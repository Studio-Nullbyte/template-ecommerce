import { useState, useEffect } from 'react'

/**
 * Utility functions for handling timeouts and preventing infinite loading states
 */

/**
 * Adds a timeout to any promise to prevent infinite waiting
 * @param promise The promise to add timeout to
 * @param timeoutMs Timeout in milliseconds (default: 8000ms)
 * @param operation Description of the operation for logging
 */
export const withTimeout = <T>(
  promise: Promise<T>, 
  timeoutMs: number = 8000, 
  operation: string = 'operation'
): Promise<T> => {
  const timeoutPromise = new Promise<T>((_, reject) => {
    setTimeout(() => {
      reject(new Error(`${operation} timeout after ${timeoutMs}ms`))
    }, timeoutMs)
  })

  return Promise.race([promise, timeoutPromise])
}

/**
 * Wraps a Supabase query with timeout protection
 * @param query The Supabase query builder
 * @param timeoutMs Timeout in milliseconds (default: 5000ms)
 * @param operation Description for logging
 */
export const withSupabaseTimeout = async <T>(
  query: any,
  timeoutMs: number = 5000,
  operation: string = 'Supabase query'
): Promise<T> => {
  try {
    const result = await withTimeout(query, timeoutMs, operation) as T
    return result
  } catch (error) {
    if (error instanceof Error && error.message.includes('timeout')) {
      throw new Error(`${operation} timed out - please check your connection`)
    }
    throw error
  }
}

/**
 * Creates a loading state manager with automatic timeout
 * @param timeoutMs Timeout in milliseconds
 * @param name Name for logging
 */
export const createLoadingManager = (
  timeoutMs: number = 10000
) => {
  let timeoutId: NodeJS.Timeout | null = null
  
  const startTimeout = (setLoading: (loading: boolean) => void) => {
    if (timeoutId) globalThis.clearTimeout(timeoutId)
    
    timeoutId = setTimeout(() => {
      // Loading timeout - forcing to false
      setLoading(false)
    }, timeoutMs)
  }
  
  const clearTimeoutFn = () => {
    if (timeoutId) {
      globalThis.clearTimeout(timeoutId)
      timeoutId = null
    }
  }
  
  const setLoadingWithTimeout = (setLoading: (loading: boolean) => void, loading: boolean) => {
    setLoading(loading)
    if (loading) {
      startTimeout(setLoading)
    } else {
      clearTimeoutFn()
    }
  }
  
  return {
    startTimeout,
    clearTimeout: clearTimeoutFn,
    setLoadingWithTimeout
  }
}

/**
 * Hook for using loading states with automatic timeout protection
 */
export const useLoadingWithTimeout = (
  initialLoading: boolean = true,
  timeoutMs: number = 10000
) => {
  const [loading, setLoading] = useState(initialLoading)
  const manager = createLoadingManager(timeoutMs)
  
  useEffect(() => {
    if (loading) {
      manager.startTimeout(setLoading)
    }
    return () => manager.clearTimeout()
  }, [loading, manager])
  
  const setLoadingWithTimeout = (newLoading: boolean) => {
    manager.setLoadingWithTimeout(setLoading, newLoading)
  }
  
  return [loading, setLoadingWithTimeout] as const
}
