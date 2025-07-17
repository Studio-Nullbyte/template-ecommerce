import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Lock, AlertCircle, CheckCircle } from 'lucide-react'
import { useAuthContext } from '../contexts/AuthContext'

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { updatePassword, signOut } = useAuthContext()
  
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // Check if we have the required tokens
  useEffect(() => {
    const accessToken = searchParams.get('access_token')
    const refreshToken = searchParams.get('refresh_token')
    
    if (!accessToken || !refreshToken) {
      navigate('/auth?mode=reset', { replace: true })
    }
  }, [searchParams, navigate])

  const validatePasswords = () => {
    if (!password) {
      setError('Password is required')
      return false
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return false
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return false
    }
    
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!validatePasswords()) return

    setLoading(true)
    
    try {
      const result = await updatePassword(password)
      
      if (result.error) {
        setError(result.error.message || 'Failed to update password')
      } else {
        setSuccess(true)
        // Sign out user so they can sign in with new password
        setTimeout(async () => {
          await signOut()
          navigate('/auth', { replace: true })
        }, 3000)
      }
    } catch (error: any) {
      setError(error.message || 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <>
        <Helmet>
          <title>Password Updated - Studio Nullbyte</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>

        <div className="min-h-screen bg-black pt-20 pb-12 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto text-center"
          >
            <div className="bg-code-gray-light border border-gray-700 rounded-lg p-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-16 h-16 bg-terminal-green/10 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <CheckCircle className="w-8 h-8 text-terminal-green" />
              </motion.div>
              
              <h2 className="text-2xl font-mono text-white mb-4">Password Updated!</h2>
              <p className="text-gray-400 font-mono text-sm mb-6">
                Your password has been successfully updated. You'll be redirected to sign in shortly.
              </p>
              
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-electric-violet mx-auto"></div>
            </div>
          </motion.div>
        </div>
      </>
    )
  }

  return (
    <>
      <Helmet>
        <title>Reset Password - Studio Nullbyte</title>
        <meta name="description" content="Set your new Studio Nullbyte password." />
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
              <h1 className="text-2xl font-mono text-white mb-2">Set New Password</h1>
              <p className="text-gray-400 font-mono text-sm">
                Enter your new password below
              </p>
            </div>

            {/* Reset Form */}
            <div className="bg-code-gray-light border border-gray-700 rounded-lg p-8">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded p-3 mb-6"
                >
                  <AlertCircle className="w-4 h-4 text-red-400" />
                  <span className="text-sm font-mono text-red-400">{error}</span>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* New Password */}
                <div>
                  <label className="block text-sm font-mono text-gray-300 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-code-gray border border-gray-600 pl-10 pr-12 py-3 rounded font-mono text-white placeholder-gray-500 focus:outline-none focus:border-electric-violet transition-colors"
                      placeholder="Enter new password"
                      disabled={loading}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-electric-violet transition-colors"
                      disabled={loading}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-mono text-gray-300 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-code-gray border border-gray-600 pl-10 pr-12 py-3 rounded font-mono text-white placeholder-gray-500 focus:outline-none focus:border-electric-violet transition-colors"
                      placeholder="Confirm new password"
                      disabled={loading}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-electric-violet transition-colors"
                      disabled={loading}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-electric-violet hover:bg-electric-violet-light disabled:opacity-50 disabled:cursor-not-allowed text-white font-mono py-3 px-4 rounded transition-colors"
                >
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-400 font-mono text-sm">
                  Remember your password?{' '}
                  <button
                    onClick={() => navigate('/auth')}
                    className="text-electric-violet hover:text-electric-violet-light transition-colors"
                    disabled={loading}
                  >
                    Sign in
                  </button>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  )
}
