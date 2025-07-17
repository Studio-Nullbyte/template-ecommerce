import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { CreditCard, Lock, User, Mail, MapPin, Phone, ArrowLeft, Check } from 'lucide-react'
import { useCart } from '../contexts/CartContext'
import { useToast } from '../contexts/ToastContext'
import { useAuthContext } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import StripePayment from '../components/payments/StripePayment'
import PayPalPayment from '../components/payments/PayPalPayment'
import SquarePayment from '../components/payments/SquarePayment'

interface CustomerInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
}

interface PaymentMethod {
  id: string
  name: string
  icon: string
  description: string
  color: string
}

const paymentMethods: PaymentMethod[] = [
  {
    id: 'stripe',
    name: 'Credit/Debit Card',
    icon: '💳',
    description: 'Visa, Mastercard, American Express • Recommended',
    color: 'bg-blue-600'
  },
  {
    id: 'paypal',
    name: 'PayPal',
    icon: '🟦',
    description: 'Pay with your PayPal account',
    color: 'bg-yellow-500'
  },
  {
    id: 'square',
    name: 'Square',
    icon: '⬛',
    description: 'Secure payment processing',
    color: 'bg-gray-600'
  }
]

const Checkout: React.FC = () => {
  const navigate = useNavigate()
  const { items, getTotalPrice, clearCart } = useCart()
  const { showToast } = useToast()
  const { profile, user } = useAuthContext()
  
  const [selectedPayment, setSelectedPayment] = useState<string>('stripe')
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    firstName: profile?.full_name?.split(' ')[0] || '',
    lastName: profile?.full_name?.split(' ')[1] || '',
    email: profile?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US'
  })

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      navigate('/products')
      showToast({
        type: 'info',
        title: 'Cart Empty',
        message: 'Your cart is empty. Add some products before checkout.'
      })
    }
  }, [items, navigate, showToast])

  const handleInputChange = (field: keyof CustomerInfo, value: string) => {
    setCustomerInfo(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Validation function without side effects (for disabled state)
  const isFormValid = (): boolean => {
    const required = ['firstName', 'lastName', 'email', 'address', 'city', 'state', 'zipCode']
    const missing = required.filter(field => !customerInfo[field as keyof CustomerInfo])
    
    if (missing.length > 0) {
      return false
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(customerInfo.email)) {
      return false
    }

    return true
  }

  const createOrder = async (paymentId: string) => {
    try {
      if (!user) {
        throw new Error('User not authenticated')
      }

      // Create the order record
      const orderData = {
        user_id: user.id,
        total_amount: total,
        status: 'completed' as const,
        payment_method: paymentMethods.find(p => p.id === selectedPayment)?.name || 'Credit Card',
        payment_id: paymentId,
        notes: `Subtotal: $${getTotalPrice().toFixed(2)}, Tax: $${tax.toFixed(2)} (Digital products - no shipping)`
      }

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([orderData])
        .select()
        .single()

      if (orderError) {
        console.error('Error creating order:', orderError)
        throw orderError
      }

      // Create order items
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.id,
        price: item.price,
        quantity: item.quantity
      }))

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

      if (itemsError) {
        console.error('Error creating order items:', itemsError)
        throw itemsError
      }

      return order.id
    } catch (error) {
      console.error('Failed to create order:', error)
      throw error
    }
  }

  const handlePaymentSuccess = async (paymentId: string) => {
    try {
      // Validate form one more time before processing
      if (!isFormValid()) {
        showToast({
          type: 'error',
          title: 'Form Incomplete',
          message: 'Please fill in all required fields before completing your order.'
        })
        return
      }

      // Create order in database
      const orderId = await createOrder(paymentId)
      
      // Clear cart and show success
      clearCart()
      
      showToast({
        type: 'success',
        title: 'Order Successful!',
        message: `Your order has been placed successfully. Order ID: ${orderId.slice(-8)}`
      })
      
      // Navigate to order confirmation page
      navigate('/order-confirmation', { 
        replace: true,
        state: {
          orderId: orderId,
          paymentId: paymentId,
          amount: total,
          subtotal: getTotalPrice(),
          tax: tax,
          items: items,
          paymentMethod: paymentMethods.find(p => p.id === selectedPayment)?.name || 'Credit Card'
        }
      })
    } catch (error) {
      console.error('Order creation failed:', error)
      showToast({
        type: 'error',
        title: 'Order Failed',
        message: 'Failed to create order. Please try again or contact support.'
      })
    }
  }

  const handlePaymentError = (error: string) => {
    showToast({
      type: 'error',
      title: 'Payment Failed',
      message: error
    })
  }

  const tax = getTotalPrice() * 0.08 // 8% tax
  const total = getTotalPrice() + tax // No shipping for digital products

  if (items.length === 0) {
    return null // Will redirect in useEffect
  }

  return (
    <>
      <Helmet>
        <title>Checkout - Studio Nullbyte</title>
        <meta name="description" content="Complete your purchase securely" />
      </Helmet>

      <div className="min-h-screen pt-20 bg-black text-white">
        <div className="container mx-auto px-4 py-8">
          {/* Back Button */}
          <button 
            onClick={() => navigate('/products')}
            className="flex items-center text-gray-400 hover:text-white transition-colors font-mono text-sm mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Order Summary */}
            <div className="order-2 lg:order-1">
              <h1 className="text-2xl font-mono font-bold mb-6">Checkout</h1>
              
              {/* Customer Information */}
              <div className="card mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <User className="w-5 h-5 text-electric-violet" />
                  <h2 className="text-lg font-mono font-bold">Customer Information</h2>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-mono text-gray-400 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      value={customerInfo.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className="w-full px-3 py-2 bg-code-gray-dark border border-gray-700 rounded-sm focus:border-electric-violet focus:outline-none font-mono text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-mono text-gray-400 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      value={customerInfo.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className="w-full px-3 py-2 bg-code-gray-dark border border-gray-700 rounded-sm focus:border-electric-violet focus:outline-none font-mono text-sm"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-mono text-gray-400 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full pl-10 pr-3 py-2 bg-code-gray-dark border border-gray-700 rounded-sm focus:border-electric-violet focus:outline-none font-mono text-sm"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-mono text-gray-400 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      value={customerInfo.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full pl-10 pr-3 py-2 bg-code-gray-dark border border-gray-700 rounded-sm focus:border-electric-violet focus:outline-none font-mono text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Billing Address */}
              <div className="card mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <MapPin className="w-5 h-5 text-electric-violet" />
                  <h2 className="text-lg font-mono font-bold">Billing Address</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-mono text-gray-400 mb-2">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      value={customerInfo.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className="w-full px-3 py-2 bg-code-gray-dark border border-gray-700 rounded-sm focus:border-electric-violet focus:outline-none font-mono text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-mono text-gray-400 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        value={customerInfo.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        className="w-full px-3 py-2 bg-code-gray-dark border border-gray-700 rounded-sm focus:border-electric-violet focus:outline-none font-mono text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-mono text-gray-400 mb-2">
                        State *
                      </label>
                      <input
                        type="text"
                        value={customerInfo.state}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                        className="w-full px-3 py-2 bg-code-gray-dark border border-gray-700 rounded-sm focus:border-electric-violet focus:outline-none font-mono text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-mono text-gray-400 mb-2">
                        ZIP Code *
                      </label>
                      <input
                        type="text"
                        value={customerInfo.zipCode}
                        onChange={(e) => handleInputChange('zipCode', e.target.value)}
                        className="w-full px-3 py-2 bg-code-gray-dark border border-gray-700 rounded-sm focus:border-electric-violet focus:outline-none font-mono text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-mono text-gray-400 mb-2">
                        Country *
                      </label>
                      <select
                        value={customerInfo.country}
                        onChange={(e) => handleInputChange('country', e.target.value)}
                        className="w-full px-3 py-2 bg-code-gray-dark border border-gray-700 rounded-sm focus:border-electric-violet focus:outline-none font-mono text-sm"
                      >
                        <option value="US">United States</option>
                        <option value="CA">Canada</option>
                        <option value="UK">United Kingdom</option>
                        <option value="AU">Australia</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="card mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <CreditCard className="w-5 h-5 text-electric-violet" />
                  <h2 className="text-lg font-mono font-bold">Payment Method</h2>
                </div>

                <div className="space-y-3 mb-6">
                  {paymentMethods.map((method) => (
                    <motion.div
                      key={method.id}
                      whileHover={{ scale: 1.02 }}
                      className={`p-4 border rounded-sm cursor-pointer transition-all relative ${
                        selectedPayment === method.id
                          ? 'border-electric-violet bg-electric-violet bg-opacity-10'
                          : 'border-gray-700 hover:border-gray-600'
                      } ${method.id === 'stripe' ? 'ring-1 ring-blue-500/30' : ''}`}
                      onClick={() => setSelectedPayment(method.id)}
                    >
                      {method.id === 'stripe' && (
                        <div className="absolute -top-2 -right-2 bg-electric-violet text-white px-2 py-1 rounded-full text-xs font-mono">
                          Recommended
                        </div>
                      )}
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-sm ${method.color} flex items-center justify-center text-lg`}>
                          {method.icon}
                        </div>
                        <div className="flex-1">
                          <div className="font-mono font-bold">{method.name}</div>
                          <div className="text-sm text-gray-400">{method.description}</div>
                        </div>
                        {selectedPayment === method.id && (
                          <Check className="w-5 h-5 text-electric-violet" />
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Payment Component */}
                {selectedPayment === 'stripe' && (
                  <StripePayment
                    product={{
                      id: `order-${Date.now()}`,
                      name: `Studio Nullbyte Order (${items.length} item${items.length > 1 ? 's' : ''})`,
                      price: total,
                      description: items.map(item => `${item.title} ($${item.price.toFixed(2)})`).join(', '),
                      image: items[0]?.image_url || undefined,
                      stripePriceId: undefined, // Combined orders don't use individual Price IDs
                      cartItems: items.map(item => ({
                        priceId: item.stripe_price_id,
                        quantity: item.quantity
                      }))
                    }}
                    onSuccess={() => handlePaymentSuccess('stripe_checkout_session')}
                    onError={handlePaymentError}
                    disabled={!isFormValid()}
                  />
                )}
                
                {selectedPayment === 'paypal' && (
                  <PayPalPayment
                    amount={total}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                    disabled={!isFormValid()}
                    customerInfo={customerInfo}
                  />
                )}
                
                {selectedPayment === 'square' && (
                  <SquarePayment
                    amount={total}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                    disabled={!isFormValid()}
                  />
                )}
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="order-1 lg:order-2">
              <div className="card sticky top-24">
                <h2 className="text-lg font-mono font-bold mb-6">Order Summary</h2>
                
                {/* Items */}
                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="w-16 h-16 bg-code-gray-dark rounded-sm overflow-hidden flex-shrink-0">
                        {item.image_url ? (
                          <img
                            src={item.image_url}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">
                            No Image
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-mono font-bold text-sm truncate">
                          {item.title}
                        </div>
                        <div className="text-gray-400 text-sm">
                          Qty: {item.quantity}
                        </div>
                        <div className="text-electric-violet font-mono text-sm">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-2 border-t border-gray-700 pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Subtotal:</span>
                    <span className="font-mono">${getTotalPrice().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Tax:</span>
                    <span className="font-mono">${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t border-gray-700 pt-2">
                    <span>Total:</span>
                    <span className="font-mono text-electric-violet">${total.toFixed(2)}</span>
                  </div>
                  <div className="text-xs text-gray-400 text-center mt-2">
                    <span className="inline-block">🔄 Digital products - instant delivery</span>
                  </div>
                </div>

                <div className="text-xs text-gray-400 text-center mt-3">
                  <Lock className="w-3 h-3 inline mr-1" />
                  Your payment information is secure and encrypted
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Checkout
