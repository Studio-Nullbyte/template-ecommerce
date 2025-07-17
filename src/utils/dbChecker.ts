import { supabase } from '../lib/supabase'
import { logger } from './logger'

export const checkDatabaseTables = async () => {
  const results = {
    orders: false,
    order_items: false,
    user_profiles: false,
    products: false,
    categories: false,
    contact_submissions: false
  }

  const tablesToCheck = [
    'orders',
    'order_items', 
    'user_profiles',
    'products',
    'categories',
    'contact_submissions'
  ]

  for (const table of tablesToCheck) {
    try {
      const { error } = await supabase
        .from(table)
        .select('*')
        .limit(1)

      if (!error) {
        results[table as keyof typeof results] = true
        logger.db(`Table '${table}' exists and is accessible`)
      } else {
        logger.error(`Table '${table}' error:`, error.message)
      }
    } catch (err) {
      logger.error(`Table '${table}' check failed:`, err)
    }
  }

  return results
}

export const createMockOrder = async () => {
  try {
    // First check if we can insert a mock order
    const mockOrder = {
      user_id: '00000000-0000-0000-0000-000000000000', // Mock UUID
      total_amount: 29.99,
      status: 'pending' as const,
      payment_method: 'mock',
      payment_id: 'mock_payment_123',
      notes: 'Mock order for testing'
    }

    const { data, error } = await supabase
      .from('orders')
      .insert([mockOrder])
      .select()

    if (error) {
      logger.error('Could not create mock order:', error.message)
      return null
    }

    logger.db('Mock order created successfully:', data)
    return data[0]
  } catch (err) {
    logger.error('Mock order creation failed:', err)
    return null
  }
}
