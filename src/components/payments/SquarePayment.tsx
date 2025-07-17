import React, { useState, useEffect, useRef } from 'react'
import { CreditCard, Lock, AlertCircle } from 'lucide-react'
import { 
  SQUARE_WEB_SDK_CONFIG, 
  SQUARE_CARD_STYLES,
  type SquarePaymentRequest
} from '../../lib/square'

interface SquarePaymentProps {
  amount: number
  onSuccess: (paymentId: string) => void
  onError: (error: string) => void
  disabled?: boolean
  customerInfo?: {
    firstName: string
    lastName: string
    email: string
    address: string
    city: string
    state: string
    zipCode: string
    country: string
  }
}

// Declare Square types for TypeScript
declare global {
  interface Window {
    Square: any
  }
}

const SquarePayment: React.FC<SquarePaymentProps> = ({
  amount,
  onSuccess,
  onError,
  disabled = false,
  customerInfo
}) => {
  const [isProcessing, setIsProcessing] = useState(false)
  const [squareError, setSquareError] = useState<string | null>(null)
  const [isSquareLoaded, setIsSquareLoaded] = useState(false)
  const [card, setCard] = useState<any>(null)
  const [payments, setPayments] = useState<any>(null)
  const cardContainerRef = useRef<HTMLDivElement>(null)

  // Load Square Web SDK
  useEffect(() => {
    const loadSquareSDK = async () => {
      try {
        // Check if Square SDK is already loaded
        if (window.Square) {
          initializeSquare()
          return
        }

        // Create script tag to load Square Web SDK
        const script = document.createElement('script')
        script.src = 'https://web.squarecdn.com/v1/square.js'
        script.async = true
        script.onload = () => {
          initializeSquare()
        }
        script.onerror = () => {
          setSquareError('Failed to load Square payment system. Please refresh the page.')
        }
        document.head.appendChild(script)
      } catch (error) {
        console.error('Error loading Square SDK:', error)
        setSquareError('Failed to initialize Square payment system.')
      }
    }

    const initializeSquare = async () => {
      try {
        const paymentsInstance = window.Square.payments(SQUARE_WEB_SDK_CONFIG.applicationId, SQUARE_WEB_SDK_CONFIG.locationId)
        setPayments(paymentsInstance)

        const cardInstance = await paymentsInstance.card({
          style: SQUARE_CARD_STYLES
        })
        
        if (cardContainerRef.current) {
          await cardInstance.attach(cardContainerRef.current)
          setCard(cardInstance)
          setIsSquareLoaded(true)
        }
      } catch (error) {
        console.error('Error initializing Square:', error)
        setSquareError('Failed to initialize Square payment form.')
      }
    }

    loadSquareSDK()

    return () => {
      // Cleanup
      if (card) {
        card.destroy()
      }
    }
  }, [])

  const handlePayment = async () => {
    if (!card || !payments) {
      onError('Square payment system not initialized')
      return
    }

    setIsProcessing(true)
    setSquareError(null)

    try {
      // Tokenize the card
      const tokenResult = await card.tokenize()
      
      if (tokenResult.status === 'OK') {
        // Create payment request (would be sent to backend in real implementation)
        const paymentRequest: SquarePaymentRequest = {
          sourceId: tokenResult.token,
          amount: Math.round(amount * 100), // Convert to cents
          currency: 'USD',
          locationId: SQUARE_WEB_SDK_CONFIG.locationId,
          referenceId: `studio-nullbyte-${Date.now()}`,
          note: 'Studio Nullbyte digital template purchase',
          buyerEmailAddress: customerInfo?.email,
          billingAddress: customerInfo ? {
            firstName: customerInfo.firstName,
            lastName: customerInfo.lastName,
            addressLine1: customerInfo.address,
            locality: customerInfo.city,
            administrativeDistrictLevel1: customerInfo.state,
            postalCode: customerInfo.zipCode,
            country: customerInfo.country
          } : undefined
        }

        // Log the payment request (would be sent to backend in real implementation)
        console.log('Payment request:', paymentRequest)

        // In a real implementation, you would send this to your backend
        // For now, we'll simulate a successful payment
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        // Generate a mock payment ID
        const paymentId = `sq_${Math.random().toString(36).substr(2, 15)}`
        onSuccess(paymentId)
      } else {
        // Handle tokenization errors
        const errorMessages = tokenResult.errors?.map((error: any) => error.message).join(', ')
        onError(errorMessages || 'Card tokenization failed. Please check your card details.')
      }
    } catch (error) {
      console.error('Square payment error:', error)
      onError('Payment processing failed. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 bg-gray-600 rounded-sm flex items-center justify-center text-white font-bold text-sm">
          ⬛
        </div>
        <span className="font-mono font-bold">Square Payment</span>
        <div className="ml-auto text-xs text-gray-400">
          Powered by Square
        </div>
      </div>

      <div className="bg-gray-800 bg-opacity-50 border border-gray-700 rounded-sm p-4 mb-4">
        <div className="text-sm text-gray-300 mb-2">
          <CreditCard className="w-4 h-4 inline mr-2" />
          Secure payment processing by Square
        </div>
        <div className="text-xs text-gray-400">
          Your payment information is encrypted and processed securely through Square's
          PCI-compliant payment infrastructure.
        </div>
      </div>

      {squareError && (
        <div className="bg-red-900 bg-opacity-20 border border-red-600 rounded-sm p-3 mb-4">
          <div className="flex items-center gap-2 text-red-400">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{squareError}</span>
          </div>
        </div>
      )}

      {!isSquareLoaded && !squareError && (
        <div className="text-center py-8">
          <div className="w-6 h-6 border-2 border-electric-violet border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <div className="text-sm text-gray-400">Loading Square payment system...</div>
        </div>
      )}

      {isSquareLoaded && (
        <>
          <div className="space-y-4">
            {/* Square card container */}
            <div 
              ref={cardContainerRef}
              className="bg-code-gray-dark border border-gray-700 rounded-sm p-4 min-h-[60px]"
            />
            
            {/* Payment button */}
            <button
              onClick={handlePayment}
              disabled={disabled || isProcessing || !isSquareLoaded}
              className="btn-secondary w-full flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-electric-violet border-t-transparent rounded-full animate-spin"></div>
                  Processing Payment...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Pay ${amount.toFixed(2)} with Square
                </>
              )}
            </button>
          </div>

          <div className="text-xs text-gray-400 text-center">
            <Lock className="w-3 h-3 inline mr-1" />
            PCI DSS compliant payment processing
          </div>
        </>
      )}
    </div>
  )
}

export default SquarePayment
