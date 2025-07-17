import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { AuthForm } from '../components/AuthForm'
import { useAuthContext } from '../contexts/AuthContext'

type AuthMode = 'login' | 'register' | 'reset'

export default function Auth() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { signIn, signUp, resetPassword, loading, user } = useAuthContext()
  const [mode, setMode] = useState<AuthMode>(() => {
    const modeParam = searchParams.get('mode')
    return (modeParam === 'register' || modeParam === 'reset') ? modeParam : 'login'
  })
  const [isLoading, setIsLoading] = useState(false)
  const [forceShowContent, setForceShowContent] = useState(false)

  // Force show content after timeout to prevent infinite loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading) {
        setForceShowContent(true)
      }
    }, 5000) // 5 second timeout

    return () => clearTimeout(timeout)
  }, [loading])

  // Redirect if already logged in
  useEffect(() => {
    if (user && !loading) {
      const redirectTo = searchParams.get('redirect') || '/'
      navigate(redirectTo, { replace: true })
    }
  }, [user, loading, navigate, searchParams])

  // Update URL when mode changes
  useEffect(() => {
    const newParams = new URLSearchParams(searchParams)
    if (mode !== 'login') {
      newParams.set('mode', mode)
    } else {
      newParams.delete('mode')
    }
    navigate(`/auth?${newParams.toString()}`, { replace: true })
  }, [mode, navigate, searchParams])

  const handleAuthSubmit = async (formData: any) => {
    setIsLoading(true)
    
    try {
      let result
      
      switch (mode) {
        case 'login':
          result = await signIn(formData.email, formData.password)
          
          if (!result.error) {
            const redirectTo = searchParams.get('redirect') || '/'
            navigate(redirectTo, { replace: true })
          }
          break
          
        case 'register':
          result = await signUp(formData.email, formData.password, {
            full_name: formData.fullName,
          })
          // Don't redirect on register - user needs to verify email
          break
          
        case 'reset':
          result = await resetPassword(formData.email)
          break
          
        default:
          result = { error: new Error('Invalid auth mode') }
      }
      
      return result
    } catch (error) {
      return { error }
    } finally {
      setIsLoading(false)
    }
  }

  const getPageTitle = () => {
    switch (mode) {
      case 'login': return 'Sign In - Studio Nullbyte'
      case 'register': return 'Create Account - Studio Nullbyte'
      case 'reset': return 'Reset Password - Studio Nullbyte'
    }
  }

  const getPageDescription = () => {
    switch (mode) {
      case 'login': return 'Sign in to your Studio Nullbyte account to access exclusive templates and tools.'
      case 'register': return 'Create your Studio Nullbyte account and start building with premium templates.'
      case 'reset': return 'Reset your Studio Nullbyte password to regain access to your account.'
    }
  }

  // Show loading spinner while checking auth state
  if (loading && !forceShowContent) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-electric-violet"></div>
          <p className="text-gray-400 font-mono text-sm">Loading authentication...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>{getPageTitle()}</title>
        <meta name="description" content={getPageDescription()} />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-black pt-20 pb-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="inline-flex items-center gap-2 mb-4"
              >
                <div className="w-8 h-8 bg-electric-violet rounded flex items-center justify-center">
                  <span className="text-black font-mono font-bold">N</span>
                </div>
                <span className="text-white font-mono text-xl">Studio<span className="text-electric-violet">Nullbyte</span></span>
              </motion.div>
              <p className="text-gray-400 font-mono text-sm">
                Modular tools for the design-minded developer
              </p>
            </div>

            {/* Auth Form */}
            <AuthForm
              mode={mode}
              onSubmit={handleAuthSubmit}
              loading={isLoading}
              onModeChange={setMode}
            />

            {/* Additional Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-8 text-center"
            >
              <p className="text-gray-500 font-mono text-xs">
                By {mode === 'register' ? 'creating an account' : 'signing in'}, you agree to our{' '}
                <a href="/terms" className="text-electric-violet hover:text-electric-violet-light transition-colors">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="/privacy" className="text-electric-violet hover:text-electric-violet-light transition-colors">
                  Privacy Policy
                </a>
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  )
}
