import { useEffect, useState, useCallback, RefObject } from 'react'

// WCAG AA Accessibility utilities for Studio Nullbyte

export const accessibility = {
  // WCAG AA color contrast requirements
  colors: {
    // These colors meet WCAG AA contrast requirements on black background
    text: {
      primary: '#FFFFFF',      // 21:1 contrast ratio
      secondary: '#D1D5DB',    // 14.4:1 contrast ratio  
      muted: '#9CA3AF',        // 8.7:1 contrast ratio (AA compliant)
    },
    interactive: {
      primary: '#A78BFA',      // Electric violet light - 8.2:1 contrast
      hover: '#C4B5FD',        // Lighter violet for hover - 10.1:1 contrast
      focus: '#DDD6FE',        // Focus ring color - 15.2:1 contrast
    },
    status: {
      success: '#10B981',      // Green - 8.1:1 contrast
      warning: '#F59E0B',      // Amber - 8.9:1 contrast
      error: '#EF4444',        // Red - 7.2:1 contrast
      info: '#3B82F6',         // Blue - 7.8:1 contrast
    }
  },

  // Focus management utilities
  focus: {
    // Trap focus within a container
    trapFocus: (container: HTMLElement) => {
      const focusableElements = container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      const firstFocusable = focusableElements[0] as HTMLElement
      const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement

      const handleTabKey = (e: KeyboardEvent) => {
        if (e.key === 'Tab') {
          if (e.shiftKey) {
            if (document.activeElement === firstFocusable) {
              lastFocusable.focus()
              e.preventDefault()
            }
          } else {
            if (document.activeElement === lastFocusable) {
              firstFocusable.focus()
              e.preventDefault()
            }
          }
        }
      }

      container.addEventListener('keydown', handleTabKey)
      return () => container.removeEventListener('keydown', handleTabKey)
    },

    // Return focus to previous element
    restoreFocus: (previousElement: HTMLElement | null) => {
      if (previousElement && typeof previousElement.focus === 'function') {
        previousElement.focus()
      }
    }
  },

  // Screen reader utilities
  screenReader: {
    // Announce content to screen readers
    announce: (message: string, priority: 'polite' | 'assertive' = 'polite') => {
      const announcer = document.createElement('div')
      announcer.setAttribute('aria-live', priority)
      announcer.setAttribute('aria-atomic', 'true')
      announcer.className = 'sr-only'
      announcer.textContent = message
      
      document.body.appendChild(announcer)
      
      setTimeout(() => {
        document.body.removeChild(announcer)
      }, 1000)
    },

    // Hide content from screen readers
    hide: (element: HTMLElement) => {
      element.setAttribute('aria-hidden', 'true')
    },

    // Show content to screen readers
    show: (element: HTMLElement) => {
      element.removeAttribute('aria-hidden')
    }
  },

  // Keyboard navigation utilities
  keyboard: {
    // Handle escape key
    onEscape: (callback: () => void) => {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          callback()
        }
      }
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    },

    // Handle enter/space for button-like elements
    onActivate: (callback: () => void) => {
      return (e: KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          callback()
        }
      }
    }
  },

  // Form validation utilities
  form: {
    // Validate required fields
    validateRequired: (value: string, fieldName: string): string | null => {
      if (!value.trim()) {
        return `${fieldName} is required`
      }
      return null
    },

    // Validate email format
    validateEmail: (email: string): string | null => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        return 'Please enter a valid email address'
      }
      return null
    },

    // Generate accessible error messages
    getErrorId: (fieldName: string) => `${fieldName}-error`,
    getDescriptionId: (fieldName: string) => `${fieldName}-description`
  },

  // Motion and animation utilities
  motion: {
    // Check if user prefers reduced motion
    prefersReducedMotion: () => {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches
    },

    // Respect motion preferences
    respectMotionPreference: <T>(animatedValue: T, staticValue: T): T => {
      return accessibility.motion.prefersReducedMotion() ? staticValue : animatedValue
    }
  },

  // Image and media utilities
  media: {
    // Generate accessible alt text guidelines
    getAltTextGuideline: (context: 'decorative' | 'informative' | 'functional') => {
      switch (context) {
        case 'decorative':
          return '' // Empty alt for decorative images
        case 'informative':
          return 'Describe the information conveyed by the image'
        case 'functional':
          return 'Describe the function or purpose of the image'
        default:
          return 'Describe the image content'
      }
    }
  }
}

// React hook for accessibility features
export const useAccessibility = () => {
  return accessibility
}

// Custom hook for keyboard navigation
export const useKeyboardNavigation = (onEscape?: () => void) => {
  useEffect(() => {
    if (onEscape) {
      return accessibility.keyboard.onEscape(onEscape)
    }
  }, [onEscape])
}

// Custom hook for focus management
export const useFocusManagement = (containerRef: RefObject<HTMLElement>) => {
  const [previousFocus, setPreviousFocus] = useState<HTMLElement | null>(null)

  const trapFocus = useCallback(() => {
    if (containerRef.current) {
      setPreviousFocus(document.activeElement as HTMLElement)
      return accessibility.focus.trapFocus(containerRef.current)
    }
  }, [containerRef])

  const restoreFocus = useCallback(() => {
    accessibility.focus.restoreFocus(previousFocus)
  }, [previousFocus])

  return { trapFocus, restoreFocus }
}

export default accessibility
