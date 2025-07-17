/**
 * Test script to verify the admin data access fix
 * Run this in the browser console to test the corrected query syntax
 */

console.log('🧪 Testing admin data access fix...')

// Test the corrected query syntax
async function testAdminDataAccess() {
  try {
    console.log('Testing categories access...')
    const { data: catData, error: catError, count: catCount } = await window.supabase
      .from('categories')
      .select('id', { count: 'exact', head: true })
    
    if (catError) {
      console.error('❌ Categories error:', catError.message)
    } else {
      console.log('✅ Categories accessible, count:', catCount)
    }

    console.log('Testing products access...')
    const { data: prodData, error: prodError, count: prodCount } = await window.supabase
      .from('products')
      .select('id', { count: 'exact', head: true })
    
    if (prodError) {
      console.error('❌ Products error:', prodError.message)
    } else {
      console.log('✅ Products accessible, count:', prodCount)
    }

    console.log('Testing users access...')
    const { data: userData, error: userError, count: userCount } = await window.supabase
      .from('user_profiles')
      .select('user_id', { count: 'exact', head: true })
    
    if (userError) {
      console.error('❌ Users error:', userError.message)
    } else {
      console.log('✅ Users accessible, count:', userCount)
    }

    console.log('Testing orders access...')
    const { data: orderData, error: orderError, count: orderCount } = await window.supabase
      .from('orders')
      .select('id', { count: 'exact', head: true })
    
    if (orderError) {
      console.error('❌ Orders error:', orderError.message)
    } else {
      console.log('✅ Orders accessible, count:', orderCount)
    }

    console.log('🎉 Admin data access test completed!')
    
  } catch (error) {
    console.error('❌ Test failed:', error)
  }
}

// Run the test
testAdminDataAccess()

console.log('💡 If all tests pass, the admin debug panel should work correctly now!')
