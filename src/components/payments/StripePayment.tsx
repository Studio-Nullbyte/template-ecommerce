import React, { useState } from 'react'
import { CreditCard, Lock, ExternalLink } from 'lucide-react'
import { loadStripe } from '@stripe/stripe-js'

// Get the publishable key
const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY

// Initialize Stripe
const stripePromise = STRIPE_PUBLISHABLE_KEY ? loadStripe(STRIPE_PUBLISHABLE_KEY) : null

interface Product {
  id: string
  name: string
  price: number
  description?: string
  image?: string
  stripePriceId?: string // Add this for pre-created Stripe Price IDs
  cartItems?: Array<{    // Add this for multi-product checkout
    priceId: string | null | undefined
    quantity: number
  }>
}

interface StripePaymentProps {
  product: Product
  onSuccess?: () => void
  onError?: (error: string) => void
  disabled?: boolean
}

// Stripe Checkout Component - GitHub Pages Compatible
const StripeCheckout: React.FC<StripePaymentProps> = ({
  product,
  onSuccess,
  onError,
  disabled = false
}) => {
  const [isProcessing, setIsProcessing] = useState(false)

  const handleCheckout = async () => {
    if (!stripePromise) {
      onError?.('Stripe is not available')
      return
    }

    if (disabled) {
      onError?.('Please complete all required fields before proceeding.')
      return
    }

    setIsProcessing(true)

    try {
      const stripe = await stripePromise

      if (!stripe) {
        onError?.('Failed to load Stripe')
        return
      }

      // Check if we have cart items or a single product
      if (product.cartItems && product.cartItems.length > 0) {
        // Multi-product checkout with individual Price IDs
        const validItems = product.cartItems.filter(item => item.priceId)
        
        if (validItems.length === 0) {
          onError?.('No valid Price IDs found for cart items. Please ensure all products have Stripe Price IDs configured.')
          return
        }

        if (validItems.length !== product.cartItems.length) {
          onError?.('Some products in your cart are missing Stripe Price IDs. Please remove them or contact support.')
          return
        }

        const { error } = await stripe.redirectToCheckout({
          lineItems: validItems.map(item => ({
            price: item.priceId!,
            quantity: item.quantity,
          })),
          mode: 'payment',
          successUrl: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/cancel`,
          clientReferenceId: product.id,
        })

        if (error) {
          console.error('Stripe Checkout error:', error)
          onError?.(error.message || 'Failed to redirect to checkout')
        } else {
          onSuccess?.()
        }
      } else if (product.stripePriceId) {
        // Single product checkout with pre-created Price ID (GitHub Pages compatible)
        const { error } = await stripe.redirectToCheckout({
          lineItems: [{
            price: product.stripePriceId,
            quantity: 1,
          }],
          mode: 'payment',
          successUrl: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/cancel`,
          clientReferenceId: product.id,
        })

        if (error) {
          console.error('Stripe Checkout error:', error)
          onError?.(error.message || 'Failed to redirect to checkout')
        } else {
          // Success callback will be handled by the success page
          onSuccess?.()
        }
      } else {
        // No pre-created Price ID available for single product or cart
        onError?.('Products require Stripe Price IDs for GitHub Pages compatibility. Please configure Price IDs in the Stripe Dashboard.')
      }

    } catch (error) {
      console.error('Checkout error:', error)
      onError?.(error instanceof Error ? error.message : 'Checkout failed')
    } finally {
      setIsProcessing(false)
    }
  }

  // Show message if Stripe is not available
  if (!stripePromise) {
    return (
      <div className="p-4 bg-red-900/20 border border-red-500 rounded-sm">
        <p className="text-red-400 font-mono text-sm mb-2">
          <strong>Stripe configuration error:</strong>
        </p>
        <div className="text-red-300 font-mono text-xs space-y-1">
          <p>• VITE_STRIPE_PUBLISHABLE_KEY: {STRIPE_PUBLISHABLE_KEY ? '✅ Found' : '❌ Missing'}</p>
          <p>• Key starts with 'pk_': {STRIPE_PUBLISHABLE_KEY?.startsWith('pk_') ? '✅ Valid format' : '❌ Invalid format'}</p>
          <p>• Environment: {import.meta.env.MODE}</p>
        </div>
        <div className="mt-3 text-xs text-gray-400">
          <p>1. Check your .env file contains VITE_STRIPE_PUBLISHABLE_KEY</p>
          <p>2. Restart your development server</p>
          <p>3. Ensure the key starts with 'pk_test_' or 'pk_live_'</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <CreditCard className="w-5 h-5 text-electric-violet" />
        <span className="font-mono font-bold text-white">Secure Checkout</span>
      </div>

      {/* Product Summary */}
      <div className="p-4 bg-code-gray border border-gray-600 rounded-sm">
        <div className="flex justify-between items-center font-mono">
          <span className="text-gray-300">{product.name}</span>
          <span className="text-white font-bold">${product.price.toFixed(2)}</span>
        </div>
        {product.description && (
          <p className="text-sm text-gray-400 mt-2 font-mono">{product.description}</p>
        )}
      </div>

      {/* Checkout Button */}
      <button
        onClick={handleCheckout}
        disabled={disabled || isProcessing}
        className="w-full bg-electric-violet hover:bg-electric-violet-light disabled:bg-gray-600 text-white font-mono py-3 px-4 rounded-sm transition-colors flex items-center justify-center gap-2"
      >
        {isProcessing ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Redirecting to Checkout...
          </>
        ) : (
          <>
            <Lock className="w-4 h-4" />
            Buy Now - ${product.price.toFixed(2)}
          </>
        )}
      </button>

      {/* Security Notice */}
      <div className="text-xs text-gray-400 text-center font-mono">
        <Lock className="w-3 h-3 inline mr-1" />
        Secured by Stripe • Redirects to secure checkout
      </div>

      {/* Info Notice */}
      <div className="text-xs text-gray-400 font-mono bg-code-gray-light p-3 rounded-sm">
        <p>• You'll be redirected to Stripe's secure checkout page</p>
        <p>• Payment is processed entirely on Stripe's servers</p>
        <p>• You'll return here after successful payment</p>
      </div>
    </div>
  )
}

// Main component - no Elements wrapper needed for Checkout
const StripePayment: React.FC<StripePaymentProps> = (props) => {
  if (!stripePromise) {
    return (
      <div className="p-4 bg-red-900/20 border border-red-500 rounded-sm">
        <p className="text-red-400 font-mono text-sm">
          Stripe is not available. Check your environment configuration.
        </p>
      </div>
    )
  }

  return <StripeCheckout {...props} />
}

export default StripePayment
