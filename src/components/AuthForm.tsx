import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, CheckCircle } from 'lucide-react'

interface AuthFormProps {
  mode: 'login' | 'register' | 'reset'
  onSubmit: (data: any) => Promise<{ error?: any }>
  loading?: boolean
  onModeChange: (mode: 'login' | 'register' | 'reset') => void
}

export function AuthForm({ mode, onSubmit, loading = false, onModeChange }: AuthFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [message, setMessage] = useState('')

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    // Password validation (not for reset mode)
    if (mode !== 'reset') {
      if (!formData.password) {
        newErrors.password = 'Password is required'
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters'
      }

      // Confirm password validation (register mode)
      if (mode === 'register') {
        if (!formData.confirmPassword) {
          newErrors.confirmPassword = 'Please confirm your password'
        } else if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = 'Passwords do not match'
        }

        if (!formData.fullName.trim()) {
          newErrors.fullName = 'Full name is required'
        }
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    setErrors({})

    if (!validateForm()) return

    try {
      console.log('AuthForm: Submitting form for mode:', mode)
      const result = await onSubmit(formData)
      console.log('AuthForm: Form submission result:', result)
      
      if (result.error) {
        console.error('AuthForm: Form submission error:', result.error)
        let errorMessage = result.error.message || 'An error occurred'
        
        // Provide more user-friendly error messages
        if (errorMessage.includes('Invalid login credentials')) {
          errorMessage = 'Invalid email or password. Please check your credentials and try again.'
        } else if (errorMessage.includes('Email not confirmed')) {
          errorMessage = 'Please check your email and click the confirmation link before signing in.'
        } else if (errorMessage.includes('Missing Supabase environment variables')) {
          errorMessage = 'Configuration error. Please contact support.'
        }
        
        setErrors({ submit: errorMessage })
      } else {
        console.log('AuthForm: Form submission successful')
        if (mode === 'reset') {
          setMessage('Password reset email sent! Check your inbox.')
        } else if (mode === 'register') {
          setMessage('Registration successful! Please check your email to verify your account.')
        }
      }
    } catch (error: any) {
      console.error('AuthForm: Form submission exception:', error)
      let errorMessage = error.message || 'An unexpected error occurred'
      
      if (errorMessage.includes('Missing Supabase environment variables')) {
        errorMessage = 'Configuration error. Please contact support.'
      }
      
      setErrors({ submit: errorMessage })
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const getTitle = () => {
    switch (mode) {
      case 'login': return 'Sign In'
      case 'register': return 'Create Account'
      case 'reset': return 'Reset Password'
    }
  }

  const getButtonText = () => {
    if (loading) return 'Processing...'
    switch (mode) {
      case 'login': return 'Sign In'
      case 'register': return 'Create Account'
      case 'reset': return 'Send Reset Email'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="bg-code-gray-light border border-gray-700 rounded-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-mono text-white mb-2">{getTitle()}</h2>
          <div className="w-12 h-px bg-electric-violet mx-auto"></div>
        </div>

        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 bg-terminal-green/10 border border-terminal-green/30 rounded p-3 mb-6"
          >
            <CheckCircle className="w-4 h-4 text-terminal-green" />
            <span className="text-sm font-mono text-terminal-green">{message}</span>
          </motion.div>
        )}

        {errors.submit && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded p-3 mb-6"
          >
            <AlertCircle className="w-4 h-4 text-red-400" />
            <span className="text-sm font-mono text-red-400">{errors.submit}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name - Register only */}
          {mode === 'register' && (
            <div>
              <label className="block text-sm font-mono text-gray-300 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className={`w-full bg-code-gray border pl-10 pr-4 py-3 rounded font-mono text-white placeholder-gray-500 focus:outline-none focus:border-electric-violet transition-colors ${
                    errors.fullName ? 'border-red-500' : 'border-gray-600'
                  }`}
                  placeholder="Enter your full name"
                  disabled={loading}
                />
              </div>
              {errors.fullName && (
                <p className="text-red-400 text-xs font-mono mt-1">{errors.fullName}</p>
              )}
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-sm font-mono text-gray-300 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full bg-code-gray border pl-10 pr-4 py-3 rounded font-mono text-white placeholder-gray-500 focus:outline-none focus:border-electric-violet transition-colors ${
                  errors.email ? 'border-red-500' : 'border-gray-600'
                }`}
                placeholder="Enter your email"
                disabled={loading}
              />
            </div>
            {errors.email && (
              <p className="text-red-400 text-xs font-mono mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password - Not shown in reset mode */}
          {mode !== 'reset' && (
            <div>
              <label className="block text-sm font-mono text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`w-full bg-code-gray border pl-10 pr-12 py-3 rounded font-mono text-white placeholder-gray-500 focus:outline-none focus:border-electric-violet transition-colors ${
                    errors.password ? 'border-red-500' : 'border-gray-600'
                  }`}
                  placeholder="Enter your password"
                  disabled={loading}
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
              {errors.password && (
                <p className="text-red-400 text-xs font-mono mt-1">{errors.password}</p>
              )}
            </div>
          )}

          {/* Confirm Password - Register only */}
          {mode === 'register' && (
            <div>
              <label className="block text-sm font-mono text-gray-300 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className={`w-full bg-code-gray border pl-10 pr-12 py-3 rounded font-mono text-white placeholder-gray-500 focus:outline-none focus:border-electric-violet transition-colors ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-600'
                  }`}
                  placeholder="Confirm your password"
                  disabled={loading}
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
              {errors.confirmPassword && (
                <p className="text-red-400 text-xs font-mono mt-1">{errors.confirmPassword}</p>
              )}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-electric-violet hover:bg-electric-violet-light disabled:opacity-50 disabled:cursor-not-allowed text-white font-mono py-3 px-4 rounded transition-colors"
          >
            {getButtonText()}
          </button>
        </form>

        {/* Mode Switching Links */}
        <div className="mt-6 text-center space-y-2">
          {mode === 'login' && (
            <>
              <p className="text-gray-400 font-mono text-sm">
                Don't have an account?{' '}
                <button
                  onClick={() => onModeChange('register')}
                  className="text-electric-violet hover:text-electric-violet-light transition-colors"
                  disabled={loading}
                >
                  Sign up
                </button>
              </p>
              <p className="text-gray-400 font-mono text-sm">
                <button
                  onClick={() => onModeChange('reset')}
                  className="text-electric-violet hover:text-electric-violet-light transition-colors"
                  disabled={loading}
                >
                  Forgot your password?
                </button>
              </p>
            </>
          )}

          {mode === 'register' && (
            <p className="text-gray-400 font-mono text-sm">
              Already have an account?{' '}
              <button
                onClick={() => onModeChange('login')}
                className="text-electric-violet hover:text-electric-violet-light transition-colors"
                disabled={loading}
              >
                Sign in
              </button>
            </p>
          )}

          {mode === 'reset' && (
            <p className="text-gray-400 font-mono text-sm">
              Remember your password?{' '}
              <button
                onClick={() => onModeChange('login')}
                className="text-electric-violet hover:text-electric-violet-light transition-colors"
                disabled={loading}
              >
                Sign in
              </button>
            </p>
          )}
        </div>
      </div>
    </motion.div>
  )
}
