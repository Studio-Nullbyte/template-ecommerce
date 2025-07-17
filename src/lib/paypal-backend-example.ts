// Example backend integration for PayPal orders
// This would typically be implemented in your backend API

interface PayPalOrderRequest {
  amount: number
  currency: string
  customerInfo: {
    firstName: string
    lastName: string
    email: string
  }
  items: Array<{
    name: string
    quantity: number
    price: number
  }>
}

interface PayPalOrderResponse {
  orderId: string
  links: Array<{
    href: string
    rel: string
    method: string
  }>
}

// Example function to create PayPal order on your backend
export async function createPayPalOrder(orderData: PayPalOrderRequest): Promise<PayPalOrderResponse> {
  const response = await fetch('/api/paypal/create-order', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderData),
  })

  if (!response.ok) {
    throw new Error('Failed to create PayPal order')
  }

  return response.json()
}

// Example function to capture PayPal payment on your backend
export async function capturePayPalPayment(orderId: string): Promise<{ success: boolean; paymentId: string }> {
  const response = await fetch(`/api/paypal/capture-order/${orderId}`, {
    method: 'POST',
  })

  if (!response.ok) {
    throw new Error('Failed to capture PayPal payment')
  }

  return response.json()
}

// Example Express.js backend routes (Node.js)
/*
// Install: npm install @paypal/checkout-server-sdk

const paypal = require('@paypal/checkout-server-sdk')

// PayPal environment setup
const clientId = process.env.PAYPAL_CLIENT_ID
const clientSecret = process.env.PAYPAL_CLIENT_SECRET
const environment = process.env.NODE_ENV === 'production' 
  ? new paypal.core.LiveEnvironment(clientId, clientSecret)
  : new paypal.core.SandboxEnvironment(clientId, clientSecret)

const client = new paypal.core.PayPalHttpClient(environment)

// Create order route
app.post('/api/paypal/create-order', async (req, res) => {
  const { amount, currency, customerInfo, items } = req.body

  const request = new paypal.orders.OrdersCreateRequest()
  request.prefer('return=representation')
  request.requestBody({
    intent: 'CAPTURE',
    purchase_units: [{
      amount: {
        currency_code: currency,
        value: amount.toFixed(2)
      },
      description: 'Studio Nullbyte Digital Products',
      custom_id: customerInfo.email,
      items: items.map(item => ({
        name: item.name,
        unit_amount: {
          currency_code: currency,
          value: item.price.toFixed(2)
        },
        quantity: item.quantity
      }))
    }],
    application_context: {
      brand_name: 'Studio Nullbyte',
      landing_page: 'BILLING',
      shipping_preference: 'NO_SHIPPING',
      user_action: 'PAY_NOW'
    }
  })

  try {
    const order = await client.execute(request)
    res.json({
      orderId: order.result.id,
      links: order.result.links
    })
  } catch (error) {
    console.error('PayPal order creation error:', error)
    res.status(500).json({ error: 'Failed to create PayPal order' })
  }
})

// Capture payment route
app.post('/api/paypal/capture-order/:orderId', async (req, res) => {
  const { orderId } = req.params
  
  const request = new paypal.orders.OrdersCaptureRequest(orderId)
  request.requestBody({})

  try {
    const capture = await client.execute(request)
    
    // Save order to database here
    // await saveOrder({ orderId, paymentId: capture.result.id, ... })
    
    res.json({
      success: true,
      paymentId: capture.result.id
    })
  } catch (error) {
    console.error('PayPal capture error:', error)
    res.status(500).json({ error: 'Failed to capture PayPal payment' })
  }
})
*/
