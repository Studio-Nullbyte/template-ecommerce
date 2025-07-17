import React from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { XCircle, ArrowLeft, Home, RefreshCw } from 'lucide-react'

const Cancel: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Payment Cancelled | Studio Nullbyte</title>
        <meta name="description" content="Your payment was cancelled. No charges were made to your account." />
      </Helmet>
      
      <div className="min-h-screen bg-black text-white pt-20">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-2xl mx-auto text-center">
            
            {/* Cancel Icon */}
            <div className="mb-8">
              <XCircle className="w-20 h-20 text-red-400 mx-auto mb-4" />
              <div className="w-24 h-1 bg-red-400 mx-auto opacity-50"></div>
            </div>

            {/* Cancel Message */}
            <h1 className="text-4xl md:text-5xl font-mono font-bold mb-6">
              Payment Cancelled<span className="cursor-blink">_</span>
            </h1>
            
            <p className="text-xl text-gray-300 font-mono mb-8">
              No charges were made to your account.
            </p>

            {/* Information Box */}
            <div className="bg-code-gray-light border border-gray-600 rounded-sm p-6 mb-8 text-left">
              <h2 className="text-xl font-mono font-bold mb-4 text-red-400">
                What Happened?
              </h2>
              <div className="space-y-3 font-mono text-sm text-gray-300">
                <p>• You cancelled the payment process</p>
                <p>• No payment was processed</p>
                <p>• Your product is still available for purchase</p>
                <p>• You can try again anytime</p>
              </div>
            </div>

            {/* Common Issues */}
            <div className="bg-code-gray border border-gray-600 rounded-sm p-6 mb-8 text-left">
              <h3 className="text-lg font-mono font-bold mb-4 text-electric-violet">
                Need Help?
              </h3>
              <div className="space-y-2 font-mono text-sm text-gray-400">
                <p>• Payment issues? Try a different card or payment method</p>
                <p>• Questions about products? Check our FAQ or contact support</p>
                <p>• Technical problems? Clear your browser cache and try again</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.history.back()}
                className="btn-primary font-mono flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>
              
              <Link
                to="/products"
                className="btn-secondary font-mono flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Browse Products
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
              <p>Still having trouble? Contact us at{' '}
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

export default Cancel
