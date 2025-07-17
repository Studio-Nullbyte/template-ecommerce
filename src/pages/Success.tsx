import React, { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { CheckCircle, Home, ArrowRight, Mail, RefreshCw } from 'lucide-react'
import { useOrderProcessing } from '../hooks/useOrderProcessing'
import { useToast } from '../contexts/ToastContext'

const Success: React.FC = () => {
  const [searchParams] = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [loading, setLoading] = useState(true)
  const [orderProcessed, setOrderProcessed] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const { processOrder, isProcessing } = useOrderProcessing()
  const { showToast } = useToast()

  useEffect(() => {
    const handleOrderProcessing = async () => {
      if (!sessionId || orderProcessed) return

      try {
        // Process the order and send emails
        await processOrder({
          stripeSessionId: sessionId,
          // Additional customer data could be extracted from Stripe session if needed
        })
        
        setOrderProcessed(true)
        setEmailSent(true)
      } catch (error) {
        console.error('Order processing failed:', error)
        setOrderProcessed(true)
        setEmailSent(false)
      } finally {
        setLoading(false)
      }
    }

    // Start processing after a brief delay for better UX
    const timer = setTimeout(() => {
      if (sessionId) {
        handleOrderProcessing()
      } else {
        setLoading(false)
      }
    }, 2000)

    return () => clearTimeout(timer)
  }, [sessionId, orderProcessed, processOrder])

  const handleResendEmail = async () => {
    if (!sessionId) return
    
    try {
      // In a real implementation, you'd need the order ID
      // For now, show a helpful message
      showToast({
        type: 'info',
        title: 'Resend Email',
        message: 'Please contact support to resend your download links.'
      })
    } catch (error) {
      console.error('Failed to resend email:', error)
    }
  }

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Processing Payment | Studio Nullbyte</title>
        </Helmet>
        
        <div className="min-h-screen bg-black text-white pt-20">
          <div className="container mx-auto px-4 py-20">
            <div className="max-w-2xl mx-auto text-center">
              <div className="animate-spin w-12 h-12 border-4 border-electric-violet border-t-transparent rounded-full mx-auto mb-8"></div>
              <h1 className="text-4xl font-mono font-bold mb-4">
                Processing Payment<span className="cursor-blink">_</span>
              </h1>
              <p className="text-gray-400 font-mono">
                Confirming your transaction...
              </p>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Helmet>
        <title>Payment Successful | Studio Nullbyte</title>
        <meta name="description" content="Your payment was successful. Download your digital products now." />
      </Helmet>
      
      <div className="min-h-screen bg-black text-white pt-20">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-2xl mx-auto text-center">
            
            {/* Success Icon */}
            <div className="mb-8">
              <CheckCircle className="w-20 h-20 text-terminal-green mx-auto mb-4" />
              <div className="w-24 h-1 bg-terminal-green mx-auto animate-pulse"></div>
            </div>

            {/* Success Message */}
            <h1 className="text-4xl md:text-5xl font-mono font-bold mb-6">
              Payment Successful<span className="cursor-blink">_</span>
            </h1>
            
            <p className="text-xl text-gray-300 font-mono mb-8">
              Your digital product is ready for download.
            </p>

            {/* Session ID Display */}
            {sessionId && (
              <div className="bg-code-gray border border-gray-600 rounded-sm p-4 mb-8">
                <p className="text-sm text-gray-400 font-mono mb-2">Transaction ID:</p>
                <p className="font-mono text-electric-violet break-all">{sessionId}</p>
              </div>
            )}

            {/* Email Status */}
            <div className="bg-code-gray border border-gray-600 rounded-sm p-4 mb-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-electric-violet" />
                  <div className="text-left">
                    <p className="text-sm font-mono text-white">Download Links</p>
                    <p className="text-xs text-gray-400 font-mono">
                      {emailSent ? 'Sent to your email address' : 'Processing...'}
                    </p>
                  </div>
                </div>
                {emailSent ? (
                  <CheckCircle className="w-5 h-5 text-terminal-green" />
                ) : isProcessing ? (
                  <div className="w-4 h-4 border-2 border-electric-violet border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <button
                    onClick={handleResendEmail}
                    className="flex items-center gap-2 text-electric-violet hover:text-electric-violet-light font-mono text-sm transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Resend
                  </button>
                )}
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-code-gray-light border border-gray-600 rounded-sm p-6 mb-8 text-left">
              <h2 className="text-xl font-mono font-bold mb-4 text-electric-violet">
                What's Next?
              </h2>
              <div className="space-y-3 font-mono text-sm">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-terminal-green mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">
                    Check your email for download links and receipt
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-terminal-green mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">
                    Access your purchases in your account dashboard
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-terminal-green mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">
                    Download files are available immediately
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/products"
                className="btn-secondary font-mono flex items-center justify-center gap-2"
              >
                <ArrowRight className="w-4 h-4" />
                Browse More Templates
              </Link>
              
              <Link
                to="/"
                className="btn-ghost font-mono flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4" />
                Back to Home
              </Link>
            </div>

            {/* Support Note */}
            <div className="mt-12 text-sm text-gray-400 font-mono">
              <p>Need help? Contact us at{' '}
                <a 
                  href="mailto:studionullbyte@gmail.com" 
                  className="text-electric-violet hover:text-electric-violet-light"
                >
                  studionullbyte@gmail.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Success
