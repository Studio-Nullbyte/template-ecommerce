import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bug, X, Clock, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react'
import { useAuthContext } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

interface LoadingDebuggerProps {
  isVisible?: boolean
  onClose?: () => void
}

interface SystemStatus {
  supabaseConnection: 'checking' | 'connected' | 'failed'
  authState: 'checking' | 'authenticated' | 'unauthenticated' | 'loading'
  databaseAccess: 'checking' | 'accessible' | 'failed'
  loadingDuration: number
}

export function LoadingDebugger({ isVisible = false, onClose }: LoadingDebuggerProps) {
  const { user, loading, profile } = useAuthContext()
  const [isOpen, setIsOpen] = useState(isVisible)
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    supabaseConnection: 'checking',
    authState: 'checking',
    databaseAccess: 'checking',
    loadingDuration: 0
  })
  const [logs, setLogs] = useState<string[]>([])
  const [startTime] = useState(Date.now())

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setLogs(prev => [...prev.slice(-9), `[${timestamp}] ${message}`])
  }

  // Track loading duration
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemStatus(prev => ({
        ...prev,
        loadingDuration: Math.floor((Date.now() - startTime) / 1000)
      }))
    }, 1000)

    return () => clearInterval(interval)
  }, [startTime])

  // Test Supabase connection
  useEffect(() => {
    const testConnection = async () => {
      try {
        addLog('Testing Supabase connection...')
        const { error } = await supabase.from('user_profiles').select('id').limit(1)
        
        if (error) {
          addLog(`Supabase connection failed: ${error.message}`)
          setSystemStatus(prev => ({ ...prev, supabaseConnection: 'failed' }))
        } else {
          addLog('Supabase connection successful')
          setSystemStatus(prev => ({ ...prev, supabaseConnection: 'connected' }))
        }
      } catch (error) {
        addLog(`Supabase connection error: ${error}`)
        setSystemStatus(prev => ({ ...prev, supabaseConnection: 'failed' }))
      }
    }

    testConnection()
  }, [])

  // Monitor auth state
  useEffect(() => {
    if (loading) {
      setSystemStatus(prev => ({ ...prev, authState: 'loading' }))
      addLog('Auth state: Loading...')
    } else if (user) {
      setSystemStatus(prev => ({ ...prev, authState: 'authenticated' }))
      addLog(`Auth state: Authenticated as ${user.email}`)
    } else {
      setSystemStatus(prev => ({ ...prev, authState: 'unauthenticated' }))
      addLog('Auth state: Not authenticated')
    }
  }, [user, loading])

  // Test database access
  useEffect(() => {
    const testDatabaseAccess = async () => {
      if (user) {
        try {
          addLog('Testing database access...')
          const { error } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('user_id', user.id)
            .single()
          
          if (error && error.code !== 'PGRST116') {
            addLog(`Database access failed: ${error.message}`)
            setSystemStatus(prev => ({ ...prev, databaseAccess: 'failed' }))
          } else {
            addLog('Database access successful')
            setSystemStatus(prev => ({ ...prev, databaseAccess: 'accessible' }))
          }
        } catch (error) {
          addLog(`Database access error: ${error}`)
          setSystemStatus(prev => ({ ...prev, databaseAccess: 'failed' }))
        }
      }
    }

    if (user && systemStatus.supabaseConnection === 'connected') {
      testDatabaseAccess()
    }
  }, [user, systemStatus.supabaseConnection])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'checking':
        return <RefreshCw className="w-4 h-4 animate-spin text-yellow-400" />
      case 'connected':
      case 'authenticated':
      case 'accessible':
        return <CheckCircle className="w-4 h-4 text-terminal-green" />
      case 'failed':
      case 'unauthenticated':
        return <AlertTriangle className="w-4 h-4 text-red-400" />
      default:
        return <Clock className="w-4 h-4 text-gray-400" />
    }
  }

  const getRecommendations = () => {
    const recommendations = []
    
    if (systemStatus.loadingDuration > 10) {
      recommendations.push('Loading has been active for over 10 seconds - this may indicate a stuck state')
    }
    
    if (systemStatus.supabaseConnection === 'failed') {
      recommendations.push('Check your internet connection and Supabase project status')
    }
    
    if (systemStatus.authState === 'loading' && systemStatus.loadingDuration > 5) {
      recommendations.push('Auth initialization is taking too long - try refreshing the page')
    }
    
    if (systemStatus.databaseAccess === 'failed') {
      recommendations.push('Database access failed - check RLS policies and user permissions')
    }

    return recommendations
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-full shadow-lg transition-colors z-50"
        title="Open Loading Debugger"
      >
        <Bug className="w-5 h-5" />
      </button>
    )
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 400 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 400 }}
        className="fixed top-20 right-4 w-96 bg-code-gray-light border border-gray-600 rounded-lg shadow-xl z-50 max-h-[80vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-600">
          <div className="flex items-center gap-2">
            <Bug className="w-5 h-5 text-electric-violet" />
            <h3 className="font-mono text-white font-bold">Loading Debugger</h3>
          </div>
          <button
            onClick={() => {
              setIsOpen(false)
              onClose?.()
            }}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-4 overflow-y-auto max-h-[calc(80vh-80px)]">
          {/* System Status */}
          <div className="space-y-2">
            <h4 className="font-mono text-sm text-electric-violet uppercase">System Status</h4>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Loading Duration:</span>
                <span className={`font-mono ${systemStatus.loadingDuration > 10 ? 'text-red-400' : 'text-white'}`}>
                  {systemStatus.loadingDuration}s
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Supabase:</span>
                <div className="flex items-center gap-2">
                  {getStatusIcon(systemStatus.supabaseConnection)}
                  <span className="font-mono text-white capitalize">{systemStatus.supabaseConnection}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Auth State:</span>
                <div className="flex items-center gap-2">
                  {getStatusIcon(systemStatus.authState)}
                  <span className="font-mono text-white capitalize">{systemStatus.authState}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Database:</span>
                <div className="flex items-center gap-2">
                  {getStatusIcon(systemStatus.databaseAccess)}
                  <span className="font-mono text-white capitalize">{systemStatus.databaseAccess}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Current State */}
          <div className="space-y-2">
            <h4 className="font-mono text-sm text-electric-violet uppercase">Current State</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-300">User:</span>
                <span className="font-mono text-white">{user ? user.email : 'None'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Profile:</span>
                <span className="font-mono text-white">{profile ? profile.role : 'None'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Loading:</span>
                <span className={`font-mono ${loading ? 'text-yellow-400' : 'text-terminal-green'}`}>
                  {loading ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          {getRecommendations().length > 0 && (
            <div className="space-y-2">
              <h4 className="font-mono text-sm text-electric-violet uppercase">Recommendations</h4>
              <div className="space-y-2">
                {getRecommendations().map((rec, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm">
                    <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Logs */}
          <div className="space-y-2">
            <h4 className="font-mono text-sm text-electric-violet uppercase">Recent Logs</h4>
            <div className="bg-black rounded p-2 space-y-1 max-h-40 overflow-y-auto">
              {logs.map((log, index) => (
                <div key={index} className="text-xs font-mono text-gray-300">
                  {log}
                </div>
              ))}
              {logs.length === 0 && (
                <div className="text-xs font-mono text-gray-500">No logs yet...</div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-2">
            <h4 className="font-mono text-sm text-electric-violet uppercase">Quick Actions</h4>
            <div className="space-y-2">
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-electric-violet hover:bg-electric-violet-light text-white font-mono text-sm py-2 px-3 rounded transition-colors"
              >
                Refresh Page
              </button>
              <button
                onClick={() => {
                  localStorage.clear()
                  window.location.reload()
                }}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white font-mono text-sm py-2 px-3 rounded transition-colors"
              >
                Clear Cache & Refresh
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
