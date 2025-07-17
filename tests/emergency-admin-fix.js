/**
 * Emergency Admin Profile Creator
 * Run this in your browser console to create an admin profile
 * bypassing RLS policies that might have recursion issues
 */

async function createAdminProfileEmergency() {
  try {
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return false
    }
    
    // Create admin profile
    const { data, error } = await supabase
      .from('user_profiles')
      .upsert({
        user_id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Admin User',
        role: 'admin'
      }, {
        onConflict: 'user_id'
      })
      .select()
    
    if (error) {
      return false
    }
    
    return true
    
  } catch (error) {
    return false
  }
}

// Run the function and refresh page if successful
createAdminProfileEmergency().then(success => {
  if (success) {
    window.location.reload()
  }
})
