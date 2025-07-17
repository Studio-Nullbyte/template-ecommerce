import React, { useEffect, useState } from 'react'
import { AlertTriangle, Info } from 'lucide-react'

interface AccessibilityIssue {
  type: 'error' | 'warning' | 'info'
  message: string
  element?: string
  fix?: string
}

const AccessibilityChecker: React.FC = () => {
  const [issues, setIssues] = useState<AccessibilityIssue[]>([])
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Only run in development
    if (process.env.NODE_ENV === 'development') {
      checkAccessibility()
    }
  }, [])

  const checkAccessibility = () => {
    const foundIssues: AccessibilityIssue[] = []

    // Check for missing alt text on images
    const images = document.querySelectorAll('img')
    images.forEach((img, index) => {
      if (!img.alt && !img.getAttribute('aria-hidden')) {
        foundIssues.push({
          type: 'error',
          message: `Image missing alt text`,
          element: `img[${index}]`,
          fix: 'Add descriptive alt text or aria-hidden="true" for decorative images'
        })
      }
    })

    // Check for buttons without accessible names
    const buttons = document.querySelectorAll('button')
    buttons.forEach((button, index) => {
      const hasText = button.textContent?.trim()
      const hasAriaLabel = button.getAttribute('aria-label')
      const hasAriaLabelledBy = button.getAttribute('aria-labelledby')
      
      if (!hasText && !hasAriaLabel && !hasAriaLabelledBy) {
        foundIssues.push({
          type: 'error',
          message: `Button without accessible name`,
          element: `button[${index}]`,
          fix: 'Add visible text, aria-label, or aria-labelledby attribute'
        })
      }
    })

    // Check for links without accessible names
    const links = document.querySelectorAll('a')
    links.forEach((link, index) => {
      const hasText = link.textContent?.trim()
      const hasAriaLabel = link.getAttribute('aria-label')
      
      if (!hasText && !hasAriaLabel) {
        foundIssues.push({
          type: 'error',
          message: `Link without accessible name`,
          element: `a[${index}]`,
          fix: 'Add descriptive link text or aria-label'
        })
      }
    })

    // Check for form inputs without labels
    const inputs = document.querySelectorAll('input, textarea, select')
    inputs.forEach((input, index) => {
      const hasLabel = document.querySelector(`label[for="${input.id}"]`)
      const hasAriaLabel = input.getAttribute('aria-label')
      const hasAriaLabelledBy = input.getAttribute('aria-labelledby')
      
      if (!hasLabel && !hasAriaLabel && !hasAriaLabelledBy) {
        foundIssues.push({
          type: 'warning',
          message: `Form input without proper label`,
          element: `${input.tagName.toLowerCase()}[${index}]`,
          fix: 'Associate with a label element or add aria-label'
        })
      }
    })

    // Check for headings structure
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
    let previousLevel = 0
    headings.forEach((heading, index) => {
      const level = parseInt(heading.tagName.charAt(1))
      if (level - previousLevel > 1) {
        foundIssues.push({
          type: 'warning',
          message: `Heading level skipped (h${previousLevel} to h${level})`,
          element: `${heading.tagName.toLowerCase()}[${index}]`,
          fix: 'Use consecutive heading levels for proper structure'
        })
      }
      previousLevel = level
    })

    // Check color contrast (simplified check)
    const lowContrastElements = document.querySelectorAll('.text-gray-400, .text-gray-500')
    if (lowContrastElements.length > 0) {
      foundIssues.push({
        type: 'info',
        message: `${lowContrastElements.length} elements may have low color contrast`,
        fix: 'Verify color contrast meets WCAG AA standards (4.5:1 for normal text)'
      })
    }

    setIssues(foundIssues)
  }

  if (process.env.NODE_ENV !== 'development' || issues.length === 0) {
    return null
  }

  return (
    <div className={`fixed bottom-4 right-4 z-50 transition-transform ${isVisible ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="bg-code-gray border border-gray-700 rounded-lg shadow-xl max-w-md">
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          <h3 className="font-mono font-bold text-sm">Accessibility Issues</h3>
          <button
            onClick={() => setIsVisible(!isVisible)}
            className="text-gray-400 hover:text-white"
            aria-label={isVisible ? 'Hide accessibility issues' : 'Show accessibility issues'}
          >
            {isVisible ? '−' : '+'}
          </button>
        </div>
        
        {isVisible && (
          <div className="p-4 max-h-80 overflow-y-auto">
            {issues.map((issue, index) => (
              <div key={index} className="mb-3 last:mb-0">
                <div className="flex items-start gap-2">
                  {issue.type === 'error' && <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />}
                  {issue.type === 'warning' && <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />}
                  {issue.type === 'info' && <Info className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />}
                  
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{issue.message}</p>
                    {issue.element && (
                      <p className="text-xs text-gray-400 mt-1">Element: {issue.element}</p>
                    )}
                    {issue.fix && (
                      <p className="text-xs text-gray-300 mt-1">Fix: {issue.fix}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            <div className="mt-4 pt-3 border-t border-gray-700">
              <button
                onClick={checkAccessibility}
                className="text-xs text-electric-violet hover:text-electric-violet-light"
              >
                Re-check Issues
              </button>
            </div>
          </div>
        )}
      </div>
      
      {!isVisible && (
        <button
          onClick={() => setIsVisible(true)}
          className="bg-electric-violet text-black p-2 rounded-full font-bold text-xs"
          aria-label={`${issues.length} accessibility issues found`}
        >
          A11y: {issues.length}
        </button>
      )}
    </div>
  )
}

export default AccessibilityChecker
