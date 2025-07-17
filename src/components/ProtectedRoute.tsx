import { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthContext } from '../contexts/AuthContext'

interface ProtectedRouteProps {
  children: ReactNode
  requireAuth?: boolean
  requireAdmin?: boolean
}

export function ProtectedRoute({ 
  children, 
  requireAuth = true, 
  requireAdmin = false 
}: ProtectedRouteProps) {
  const { user, isAdmin, loading } = useAuthContext()
  const location = useLocation()

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-white font-mono">Loading...</div>
      </div>
    )
  }

  // Check authentication
  if (requireAuth && !user) {
    return <Navigate to="/auth" state={{ from: location }} replace />
  }

  // Check admin access
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
