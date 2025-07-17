import { createClient } from '@supabase/supabase-js'
import type { Database } from './types/database'
import { logger } from '../utils/logger'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''



// Create a fallback client if environment variables are missing
let supabase: any

if (!supabaseUrl || !supabaseAnonKey) {
  logger.warn('⚠️ Missing Supabase environment variables. Authentication will be disabled.')
  logger.warn('⚠️ Expected variables: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY')
  
  // Create a mock client for development
  supabase = {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      signUp: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
      signInWithPassword: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
      signOut: () => Promise.resolve({ error: null }),
      resetPasswordForEmail: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
      updateUser: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
    },
    from: () => {
      // Create a mock query chain
      const mockQuery = {
        select: () => mockQuery,
        eq: () => mockQuery,
        order: () => mockQuery,
        limit: () => mockQuery,
        single: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
        insert: () => mockQuery,
        update: () => mockQuery,
        delete: () => mockQuery,
        then: () => Promise.resolve({ data: [], error: null }) // For when used as a promise
      }
      return mockQuery
    }
  }
} else {
  supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      // Disable debug logging to reduce console noise
      debug: false
    }
  })
}

export { supabase }

// Test Supabase connection
supabase.auth.getSession()
  .then(() => {
    // Connection test complete - handle silently
  })
  .catch(() => {
    // Connection failed - handle silently
  })

// Auth helpers
export const signUp = async (email: string, password: string, userData?: any) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData
    }
  })
  return { data, error }
}

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  return { data, error }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  return { user, error }
}

// Database helpers
export const getProducts = async (category?: string) => {
  // Check if Supabase is properly configured
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('⚠️ Supabase not configured. Returning empty products.')
    return { data: [], error: null }
  }

  try {
    let query = supabase
      .from('products')
      .select(`
        *,
        categories!inner(name),
        downloads:download_history(count),
        reviews(rating)
      `)
      .eq('active', true)
      .order('created_at', { ascending: false })

    if (category && category !== 'all') {
      query = query.eq('categories.slug', category)
    }

    const { data, error } = await query
    return { data, error }
  } catch (err) {
    logger.error('Error in getProducts:', err)
    return { data: [], error: err }
  }
}

export const getFeaturedProducts = async (limit = 3) => {
  // Check if Supabase is properly configured
  if (!supabaseUrl || !supabaseAnonKey) {
    logger.warn('⚠️ Supabase not configured. Returning empty featured products.')
    return { data: [], error: null }
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories(name, slug),
        downloads:download_history(count),
        reviews(rating)
      `)
      .eq('active', true)
      .eq('featured', true)
      .order('created_at', { ascending: false })
      .limit(limit)

    return { data, error }
  } catch (err) {
    logger.error('Error in getFeaturedProducts:', err)
    return { data: [], error: err }
  }
}

export const getProduct = async (id: string) => {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      categories(name, slug),
      downloads:download_history(count),
      reviews(rating, comment, user_profiles(full_name))
    `)
    .eq('id', id)
    .eq('active', true)
    .single()

  return { data, error }
}

export const createDownload = async (productId: string, userId: string) => {
  const { data, error } = await supabase
    .from('download_history')
    .insert({
      product_id: productId,
      user_id: userId,
      downloaded_at: new Date().toISOString()
    })
    .select()
    .single()

  return { data, error }
}

export const createReview = async (productId: string, userId: string, rating: number, comment?: string) => {
  const { data, error } = await supabase
    .from('reviews')
    .insert({
      product_id: productId,
      user_id: userId,
      rating,
      comment
    })
    .select()
    .single()

  return { data, error }
}

export const getUserDownloads = async (userId: string) => {
  const { data, error } = await supabase
    .from('download_history')
    .select(`
      *,
      products(
        id,
        title,
        description,
        price,
        image_url,
        download_url,
        categories(name)
      )
    `)
    .eq('user_id', userId)
    .order('downloaded_at', { ascending: false })

  return { data, error }
}

export const submitContactForm = async (formData: {
  name: string
  email: string
  subject: string
  message: string
}) => {
  const { data, error } = await supabase
    .from('contact_submissions')
    .insert({
      name: formData.name,
      email: formData.email,
      subject: formData.subject,
      message: formData.message,
      submitted_at: new Date().toISOString()
    })
    .select()
    .single()

  return { data, error }
}
