import { supabase } from '../lib/supabase'

export const testSupabaseConnection = async () => {
  console.log('🔍 Testing Supabase Connection...')
  
  try {
    // Test 1: Check environment variables
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
    
    console.log('📋 Environment Variables:')
    console.log('  VITE_SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Missing')
    console.log('  VITE_SUPABASE_ANON_KEY:', supabaseKey ? '✅ Set' : '❌ Missing')
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('❌ Missing environment variables - check .env.local file')
      return false
    }
    
    // Test 2: Check auth session
    console.log('\n🔐 Testing Auth Session...')
    const { error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError) {
      console.error('❌ Auth session error:', sessionError)
      return false
    }
    
    console.log('✅ Auth session test passed')
    
    // Test 3: Test simple query
    console.log('\n📊 Testing Database Query...')
    const { data, error } = await supabase
      .from('user_profiles')
      .select('id')
      .limit(1)
    
    if (error) {
      console.error('❌ Database query failed:', error)
      console.error('Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
      
      // Check for specific error types
      if (error.message.includes('503') || error.message.includes('Service Unavailable')) {
        console.error('\n🔴 503 Service Unavailable - Possible solutions:')
        console.error('   1. Check if your Supabase project is paused')
        console.error('   2. Go to https://supabase.com/dashboard')
        console.error('   3. Click on your project')
        console.error('   4. Check project status in settings')
        console.error('   5. If paused, restart the project')
      }
      
      if (error.message.includes('relation') && error.message.includes('does not exist')) {
        console.error('\n🔴 Table does not exist - Possible solutions:')
        console.error('   1. Check if user_profiles table exists in your database')
        console.error('   2. Run database migrations')
        console.error('   3. Create the table manually in Supabase dashboard')
      }
      
      return false
    }
    
    console.log('✅ Database query test passed')
    console.log('📊 Query result:', data)
    
    console.log('\n🎉 All Supabase connection tests passed!')
    return true
    
  } catch (error) {
    console.error('❌ Unexpected error during diagnostics:', error)
    return false
  }
}

export const checkSupabaseStatus = async () => {
  console.log('🔍 Checking Supabase Project Status...')
  
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  if (!supabaseUrl) {
    console.error('❌ No Supabase URL found')
    return
  }
  
  try {
    // Extract project ID from URL
    const projectId = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1]
    if (!projectId) {
      console.error('❌ Could not extract project ID from URL')
      return
    }
    
    console.log('📋 Project Info:')
    console.log('  Project ID:', projectId)
    console.log('  URL:', supabaseUrl)
    console.log('  Dashboard:', `https://supabase.com/dashboard/project/${projectId}`)
    
    // Test basic connectivity
    const response = await fetch(`${supabaseUrl}/health`)
    console.log('🏥 Health check response:', response.status, response.statusText)
    
  } catch (error) {
    console.error('❌ Error checking Supabase status:', error)
  }
}
