import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  LayoutDashboard,
  Package,
  Tag,
  Users,
  ShoppingCart,
  Mail,
  Menu,
  X,
  ChevronRight
} from 'lucide-react'

interface AdminSidebarProps {
  className?: string
}

export default function AdminSidebar({ className = '' }: AdminSidebarProps) {
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024)
    }
    
    checkIsDesktop()
    window.addEventListener('resize', checkIsDesktop)
    
    return () => window.removeEventListener('resize', checkIsDesktop)
  }, [])

  const navigationItems = [
    {
      title: 'Dashboard',
      href: '/admin',
      icon: LayoutDashboard,
      description: 'Overview & Analytics'
    },
    {
      title: 'Products',
      href: '/admin/products',
      icon: Package,
      description: 'Manage Templates'
    },
    {
      title: 'Categories',
      href: '/admin/categories',
      icon: Tag,
      description: 'Product Categories'
    },
    {
      title: 'Users',
      href: '/admin/users',
      icon: Users,
      description: 'User Accounts'
    },
    {
      title: 'Orders',
      href: '/admin/orders',
      icon: ShoppingCart,
      description: 'Order Management'
    },
    {
      title: 'Messages',
      href: '/admin/contacts',
      icon: Mail,
      description: 'Customer Messages'
    }
  ]

  const isActiveRoute = (href: string) => {
    if (href === '/admin') {
      return location.pathname === '/admin'
    }
    return location.pathname.startsWith(href)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileMenu}
        className="fixed top-24 left-4 z-50 lg:hidden bg-code-gray-light border border-gray-700 rounded-lg p-2 text-white hover:bg-code-gray transition-colors"
      >
        {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Backdrop for mobile */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeMobileMenu}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ 
          x: isDesktop ? 0 : (isMobileMenuOpen ? 0 : -300),
        }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className={`fixed top-20 left-0 h-[calc(100vh-5rem)] w-64 bg-code-gray-light border-r border-gray-700 z-40 overflow-y-auto lg:static lg:z-auto lg:h-screen lg:top-0 ${className}`}
      >
        <div className="p-4 pt-24 lg:pt-24">
          {/* Sidebar Header */}
          <div className="mb-6">
            <h2 className="text-base font-mono text-white mb-1">Admin Panel</h2>
            <p className="text-xs font-mono text-gray-400">Quick Actions</p>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1">
            {navigationItems.map((item) => {
              const isActive = isActiveRoute(item.href)
              const Icon = item.icon

              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={closeMobileMenu}
                  className={`flex items-center gap-2 p-2 rounded font-mono text-sm transition-all duration-200 group ${
                    isActive
                      ? 'bg-electric-violet text-white shadow-lg shadow-electric-violet/25'
                      : 'text-gray-300 hover:text-white hover:bg-code-gray'
                  }`}
                >
                  <div className={`flex items-center justify-center w-6 h-6 rounded transition-colors ${
                    isActive
                      ? 'bg-white/20'
                      : 'bg-gray-700 group-hover:bg-gray-600'
                  }`}>
                    <Icon className={`w-3 h-3 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{item.title}</div>
                  </div>

                  {isActive && (
                    <ChevronRight className="w-3 h-3 text-white/70 flex-shrink-0" />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-gray-700">
            <p className="text-xs font-mono text-gray-500 text-center">
              Studio <span className="cursor-blink">Nullbyte</span>
            </p>
            <p className="text-xs font-mono text-gray-600 text-center">
              v1.0.0
            </p>
          </div>
        </div>
      </motion.aside>
    </>
  )
}
