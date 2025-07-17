/**
 * Rate limiting utilities
 * Provides client-side rate limiting for API calls and form submissions
 */

import { logger } from './logger';

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  keyGenerator?: (identifier: string) => string;
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private store: Map<string, RateLimitEntry> = new Map();
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
    
    // Clean up expired entries every minute
    setInterval(() => this.cleanup(), 60000);
  }

  /**
   * Check if a request should be allowed
   */
  isAllowed(identifier: string): { allowed: boolean; remaining: number; resetTime: number } {
    const key = this.config.keyGenerator ? this.config.keyGenerator(identifier) : identifier;
    const now = Date.now();
    const entry = this.store.get(key);

    if (!entry || now >= entry.resetTime) {
      // First request or window has expired
      this.store.set(key, {
        count: 1,
        resetTime: now + this.config.windowMs
      });
      
      return {
        allowed: true,
        remaining: this.config.maxRequests - 1,
        resetTime: now + this.config.windowMs
      };
    }

    if (entry.count >= this.config.maxRequests) {
      // Rate limit exceeded
      logger.warn(`Rate limit exceeded for ${identifier}`, {
        key,
        count: entry.count,
        maxRequests: this.config.maxRequests,
        resetTime: entry.resetTime
      });
      
      return {
        allowed: false,
        remaining: 0,
        resetTime: entry.resetTime
      };
    }

    // Increment counter
    entry.count++;
    this.store.set(key, entry);

    return {
      allowed: true,
      remaining: this.config.maxRequests - entry.count,
      resetTime: entry.resetTime
    };
  }

  /**
   * Reset rate limit for a specific identifier
   */
  reset(identifier: string): void {
    const key = this.config.keyGenerator ? this.config.keyGenerator(identifier) : identifier;
    this.store.delete(key);
  }

  /**
   * Get current status for an identifier
   */
  getStatus(identifier: string): { count: number; remaining: number; resetTime: number | null } {
    const key = this.config.keyGenerator ? this.config.keyGenerator(identifier) : identifier;
    const entry = this.store.get(key);
    const now = Date.now();

    if (!entry || now >= entry.resetTime) {
      return {
        count: 0,
        remaining: this.config.maxRequests,
        resetTime: null
      };
    }

    return {
      count: entry.count,
      remaining: this.config.maxRequests - entry.count,
      resetTime: entry.resetTime
    };
  }

  /**
   * Clean up expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    let cleanedCount = 0;

    for (const [key, entry] of this.store.entries()) {
      if (now >= entry.resetTime) {
        this.store.delete(key);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      logger.debug(`Cleaned up ${cleanedCount} expired rate limit entries`);
    }
  }
}

// Pre-configured rate limiters for common use cases

/**
 * API calls rate limiter - 100 requests per minute
 */
export const apiRateLimit = new RateLimiter({
  maxRequests: 100,
  windowMs: 60 * 1000, // 1 minute
  keyGenerator: (identifier) => `api:${identifier}`
});

/**
 * Form submissions rate limiter - 5 submissions per minute
 */
export const formRateLimit = new RateLimiter({
  maxRequests: 5,
  windowMs: 60 * 1000, // 1 minute
  keyGenerator: (identifier) => `form:${identifier}`
});

/**
 * Search queries rate limiter - 30 searches per minute
 */
export const searchRateLimit = new RateLimiter({
  maxRequests: 30,
  windowMs: 60 * 1000, // 1 minute
  keyGenerator: (identifier) => `search:${identifier}`
});

/**
 * Authentication rate limiter - 10 attempts per hour
 */
export const authRateLimit = new RateLimiter({
  maxRequests: 10,
  windowMs: 60 * 60 * 1000, // 1 hour
  keyGenerator: (identifier) => `auth:${identifier}`
});

/**
 * Contact form rate limiter - 3 submissions per hour
 */
export const contactRateLimit = new RateLimiter({
  maxRequests: 3,
  windowMs: 60 * 60 * 1000, // 1 hour
  keyGenerator: (identifier) => `contact:${identifier}`
});

/**
 * Generate identifier for rate limiting
 * Uses a combination of factors to create a unique identifier
 */
export function generateRateLimitIdentifier(): string {
  // In a real application, you might use:
  // - User ID (if authenticated)
  // - IP address (if available)
  // - Device fingerprint
  // - Session ID
  
  // For client-side rate limiting, we use a combination of:
  // - Browser fingerprint components
  // - Session storage identifier
  
  let identifier = '';
  
  // Add session storage identifier
  try {
    let sessionId = sessionStorage.getItem('rate-limit-session');
    if (!sessionId) {
      sessionId = Math.random().toString(36).substring(2, 15);
      sessionStorage.setItem('rate-limit-session', sessionId);
    }
    identifier += sessionId;
  } catch (error) {
    logger.warn('Failed to access session storage for rate limiting', error);
    identifier += Math.random().toString(36).substring(2, 15);
  }
  
  // Add browser fingerprint components
  identifier += navigator.userAgent.length.toString();
  identifier += screen.width.toString();
  identifier += screen.height.toString();
  identifier += new Date().getTimezoneOffset().toString();
  
  // Create a hash of the identifier
  let hash = 0;
  for (let i = 0; i < identifier.length; i++) {
    const char = identifier.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  return Math.abs(hash).toString(36);
}

/**
 * Rate limit wrapper for async functions
 */
export function withRateLimit<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  rateLimiter: RateLimiter,
  identifier?: string
): T {
  return (async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    const id = identifier || generateRateLimitIdentifier();
    const result = rateLimiter.isAllowed(id);
    
    if (!result.allowed) {
      const resetIn = Math.ceil((result.resetTime - Date.now()) / 1000);
      const error = new Error(`Rate limit exceeded. Please try again in ${resetIn} seconds.`);
      (error as any).code = 'RATE_LIMIT_EXCEEDED';
      (error as any).resetTime = result.resetTime;
      throw error;
    }
    
    logger.debug(`Rate limit check passed for ${id}`, {
      remaining: result.remaining,
      resetTime: result.resetTime
    });
    
    return await fn(...args);
  }) as T;
}

/**
 * Hook for using rate limiting in React components
 */
export function useRateLimit(rateLimiter: RateLimiter, identifier?: string) {
  const id = identifier || generateRateLimitIdentifier();
  
  const checkLimit = () => rateLimiter.isAllowed(id);
  const getStatus = () => rateLimiter.getStatus(id);
  const reset = () => rateLimiter.reset(id);
  
  return {
    checkLimit,
    getStatus,
    reset,
    identifier: id
  };
}

/**
 * Utility to handle rate limit errors
 */
export function isRateLimitError(error: any): error is Error & { code: 'RATE_LIMIT_EXCEEDED'; resetTime: number } {
  return error && error.code === 'RATE_LIMIT_EXCEEDED';
}

/**
 * Format rate limit error message
 */
export function formatRateLimitError(error: Error & { resetTime: number }): string {
  const resetIn = Math.ceil((error.resetTime - Date.now()) / 1000);
  
  if (resetIn <= 60) {
    return `Too many requests. Please try again in ${resetIn} seconds.`;
  } else if (resetIn <= 3600) {
    const minutes = Math.ceil(resetIn / 60);
    return `Too many requests. Please try again in ${minutes} minutes.`;
  } else {
    const hours = Math.ceil(resetIn / 3600);
    return `Too many requests. Please try again in ${hours} hours.`;
  }
}
