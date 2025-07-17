import { useEffect } from 'react'

// Extend Window interface for Crisp
declare global {
  interface Window {
    $crisp: any[]
    CRISP_WEBSITE_ID: string
  }
}

const CrispChat: React.FC = () => {
  useEffect(() => {
    // Get Crisp Website ID from environment
    const crispWebsiteId = import.meta.env.VITE_CRISP_WEBSITE_ID

    if (!crispWebsiteId) {
      console.warn('Crisp Chat: VITE_CRISP_WEBSITE_ID not found in environment variables')
      return
    }

    // Initialize Crisp
    window.$crisp = []
    window.CRISP_WEBSITE_ID = crispWebsiteId

    // Create and append Crisp script
    const script = document.createElement('script')
    script.src = 'https://client.crisp.chat/l.js'
    script.async = true
    script.onload = () => {
      // Customize Crisp to match Studio Nullbyte theme
      configureCrispTheme()
    }
    
    document.getElementsByTagName('head')[0].appendChild(script)

    // Cleanup function
    return () => {
      const existingScript = document.querySelector('script[src="https://client.crisp.chat/l.js"]')
      if (existingScript) {
        existingScript.remove()
      }
      
      // Reset Crisp globals
      if (window.$crisp) {
        window.$crisp = []
      }
    }
  }, [])

  const configureCrispTheme = () => {
    if (!window.$crisp) return

    try {
      // Studio Nullbyte theme customization
      window.$crisp.push(['set', 'appearance:theme', ['dark']])
      window.$crisp.push(['set', 'appearance:color', ['#8B5CF6']]) // Electric violet
      
      // Position and behavior
      window.$crisp.push(['set', 'appearance:position', ['bottom-right']])
      window.$crisp.push(['set', 'appearance:animation', ['slide']])
      
      // Custom welcome message
      window.$crisp.push(['set', 'chat:greeting:text', [
        'Welcome to Studio Nullbyte! 👋\n\nNeed help with our templates or have questions about custom development?'
      ]])
      
      // Set availability text
      window.$crisp.push(['set', 'chat:availability:text', [
        'We typically respond within a few hours. Drop us a message!'
      ]])

      // Tag conversations for better organization
      window.$crisp.push(['set', 'session:segments', [['website-visitor']]])
      
    } catch (error) {
      console.error('Crisp Chat configuration error:', error)
    }
  }

  // This component doesn't render any visible elements
  return null
}

export default CrispChat
