import React, { useState } from 'react'
import { PayPalButtons, PayPalScriptProvider, usePayPalScriptReducer } from '@paypal/react-paypal-js'
import { Lock, AlertCircle } from 'lucide-react'
import { PAYPAL_OPTIONS, PAYPAL_STYLES, PAYPAL_RETURN_URL, PAYPAL_CANCEL_URL, type PayPalOrderData } from '../../lib/paypal'

interface PayPalPaymentProps {
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

const PayPalPayment: React.FC<PayPalPaymentProps> = ({
  amount,
  onSuccess,
  onError,
  disabled = false,
  customerInfo
}) => {
  const [isProcessing, setIsProcessing] = useState(false)
  const [paypalError, setPaypalError] = useState<string | null>(null)

  // PayPal Button Component
  const PayPalButtonComponent = () => {
    const [{ isPending, isRejected }] = usePayPalScriptReducer()

    const createOrder = async (): Promise<string> => {
      try {
        setIsProcessing(true)
        setPaypalError(null)

        const orderData: PayPalOrderData = {
          intent: 'CAPTURE',
          purchase_units: [
            {
              reference_id: `ORDER_${Date.now()}`,
              amount: {
                currency_code: 'USD',
                value: amount.toFixed(2)
              },
              description: 'Studio Nullbyte Digital Products',
              custom_id: `customer_${customerInfo?.email || 'guest'}`,
              soft_descriptor: 'STUDIO_NULLBYTE'
            }
          ],
          application_context: {
            brand_name: 'Studio Nullbyte',
            locale: 'en_US',
            landing_page: 'BILLING',
            shipping_preference: 'NO_SHIPPING',
            user_action: 'PAY_NOW',
            return_url: PAYPAL_RETURN_URL,
            cancel_url: PAYPAL_CANCEL_URL
          }
        }

        // In a real implementation, you would send this to your backend
        // For now, we'll simulate order creation
        const orderId = `ORDER_${Math.random().toString(36).substr(2, 12).toUpperCase()}`
        
        console.log('Created PayPal order:', orderId, orderData)
        return orderId
      } catch (error) {
        console.error('Error creating PayPal order:', error)
        setPaypalError('Failed to create PayPal order. Please try again.')
        throw error
      }
    }

    const onApprove = async (data: any) => {
      try {
        setIsProcessing(true)
        console.log('PayPal payment approved:', data)
        
        // In a real implementation, you would capture the payment on your backend
        // For now, we'll simulate successful payment
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        onSuccess(data.orderID)
      } catch (error) {
        console.error('Error capturing PayPal payment:', error)
        onError('Payment capture failed. Please contact support.')
      } finally {
        setIsProcessing(false)
      }
    }

    const onCancel = (data: any) => {
      console.log('PayPal payment cancelled:', data)
      setIsProcessing(false)
      onError('Payment was cancelled. Please try again.')
    }

    const onErrorHandler = (error: any) => {
      console.error('PayPal payment error:', error)
      setIsProcessing(false)
      setPaypalError('PayPal payment failed. Please try again.')
      onError('PayPal payment failed. Please try again.')
    }

    if (isPending || isProcessing) {
      return (
        <div className="w-full bg-gray-700 rounded-sm p-4 flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-electric-violet border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-2 text-sm font-mono">Loading PayPal...</span>
        </div>
      )
    }

    if (isRejected) {
      return (
        <div className="w-full bg-red-900 bg-opacity-30 border border-red-500 rounded-sm p-4">
          <div className="flex items-center gap-2 text-red-400">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm font-mono">PayPal failed to load. Please refresh the page.</span>
          </div>
        </div>
      )
    }

    return (
      <PayPalButtons
        style={PAYPAL_STYLES}
        disabled={disabled}
        createOrder={createOrder}
        onApprove={onApprove}
        onCancel={onCancel}
        onError={onErrorHandler}
      />
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 bg-blue-600 rounded-sm flex items-center justify-center text-white font-bold text-sm">
          P
        </div>
        <span className="font-mono font-bold">PayPal</span>
      </div>

      <div className="bg-yellow-500 bg-opacity-10 border border-yellow-500 border-opacity-30 rounded-sm p-4 mb-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-yellow-500 rounded-sm flex items-center justify-center text-black font-bold">
            PP
          </div>
          <div>
            <div className="font-mono font-bold text-yellow-400 mb-1">
              Secure PayPal Payment
            </div>
            <div className="text-sm text-gray-300">
              You can pay with your PayPal balance, bank account, or credit card.
              No PayPal account required.
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Amount:</span>
          <span className="font-mono font-bold text-electric-violet">${amount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">PayPal Fee:</span>
          <span className="font-mono">$0.00</span>
        </div>
        <div className="border-t border-gray-700 pt-2">
          <div className="flex justify-between">
            <span className="font-mono font-bold">Total:</span>
            <span className="font-mono font-bold text-electric-violet">${amount.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {paypalError && (
        <div className="bg-red-900 bg-opacity-30 border border-red-500 rounded-sm p-3">
          <div className="flex items-center gap-2 text-red-400">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm font-mono">{paypalError}</span>
          </div>
        </div>
      )}

      <PayPalScriptProvider options={PAYPAL_OPTIONS}>
        <PayPalButtonComponent />
      </PayPalScriptProvider>

      <div className="text-xs text-gray-400 text-center">
        <Lock className="w-3 h-3 inline mr-1" />
        Protected by PayPal's Buyer Protection Program
      </div>
    </div>
  )
}

export default PayPalPayment
