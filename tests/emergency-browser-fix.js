// 🚨 IMMEDIATE BROWSER FIX - Copy and paste this into your browser console

console.log('🚨 Starting Emergency RLS Fix...');

// Step 1: Test if we can access Supabase client
if (typeof window.supabase === 'undefined') {
  console.error('❌ Supabase client not found. Make sure you are on your website.');
  console.log('💡 Go to your website first, then run this script.');
} else {
  console.log('✅ Supabase client found');
  
  // Step 2: Emergency profile creation using auth metadata
  (async function() {
    try {
      console.log('🔧 Getting current user...');
      
      const { data: { user }, error: userError } = await window.supabase.auth.getUser();
      
      if (userError || !user) {
        console.error('❌ No user found:', userError);
        console.log('💡 Please log in first, then run this script again.');
        return;
      }
      
      console.log('✅ User found:', user.email);
      
      // Step 3: Update user metadata to include admin role
      console.log('🔧 Setting admin role in user metadata...');
      
      const { data: updateData, error: updateError } = await window.supabase.auth.updateUser({
        data: { 
          role: 'admin',
          is_admin: true,
          full_name: user.email?.split('@')[0] || 'Admin User'
        }
      });
      
      if (updateError) {
        console.error('❌ Failed to update user metadata:', updateError);
      } else {
        console.log('✅ User metadata updated with admin role');
      }
      
      // Step 4: Try to create profile with minimal data
      console.log('🔧 Attempting to create basic profile...');
      
      // Use a very simple upsert that might bypass some policy issues
      const profileData = {
        id: user.id,
        email: user.email,
        role: 'admin'
      };
      
      const { data: profileResult, error: profileError } = await window.supabase
        .from('user_profiles')
        .upsert(profileData, { 
          onConflict: 'id',
          ignoreDuplicates: false 
        });
      
      if (profileError) {
        console.error('❌ Profile creation still blocked by RLS:', profileError.message);
        console.log('💡 You MUST fix the RLS policies in Supabase Dashboard');
        console.log('📋 Use the instructions in FIX_RECURSION_NOW.md');
      } else {
        console.log('✅ Profile created successfully!');
        console.log('🔄 Refreshing page to show admin links...');
        setTimeout(() => window.location.reload(), 1000);
      }
      
    } catch (error) {
      console.error('❌ Emergency fix failed:', error);
      console.log('💡 The database policies are blocking all access.');
      console.log('📋 You MUST run the SQL fix in Supabase Dashboard');
      console.log('📁 See FIX_RECURSION_NOW.md for step-by-step instructions');
    }
  })();
}

console.log('🏁 Emergency fix script completed. Check messages above for results.');
