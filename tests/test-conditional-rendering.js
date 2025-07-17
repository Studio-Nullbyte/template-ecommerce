// Test script to demonstrate conditional Featured Products rendering
import { getFeaturedProducts } from '../src/lib/supabase.js'

const testConditionalRendering = async () => {
  console.log('Testing conditional Featured Products rendering...\n')
  
  try {
    // Test 1: Check if there are any featured products
    const { data, error } = await getFeaturedProducts(3)
    
    if (error) {
      console.log('❌ Error state: Featured Products section will show with error message')
      console.log('Section behavior: VISIBLE with error display')
      return
    }
    
    if (!data || data.length === 0) {
      console.log('🚫 No featured products found')
      console.log('Section behavior: HIDDEN (entire section will not render)')
    } else {
      console.log(`✅ Found ${data.length} featured products`)
      console.log('Section behavior: VISIBLE with products')
      
      data.forEach((product, index) => {
        console.log(`  ${index + 1}. ${product.title} - $${product.price}`)
      })
    }
    
    console.log('\n📝 Note: The Featured Products section will only appear when:')
    console.log('  • Loading state (showing spinner)')
    console.log('  • Error state (showing error message)')
    console.log('  • Success state with products (showing actual products)')
    console.log('  • Hidden completely when no featured products exist')
    
  } catch (err) {
    console.error('Exception during test:', err)
    console.log('Section behavior: VISIBLE with error display')
  }
}

testConditionalRendering()
