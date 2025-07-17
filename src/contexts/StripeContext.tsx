import React, { createContext, useContext } from 'react'
import { loadStripe } from '@stripe/stripe-js'

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!)

interface StripeContextType {
  stripePromise: ReturnType<typeof loadStripe>
}

const StripeContext = createContext<StripeContextType | undefined>(undefined)

export const useStripeContext = () => {
  const context = useContext(StripeContext)
  if (!context) {
    throw new Error('useStripeContext must be used within a StripeProvider')
  }
  return context
}

interface StripeProviderProps {
  children: React.ReactNode
}

export const StripeProvider: React.FC<StripeProviderProps> = ({ children }) => {
  return (
    <StripeContext.Provider value={{ stripePromise }}>
      {children}
    </StripeContext.Provider>
  )
}
