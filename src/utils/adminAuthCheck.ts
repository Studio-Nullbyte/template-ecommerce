/**
 * Utility for comprehensive admin authentication checks
 * This helps debug and fix intermittent admin access issues
 */

import { supabase } from '../lib/supabase'
import { debugAdminState } from './adminDebug'

export interface AdminAuthResult {
  isAdmin: boolean
  user: any | null
  profile: any | null
  session: any | null
  error?: string
  warnings: string[]
}

export async function performAdminAuthCheck(): Promise<AdminAuthResult> {
  const warnings: string[] = []
  let error: string | undefined
  
  try {
    // Step 1: Check current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError) {
      error = `Session error: ${sessionError.message}`
      debugAdminState('session error', { sessionError })
    }
    
    if (!session) {
      return {
        isAdmin: false,
        user: null,
        profile: null,
        session: null,
        error: 'No active session',
        warnings
      }
    }
    
    // Step 2: Check user
    const user = session.user
    if (!user) {
      return {
        isAdmin: false,
        user: null,
        profile: null,
        session,
        error: 'No user in session',
        warnings
      }
    }
    
    // Step 3: Check profile with explicit admin check
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()
    
    if (profileError) {
      if (profileError.code === 'PGRST116') {
        error = 'No profile found for user'
      } else {
        error = `Profile error: ${profileError.message}`
        debugAdminState('profile error', { profileError })
      }
    }
    
    if (!profile) {
      return {
        isAdmin: false,
        user,
        profile: null,
        session,
        error: error || 'Profile not found',
        warnings
      }
    }
    
    // Step 4: Check admin role
    const isAdmin = profile.role === 'admin'
    
    if (!isAdmin) {
      warnings.push(`User role is '${profile.role}', not 'admin'`)
    }
    
    // Step 5: Test admin data access
    try {
      const { data: testData, error: testError } = await supabase
        .from('products')
        .select('id', { count: 'exact', head: true })
      
      if (testError) {
        warnings.push(`Admin data access test failed: ${testError.message}`)
        debugAdminState('admin data access test failed', { testError })
      } else {
        debugAdminState('admin data access test passed', { testData })
      }
    } catch (testError) {
      warnings.push(`Admin data access test exception: ${testError}`)
    }
    
    debugAdminState('admin auth check complete', {
      isAdmin,
      userId: user.id,
      profileRole: profile.role,
      warningCount: warnings.length
    })
    
    return {
      isAdmin,
      user,
      profile,
      session,
      error,
      warnings
    }
  } catch (exception) {
    error = `Admin auth check exception: ${exception}`
    debugAdminState('admin auth check exception', { exception })
    
    return {
      isAdmin: false,
      user: null,
      profile: null,
      session: null,
      error,
      warnings
    }
  }
}

/**
 * Force refresh admin profile and clear cache
 */
export async function forceRefreshAdminProfile(): Promise<AdminAuthResult> {
  try {
    // Clear admin cache
    localStorage.removeItem('studio_nullbyte_admin_status')
    localStorage.removeItem('studio_nullbyte_admin_expiry')
    
    // Force fresh auth check
    const result = await performAdminAuthCheck()
    
    // If admin, cache the result
    if (result.isAdmin) {
      const expiryTime = Date.now() + (30 * 60 * 1000) // 30 minutes
      localStorage.setItem('studio_nullbyte_admin_status', 'true')
      localStorage.setItem('studio_nullbyte_admin_expiry', expiryTime.toString())
    }
    
    return result
  } catch (error) {
    return {
      isAdmin: false,
      user: null,
      profile: null,
      session: null,
      error: `Force refresh failed: ${error}`,
      warnings: []
    }
  }
}

/**
 * Check if admin data queries are working
 */
export async function testAdminDataAccess(): Promise<{
  categories: boolean
  products: boolean
  users: boolean
  orders: boolean
  errors: string[]
}> {
  const errors: string[] = []
  let categories = false
  let products = false
  let users = false
  let orders = false
  
  try {
    // Test categories access
    const { error: catError } = await supabase
      .from('categories')
      .select('id', { count: 'exact', head: true })
    
    if (catError) {
      errors.push(`Categories: ${catError.message}`)
    } else {
      categories = true
    }
  } catch (error) {
    errors.push(`Categories exception: ${error}`)
  }
  
  try {
    // Test products access
    const { error: prodError } = await supabase
      .from('products')
      .select('id', { count: 'exact', head: true })
    
    if (prodError) {
      errors.push(`Products: ${prodError.message}`)
    } else {
      products = true
    }
  } catch (error) {
    errors.push(`Products exception: ${error}`)
  }
  
  try {
    // Test users access
    const { error: userError } = await supabase
      .from('user_profiles')
      .select('user_id', { count: 'exact', head: true })
    
    if (userError) {
      errors.push(`Users: ${userError.message}`)
    } else {
      users = true
    }
  } catch (error) {
    errors.push(`Users exception: ${error}`)
  }
  
  try {
    // Test orders access
    const { error: orderError } = await supabase
      .from('orders')
      .select('id', { count: 'exact', head: true })
    
    if (orderError) {
      errors.push(`Orders: ${orderError.message}`)
    } else {
      orders = true
    }
  } catch (error) {
    errors.push(`Orders exception: ${error}`)
  }
  
  return {
    categories,
    products,
    users,
    orders,
    errors
  }
}
