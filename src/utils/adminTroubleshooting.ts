/**
 * Admin Troubleshooting Utility
 * Use this to diagnose and fix admin access issues
 */

import { supabase } from '../lib/supabase'
import { logger } from './logger'

export interface AdminTroubleshootingResult {
  userId: string | null
  sessionValid: boolean
  profileExists: boolean
  userRole: string | null
  isAdmin: boolean
  rlsEnabled: boolean
  dataAccessTest: {
    categories: boolean
    products: boolean
    users: boolean
    orders: boolean
  }
  recommendations: string[]
  errors: string[]
}

export async function runAdminTroubleshooting(): Promise<AdminTroubleshootingResult> {
  const recommendations: string[] = []
  const errors: string[] = []
  
  try {
    // 1. Check current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError) {
      errors.push(`Session error: ${sessionError.message}`)
    }
    
    const sessionValid = !!session
    const userId = session?.user?.id || null
    
    if (!sessionValid) {
      recommendations.push('User needs to log in again')
      return {
        userId,
        sessionValid,
        profileExists: false,
        userRole: null,
        isAdmin: false,
        rlsEnabled: false,
        dataAccessTest: {
          categories: false,
          products: false,
          users: false,
          orders: false
        },
        recommendations,
        errors
      }
    }

    // 2. Check user profile
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('user_id', userId)
      .single()

    const profileExists = !profileError && !!profile
    const userRole = profile?.role || null
    const isAdmin = userRole === 'admin'

    if (profileError) {
      errors.push(`Profile error: ${profileError.message}`)
      if (profileError.code === 'PGRST116') {
        recommendations.push('User profile needs to be created')
      }
    }

    if (!isAdmin) {
      recommendations.push('User role needs to be changed to "admin"')
    }

    // 3. Test RLS policies using the debug function
    let rlsEnabled = false
    try {
      const { data: debugData, error: debugError } = await supabase.rpc('debug_admin_access')
      
      if (debugError) {
        errors.push(`Debug function error: ${debugError.message}`)
        recommendations.push('Run the SQL fix script to create the debug function')
      } else {
        rlsEnabled = true
        logger.admin('RLS debug data:', debugData)
      }
    } catch (error) {
      errors.push(`Debug function not available: ${error}`)
      recommendations.push('Run the SQL fix script to create the debug function')
    }

    // 4. Test data access
    const dataAccessTest = {
      categories: false,
      products: false,
      users: false,
      orders: false
    }

    // Test categories
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id')
        .limit(1)
      
      if (!error && data !== null) {
        dataAccessTest.categories = true
      } else if (error) {
        errors.push(`Categories access error: ${error.message}`)
      }
    } catch (error) {
      errors.push(`Categories access exception: ${error}`)
    }

    // Test products
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id')
        .limit(1)
      
      if (!error && data !== null) {
        dataAccessTest.products = true
      } else if (error) {
        errors.push(`Products access error: ${error.message}`)
      }
    } catch (error) {
      errors.push(`Products access exception: ${error}`)
    }

    // Test users
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('user_id')
        .limit(1)
      
      if (!error && data !== null) {
        dataAccessTest.users = true
      } else if (error) {
        errors.push(`Users access error: ${error.message}`)
      }
    } catch (error) {
      errors.push(`Users access exception: ${error}`)
    }

    // Test orders
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('id')
        .limit(1)
      
      if (!error && data !== null) {
        dataAccessTest.orders = true
      } else if (error) {
        errors.push(`Orders access error: ${error.message}`)
      }
    } catch (error) {
      errors.push(`Orders access exception: ${error}`)
    }

    // Generate recommendations based on test results
    const failedTests = Object.entries(dataAccessTest).filter(([_, success]) => !success)
    
    if (failedTests.length > 0) {
      recommendations.push('Some data access tests failed - check RLS policies')
      recommendations.push('Run the SQL fix script to update RLS policies')
    }

    if (errors.some(error => error.includes('RLS') || error.includes('PGRST301'))) {
      recommendations.push('RLS policies need to be updated for admin access')
    }

    return {
      userId,
      sessionValid,
      profileExists,
      userRole,
      isAdmin,
      rlsEnabled,
      dataAccessTest,
      recommendations,
      errors
    }

  } catch (error) {
    errors.push(`Troubleshooting failed: ${error}`)
    
    return {
      userId: null,
      sessionValid: false,
      profileExists: false,
      userRole: null,
      isAdmin: false,
      rlsEnabled: false,
      dataAccessTest: {
        categories: false,
        products: false,
        users: false,
        orders: false
      },
      recommendations: ['Run complete troubleshooting in a stable environment'],
      errors
    }
  }
}

/**
 * Quick fix for admin access issues
 */
export async function quickFixAdminAccess() {
  try {
    // 1. Clear all admin-related cache
    localStorage.removeItem('studio_nullbyte_admin_status')
    localStorage.removeItem('studio_nullbyte_admin_expiry')
    
    // 2. Refresh the session
    const { data: { session }, error: sessionError } = await supabase.auth.refreshSession()
    
    if (sessionError) {
      throw new Error(`Session refresh failed: ${sessionError.message}`)
    }
    
    // 3. Re-fetch profile
    if (session?.user) {
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('user_id', session.user.id)
        .single()
      
      if (profileError) {
        throw new Error(`Profile fetch failed: ${profileError.message}`)
      }
      
      if (profile?.role === 'admin') {
        // Cache the admin status
        const expiryTime = Date.now() + (30 * 60 * 1000) // 30 minutes
        localStorage.setItem('studio_nullbyte_admin_status', 'true')
        localStorage.setItem('studio_nullbyte_admin_expiry', expiryTime.toString())
        
        return { success: true, message: 'Admin access restored' }
      } else {
        return { success: false, message: 'User is not an admin' }
      }
    }
    
    return { success: false, message: 'No valid session' }
    
  } catch (error) {
    return { success: false, message: `Quick fix failed: ${error}` }
  }
}

/**
 * Force admin profile creation (for development/testing)
 */
export async function forceCreateAdminProfile() {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session?.user) {
      throw new Error('No active session')
    }
    
    // Try to update existing profile first
    const { data: updateData, error: updateError } = await supabase
      .from('user_profiles')
      .update({ role: 'admin' })
      .eq('user_id', session.user.id)
      .select()
      .single()
    
    if (updateError && updateError.code === 'PGRST116') {
      // Profile doesn't exist, create it
      const { data: insertData, error: insertError } = await supabase
        .from('user_profiles')
        .insert({
          user_id: session.user.id,
          email: session.user.email!,
          full_name: session.user.user_metadata?.full_name || 'Admin User',
          role: 'admin'
        })
        .select()
        .single()
      
      if (insertError) {
        throw new Error(`Profile creation failed: ${insertError.message}`)
      }
      
      return { success: true, message: 'Admin profile created', data: insertData }
    } else if (updateError) {
      throw new Error(`Profile update failed: ${updateError.message}`)
    }
    
    return { success: true, message: 'Admin profile updated', data: updateData }
    
  } catch (error) {
    return { success: false, message: `Force admin creation failed: ${error}` }
  }
}
