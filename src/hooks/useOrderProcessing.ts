import { useState } from 'react'
import { useAuthContext } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'
import { useToast } from '../contexts/ToastContext'
import { supabase } from '../lib/supabase'
import emailService from '../services/emailService'

interface OrderItem {
  product_id: string
  product_name: string
  price: number
  download_link?: string
}

interface ProcessOrderData {
  stripeSessionId: string
  customerEmail?: string
  customerName?: string
}

export const useOrderProcessing = () => {
  const [isProcessing, setIsProcessing] = useState(false)
  const { user } = useAuthContext()
  const { items, clearCart } = useCart()
  const { showToast } = useToast()

  const processOrder = async (orderData: ProcessOrderData) => {
    setIsProcessing(true)
    
    try {
      // 1. Create order record in database
      const order = await createOrderRecord(orderData)
      
      // 2. Send confirmation emails for each product
      await sendOrderEmails(order, orderData)
      
      // 3. Clear cart
      clearCart()
      
      // 4. Show success message
      showToast({
        type: 'success',
        title: 'Order Complete!',
        message: 'Download links have been sent to your email.'
      })

      return order
    } catch (error) {
      console.error('Order processing failed:', error)
      showToast({
        type: 'error',
        title: 'Order Processing Failed',
        message: 'Please contact support if payment was charged.'
      })
      throw error
    } finally {
      setIsProcessing(false)
    }
  }

  const createOrderRecord = async (orderData: ProcessOrderData) => {
    const orderNumber = `SN-${Date.now()}`
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    
    // Create main order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([{
        user_id: user?.id,
        order_number: orderNumber,
        total_amount: total,
        status: 'completed',
        payment_method: 'stripe',
        payment_id: orderData.stripeSessionId,
        customer_email: orderData.customerEmail || user?.email,
        customer_name: orderData.customerName || user?.user_metadata?.full_name || 'Customer',
        notes: `Stripe Session: ${orderData.stripeSessionId}`
      }])
      .select()
      .single()

    if (orderError) {
      throw new Error(`Failed to create order: ${orderError.message}`)
    }

    // Create order items
    const orderItems = items.map(item => ({
      order_id: order.id,
      product_id: item.id,
      product_name: item.title,
      price: item.price,
      quantity: item.quantity
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) {
      throw new Error(`Failed to create order items: ${itemsError.message}`)
    }

    return { ...order, items: orderItems }
  }

  const sendOrderEmails = async (order: any, orderData: ProcessOrderData) => {
    // Get product details with download links
    const productIds = items.map(item => item.id)
    const { data: products, error } = await supabase
      .from('products')
      .select('id, title, price, download_link, file_url')
      .in('id', productIds)

    if (error) {
      console.error('Failed to fetch product details:', error)
      // Continue without email - order is still valid
      return
    }

    // Send email for each product
    for (const item of items) {
      const product = products?.find(p => p.id === item.id)
      if (!product) continue

      const downloadLink = product.download_link || product.file_url || 
        `https://studio-nullbyte.github.io/studio-nullbyte.github.io/download/${product.id}`

      try {
        await emailService.sendOrderConfirmation({
          customerName: orderData.customerName || user?.user_metadata?.full_name || 'Customer',
          customerEmail: orderData.customerEmail || user?.email || '',
          productName: product.title,
          productPrice: product.price,
          downloadLink: downloadLink,
          orderNumber: order.order_number,
          purchaseDate: new Date().toLocaleDateString()
        })
      } catch (emailError) {
        console.error(`Failed to send email for product ${product.title}:`, emailError)
        // Log but don't fail the order
      }
    }
  }

  const resendOrderEmail = async (orderId: string) => {
    setIsProcessing(true)
    
    try {
      // Get order details
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            product_id,
            product_name,
            price,
            quantity,
            products (
              title,
              download_link,
              file_url
            )
          )
        `)
        .eq('id', orderId)
        .single()

      if (orderError || !order) {
        throw new Error('Order not found')
      }

      // Resend emails for each item
      for (const item of order.order_items) {
        const downloadLink = item.products.download_link || 
          item.products.file_url || 
          `https://studio-nullbyte.github.io/studio-nullbyte.github.io/download/${item.product_id}`

        await emailService.sendOrderConfirmation({
          customerName: order.customer_name,
          customerEmail: order.customer_email,
          productName: item.product_name,
          productPrice: item.price,
          downloadLink: downloadLink,
          orderNumber: order.order_number,
          purchaseDate: new Date(order.created_at).toLocaleDateString()
        })
      }

      showToast({
        type: 'success',
        title: 'Email Resent',
        message: 'Download links have been sent to your email again.'
      })

    } catch (error) {
      console.error('Failed to resend email:', error)
      showToast({
        type: 'error',
        title: 'Resend Failed',
        message: 'Could not resend email. Please contact support.'
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return {
    processOrder,
    resendOrderEmail,
    isProcessing
  }
}
