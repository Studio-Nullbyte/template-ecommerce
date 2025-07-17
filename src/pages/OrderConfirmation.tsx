import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { CheckCircle, Package, CreditCard, Calendar, ArrowRight } from 'lucide-react'

const OrderConfirmation: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  
  // In a real app, this would come from the payment result or API
  const orderDetails = location.state || {
    orderId: `ORD-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
    paymentId: `PAY-${Math.random().toString(36).substr(2, 12)}`,
    amount: 0,
    subtotal: 0,
    tax: 0,
    items: [],
    paymentMethod: 'Credit Card'
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  return (
    <>
      <Helmet>
        <title>Order Confirmation - Studio Nullbyte</title>
        <meta name="description" content="Your order has been confirmed" />
      </Helmet>

      <div className="min-h-screen pt-20 bg-black text-white">
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto text-center"
          >
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 mx-auto mb-8"
            >
              <CheckCircle className="w-full h-full text-green-400" />
            </motion.div>

            {/* Success Message */}
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-3xl md:text-4xl font-mono font-bold mb-4"
            >
              Order Confirmed!
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-gray-400 text-lg mb-8"
            >
              Thank you for your purchase. Your order has been successfully processed.
            </motion.p>

            {/* Order Details Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="card text-left mb-8"
            >
              <h2 className="text-xl font-mono font-bold mb-6 text-center">
                Order Details
              </h2>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-code-gray-dark rounded-sm">
                  <Package className="w-5 h-5 text-electric-violet" />
                  <div>
                    <div className="font-mono text-sm text-gray-400">Order ID</div>
                    <div className="font-mono font-bold">{orderDetails.orderId}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-code-gray-dark rounded-sm">
                  <CreditCard className="w-5 h-5 text-electric-violet" />
                  <div>
                    <div className="font-mono text-sm text-gray-400">Payment ID</div>
                    <div className="font-mono font-bold">{orderDetails.paymentId}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-code-gray-dark rounded-sm">
                  <Calendar className="w-5 h-5 text-electric-violet" />
                  <div>
                    <div className="font-mono text-sm text-gray-400">Order Date</div>
                    <div className="font-mono font-bold">
                      {new Date().toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-code-gray-dark rounded-sm">
                  <CreditCard className="w-5 h-5 text-electric-violet" />
                  <div>
                    <div className="font-mono text-sm text-gray-400">Payment Method</div>
                    <div className="font-mono font-bold">{orderDetails.paymentMethod}</div>
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              {orderDetails.subtotal && (
                <div className="mt-6 pt-6 border-t border-gray-700">
                  <h3 className="text-lg font-mono font-bold mb-4">Order Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between font-mono">
                      <span className="text-gray-400">Subtotal:</span>
                      <span>{formatCurrency(orderDetails.subtotal)}</span>
                    </div>
                    <div className="flex justify-between font-mono">
                      <span className="text-gray-400">Tax:</span>
                      <span>{formatCurrency(orderDetails.tax || 0)}</span>
                    </div>
                    <div className="flex justify-between font-mono text-lg font-bold border-t border-gray-700 pt-2 mt-2">
                      <span className="text-electric-violet">Total:</span>
                      <span className="text-electric-violet">{formatCurrency(orderDetails.amount)}</span>
                    </div>
                    <div className="text-xs text-gray-400 text-center mt-3">
                      <span className="inline-block">🔄 Digital products - no shipping required</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Order Items */}
              {orderDetails.items && orderDetails.items.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-700">
                  <h3 className="text-lg font-mono font-bold mb-4">Items Ordered</h3>
                  <div className="space-y-3">
                    {orderDetails.items.map((item: any, index: number) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-code-gray-dark rounded-sm">
                        <div>
                          <div className="font-mono font-bold">{item.title}</div>
                          <div className="font-mono text-sm text-gray-400">Qty: {item.quantity}</div>
                        </div>
                        <div className="font-mono text-electric-violet">
                          {formatCurrency(item.price * item.quantity)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            {/* What's Next */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              className="card mb-8"
            >
              <h3 className="text-lg font-mono font-bold mb-4">What's Next?</h3>
              <div className="space-y-3 text-sm text-gray-400">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-electric-violet text-black font-mono font-bold text-xs flex items-center justify-center mt-0.5">
                    1
                  </div>
                  <div>
                    <div className="font-mono font-bold text-white">Order Processing</div>
                    <div>We'll begin processing your order immediately.</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-gray-600 text-white font-mono font-bold text-xs flex items-center justify-center mt-0.5">
                    2
                  </div>
                  <div>
                    <div className="font-mono font-bold text-white">Email Confirmation</div>
                    <div>You'll receive an email with your download links and receipt.</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-gray-600 text-white font-mono font-bold text-xs flex items-center justify-center mt-0.5">
                    3
                  </div>
                  <div>
                    <div className="font-mono font-bold text-white">Instant Access</div>
                    <div>Download your digital products immediately from the email.</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <button
                onClick={() => navigate('/products')}
                className="btn-primary flex items-center justify-center gap-2"
              >
                Continue Shopping
                <ArrowRight className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => navigate('/')}
                className="btn-ghost"
              >
                Back to Home
              </button>
            </motion.div>

            {/* Support Note */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4 }}
              className="mt-8 p-4 border border-gray-700 rounded-sm"
            >
              <div className="text-sm text-gray-400">
                <div className="font-mono font-bold text-white mb-2">Need Help?</div>
                <div>
                  If you have any questions about your order or need assistance with downloads, 
                  please don't hesitate to{' '}
                  <button
                    onClick={() => navigate('/contact')}
                    className="text-electric-violet hover:text-electric-violet-light transition-colors underline"
                  >
                    contact our support team
                  </button>
                  .
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  )
}

export default OrderConfirmation
