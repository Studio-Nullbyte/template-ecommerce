import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  AlertCircle, 
  CheckCircle, 
  RefreshCw, 
  Database, 
  User, 
  Shield,
  X,
  Play,
  Zap,
  Settings,
  FileText
} from 'lucide-react'
import { performAdminAuthCheck, forceRefreshAdminProfile, testAdminDataAccess } from '../utils/adminAuthCheck'
import { runAdminTroubleshooting, quickFixAdminAccess, forceCreateAdminProfile } from '../utils/adminTroubleshooting'
import { useAdmin } from '../hooks/useAdmin'
import { useAuthContext } from '../contexts/AuthContext'

interface AdminDebugPanelProps {
  isOpen: boolean
  onClose: () => void
}

export default function AdminDebugPanel({ isOpen, onClose }: AdminDebugPanelProps) {
  const { isAdmin: hookIsAdmin, loading: hookLoading } = useAdmin()
  const { isAdmin: stateIsAdmin, loading: stateLoading } = useAuthContext()
  
  const [authResult, setAuthResult] = useState<any>(null)
  const [dataAccessResult, setDataAccessResult] = useState<any>(null)
  const [troubleshootingResult, setTroubleshootingResult] = useState<any>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [lastCheck, setLastCheck] = useState<string>('')
  const [message, setMessage] = useState<string>('')

  const runFullTroubleshooting = async () => {
    setIsRunning(true)
    setMessage('')
    try {
      const result = await runAdminTroubleshooting()
      setTroubleshootingResult(result)
      setLastCheck(new Date().toLocaleTimeString())
    } catch (error) {
      setMessage(`Troubleshooting failed: ${error}`)
    } finally {
      setIsRunning(false)
    }
  }

  const runQuickFix = async () => {
    setIsRunning(true)
    setMessage('')
    try {
      const result = await quickFixAdminAccess()
      setMessage(result.message)
      if (result.success) {
        // Re-run auth check after quick fix
        await runAuthCheck()
      }
    } catch (error) {
      setMessage(`Quick fix failed: ${error}`)
    } finally {
      setIsRunning(false)
    }
  }

  const runForceCreateAdmin = async () => {
    setIsRunning(true)
    setMessage('')
    try {
      const result = await forceCreateAdminProfile()
      setMessage(result.message)
      if (result.success) {
        // Re-run auth check after profile creation
        await runAuthCheck()
      }
    } catch (error) {
      setMessage(`Force create admin failed: ${error}`)
    } finally {
      setIsRunning(false)
    }
  }

  const runAuthCheck = async () => {
    setIsRunning(true)
    try {
      const result = await performAdminAuthCheck()
      setAuthResult(result)
      setLastCheck(new Date().toLocaleTimeString())
    } catch (error) {
      setAuthResult({
        isAdmin: false,
        user: null,
        profile: null,
        session: null,
        error: `Check failed: ${error}`,
        warnings: []
      })
    } finally {
      setIsRunning(false)
    }
  }

  const runDataAccessTest = async () => {
    setIsRunning(true)
    try {
      const result = await testAdminDataAccess()
      setDataAccessResult(result)
    } catch (error) {
      setDataAccessResult({
        categories: false,
        products: false,
        users: false,
        orders: false,
        errors: [`Test failed: ${error}`]
      })
    } finally {
      setIsRunning(false)
    }
  }

  const forceRefresh = async () => {
    setIsRunning(true)
    try {
      const result = await forceRefreshAdminProfile()
      setAuthResult(result)
      setLastCheck(new Date().toLocaleTimeString())
      
      // Also run data access test
      await runDataAccessTest()
    } catch (error) {
      setAuthResult({
        isAdmin: false,
        user: null,
        profile: null,
        session: null,
        error: `Force refresh failed: ${error}`,
        warnings: []
      })
    } finally {
      setIsRunning(false)
    }
  }

  // Auto-run on open
  useEffect(() => {
    if (isOpen && !authResult) {
      runAuthCheck()
      runDataAccessTest()
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-code-gray border border-gray-700 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-mono text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-electric-violet" />
              Admin Debug Panel
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Hook Status */}
            <div className="bg-code-gray-dark p-4 rounded-lg">
              <h3 className="text-lg font-mono text-white mb-3 flex items-center gap-2">
                <User className="w-4 h-4" />
                Hook Status
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm font-mono">
                <div>
                  <span className="text-gray-400">useAdmin:</span>
                  <span className={`ml-2 ${hookIsAdmin ? 'text-terminal-green' : 'text-red-400'}`}>
                    {hookLoading ? 'Loading...' : hookIsAdmin ? 'Admin' : 'Not Admin'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">useAdminState:</span>
                  <span className={`ml-2 ${stateIsAdmin ? 'text-terminal-green' : 'text-red-400'}`}>
                    {stateLoading ? 'Loading...' : stateIsAdmin ? 'Admin' : 'Not Admin'}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="text-sm font-mono text-gray-400">Diagnostics</h4>
                <div className="space-y-2">
                  <button
                    onClick={runAuthCheck}
                    disabled={isRunning}
                    className="btn-secondary w-full flex items-center gap-2"
                  >
                    <Play className="w-4 h-4" />
                    Auth Check
                  </button>
                  <button
                    onClick={runDataAccessTest}
                    disabled={isRunning}
                    className="btn-secondary w-full flex items-center gap-2"
                  >
                    <Database className="w-4 h-4" />
                    Data Access Test
                  </button>
                  <button
                    onClick={runFullTroubleshooting}
                    disabled={isRunning}
                    className="btn-secondary w-full flex items-center gap-2"
                  >
                    <Settings className="w-4 h-4" />
                    Full Troubleshooting
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-mono text-gray-400">Fixes</h4>
                <div className="space-y-2">
                  <button
                    onClick={forceRefresh}
                    disabled={isRunning}
                    className="btn-primary w-full flex items-center gap-2"
                  >
                    <RefreshCw className={`w-4 h-4 ${isRunning ? 'animate-spin' : ''}`} />
                    Force Refresh
                  </button>
                  <button
                    onClick={runQuickFix}
                    disabled={isRunning}
                    className="btn-primary w-full flex items-center gap-2"
                  >
                    <Zap className="w-4 h-4" />
                    Quick Fix
                  </button>
                  <button
                    onClick={runForceCreateAdmin}
                    disabled={isRunning}
                    className="btn-primary w-full flex items-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    Force Admin
                  </button>
                </div>
              </div>
            </div>

            {lastCheck && (
              <div className="text-sm text-gray-400 font-mono">
                Last check: {lastCheck}
              </div>
            )}

            {message && (
              <div className="p-3 bg-electric-violet/10 border border-electric-violet/20 rounded">
                <div className="text-electric-violet font-mono text-sm">
                  {message}
                </div>
              </div>
            )}

            {/* SQL Fix Guide */}
            <div className="bg-code-gray-dark p-4 rounded-lg">
              <h3 className="text-lg font-mono text-white mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                SQL Fix Guide
              </h3>
              <div className="text-sm text-gray-400 font-mono space-y-2">
                <p>If admin access is intermittent, run the SQL fix script:</p>
                <div className="bg-code-gray p-2 rounded border">
                  <code className="text-terminal-green">
                    sql/fix_admin_access.sql
                  </code>
                </div>
                <p>This will fix RLS policies and create debug functions.</p>
              </div>
            </div>

            {/* Troubleshooting Result */}
            {troubleshootingResult && (
              <div className="bg-code-gray-dark p-4 rounded-lg">
                <h3 className="text-lg font-mono text-white mb-3 flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Troubleshooting Result
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm font-mono">
                    <div>
                      <span className="text-gray-400">Session:</span>
                      <span className={`ml-2 ${troubleshootingResult.sessionValid ? 'text-terminal-green' : 'text-red-400'}`}>
                        {troubleshootingResult.sessionValid ? 'Valid' : 'Invalid'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Profile:</span>
                      <span className={`ml-2 ${troubleshootingResult.profileExists ? 'text-terminal-green' : 'text-red-400'}`}>
                        {troubleshootingResult.profileExists ? 'Exists' : 'Missing'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Role:</span>
                      <span className={`ml-2 ${troubleshootingResult.isAdmin ? 'text-terminal-green' : 'text-red-400'}`}>
                        {troubleshootingResult.userRole || 'None'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">RLS:</span>
                      <span className={`ml-2 ${troubleshootingResult.rlsEnabled ? 'text-terminal-green' : 'text-red-400'}`}>
                        {troubleshootingResult.rlsEnabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                  </div>

                  {troubleshootingResult.recommendations?.length > 0 && (
                    <div className="p-3 bg-yellow-900 bg-opacity-20 rounded border border-yellow-700">
                      <div className="flex items-center gap-2 text-yellow-400">
                        <AlertCircle className="w-4 h-4" />
                        <span className="font-semibold">Recommendations:</span>
                      </div>
                      <ul className="text-yellow-300 mt-1 space-y-1">
                        {troubleshootingResult.recommendations.map((rec: string, index: number) => (
                          <li key={index} className="text-sm">• {rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Auth Result */}
            {authResult && (
              <div className="bg-code-gray-dark p-4 rounded-lg">
                <h3 className="text-lg font-mono text-white mb-3 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Authentication Result
                </h3>
                <div className="space-y-2 text-sm font-mono">
                  <div className="flex items-center gap-2">
                    {authResult.isAdmin ? (
                      <CheckCircle className="w-4 h-4 text-terminal-green" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-400" />
                    )}
                    <span className={authResult.isAdmin ? 'text-terminal-green' : 'text-red-400'}>
                      {authResult.isAdmin ? 'Admin Access Granted' : 'No Admin Access'}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <span className="text-gray-400">User:</span>
                      <span className={`ml-2 ${authResult.user ? 'text-terminal-green' : 'text-red-400'}`}>
                        {authResult.user ? 'Present' : 'Missing'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Profile:</span>
                      <span className={`ml-2 ${authResult.profile ? 'text-terminal-green' : 'text-red-400'}`}>
                        {authResult.profile ? `Role: ${authResult.profile.role}` : 'Missing'}
                      </span>
                    </div>
                  </div>

                  {authResult.error && (
                    <div className="mt-4 p-3 bg-red-900 bg-opacity-20 rounded border border-red-700">
                      <div className="flex items-center gap-2 text-red-400">
                        <AlertCircle className="w-4 h-4" />
                        <span className="font-semibold">Error:</span>
                      </div>
                      <div className="text-red-300 mt-1">{authResult.error}</div>
                    </div>
                  )}

                  {authResult.warnings?.length > 0 && (
                    <div className="mt-4 p-3 bg-yellow-900 bg-opacity-20 rounded border border-yellow-700">
                      <div className="flex items-center gap-2 text-yellow-400">
                        <AlertCircle className="w-4 h-4" />
                        <span className="font-semibold">Warnings:</span>
                      </div>
                      <ul className="text-yellow-300 mt-1 space-y-1">
                        {authResult.warnings.map((warning: string, index: number) => (
                          <li key={index} className="text-sm">• {warning}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Data Access Result */}
            {dataAccessResult && (
              <div className="bg-code-gray-dark p-4 rounded-lg">
                <h3 className="text-lg font-mono text-white mb-3 flex items-center gap-2">
                  <Database className="w-4 h-4" />
                  Data Access Test
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm font-mono">
                  <div className="flex items-center gap-2">
                    {dataAccessResult.categories ? (
                      <CheckCircle className="w-4 h-4 text-terminal-green" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-400" />
                    )}
                    <span className={dataAccessResult.categories ? 'text-terminal-green' : 'text-red-400'}>
                      Categories
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {dataAccessResult.products ? (
                      <CheckCircle className="w-4 h-4 text-terminal-green" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-400" />
                    )}
                    <span className={dataAccessResult.products ? 'text-terminal-green' : 'text-red-400'}>
                      Products
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {dataAccessResult.users ? (
                      <CheckCircle className="w-4 h-4 text-terminal-green" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-400" />
                    )}
                    <span className={dataAccessResult.users ? 'text-terminal-green' : 'text-red-400'}>
                      Users
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {dataAccessResult.orders ? (
                      <CheckCircle className="w-4 h-4 text-terminal-green" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-400" />
                    )}
                    <span className={dataAccessResult.orders ? 'text-terminal-green' : 'text-red-400'}>
                      Orders
                    </span>
                  </div>
                </div>

                {dataAccessResult.errors?.length > 0 && (
                  <div className="mt-4 p-3 bg-red-900 bg-opacity-20 rounded border border-red-700">
                    <div className="flex items-center gap-2 text-red-400">
                      <AlertCircle className="w-4 h-4" />
                      <span className="font-semibold">Data Access Errors:</span>
                    </div>
                    <ul className="text-red-300 mt-1 space-y-1">
                      {dataAccessResult.errors.map((error: string, index: number) => (
                        <li key={index} className="text-sm">• {error}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
