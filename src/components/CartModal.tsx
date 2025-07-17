import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react'
import { useCart } from '../contexts/CartContext'
import { useToast } from '../contexts/ToastContext'

interface CartModalProps {
  isOpen: boolean
  onClose: () => void
}

const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate()
  const { items, updateQuantity, removeFromCart, clearCart, getTotalPrice } = useCart()
  const { showToast } = useToast()

  const handleRemoveItem = (item: { id: string; title: string }) => {
    removeFromCart(item.id)
    showToast({
      type: 'info',
      title: 'Item Removed',
      message: `${item.title} has been removed from your cart.`
    })
  }

  const handleClearCart = () => {
    if (items.length > 0) {
      clearCart()
      showToast({
        type: 'info',
        title: 'Cart Cleared',
        message: 'All items have been removed from your cart.'
      })
    }
  }

  const handleCheckout = () => {
    onClose() // Close the modal first
    navigate('/checkout')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-black border-l border-gray-700 z-50 overflow-hidden"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-700">
                <h2 className="text-xl font-mono font-bold">Shopping Cart</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-800 rounded-sm transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-6">
                {items.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400 font-mono">Your cart is empty</p>
                    <button
                      onClick={onClose}
                      className="btn-primary mt-4"
                    >
                      Continue Shopping
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-4 p-4 bg-code-gray rounded-sm">
                        {/* Product Image */}
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

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-mono font-bold text-sm truncate mb-1">
                            {item.title}
                          </h3>
                          <p className="text-electric-violet font-mono text-sm mb-2">
                            ${item.price}
                          </p>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1 hover:bg-gray-700 rounded-sm transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="font-mono text-sm w-8 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1 hover:bg-gray-700 rounded-sm transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleRemoveItem({ id: item.id, title: item.title })}
                              className="p-1 hover:bg-red-600 rounded-sm transition-colors ml-2"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        {/* Item Total */}
                        <div className="text-right">
                          <p className="font-mono font-bold text-sm">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <div className="border-t border-gray-700 p-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-mono font-bold">Total:</span>
                    <span className="font-mono font-bold text-xl text-electric-violet">
                      ${getTotalPrice().toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <button
                      onClick={handleCheckout}
                      className="btn-primary w-full"
                    >
                      Checkout
                    </button>
                    <button
                      onClick={handleClearCart}
                      className="btn-ghost w-full text-sm"
                    >
                      Clear Cart
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default CartModal
