// Run this in the browser console to test Supabase connection
// Navigate to your app and open Developer Tools (F12)
// Paste this code in the console and press Enter

import { testSupabaseConnection, checkSupabaseStatus } from '../src/utils/supabaseDiagnostics'

// Run diagnostics
console.log('🚀 Running Supabase Diagnostics...')
console.log('=' .repeat(50))

checkSupabaseStatus()
  .then(() => {
    console.log('\n')
    return testSupabaseConnection()
  })
  .then(success => {
    console.log('\n' + '='.repeat(50))
    if (success) {
      console.log('✅ Diagnostics completed successfully!')
    } else {
      console.log('❌ Diagnostics found issues - check the output above')
    }
  })
  .catch(error => {
    console.error('❌ Diagnostics failed:', error)
  })
