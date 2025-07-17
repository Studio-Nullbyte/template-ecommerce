/**
 * Environment validation and security utilities
 * Validates environment variables and configuration for security
 */

import { logger } from './logger';

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validate environment variables for security
 */
export function validateEnvironment(): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check for required environment variables
  const requiredEnvVars = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY'
  ];

  for (const envVar of requiredEnvVars) {
    const value = import.meta.env[envVar];
    if (!value) {
      errors.push(`Missing required environment variable: ${envVar}`);
    } else if (value.includes('localhost') || value.includes('127.0.0.1')) {
      warnings.push(`Environment variable ${envVar} contains localhost - ensure this is intended for development`);
    }
  }

  // Check for secure configuration
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  if (supabaseUrl) {
    if (!supabaseUrl.startsWith('https://')) {
      errors.push('VITE_SUPABASE_URL must use HTTPS in production');
    }
    
    if (supabaseUrl.includes('localhost') && import.meta.env.PROD) {
      errors.push('VITE_SUPABASE_URL cannot use localhost in production');
    }
  }

  // Check for potentially exposed secrets
  const envKeys = Object.keys(import.meta.env);
  const suspiciousKeys = envKeys.filter(key => 
    key.includes('SECRET') || 
    key.includes('PRIVATE') || 
    key.includes('PASSWORD') ||
    key.includes('TOKEN')
  );

  for (const key of suspiciousKeys) {
    if (key.startsWith('VITE_')) {
      errors.push(`Potentially sensitive environment variable exposed to client: ${key}`);
    }
  }

  // Check for development-only variables in production
  if (import.meta.env.PROD) {
    const devOnlyVars = envKeys.filter(key => 
      key.includes('DEV') || 
      key.includes('DEBUG') || 
      key.includes('TEST')
    );
    
    for (const key of devOnlyVars) {
      if (import.meta.env[key]) {
        warnings.push(`Development variable ${key} is set in production`);
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validate that sensitive configuration is properly secured
 */
export function validateSecureConfiguration(): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check for hardcoded credentials in common places
  // This would be expanded to check actual code/config files
  // For now, we'll just validate environment structure
  
  // Check for insecure defaults
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  if (supabaseUrl && supabaseUrl.includes('localhost') && import.meta.env.PROD) {
    errors.push('Using localhost Supabase URL in production');
  }

  // Check for proper HTTPS usage
  if (import.meta.env.PROD && window.location.protocol !== 'https:') {
    errors.push('Application not served over HTTPS in production');
  }

  // Check for secure headers (CSP, etc.) - these would be validated server-side
  // For now, we'll just check if they're present in the HTML
  const hasCSP = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
  if (!hasCSP) {
    warnings.push('Content Security Policy header not detected');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Log security validation results
 */
export function logSecurityValidation(): void {
  const envValidation = validateEnvironment();
  const configValidation = validateSecureConfiguration();

  if (!envValidation.isValid) {
    logger.error('Environment validation failed', {
      errors: envValidation.errors,
      warnings: envValidation.warnings
    });
  }

  if (!configValidation.isValid) {
    logger.error('Security configuration validation failed', {
      errors: configValidation.errors,
      warnings: configValidation.warnings
    });
  }

  if (envValidation.warnings.length > 0) {
    logger.warn('Environment validation warnings', {
      warnings: envValidation.warnings
    });
  }

  if (configValidation.warnings.length > 0) {
    logger.warn('Security configuration warnings', {
      warnings: configValidation.warnings
    });
  }
}

/**
 * Initialize security validation on app startup
 */
export function initializeSecurityValidation(): void {
  // Run validation on app startup
  logSecurityValidation();

  // Set up periodic validation in development
  if (import.meta.env.DEV) {
    // Check every 5 minutes in development
    setInterval(() => {
      logSecurityValidation();
    }, 5 * 60 * 1000);
  }
}

/**
 * Check if running in a secure context
 */
export function isSecureContext(): boolean {
  // Check if we're in a secure context (HTTPS, localhost, or file://)
  return window.isSecureContext || false;
}

/**
 * Validate that required security features are available
 */
export function validateSecurityFeatures(): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check for secure context
  if (!isSecureContext()) {
    errors.push('Application not running in secure context (HTTPS required)');
  }

  // Check for required web APIs
  if (!window.crypto || !window.crypto.subtle) {
    errors.push('Web Crypto API not available');
  }

  if (!window.sessionStorage || !window.localStorage) {
    errors.push('Web Storage API not available');
  }

  // Check for CSP support
  if (!document.querySelector('meta[http-equiv="Content-Security-Policy"]')) {
    warnings.push('Content Security Policy not detected');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Get security configuration summary
 */
export function getSecuritySummary(): {
  environment: ValidationResult;
  configuration: ValidationResult;
  features: ValidationResult;
  secureContext: boolean;
} {
  return {
    environment: validateEnvironment(),
    configuration: validateSecureConfiguration(),
    features: validateSecurityFeatures(),
    secureContext: isSecureContext()
  };
}
