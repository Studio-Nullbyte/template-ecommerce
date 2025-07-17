/**
 * Emergency sign out utility
 * This provides a simple way to sign out when the normal flow fails
 */
import { logger } from './logger'

export function emergencySignOut() {
  logger.auth('Emergency sign out initiated...')
  
  try {
    // Clear all possible authentication storage
    const storageKeys = [
      'rememberMe',
      'tempSession',
      'supabase.auth.token',
      'supabase.auth.user',
      'supabase.auth.session'
    ]
    
    storageKeys.forEach(key => {
      try {
        localStorage.removeItem(key)
        sessionStorage.removeItem(key)
      } catch (error) {
        logger.warn(`Failed to remove ${key}:`, error)
      }
    })
    
    // Clear all localStorage items that contain 'supabase' or 'auth'
    const allLocalKeys = Object.keys(localStorage)
    allLocalKeys.forEach(key => {
      if (key.includes('supabase') || key.includes('auth')) {
        try {
          localStorage.removeItem(key)
        } catch (error) {
          logger.warn(`Failed to remove local storage key ${key}:`, error)
        }
      }
    })
    
    // Clear all sessionStorage items that contain 'supabase' or 'auth'
    const allSessionKeys = Object.keys(sessionStorage)
    allSessionKeys.forEach(key => {
      if (key.includes('supabase') || key.includes('auth')) {
        try {
          sessionStorage.removeItem(key)
        } catch (error) {
          logger.warn(`Failed to remove session storage key ${key}:`, error)
        }
      }
    })
    
    logger.auth('Emergency sign out completed - reloading page...')
    
    // Force reload the page to reset all state
    window.location.href = window.location.origin
    
  } catch (error) {
    logger.error('Emergency sign out failed:', error)
    
    // Last resort - just reload the page
    window.location.reload()
  }
}
