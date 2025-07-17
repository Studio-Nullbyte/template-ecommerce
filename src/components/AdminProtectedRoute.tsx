import { ReactNode, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdmin } from '../hooks/useAdmin'
import { useAuthContext } from '../contexts/AuthContext'

interface AdminProtectedRouteProps {
  children: ReactNode
}

export default function AdminProtectedRoute({ children }: AdminProtectedRouteProps) {
  const { loading: authLoading } = useAuthContext()
  const { isAdmin, loading: adminLoading } = useAdmin()
  const navigate = useNavigate()

  // Determine if we're still loading overall
  const isLoading = authLoading || adminLoading

  // Listen for session expiration events
  useEffect(() => {
    const handleSessionExpired = () => {
      navigate('/', { replace: true })
    }

    window.addEventListener('session-expired', handleSessionExpired)
    return () => window.removeEventListener('session-expired', handleSessionExpired)
  }, [navigate])

  useEffect(() => {
    // Only redirect if we're done loading and user is definitely not admin
    if (!isLoading && !isAdmin) {
      navigate('/', { replace: true })
    }
  }, [isLoading, isAdmin, navigate, authLoading, adminLoading])

  // Show loading while determining auth status
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-electric-violet border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 font-mono">Verifying admin access...</p>
        </div>
      </div>
    )
  }

  // Show nothing if not admin (redirect will happen)
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 font-mono">Access denied. Redirecting...</p>
        </div>
      </div>
    )
  }

  // User is confirmed admin, show the protected content
  return <>{children}</>
}
