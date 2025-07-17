import { useEffect, useState } from 'react'
import { useAuthContext } from '../contexts/AuthContext'
import { logger } from '../utils/logger'

/**
 * Hook specifically for managing admin state persistence
 * This prevents admin status from being lost during navigation
 */
export function useAdminState() {
  const { user, profile, loading: authLoading } = useAuthContext()
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    logger.admin('useAdminState: Auth state changed', {
      user: !!user,
      profile: !!profile,
      profileRole: profile?.role,
      authLoading,
      timestamp: new Date().toISOString()
    })

    if (authLoading) {
      console.log('🔑 useAdminState: Still loading auth...')
      return
    }

    if (!user) {
      console.log('🔑 useAdminState: No user, setting admin to false')
      setIsAdmin(false)
      setLoading(false)
      return
    }

    if (profile) {
      const adminStatus = profile.role === 'admin'
      console.log('🔑 useAdminState: Profile loaded, admin status:', adminStatus)
      setIsAdmin(adminStatus)
      setLoading(false)
    } else if (profile === null) {
      console.log('🔑 useAdminState: Profile is null, setting admin to false')
      setIsAdmin(false)
      setLoading(false)
    }
    // If profile is undefined, keep loading
  }, [user, profile, authLoading])

  return {
    isAdmin,
    loading,
    user,
    profile
  }
}
