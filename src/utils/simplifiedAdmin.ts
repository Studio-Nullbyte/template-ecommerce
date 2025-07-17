// Simplified admin check - no caching, no complex state management

// In useAuth hook, just add:
const isAdmin = profile?.role === 'admin'

// In ProtectedRoute component:
function ProtectedRoute({ children, requireAdmin = false }) {
  const { user, profile, loading } = useAuth()
  
  if (loading) {
    return <div>Loading...</div>
  }
  
  if (!user) {
    return <Navigate to="/auth" />
  }
  
  if (requireAdmin && profile?.role !== 'admin') {
    return <Navigate to="/" />
  }
  
  return children
}

// Remove all these files:
// - useAdminState.ts
// - useAdmin.ts  
// - adminAuthCheck.ts
// - adminDebug.ts
// - adminTroubleshooting.ts
// - All admin debug components
