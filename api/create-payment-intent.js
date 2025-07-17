const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

/**
 * Vercel serverless function to create Stripe payment intents
 * This function creates a payment intent for live payments
 */
module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { amount, currency = 'usd', metadata = {} } = req.body

    // Validate required fields
    if (!amount || typeof amount !== 'number') {
      return res.status(400).json({
        error: 'Amount is required and must be a number'
      })
    }

    // Validate minimum amount (50 cents for USD)
    if (amount < 50) {
      return res.status(400).json({
        error: 'Amount must be at least 50 cents'
      })
    }

    // Check if Stripe secret key is configured
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('STRIPE_SECRET_KEY not configured')
      return res.status(500).json({
        error: 'Payment processing not configured'
      })
    }

    // Create the payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // Amount should already be in cents
      currency: currency,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        ...metadata,
        amount_dollars: (amount / 100).toString(),
        created_at: new Date().toISOString()
      }
    })

    // Return the client secret
    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    })

  } catch (error) {
    console.error('Payment intent creation error:', error)
    
    // Return appropriate error message
    if (error.type === 'StripeCardError') {
      res.status(400).json({ error: error.message })
    } else if (error.type === 'StripeInvalidRequestError') {
      res.status(400).json({ error: 'Invalid payment request' })
    } else {
      res.status(500).json({ error: 'Payment processing failed' })
    }
  }
}
