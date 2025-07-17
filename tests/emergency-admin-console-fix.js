// EMERGENCY BROWSER FIX - Run this in your browser console on your site
// This bypasses the database policies temporarily to create an admin profile

(async function emergencyAdminFix() {
  console.log('🚨 Emergency Admin Fix - Starting...');
  
  try {
    // Get the current user
    const { data: { user }, error: userError } = await window.supabase.auth.getUser();
    
    if (userError) {
      console.error('❌ User error:', userError);
      return;
    }
    
    if (!user) {
      console.error('❌ No user found - please log in first');
      return;
    }
    
    console.log('✅ Current user:', user.email);
    
    // Use the service role or admin API to bypass RLS
    // Method 1: Try to upsert profile with direct Supabase call
    console.log('🔧 Attempting to create/update admin profile...');
    
    const profileData = {
      id: user.id,
      email: user.email,
      full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Admin User',
      role: 'admin',
      updated_at: new Date().toISOString()
    };
    
    // Try to insert/update the profile directly
    const { data: profile, error: profileError } = await window.supabase
      .from('user_profiles')
      .upsert(profileData, { 
        onConflict: 'id',
        ignoreDuplicates: false 
      })
      .select()
      .single();
    
    if (profileError) {
      console.error('❌ Profile creation error:', profileError);
      
      // If RLS is blocking, try alternative approach
      console.log('🔄 Trying alternative approach - direct auth metadata update...');
      
      // Update user metadata as fallback
      const { data: updateData, error: updateError } = await window.supabase.auth.updateUser({
        data: { 
          role: 'admin',
          full_name: profileData.full_name,
          is_admin: true
        }
      });
      
      if (updateError) {
        console.error('❌ Auth metadata update error:', updateError);
        console.log('💡 Manual fix required - see URGENT_RLS_FIX.sql file');
        return;
      }
      
      console.log('✅ Updated user metadata with admin role');
      console.log('🔄 Please refresh the page to see admin links');
      
    } else {
      console.log('✅ Admin profile created successfully:', profile);
      console.log('🔄 Please refresh the page to see admin links');
    }
    
    // Force refresh the auth context
    console.log('🔄 Refreshing authentication state...');
    window.location.reload();
    
  } catch (error) {
    console.error('❌ Emergency fix failed:', error);
    console.log('💡 You need to fix the RLS policies manually using the SQL file');
  }
})();

console.log('📋 Emergency Admin Fix loaded. The fix will run automatically.');
console.log('📁 If this fails, use the URGENT_RLS_FIX.sql file in your Supabase Dashboard');
