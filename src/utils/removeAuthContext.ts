// Remove AuthContext.tsx entirely and use useAuth directly in components

// In components, instead of:
// const { user, signOut } = useAuthContext()

// Use:
// const { user, signOut } = useAuth()

// This eliminates:
// - AuthContext.tsx file
// - AuthProvider wrapper
// - useAuthContext hook
// - Context-related errors

// Update App.tsx to remove AuthProvider:
function App() {
  return (
    <CartProvider>
      <ToastProvider>
        <div className="min-h-screen bg-black text-white">
          <Header />
          {/* ... rest of app */}
        </div>
      </ToastProvider>
    </CartProvider>
  )
}
