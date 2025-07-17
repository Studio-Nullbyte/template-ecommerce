import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { 
  ShoppingCart, 
  Search, 
  Filter,
  Eye, 
  Edit3,
  Package,
  DollarSign,
  Calendar,
  User,
  AlertCircle,
  CheckCircle,
  Clock,
  X,
  Save,
  ExternalLink
} from 'lucide-react'
import { useAdmin } from '../hooks/useAdmin'
import { useNavigate, Link } from 'react-router-dom'
import AdminLayout from '../components/AdminLayout'
import { logger } from '../utils/logger'

interface Order {
  id: string
  user_id: string
  total_amount: number
  status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'refunded'
  payment_method: string | null
  payment_id: string | null
  notes: string | null
  created_at: string
  updated_at: string
  user_profiles?: {
    full_name: string | null
    email: string
  }
  order_items?: {
    id: string
    product_id: string
    price: number
    quantity: number
    products: {
      title: string
    }
  }[]
}

const statusColors = {
  pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  processing: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  completed: 'bg-terminal-green/20 text-terminal-green border-terminal-green/30',
  cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
  refunded: 'bg-purple-500/20 text-purple-400 border-purple-500/30'
}

const statusIcons = {
  pending: Clock,
  processing: Package,
  completed: CheckCircle,
  cancelled: X,
  refunded: AlertCircle
}

export default function AdminOrders() {
  const { isAdmin, loading, getOrders, updateOrder } = useAdmin()
  const navigate = useNavigate()
  
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [ordersLoading, setOrdersLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [editingOrder, setEditingOrder] = useState<Order | null>(null)
  const [formLoading, setFormLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  // Form state for order editing
  const [formData, setFormData] = useState({
    status: 'pending' as Order['status'],
    notes: ''
  })

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate('/')
    }
  }, [isAdmin, loading, navigate])

  useEffect(() => {
    const fetchOrders = async () => {
      if (isAdmin) {
        try {
          logger.admin('Starting to fetch orders...')
          const ordersData = await getOrders()
          logger.admin('Orders fetched successfully:', ordersData)
          setOrders(ordersData)
          setError('') // Clear any previous errors
        } catch (error) {
          logger.error('Failed to load orders:', error)
          setError(`Failed to load orders: ${error instanceof Error ? error.message : 'Unknown error'}`)
        } finally {
          logger.debug('Setting ordersLoading to false')
          setOrdersLoading(false)
        }
      } else {
        setOrdersLoading(false)
      }
    }

    // Add a timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      if (ordersLoading) {
        logger.warn('Timeout reached, forcing loading to false')
        setOrdersLoading(false)
        setError('Request timed out. Please try refreshing the page.')
      }
    }, 10000) // 10 second timeout

    fetchOrders()

    return () => clearTimeout(timeoutId)
  }, [isAdmin, getOrders, ordersLoading])

  // Filter orders
  useEffect(() => {
    let filtered = orders

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(order => 
        order.id.toLowerCase().includes(term) ||
        order.user_profiles?.email.toLowerCase().includes(term) ||
        order.user_profiles?.full_name?.toLowerCase().includes(term) ||
        order.payment_id?.toLowerCase().includes(term)
      )
    }

    if (statusFilter) {
      filtered = filtered.filter(order => order.status === statusFilter)
    }

    setFilteredOrders(filtered)
  }, [orders, searchTerm, statusFilter])

  const resetForms = () => {
    setFormData({
      status: 'pending',
      notes: ''
    })
    setSelectedOrder(null)
    setEditingOrder(null)
    setIsViewModalOpen(false)
    setIsEditModalOpen(false)
    setError('')
    setMessage('')
  }

  const openViewModal = (order: Order) => {
    setSelectedOrder(order)
    setIsViewModalOpen(true)
  }

  const openEditModal = (order: Order) => {
    setFormData({
      status: order.status,
      notes: order.notes || ''
    })
    setEditingOrder(order)
    setIsEditModalOpen(true)
  }

  const handleUpdateOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormLoading(true)
    setError('')

    if (!editingOrder) {
      setError('No order selected for editing')
      setFormLoading(false)
      return
    }

    try {
      const orderData = {
        status: formData.status,
        notes: formData.notes.trim() || null
      }

      const result = await updateOrder(editingOrder.id, orderData)

      if (result.error) {
        setError('Failed to update order')
      } else {
        setMessage('Order updated successfully!')
        
        // Update local state
        setOrders(orders.map(order => 
          order.id === editingOrder.id 
            ? { ...order, ...orderData }
            : order
        ))
        
        setTimeout(() => {
          resetForms()
        }, 1500)
      }
    } catch (error: any) {
      setError(error.message || 'An unexpected error occurred')
    } finally {
      setFormLoading(false)
    }
  }

  const getOrderStats = () => {
    return {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      processing: orders.filter(o => o.status === 'processing').length,
      completed: orders.filter(o => o.status === 'completed').length,
      revenue: orders
        .filter(o => o.status === 'completed')
        .reduce((sum, order) => sum + order.total_amount, 0)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  if (loading || ordersLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-electric-violet"></div>
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  const stats = getOrderStats()

  return (
    <AdminLayout>
      <Helmet>
        <title>Manage Orders - Admin - Studio Nullbyte</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="pb-6">
        <div className="w-full px-4 py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full"
          >
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <ShoppingCart className="w-6 h-6 text-electric-violet" />
                  <h1 className="text-3xl font-mono text-white">Manage Orders</h1>
                </div>
              </div>
              <p className="text-gray-400 font-mono">
                View and manage customer orders and transactions
              </p>
            </div>

            {/* Status Messages */}
            {message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 bg-terminal-green/10 border border-terminal-green/30 rounded p-3 mb-6"
              >
                <CheckCircle className="w-4 h-4 text-terminal-green" />
                <span className="text-sm font-mono text-terminal-green">{message}</span>
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded p-3 mb-6"
              >
                <AlertCircle className="w-4 h-4 text-red-400" />
                <span className="text-sm font-mono text-red-400">{error}</span>
              </motion.div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
              <div className="bg-code-gray-light border border-gray-700 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <ShoppingCart className="w-8 h-8 text-electric-violet" />
                  <div>
                    <p className="text-2xl font-mono text-white font-bold">{stats.total}</p>
                    <p className="text-gray-400 font-mono text-sm">Total Orders</p>
                  </div>
                </div>
              </div>

              <div className="bg-code-gray-light border border-gray-700 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <Clock className="w-8 h-8 text-yellow-500" />
                  <div>
                    <p className="text-2xl font-mono text-white font-bold">{stats.pending}</p>
                    <p className="text-gray-400 font-mono text-sm">Pending</p>
                  </div>
                </div>
              </div>

              <div className="bg-code-gray-light border border-gray-700 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <Package className="w-8 h-8 text-blue-500" />
                  <div>
                    <p className="text-2xl font-mono text-white font-bold">{stats.processing}</p>
                    <p className="text-gray-400 font-mono text-sm">Processing</p>
                  </div>
                </div>
              </div>

              <div className="bg-code-gray-light border border-gray-700 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-8 h-8 text-terminal-green" />
                  <div>
                    <p className="text-2xl font-mono text-white font-bold">{stats.completed}</p>
                    <p className="text-gray-400 font-mono text-sm">Completed</p>
                  </div>
                </div>
              </div>

              <div className="bg-code-gray-light border border-gray-700 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-8 h-8 text-terminal-green" />
                  <div>
                    <p className="text-2xl font-mono text-white font-bold">
                      {formatCurrency(stats.revenue)}
                    </p>
                    <p className="text-gray-400 font-mono text-sm">Revenue</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-code-gray-light border border-gray-700 rounded-lg p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search orders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-code-gray border border-gray-600 pl-10 pr-4 py-2 rounded font-mono text-white placeholder-gray-500 focus:outline-none focus:border-electric-violet transition-colors"
                  />
                </div>

                {/* Status Filter */}
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full bg-code-gray border border-gray-600 pl-10 pr-4 py-2 rounded font-mono text-white focus:outline-none focus:border-electric-violet transition-colors appearance-none"
                  >
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>

                {/* Results Count */}
                <div className="flex items-center justify-end">
                  <span className="font-mono text-gray-400 text-sm">
                    {filteredOrders.length} of {orders.length} orders
                  </span>
                </div>
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-code-gray-light border border-gray-700 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-code-gray border-b border-gray-700">
                    <tr>
                      <th className="text-left p-4 font-mono text-gray-300 text-sm">Order ID</th>
                      <th className="text-left p-4 font-mono text-gray-300 text-sm">Customer</th>
                      <th className="text-left p-4 font-mono text-gray-300 text-sm">Items</th>
                      <th className="text-left p-4 font-mono text-gray-300 text-sm">Amount</th>
                      <th className="text-left p-4 font-mono text-gray-300 text-sm">Status</th>
                      {/* <th className="text-left p-4 font-mono text-gray-300 text-sm">Payment</th> */}
                      <th className="text-left p-4 font-mono text-gray-300 text-sm">Date</th>
                      <th className="text-left p-4 font-mono text-gray-300 text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order, index) => {
                      const StatusIcon = statusIcons[order.status]
                      return (
                        <motion.tr
                          key={order.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="border-b border-gray-700/50 hover:bg-code-gray/50 transition-colors"
                        >
                          {/* Order ID */}
                          <td className="p-4">
                            <span className="font-mono text-white text-sm">
                              #{order.id.slice(-8)}
                            </span>
                          </td>

                          {/* Customer */}
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-gray-400" />
                              <div>
                                <p className="font-mono text-white text-sm">
                                  {order.user_profiles?.full_name || 'Unknown'}
                                </p>
                                <p className="font-mono text-gray-400 text-xs">
                                  {order.user_profiles?.email}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Order Items */}
                          <td className="p-4">
                            <div className="space-y-1">
                              {order.order_items && order.order_items.length > 0 ? (
                                order.order_items.map((item) => (
                                  <div key={item.id} className="flex items-center gap-2">
                                    <Link
                                      to={`/products/${item.product_id}`}
                                      className="flex items-center gap-1 text-electric-violet hover:text-electric-violet-light transition-colors font-mono text-xs group"
                                    >
                                      <span>{item.products.title}</span>
                                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </Link>
                                    <span className="text-gray-400 text-xs">
                                      ({item.quantity}x)
                                    </span>
                                  </div>
                                ))
                              ) : (
                                <span className="font-mono text-gray-500 text-xs">No items</span>
                              )}
                            </div>
                          </td>

                          {/* Amount */}
                          <td className="p-4">
                            <span className="font-mono text-electric-violet font-bold">
                              {formatCurrency(order.total_amount)}
                            </span>
                          </td>

                          {/* Status */}
                          <td className="p-4">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-mono border ${statusColors[order.status]}`}>
                              <StatusIcon className="w-3 h-3" />
                            </span>
                          </td>

                          {/* Payment
                          <td className="p-4">
                            <div>
                              <p className="font-mono text-white text-sm">
                                {order.payment_method || 'N/A'}
                              </p>
                              {order.payment_id && (
                                <p className="font-mono text-gray-400 text-xs">
                                  {order.payment_id.slice(-8)}
                                </p>
                              )}
                            </div>
                          </td> */}

                          {/* Date */}
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <span className="font-mono text-gray-300 text-sm">
                                {new Date(order.created_at).toLocaleDateString()}
                              </span>
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => openViewModal(order)}
                                className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs font-mono transition-colors"
                              >
                                <Eye className="w-3 h-3" />
                                View
                              </button>
                              
                              <button
                                onClick={() => openEditModal(order)}
                                className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs font-mono transition-colors"
                              >
                                <Edit3 className="w-3 h-3" />
                                Edit
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {filteredOrders.length === 0 && (
                <div className="text-center py-12">
                  <ShoppingCart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-mono text-gray-400 mb-2">No orders found</h3>
                  <p className="text-gray-500 font-mono text-sm">
                    {searchTerm || statusFilter ? 'Try adjusting your filters' : 'No orders have been placed yet'}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* View Order Modal */}
      {isViewModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-code-gray-light border border-gray-700 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-mono text-white">
                  Order Details #{selectedOrder.id.slice(-8)}
                </h2>
                <button
                  onClick={resetForms}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Order Info */}
              <div className="space-y-6">
                {/* Customer & Payment */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-code-gray border border-gray-600 rounded p-4">
                    <h3 className="text-sm font-mono text-gray-300 mb-3">Customer</h3>
                    <div className="space-y-2">
                      <p className="font-mono text-white">
                        {selectedOrder.user_profiles?.full_name || 'Unknown Customer'}
                      </p>
                      <p className="font-mono text-gray-400 text-sm">
                        {selectedOrder.user_profiles?.email}
                      </p>
                    </div>
                  </div>

                  <div className="bg-code-gray border border-gray-600 rounded p-4">
                    <h3 className="text-sm font-mono text-gray-300 mb-3">Payment</h3>
                    <div className="space-y-2">
                      <p className="font-mono text-white">
                        {selectedOrder.payment_method || 'N/A'}
                      </p>
                      {selectedOrder.payment_id && (
                        <p className="font-mono text-gray-400 text-sm">
                          ID: {selectedOrder.payment_id}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Order Status & Amount */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-code-gray border border-gray-600 rounded p-4">
                    <h3 className="text-sm font-mono text-gray-300 mb-3">Status</h3>
                    <div className="flex items-center gap-2">
                      {(() => {
                        const StatusIcon = statusIcons[selectedOrder.status]
                        return (
                          <span className={`inline-flex items-center gap-2 px-3 py-2 rounded font-mono border ${statusColors[selectedOrder.status]}`}>
                            <StatusIcon className="w-4 h-4" />
                            {selectedOrder.status}
                          </span>
                        )
                      })()}
                    </div>
                  </div>

                  <div className="bg-code-gray border border-gray-600 rounded p-4">
                    <h3 className="text-sm font-mono text-gray-300 mb-3">Total Amount</h3>
                    <p className="text-2xl font-mono text-electric-violet font-bold">
                      {formatCurrency(selectedOrder.total_amount)}
                    </p>
                    {selectedOrder.notes && selectedOrder.notes.includes('Subtotal:') && (
                      <div className="mt-3 text-xs font-mono text-gray-400">
                        {selectedOrder.notes.split(', ').map((part, index) => (
                          <div key={index}>{part}</div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Order Items */}
                {selectedOrder.order_items && selectedOrder.order_items.length > 0 && (
                  <div className="bg-code-gray border border-gray-600 rounded p-4">
                    <h3 className="text-sm font-mono text-gray-300 mb-3">Order Items</h3>
                    <div className="space-y-3">
                      {selectedOrder.order_items.map(item => (
                        <div key={item.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <Link
                                  to={`/products/${item.product_id}`}
                                  className="font-mono text-electric-violet hover:text-electric-violet-light transition-colors text-sm flex items-center gap-1 group"
                                >
                                  {item.products?.title}
                                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </Link>
                              </div>
                              <div className="flex items-center gap-2">
                                <p className="font-mono text-gray-400 text-xs">
                                  Item ID: #{item.id.slice(-8)}
                                </p>
                                <span className="text-gray-500">•</span>
                                <p className="font-mono text-gray-400 text-xs">
                                  Qty: {item.quantity}
                                </p>
                              </div>
                            </div>
                          </div>
                          <span className="font-mono text-electric-violet">
                            {formatCurrency(item.price)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes */}
                {selectedOrder.notes && (
                  <div className="bg-code-gray border border-gray-600 rounded p-4">
                    <h3 className="text-sm font-mono text-gray-300 mb-3">Notes</h3>
                    <p className="font-mono text-white text-sm whitespace-pre-wrap">
                      {selectedOrder.notes}
                    </p>
                  </div>
                )}

                {/* Dates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-code-gray border border-gray-600 rounded p-4">
                    <h3 className="text-sm font-mono text-gray-300 mb-3">Created</h3>
                    <p className="font-mono text-white">
                      {new Date(selectedOrder.created_at).toLocaleString()}
                    </p>
                  </div>

                  <div className="bg-code-gray border border-gray-600 rounded p-4">
                    <h3 className="text-sm font-mono text-gray-300 mb-3">Last Updated</h3>
                    <p className="font-mono text-white">
                      {new Date(selectedOrder.updated_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Edit Order Modal */}
      {isEditModalOpen && editingOrder && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-code-gray-light border border-gray-700 rounded-lg w-full max-w-md"
          >
            <form onSubmit={handleUpdateOrder} className="p-6">
              {/* Form Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-mono text-white">
                  Edit Order #{editingOrder.id.slice(-8)}
                </h2>
                <button
                  type="button"
                  onClick={resetForms}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                {/* Status */}
                <div>
                  <label className="block text-sm font-mono text-gray-300 mb-2">
                    Order Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as Order['status'] }))}
                    className="w-full bg-code-gray border border-gray-600 px-4 py-3 rounded font-mono text-white focus:outline-none focus:border-electric-violet transition-colors"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-mono text-gray-300 mb-2">
                    Admin Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    rows={4}
                    className="w-full bg-code-gray border border-gray-600 px-4 py-3 rounded font-mono text-white placeholder-gray-500 focus:outline-none focus:border-electric-violet transition-colors resize-none"
                    placeholder="Add internal notes about this order..."
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center gap-3 mt-8 pt-6 border-t border-gray-700">
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex items-center gap-2 bg-electric-violet hover:bg-electric-violet-light disabled:opacity-50 disabled:cursor-not-allowed text-white font-mono py-3 px-6 rounded transition-colors"
                >
                  <Save className="w-4 h-4" />
                  {formLoading ? 'Saving...' : 'Update Order'}
                </button>
                
                <button
                  type="button"
                  onClick={resetForms}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-mono py-3 px-6 rounded transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AdminLayout>
  )
}
