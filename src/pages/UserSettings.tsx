import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Save, 
  AlertCircle, 
  CheckCircle,
  LogOut,
  Download,
  Settings as SettingsIcon
} from 'lucide-react'
import { useAuthContext } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { emergencySignOut } from '../utils/emergencySignOut'
import { logger } from '../utils/logger'

export default function UserSettings() {
  const { user, profile, updateProfile, updatePassword, signOut, refreshProfile } = useAuthContext()
  const navigate = useNavigate()
  
  const [activeTab, setActiveTab] = useState('profile')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  
  // Profile form
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
  })
  
  // Password form
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Load profile data
  useEffect(() => {
    if (profile) {
      setProfileData({
        fullName: profile.full_name || '',
        email: profile.email || user?.email || '',
      })
    } else if (user) {
      setProfileData({
        fullName: '',
        email: user.email || '',
      })
    }
  }, [profile, user])

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/auth?redirect=/settings')
    }
  }, [user, navigate])

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setError('')

    try {
      const result = await updateProfile({
        full_name: profileData.fullName.trim(),
        email: profileData.email,
      })

      if (result.error) {
        setError(result.error.message || 'Failed to update profile')
      } else {
        setMessage('Profile updated successfully!')
        await refreshProfile()
      }
    } catch (error: any) {
      setError(error.message || 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setError('')

    // Validate passwords
    if (passwordData.newPassword.length < 6) {
      setError('New password must be at least 6 characters')
      setLoading(false)
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match')
      setLoading(false)
      return
    }

    try {
      const result = await updatePassword(passwordData.newPassword)

      if (result.error) {
        setError(result.error.message || 'Failed to update password')
      } else {
        setMessage('Password updated successfully!')
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        })
      }
    } catch (error: any) {
      setError(error.message || 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = () => {
    logger.auth('UserSettings: Sign out button clicked - using emergency sign out!')
    
    // Show confirmation
    const confirmSignOut = confirm('Are you sure you want to sign out?')
    
    if (confirmSignOut) {
      // Use emergency sign out (this will reload the page)
      emergencySignOut()
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-electric-violet"></div>
      </div>
    )
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'downloads', label: 'Downloads', icon: Download },
  ]

  return (
    <>
      <Helmet>
        <title>Account Settings - Studio Nullbyte</title>
        <meta name="description" content="Manage your Studio Nullbyte account settings and preferences." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-black pt-20 pb-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <SettingsIcon className="w-6 h-6 text-electric-violet" />
                <h1 className="text-3xl font-mono text-white">Account Settings</h1>
              </div>
              <p className="text-gray-400 font-mono">
                Manage your account preferences and security settings
              </p>
            </div>

            {/* Status Messages */}
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

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-code-gray-light border border-gray-700 rounded-lg p-4">
                  <nav className="space-y-2">
                    {tabs.map((tab) => {
                      const Icon = tab.icon
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded font-mono text-sm transition-colors ${
                            activeTab === tab.id
                              ? 'bg-electric-violet text-white'
                              : 'text-gray-400 hover:text-white hover:bg-code-gray'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          {tab.label}
                        </button>
                      )
                    })}

                    <hr className="border-gray-700 my-4" />

                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded font-mono text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </nav>
                </div>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-3">
                <div className="bg-code-gray-light border border-gray-700 rounded-lg p-8">
                  {/* Profile Tab */}
                  {activeTab === 'profile' && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <h2 className="text-xl font-mono text-white mb-6">Profile Information</h2>
                      
                      <form onSubmit={handleProfileUpdate} className="space-y-6">
                        <div>
                          <label className="block text-sm font-mono text-gray-300 mb-2">
                            Full Name
                          </label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                              type="text"
                              value={profileData.fullName}
                              onChange={(e) => setProfileData(prev => ({ ...prev, fullName: e.target.value }))}
                              className="w-full bg-code-gray border border-gray-600 pl-10 pr-4 py-3 rounded font-mono text-white placeholder-gray-500 focus:outline-none focus:border-electric-violet transition-colors"
                              placeholder="Enter your full name"
                              disabled={loading}
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-mono text-gray-300 mb-2">
                            Email Address
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                              type="email"
                              value={profileData.email}
                              onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                              className="w-full bg-code-gray border border-gray-600 pl-10 pr-4 py-3 rounded font-mono text-white placeholder-gray-500 focus:outline-none focus:border-electric-violet transition-colors"
                              placeholder="Enter your email"
                              disabled={loading}
                            />
                          </div>
                          <p className="text-gray-500 font-mono text-xs mt-1">
                            Email changes require verification
                          </p>
                        </div>

                        <button
                          type="submit"
                          disabled={loading}
                          className="flex items-center gap-2 bg-electric-violet hover:bg-electric-violet-light disabled:opacity-50 disabled:cursor-not-allowed text-white font-mono py-3 px-6 rounded transition-colors"
                        >
                          <Save className="w-4 h-4" />
                          {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                      </form>
                    </motion.div>
                  )}

                  {/* Security Tab */}
                  {activeTab === 'security' && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <h2 className="text-xl font-mono text-white mb-6">Security Settings</h2>
                      
                      <form onSubmit={handlePasswordUpdate} className="space-y-6">
                        <div>
                          <label className="block text-sm font-mono text-gray-300 mb-2">
                            Current Password
                          </label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                              type={showCurrentPassword ? 'text' : 'password'}
                              value={passwordData.currentPassword}
                              onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                              className="w-full bg-code-gray border border-gray-600 pl-10 pr-12 py-3 rounded font-mono text-white placeholder-gray-500 focus:outline-none focus:border-electric-violet transition-colors"
                              placeholder="Enter current password"
                              disabled={loading}
                            />
                            <button
                              type="button"
                              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-electric-violet transition-colors"
                            >
                              {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-mono text-gray-300 mb-2">
                            New Password
                          </label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                              type={showNewPassword ? 'text' : 'password'}
                              value={passwordData.newPassword}
                              onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                              className="w-full bg-code-gray border border-gray-600 pl-10 pr-12 py-3 rounded font-mono text-white placeholder-gray-500 focus:outline-none focus:border-electric-violet transition-colors"
                              placeholder="Enter new password"
                              disabled={loading}
                            />
                            <button
                              type="button"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-electric-violet transition-colors"
                            >
                              {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-mono text-gray-300 mb-2">
                            Confirm New Password
                          </label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                              type={showConfirmPassword ? 'text' : 'password'}
                              value={passwordData.confirmPassword}
                              onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                              className="w-full bg-code-gray border border-gray-600 pl-10 pr-12 py-3 rounded font-mono text-white placeholder-gray-500 focus:outline-none focus:border-electric-violet transition-colors"
                              placeholder="Confirm new password"
                              disabled={loading}
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-electric-violet transition-colors"
                            >
                              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={loading}
                          className="flex items-center gap-2 bg-electric-violet hover:bg-electric-violet-light disabled:opacity-50 disabled:cursor-not-allowed text-white font-mono py-3 px-6 rounded transition-colors"
                        >
                          <Lock className="w-4 h-4" />
                          {loading ? 'Updating...' : 'Update Password'}
                        </button>
                      </form>
                    </motion.div>
                  )}

                  {/* Downloads Tab */}
                  {activeTab === 'downloads' && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <h2 className="text-xl font-mono text-white mb-6">Download History</h2>
                      
                      <div className="text-center py-12">
                        <Download className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-lg font-mono text-gray-400 mb-2">No Downloads Yet</h3>
                        <p className="text-gray-500 font-mono text-sm mb-6">
                          Your purchased templates and downloads will appear here
                        </p>
                        <button
                          onClick={() => navigate('/products')}
                          className="bg-electric-violet hover:bg-electric-violet-light text-white font-mono py-2 px-4 rounded transition-colors"
                        >
                          Browse Products
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  )
}
