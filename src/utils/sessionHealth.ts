/**
 * Session Health Monitor
 * Detects and handles session expiry, network issues, and auth state corruption
 */
import React from 'react'
import { supabase } from '../lib/supabase'
import { logger } from './logger'

interface SessionHealth {
  isHealthy: boolean
  lastCheck: number
  consecutiveFailures: number
}

class SessionHealthMonitor {
  private health: SessionHealth = {
    isHealthy: true,
    lastCheck: Date.now(),
    consecutiveFailures: 0
  }
  
  private healthCheckInterval: NodeJS.Timeout | null = null
  private listeners: Array<(health: SessionHealth) => void> = []

  constructor() {
    this.startHealthCheck()
  }

  // Start periodic health checks
  startHealthCheck() {
    // Check session health every 2 minutes
    this.healthCheckInterval = setInterval(() => {
      this.checkSessionHealth()
    }, 2 * 60 * 1000)
    
    // Initial check
    setTimeout(() => this.checkSessionHealth(), 5000)
  }

  // Stop health monitoring
  stopHealthCheck() {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval)
      this.healthCheckInterval = null
    }
  }

  // Add listener for health changes
  onHealthChange(callback: (health: SessionHealth) => void) {
    this.listeners.push(callback)
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback)
    }
  }

  // Check if session is healthy
  private async checkSessionHealth() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        this.recordFailure()
        return
      }

      if (!session) {
        this.recordSuccess()
        return
      }

      // Check if session is close to expiry (within 5 minutes)
      const expiresAt = session.expires_at
      const now = Math.floor(Date.now() / 1000)
      const timeUntilExpiry = expiresAt ? expiresAt - now : 0

      if (timeUntilExpiry < 300) { // Less than 5 minutes
        await this.refreshSession()
      } else {
        this.recordSuccess()
      }

    } catch (error) {
      this.recordFailure()
    }
  }

  // Attempt to refresh the session
  private async refreshSession() {
    try {
      const { error } = await supabase.auth.refreshSession()
      
      if (error) {
        this.recordFailure()
        this.notifySessionExpired()
      } else {
        this.recordSuccess()
      }
    } catch (error) {
      this.recordFailure()
    }
  }

  // Record successful health check
  private recordSuccess() {
    this.health = {
      isHealthy: true,
      lastCheck: Date.now(),
      consecutiveFailures: 0
    }
    this.notifyListeners()
  }

  // Record failed health check
  private recordFailure() {
    this.health = {
      isHealthy: this.health.consecutiveFailures < 3, // Unhealthy after 3 failures
      lastCheck: Date.now(),
      consecutiveFailures: this.health.consecutiveFailures + 1
    }
    this.notifyListeners()
  }

  // Notify listeners of health changes
  private notifyListeners() {
    this.listeners.forEach(listener => {
      try {
        listener(this.health)
      } catch (error) {
        logger.error('SessionHealthMonitor: Listener error:', error)
      }
    })
  }

  // Notify that session has expired
  private notifySessionExpired() {
    // Dispatch custom event for components to handle
    window.dispatchEvent(new CustomEvent('session-expired', {
      detail: { reason: 'Session refresh failed' }
    }))
  }

  // Get current health status
  getHealth(): SessionHealth {
    return { ...this.health }
  }

  // Manual session check
  async checkNow(): Promise<SessionHealth> {
    await this.checkSessionHealth()
    return this.getHealth()
  }
}

// Export singleton instance
export const sessionHealthMonitor = new SessionHealthMonitor()

// React hook for session health
export function useSessionHealth() {
  const [health, setHealth] = React.useState<SessionHealth>(
    sessionHealthMonitor.getHealth()
  )

  React.useEffect(() => {
    const unsubscribe = sessionHealthMonitor.onHealthChange(setHealth)
    return unsubscribe
  }, [])

  return health
}
