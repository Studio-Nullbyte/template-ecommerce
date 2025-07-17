/**
 * Production-safe logging utility
 * Only logs in development mode to prevent information leakage
 */

const isDevelopment = import.meta.env.MODE === 'development'

export const logger = {
  debug: (message: string, ...args: any[]) => {
    if (isDevelopment) {
      console.log(`🐛 [DEBUG] ${message}`, ...args)
    }
  },
  
  info: (message: string, ...args: any[]) => {
    if (isDevelopment) {
      console.log(`ℹ️ [INFO] ${message}`, ...args)
    }
  },
  
  warn: (message: string, ...args: any[]) => {
    if (isDevelopment) {
      console.warn(`⚠️ [WARN] ${message}`, ...args)
    }
  },
  
  error: (message: string, ...args: any[]) => {
    // Always log errors, even in production (for critical issues)
    console.error(`❌ [ERROR] ${message}`, ...args)
  },
  
  // Security-focused logging - never logs in production
  security: (message: string, ...args: any[]) => {
    if (isDevelopment) {
      console.log(`🔒 [SECURITY] ${message}`, ...args)
    }
  },

  // Admin-specific logging
  admin: (message: string, ...args: any[]) => {
    if (isDevelopment) {
      console.log(`👑 [ADMIN] ${message}`, ...args)
    }
  },

  // Database-related logging
  db: (message: string, ...args: any[]) => {
    if (isDevelopment) {
      console.log(`🗄️ [DB] ${message}`, ...args)
    }
  },

  // Auth-related logging
  auth: (message: string, ...args: any[]) => {
    if (isDevelopment) {
      console.log(`� [AUTH] ${message}`, ...args)
    }
  }
}

// Production build should strip console logs
if (!isDevelopment) {
  // Override console methods to prevent accidental logging
  const noop = () => {}
  console.log = noop
  console.debug = noop
  console.info = noop
  console.warn = noop
  // Keep console.error for critical issues
}
