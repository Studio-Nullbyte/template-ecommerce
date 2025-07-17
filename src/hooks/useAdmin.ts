import { useState, useEffect } from 'react'
import { useAuthContext } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { debugAdminState } from '../utils/adminDebug'
import { testSupabaseConnection, checkSupabaseStatus } from '../utils/supabaseDiagnostics'

interface AdminStats {
  totalUsers: number
  totalProducts: number
  totalOrders: number
  totalRevenue: number
  pendingOrders: number
  newContactSubmissions: number
}

interface User {
  id: string
  user_id: string
  full_name: string | null
  email: string
  role: string
  created_at: string
  updated_at: string
}

interface Product {
  id: string
  title: string
  description: string
  price: number
  category_id: string
  category?: {
    name: string
    slug: string
  }
  image_url: string | null
  download_url: string | null
  preview_url: string | null
  tags: string[]
  featured: boolean
  active: boolean
  created_at: string
  updated_at: string
}

interface Order {
  id: string
  user_id: string
  total_amount: number
  status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'refunded'
  payment_method: string | null
  payment_id: string | null
  notes: string | null
  created_at: string
  updated_at: string
  user_profiles?: {
    full_name: string | null
    email: string
  }
  order_items?: {
    id: string
    product_id: string
    price: number
    quantity: number
    products: {
      title: string
    }
  }[]
}

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

interface ContactSubmission {
  id: string
  name: string
  email: string
  subject: string
  message: string
  submitted_at: string
  status: 'new' | 'in_progress' | 'resolved'
}

export function useAdmin() {
  const { profile, loading: authLoading, user } = useAuthContext()
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  // Cache admin status in localStorage to prevent random drops
  const ADMIN_CACHE_KEY = 'studio_nullbyte_admin_status'
  const ADMIN_CACHE_EXPIRY = 'studio_nullbyte_admin_expiry'

  // Emergency timeout to prevent infinite loading
  useEffect(() => {
    const emergencyTimeout = setTimeout(() => {
      if (loading) {
        // Emergency timeout reached - forcing loading to false
        setLoading(false)
      }
    }, 60000) // Increased from 8s to 60s for better reliability

    return () => clearTimeout(emergencyTimeout)
  }, [loading])

  // Load cached admin status immediately for faster UI response
  useEffect(() => {
    const loadCachedAdminStatus = () => {
      try {
        const cachedStatus = localStorage.getItem(ADMIN_CACHE_KEY)
        const cachedExpiry = localStorage.getItem(ADMIN_CACHE_EXPIRY)
        
        if (cachedStatus && cachedExpiry) {
          const expiryTime = parseInt(cachedExpiry)
          const now = Date.now()
          
          // Cache valid for 30 minutes
          if (now < expiryTime && user) {
            const isAdminCached = cachedStatus === 'true'
            setIsAdmin(isAdminCached)
          } else {
            // Clear expired cache
            localStorage.removeItem(ADMIN_CACHE_KEY)
            localStorage.removeItem(ADMIN_CACHE_EXPIRY)
          }
        }
      } catch (error) {
        // Silently handle cache errors
      }
    }

    if (user) {
      loadCachedAdminStatus()
    }
  }, [user])

  // Cache admin status when determined
  const cacheAdminStatus = (adminStatus: boolean) => {
    try {
      const expiryTime = Date.now() + (30 * 60 * 1000) // 30 minutes
      localStorage.setItem(ADMIN_CACHE_KEY, adminStatus.toString())
      localStorage.setItem(ADMIN_CACHE_EXPIRY, expiryTime.toString())
    } catch (error) {
      // Silently handle cache errors
    }
  }

  // Check if user is admin - wait for both auth and admin loading to complete
  useEffect(() => {
    const checkAdminStatus = () => {
    //   debugAdminState('checkAdminStatus', {
    //     authLoading,
    //     user: !!user,
    //     profile: profile,
    //     profileRole: profile?.role
    //   })

      // Don't make admin determination until auth is fully loaded
      if (authLoading) {
        return
      }

      // Clear admin status and cache if no user
      if (!user) {
        setIsAdmin(false)
        localStorage.removeItem(ADMIN_CACHE_KEY)
        localStorage.removeItem(ADMIN_CACHE_EXPIRY)
        setLoading(false)
        return
      }
      
      // Wait for profile to be loaded before determining admin status
      if (profile) {
        const adminStatus = profile.role === 'admin'
        //debugAdminState('setting admin status', { adminStatus, role: profile.role })
        setIsAdmin(adminStatus)
        cacheAdminStatus(adminStatus)
        setLoading(false)
      } else if (profile === null) {
        // Profile is explicitly null (user exists but no profile)
        //debugAdminState('no profile found', { user: !!user })
        setIsAdmin(false)
        cacheAdminStatus(false)
        setLoading(false)
      }
      // If profile is undefined, keep loading until we get a definitive result
    }

    checkAdminStatus()
  }, [profile, authLoading, user])

  // Add listener for auth state changes to refresh admin status
  useEffect(() => {
    const handleAuthStateChange = () => {
      // When auth state changes, clear cache and re-check admin status
      localStorage.removeItem(ADMIN_CACHE_KEY)
      localStorage.removeItem(ADMIN_CACHE_EXPIRY)
      
      if (!user) {
        setIsAdmin(false)
        setLoading(false)
      }
    }

    // Listen for session changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange)
    
    return () => subscription.unsubscribe()
  }, [user])

  // Admin Statistics
  const getAdminStats = async (): Promise<AdminStats> => {
    try {
      // Check Supabase connection first
      const { error: healthError } = await supabase.auth.getSession()
      if (healthError) {
        console.error('Supabase connection error:', healthError)
        throw new Error(`Supabase connection failed: ${healthError.message}`)
      }

      console.log('Fetching admin stats from Supabase...')
      
      const [
        usersResult,
        productsResult,
        ordersResult,
        revenueResult,
        pendingOrdersResult,
        contactsResult
      ] = await Promise.all([
        supabase.from('user_profiles').select('id', { count: 'exact', head: true }),
        supabase.from('products').select('id', { count: 'exact', head: true }),
        supabase.from('orders').select('id', { count: 'exact', head: true }),
        supabase
          .from('orders')
          .select('total_amount')
          .eq('status', 'completed'),
        supabase
          .from('orders')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'pending'),
        supabase
          .from('contact_submissions')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'new')
      ])

      // Check for specific errors in each query
      if (usersResult.error) {
        console.error('Users query error:', usersResult.error)
        console.error('Users error details:', {
          message: usersResult.error.message,
          details: usersResult.error.details,
          hint: usersResult.error.hint,
          code: usersResult.error.code
        })
      }

      if (productsResult.error) {
        console.error('Products query error:', productsResult.error)
      }

      if (ordersResult.error) {
        console.error('Orders query error:', ordersResult.error)
      }

      if (revenueResult.error) {
        console.error('Revenue query error:', revenueResult.error)
      }

      if (pendingOrdersResult.error) {
        console.error('Pending orders query error:', pendingOrdersResult.error)
      }

      if (contactsResult.error) {
        console.error('Contacts query error:', contactsResult.error)
      }

      const totalRevenue = revenueResult.data?.reduce(
        (sum, order) => sum + parseFloat(order.total_amount.toString()),
        0
      ) || 0

      return {
        totalUsers: usersResult.count || 0,
        totalProducts: productsResult.count || 0,
        totalOrders: ordersResult.count || 0,
        totalRevenue,
        pendingOrders: pendingOrdersResult.count || 0,
        newContactSubmissions: contactsResult.count || 0
      }
    } catch (error) {
      console.error('Error fetching admin stats:', error)
      
      // Check if it's a 503 Service Unavailable error
      if (error && typeof error === 'object' && 'message' in error) {
        const errorMessage = (error as any).message || ''
        if (errorMessage.includes('503') || errorMessage.includes('Service Unavailable')) {
          console.error('🔴 Supabase 503 Error - Possible causes:')
          console.error('   • Project may be paused (free tier)')
          console.error('   • Database connection issues')
          console.error('   • Temporary service outage')
          console.error('   • Check your Supabase dashboard: https://supabase.com/dashboard')
        }
      }
      
      throw error
    }
  }

  // User Management with retry logic
  const getUsers = async () => {
    const maxRetries = 3
    let lastError = null
    
    for (let retry = 0; retry < maxRetries; retry++) {
      try {
        debugAdminState('fetching users', { retry, maxRetries })
        
        // Get user profiles with auth data from profiles table
        const { data: profiles, error } = await supabase
          .from('user_profiles')
          .select(`
            user_id,
            email,
            full_name,
            avatar_url,
            role,
            is_active,
            created_at,
            updated_at
          `)
          .order('created_at', { ascending: false })

        if (error) {
          lastError = error
          console.error('Supabase error on retry', retry, ':', error)
          
          // If this is a permissions/RLS error, don't retry
          if (error.code === 'PGRST301' || error.message.includes('RLS')) {
            throw error
          }
          
          // Wait before retrying
          if (retry < maxRetries - 1) {
            await new Promise(resolve => setTimeout(resolve, (retry + 1) * 1000))
            continue
          }
          
          throw error
        }

        debugAdminState('users fetched successfully', { count: profiles?.length || 0 })

        // Transform profile data to match AdminUser interface
        const usersWithProfiles = profiles?.map((profile: any) => {
          const [firstName, lastName] = (profile.full_name || '').split(' ')
          
          return {
            id: profile.user_id,
            email: profile.email || '',
            first_name: firstName || null,
            last_name: lastName || null,
            avatar_url: profile.avatar_url || null,
            role: (profile.role as 'user' | 'admin') || 'user',
            is_active: profile.is_active ?? true,
            created_at: profile.created_at,
            last_sign_in_at: null, // Not available from profiles table
            email_confirmed_at: null // Not available from profiles table
          }
        }) || []

        return usersWithProfiles
      } catch (error) {
        lastError = error
        console.error('Error fetching users on retry', retry, ':', error)
        
        // If this is the last retry, throw the error
        if (retry === maxRetries - 1) {
          if (error instanceof Error && error.message.includes('column')) {
            throw new Error('User profiles table is missing required columns. Please run the database update script.')
          }
          throw error
        }
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, (retry + 1) * 1000))
      }
    }
    
    throw lastError || new Error('Failed to fetch users after multiple retries')
  }

  const updateUser = async (userId: string, updates: Partial<User>) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('user_id', userId)
        .select()
        .single()

      if (error) throw error

      // Log admin activity
      await supabase.rpc('log_admin_activity', {
        p_action: 'update_user',
        p_table_name: 'user_profiles',
        p_record_id: userId,
        p_new_values: updates
      })

      return { data, error: null }
    } catch (error) {
      console.error('Error updating user:', error)
      return { data: null, error }
    }
  }

  const deleteUser = async (userId: string) => {
    try {
      const { error } = await supabase.auth.admin.deleteUser(userId)
      if (error) throw error

      // Log admin activity
      await supabase.rpc('log_admin_activity', {
        p_action: 'delete_user',
        p_table_name: 'user_profiles',
        p_record_id: userId
      })

      return { error: null }
    } catch (error) {
      console.error('Error deleting user:', error)
      return { error }
    }
  }

  // Product Management with retry logic
  const getProducts = async (): Promise<Product[]> => {
    const maxRetries = 3
    let lastError = null
    
    for (let retry = 0; retry < maxRetries; retry++) {
      try {
        debugAdminState('fetching products', { retry, maxRetries })
        
        const { data, error } = await supabase
          .from('products')
          .select(`
            *,
            category:categories(name, slug)
          `)
          .order('created_at', { ascending: false })

        if (error) {
          lastError = error
          console.error('Supabase error on retry', retry, ':', error)
          
          // If this is a permissions/RLS error, don't retry
          if (error.code === 'PGRST301' || error.message.includes('RLS')) {
            throw error
          }
          
          // Wait before retrying
          if (retry < maxRetries - 1) {
            await new Promise(resolve => setTimeout(resolve, (retry + 1) * 1000))
            continue
          }
          
          throw error
        }

        debugAdminState('products fetched successfully', { count: data?.length || 0 })
        return data || []
      } catch (error) {
        lastError = error
        console.error('Error fetching products on retry', retry, ':', error)
        
        // If this is the last retry, throw the error
        if (retry === maxRetries - 1) {
          throw error
        }
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, (retry + 1) * 1000))
      }
    }
    
    throw lastError || new Error('Failed to fetch products after multiple retries')
  }

  const createProduct = async (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert(product)
        .select()
        .single()

      if (error) throw error

      // Log admin activity
      await supabase.rpc('log_admin_activity', {
        p_action: 'create_product',
        p_table_name: 'products',
        p_record_id: data.id,
        p_new_values: product
      })

      return { data, error: null }
    } catch (error) {
      console.error('Error creating product:', error)
      return { data: null, error }
    }
  }

  const updateProduct = async (productId: string, updates: Partial<Product>) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', productId)
        .select()
        .single()

      if (error) throw error

      // Log admin activity
      await supabase.rpc('log_admin_activity', {
        p_action: 'update_product',
        p_table_name: 'products',
        p_record_id: productId,
        p_new_values: updates
      })

      return { data, error: null }
    } catch (error) {
      console.error('Error updating product:', error)
      return { data: null, error }
    }
  }

  const deleteProduct = async (productId: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId)

      if (error) throw error

      // Log admin activity
      await supabase.rpc('log_admin_activity', {
        p_action: 'delete_product',
        p_table_name: 'products',
        p_record_id: productId
      })

      return { error: null }
    } catch (error) {
      console.error('Error deleting product:', error)
      return { error }
    }
  }

  // Order Management
  const getOrders = async (): Promise<Order[]> => {
    try {
      console.log('Starting getOrders...')
      
      // First, check if orders table exists by trying a simple query
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })

      if (ordersError) {
        console.error('Error fetching orders:', ordersError)
        
        // If table doesn't exist, return empty array instead of throwing
        if (ordersError.message.includes('table') || ordersError.message.includes('does not exist')) {
          console.warn('Orders table does not exist, returning empty array')
          return []
        }
        
        throw ordersError
      }

      console.log('Orders fetched:', ordersData?.length || 0)

      if (!ordersData || ordersData.length === 0) {
        console.log('No orders found, returning empty array')
        return []
      }

      // Get unique user IDs from orders
      const userIds = [...new Set(ordersData.map(order => order.user_id))]
      console.log('User IDs to fetch:', userIds)

      let userProfilesMap = new Map()

      // Try to fetch user profiles, but don't fail if table doesn't exist
      try {
        const { data: userProfiles, error: userError } = await supabase
          .from('user_profiles')
          .select('user_id, full_name, email')
          .in('user_id', userIds)

        if (userError) {
          console.error('Error fetching user profiles:', userError)
        } else {
          console.log('User profiles fetched:', userProfiles?.length || 0)
          
          // Create a map of user profiles for quick lookup
          if (userProfiles) {
            userProfiles.forEach(profile => {
              userProfilesMap.set(profile.user_id, profile)
            })
          }
        }
      } catch (profileError) {
        console.warn('Could not fetch user profiles:', profileError)
      }

      let orderItemsMap = new Map()

      // Try to fetch order items, but don't fail if table doesn't exist
      try {
        const orderIds = ordersData.map(order => order.id)
        console.log('Order IDs to fetch items for:', orderIds)
        
        const { data: orderItems, error: itemsError } = await supabase
          .from('order_items')
          .select(`
            id,
            order_id,
            product_id,
            price,
            quantity,
            products(title)
          `)
          .in('order_id', orderIds)

        if (itemsError) {
          console.error('Error fetching order items:', itemsError)
        } else {
          console.log('Order items fetched:', orderItems?.length || 0)
          
          // Create a map of order items grouped by order_id
          if (orderItems) {
            orderItems.forEach(item => {
              if (!orderItemsMap.has(item.order_id)) {
                orderItemsMap.set(item.order_id, [])
              }
              orderItemsMap.get(item.order_id).push(item)
            })
          }
        }
      } catch (itemsError) {
        console.warn('Could not fetch order items:', itemsError)
      }

      // Combine all data
      const enrichedOrders = ordersData.map(order => ({
        ...order,
        user_profiles: userProfilesMap.get(order.user_id) || null,
        order_items: orderItemsMap.get(order.id) || []
      }))

      console.log('Enriched orders prepared:', enrichedOrders.length)
      return enrichedOrders
    } catch (error) {
      console.error('Error fetching orders:', error)
      
      // If it's a table not found error, return empty array instead of throwing
      if (error instanceof Error && (error.message.includes('table') || error.message.includes('does not exist'))) {
        console.warn('Database tables not found, returning empty array')
        return []
      }
      
      throw error
    }
  }

  const updateOrder = async (orderId: string, updates: { status?: string; notes?: string | null }) => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update(updates)
        .eq('id', orderId)
        .select()
        .single()

      if (error) throw error

      // Log admin activity
      await supabase.rpc('log_admin_activity', {
        p_action: 'update_order',
        p_table_name: 'orders',
        p_record_id: orderId,
        p_new_values: updates
      })

      return { data, error: null }
    } catch (error) {
      console.error('Error updating order:', error)
      return { data: null, error }
    }
  }

  // Contact Submissions Management
  const getContactSubmissions = async (): Promise<ContactSubmission[]> => {
    try {
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('submitted_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching contact submissions:', error)
      throw error
    }
  }

  const updateContactSubmissionStatus = async (submissionId: string, status: 'new' | 'in_progress' | 'resolved') => {
    try {
      const { data, error } = await supabase
        .from('contact_submissions')
        .update({ status })
        .eq('id', submissionId)
        .select()
        .single()

      if (error) throw error

      // Log admin activity
      await supabase.rpc('log_admin_activity', {
        p_action: 'update_contact_status',
        p_table_name: 'contact_submissions',
        p_record_id: submissionId,
        p_new_values: { status }
      })

      return { data, error: null }
    } catch (error) {
      console.error('Error updating contact submission status:', error)
      return { data: null, error }
    }
  }

  // Categories Management with retry logic
  const getCategories = async (): Promise<Category[]> => {
    const maxRetries = 3
    let lastError = null
    
    for (let retry = 0; retry < maxRetries; retry++) {
      try {
        debugAdminState('fetching categories', { retry, maxRetries })
        
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('name')

        if (error) {
          lastError = error
          console.error('Supabase error on retry', retry, ':', error)
          
          // If this is a permissions/RLS error, don't retry
          if (error.code === 'PGRST301' || error.message.includes('RLS')) {
            throw error
          }
          
          // Wait before retrying
          if (retry < maxRetries - 1) {
            await new Promise(resolve => setTimeout(resolve, (retry + 1) * 1000))
            continue
          }
          
          throw error
        }

        debugAdminState('categories fetched successfully', { count: data?.length || 0 })
        return data || []
      } catch (error) {
        lastError = error
        console.error('Error fetching categories on retry', retry, ':', error)
        
        // If this is the last retry, throw the error
        if (retry === maxRetries - 1) {
          throw error
        }
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, (retry + 1) * 1000))
      }
    }
    
    throw lastError || new Error('Failed to fetch categories after multiple retries')
  }

  const createCategory = async (category: { name: string; slug: string; description?: string }) => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert({
          name: category.name,
          slug: category.slug,
          description: category.description || null,
          is_active: true
        })
        .select()
        .single()

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      console.error('Error creating category:', error)
      return { data: null, error }
    }
  }

  const updateCategory = async (categoryId: string, updates: { name?: string; slug?: string; description?: string; is_active?: boolean }) => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .update(updates)
        .eq('id', categoryId)
        .select()
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Error updating category:', error)
      return { data: null, error }
    }
  }

  const deleteCategory = async (categoryId: string) => {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', categoryId)

      if (error) throw error
      return { error: null }
    } catch (error) {
      console.error('Error deleting category:', error)
      return { error }
    }
  }

  // Image Upload Management
  const uploadProductImage = async (file: File): Promise<{ url: string | null; error: any }> => {
    try {
      // Validate file type and size
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
      if (!allowedTypes.includes(file.type)) {
        return { url: null, error: { message: 'Invalid file type. Please upload a valid image file.' } }
      }

      if (file.size > 10485760) { // 10MB
        return { url: null, error: { message: 'File size too large. Please upload an image smaller than 10MB.' } }
      }

      // Generate unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `product-images/${fileName}`

      // Try to upload file to Supabase Storage
      // Note: We'll skip bucket creation as it requires admin privileges
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        console.error('Error uploading image:', uploadError)
        
        // If bucket doesn't exist, provide helpful message
        if (uploadError.message?.includes('Bucket not found')) {
          return { 
            url: null, 
            error: { 
              message: 'Storage bucket not found. Please create an "images" bucket in your Supabase dashboard under Storage.' 
            } 
          }
        }

        // If RLS policy error, provide helpful message
        if (uploadError.message?.includes('row-level security') || uploadError.message?.includes('policy')) {
          return { 
            url: null, 
            error: { 
              message: 'Storage permissions error. Please check your Supabase storage policies or contact an administrator.' 
            } 
          }
        }

        return { url: null, error: uploadError }
      }

      // Get public URL
      const { data } = supabase.storage
        .from('images')
        .getPublicUrl(filePath)

      return { url: data.publicUrl, error: null }
    } catch (error) {
      console.error('Error in uploadProductImage:', error)
      return { url: null, error }
    }
  }

  const deleteProductImage = async (imageUrl: string): Promise<{ error: any }> => {
    try {
      // Extract file path from URL
      const url = new URL(imageUrl)
      const pathSegments = url.pathname.split('/')
      const filePath = pathSegments.slice(-2).join('/') // Get 'product-images/filename'

      const { error } = await supabase.storage
        .from('images')
        .remove([filePath])

      if (error) {
        console.error('Error deleting image:', error)
        return { error }
      }

      return { error: null }
    } catch (error) {
      console.error('Error in deleteProductImage:', error)
      return { error }
    }
  }

  // Diagnostic function to test Supabase connection
  const diagnoseSupabase = async () => {
    console.log('🔍 Running Supabase Diagnostics...')
    await checkSupabaseStatus()
    return await testSupabaseConnection()
  }

  return {
    isAdmin,
    loading,
    // Statistics
    getAdminStats,
    // User management
    getUsers,
    updateUser,
    deleteUser,
    // Product management
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    // Order management
    getOrders,
    updateOrder,
    // Contact submissions
    getContactSubmissions,
    updateContactSubmissionStatus,
    // Categories
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    // Image upload
    uploadProductImage,
    deleteProductImage,
    // Diagnostics
    diagnoseSupabase
  }
}

export type { Order, Category }
