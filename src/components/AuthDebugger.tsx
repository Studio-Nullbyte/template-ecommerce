import React from 'react'
import { useAuthContext } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

export const AuthDebugger: React.FC = () => {
  const { user, profile, loading } = useAuthContext()

  const makeAdmin = async () => {
    if (!user) {
      alert('No user logged in')
      return
    }
    
    try {
      console.log('Making user admin for user:', user.id, user.email)
      
      // First, check if profile exists
      const { data: existingProfile, error: checkError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()
      
      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking profile:', checkError)
        alert('Error checking profile: ' + checkError.message)
        return
      }
      
      if (existingProfile) {
        // Profile exists, update it
        console.log('Updating existing profile to admin...')
        const { error: updateError } = await supabase
          .from('user_profiles')
          .update({ role: 'admin' })
          .eq('user_id', user.id)
        
        if (updateError) {
          console.error('Error updating profile:', updateError)
          alert('Error updating profile: ' + updateError.message)
          return
        }
        
        console.log('Profile updated to admin successfully')
        alert('Successfully updated profile to admin! Please refresh the page.')
      } else {
        // Profile doesn't exist, create it
        console.log('Creating new admin profile...')
        const { error: insertError } = await supabase
          .from('user_profiles')
          .insert({
            user_id: user.id,
            email: user.email || '',
            full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Admin User',
            role: 'admin'
          })
        
        if (insertError) {
          console.error('Error creating profile:', insertError)
          alert('Error creating profile: ' + insertError.message)
          return
        }
        
        console.log('Profile created with admin role successfully')
        alert('Successfully created admin profile! Please refresh the page.')
      }
      
    } catch (error) {
      console.error('Unexpected error making admin:', error)
      alert('Unexpected error: ' + (error as Error).message)
    }
  }

  const checkDatabase = async () => {
    if (!user) return
    
    try {
      console.log('Checking database for user:', user.id)
      
      // Check if user_profiles table exists and is accessible
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()
      
      console.log('Database check result:', { data, error })
      
      if (error) {
        if (error.code === 'PGRST116') {
          alert('Profile not found in database. Click "Make Admin" to create one.')
        } else {
          alert('Database error: ' + error.message)
        }
      } else {
        alert('Profile found: ' + JSON.stringify(data, null, 2))
      }
    } catch (error) {
      console.error('Database check error:', error)
      alert('Database check failed: ' + (error as Error).message)
    }
  }

  if (!user) {
    return (
      <div className="fixed bottom-4 right-4 bg-red-900 border border-red-700 rounded p-4 text-white font-mono text-xs max-w-sm z-50">
        <h3 className="font-bold mb-2">Auth Debug - No User</h3>
        <p>User is not logged in</p>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 bg-gray-900 border border-gray-700 rounded p-4 text-white font-mono text-xs max-w-sm z-50">
      <h3 className="font-bold mb-2">Auth Debug Info</h3>
      <div className="space-y-1">
        <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
        <p><strong>User ID:</strong> {user.id.slice(0, 8)}...</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Profile Loaded:</strong> {profile ? 'Yes' : 'No'}</p>
        {profile ? (
          <>
            <p><strong>Full Name:</strong> {profile.full_name || 'None'}</p>
            <p><strong>Role:</strong> {profile.role || 'None'}</p>
            <p><strong>Is Admin:</strong> {profile.role === 'admin' ? 'YES' : 'NO'}</p>
          </>
        ) : (
          <p className="text-red-400">Profile not loaded - this may be the issue!</p>
        )}
      </div>
      
      <div className="mt-3 space-y-2">
        <button
          onClick={checkDatabase}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs"
        >
          Check Database
        </button>
        
        {!profile || profile?.role !== 'admin' ? (
          <button
            onClick={makeAdmin}
            className="w-full bg-electric-violet hover:bg-electric-violet-light text-white px-2 py-1 rounded text-xs"
          >
            {profile ? 'Make Admin' : 'Create Admin Profile'}
          </button>
        ) : (
          <p className="text-green-400 text-center">✓ Already Admin</p>
        )}
      </div>
      
      <p className="mt-2 text-gray-500 text-xs">
        Remove this debug panel when done testing
      </p>
    </div>
  )
}
