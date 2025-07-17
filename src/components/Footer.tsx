import React from 'react'
import { Link } from 'react-router-dom'
import { Github, Mail } from 'lucide-react'

const Footer: React.FC = () => {
  return (
    <footer className="bg-code-gray border-t border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-2">
            <div className="flex items-center space-x-2 sm:space-x-3 mb-4">
              <div className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center">
                <img 
                  src="/images/SNLogo.jpg" 
                  alt="Studio Nullbyte Logo" 
                  className="w-6 h-6 sm:w-8 sm:h-8 hover:scale-110 transition-transform duration-300"
                />
              </div>
              <span className="font-mono text-lg sm:text-xl font-bold">
                Studio<span className="text-electric-violet ml-1 cursor-blink">Nullbyte</span>
              </span>
            </div>
            <p className="text-gray-400 font-mono text-sm mb-4 max-w-md">
              Modular tools for those who think in syntax and ship in silence.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://github.com/studio-nullbyte"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-electric-violet transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="mailto:studionullbyte@gmail.com"
                className="text-gray-400 hover:text-electric-violet transition-colors"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-mono text-sm font-bold mb-4 text-electric-violet">
              Navigation
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-400 hover:text-white transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Products */}
          <div>
            <h3 className="font-mono text-sm font-bold mb-4 text-electric-violet">
              Products
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/products?category=web" className="text-gray-400 hover:text-white transition-colors">
                  Web Templates
                </Link>
              </li>
              <li>
                <Link to="/products?category=notion" className="text-gray-400 hover:text-white transition-colors">
                  Notion Templates
                </Link>
              </li>
              <li>
                <Link to="/products?category=ai" className="text-gray-400 hover:text-white transition-colors">
                  AI Prompts
                </Link>
              </li>
              <li>
                <Link to="/products?category=docs" className="text-gray-400 hover:text-white transition-colors">
                  Document Templates
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-6 sm:pt-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <p className="text-gray-400 text-sm font-mono text-center sm:text-left">
            © 2025 Studio Nullbyte. All rights reserved.
          </p>
          <div className="flex space-x-4 sm:space-x-6">
            <Link to="/privacy-policy" className="text-gray-400 hover:text-white text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms-of-service" className="text-gray-400 hover:text-white text-sm transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
