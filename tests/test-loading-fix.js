// Test script to verify the featured products loading fix
import { getFeaturedProducts } from '../src/lib/supabase.js'

console.log('Testing Featured Products loading fix...\n')

// Test the function directly
const testFeaturedProducts = async () => {
  console.log('🔍 Testing getFeaturedProducts function...')
  
  const startTime = Date.now()
  
  try {
    const { data, error } = await getFeaturedProducts(3)
    const endTime = Date.now()
    
    console.log(`⏱️ Function completed in ${endTime - startTime}ms`)
    
    if (error) {
      console.log('❌ Error returned:', error.message)
    } else {
      console.log('✅ Success! Data returned:', data)
      console.log(`📊 Products found: ${data?.length || 0}`)
    }
    
    // Test specific scenarios
    console.log('\n📋 Expected behavior:')
    console.log('• If Supabase not configured: Returns empty array immediately')
    console.log('• If Supabase configured: Queries database for featured products')
    console.log('• Loading spinner should stop after function completes')
    
  } catch (err) {
    console.error('💥 Exception caught:', err)
  }
}

testFeaturedProducts()
