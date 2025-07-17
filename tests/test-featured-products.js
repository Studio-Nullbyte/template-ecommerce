// Test script to verify getFeaturedProducts function
import { getFeaturedProducts } from '../src/lib/supabase.js'

const testFeaturedProducts = async () => {
  console.log('Testing getFeaturedProducts function...')
  
  try {
    const { data, error } = await getFeaturedProducts(3)
    
    if (error) {
      console.error('Error:', error)
    } else {
      console.log('Success! Featured products:', data)
      console.log(`Found ${data?.length || 0} featured products`)
    }
  } catch (err) {
    console.error('Exception:', err)
  }
}

testFeaturedProducts()
