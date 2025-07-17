// Simplified Remember Me - let Supabase handle it natively

const signIn = async (email: string, password: string, rememberMe: boolean = false) => {
  try {
    // Supabase handles persistence automatically
    const result = await supabase.auth.signInWithPassword({ 
      email, 
      password 
    })
    
    // Only store a simple preference flag
    if (result.data?.session) {
      localStorage.setItem('rememberMe', rememberMe.toString())
    }
    
    return result
  } catch (error) {
    return { data: null, error: error as AuthError }
  }
}

const signOut = async () => {
  try {
    await supabase.auth.signOut()
    localStorage.removeItem('rememberMe')
    return { error: null }
  } catch (error) {
    return { error: error as AuthError }
  }
}

// Remove all the complex beforeunload logic and tempSession handling
