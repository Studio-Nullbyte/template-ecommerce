import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Code, Palette, Zap, Users, Download, Contact, Loader2 } from 'lucide-react'
import SEO from '../components/SEO'
import { getFeaturedProducts } from '../lib/supabase'
import type { Product } from '../lib/types/database'

const Home: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true)
        const { data, error } = await getFeaturedProducts(3)
        
        if (error) {
          console.error('Error fetching featured products:', error)
          setError('Failed to load featured products')
        } else if (data) {
          setFeaturedProducts(data)
        }
      } catch (err) {
        console.error('Error fetching featured products:', err)
        setError('Failed to load featured products')
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedProducts()
  }, [])

  const features = [
    {
      icon: <Code className="w-8 h-8" aria-hidden="true" />,
      title: "Developer-First",
      description: "Built for those who think in syntax and ship in silence."
    },
    {
      icon: <Palette className="w-8 h-8" aria-hidden="true" />,
      title: "Design-Minded",
      description: "Aesthetic precision meets functional excellence."
    },
    {
      icon: <Zap className="w-8 h-8" aria-hidden="true" />,
      title: "Ready to Deploy",
      description: "Plug-and-play solutions that work out of the box."
    },
    {
      icon: <Users className="w-8 h-8" aria-hidden="true" />,
      title: "Community Driven",
      description: "Built by developers, for developers and creators."
    }
  ]

  const stats = [
    { value: "500+", label: "Templates" },
    { value: "10k+", label: "Downloads" },
    { value: "4.9/5", label: "Rating" },
    { value: "24/7", label: "Support" }
  ]

  const structuredData = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Studio Nullbyte",
    "url": "https://studio-nullbyte.github.io",
    "description": "Modular tools for the design-minded developer. Clean. Branded. Ready to deploy.",
    "publisher": {
      "@type": "Organization",
      "name": "Studio Nullbyte"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://studio-nullbyte.github.io/products?search={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  }, null, 2)

  return (
    <>
      <SEO
        title="Studio Nullbyte - Modular Design Tools"
        description="Modular tools for the design-minded developer. Clean. Branded. Ready to deploy."
        keywords="templates, web templates, notion templates, AI prompts, developer tools, react templates, ui components, freelancers, digital products"
        url="/"
        type="website"
        structuredData={structuredData}
      />

      {/* Skip Link */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Hero Section */}
      <section 
        id="main-content"
        className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 sm:px-6" 
        aria-labelledby="hero-heading"
      >
        <div className="absolute inset-0 bg-grid-pattern opacity-10" aria-hidden="true" />
        <div className="container mx-auto text-center relative z-10 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <h1 
              id="hero-heading"
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-mono font-bold mb-4 sm:mb-6 leading-tight"
            >
              Modular tools for the
              <span className="block text-electric-violet mt-2">
                design-minded developer
              </span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-400 mb-6 sm:mb-8 font-mono px-4">
              Clean. Branded. Ready to deploy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
              <Link 
                to="/products" 
                className="btn-primary inline-flex items-center justify-center"
                aria-describedby="browse-description"
              >
                Browse Templates
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" aria-hidden="true" />
              </Link>
              <span id="browse-description" className="sr-only">
                Explore our collection of developer tools and templates
              </span>
              <Link to="/about" className="btn-secondary">
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section 
        className="py-12 sm:py-16 lg:py-20 bg-code-gray"
        aria-labelledby="stats-heading"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="stats-heading" className="sr-only">Company Statistics</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div 
                  className="text-2xl sm:text-3xl lg:text-4xl font-mono font-bold text-electric-violet mb-2"
                  aria-label={`${stat.value} ${stat.label}`}
                >
                  {stat.value}
                </div>
                <div className="text-gray-400 font-mono text-xs sm:text-sm">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section 
        className="py-12 sm:py-16 lg:py-20"
        aria-labelledby="features-heading"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 
              id="features-heading"
              className="text-2xl sm:text-3xl lg:text-4xl font-mono font-bold mb-4"
            >
              Built for <span className="text-electric-violet">Creators</span>
            </h2>
            <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto px-4">
              Whether you're a freelancer, indie developer, or agency owner, our tools adapt to your workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card group"
              >
                <div className="text-electric-violet mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-mono font-bold mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products - Only show if there are products or if loading/error */}
      {(loading || error || featuredProducts.length > 0) && (
        <section 
          className="py-12 sm:py-16 lg:py-20 bg-code-gray"
          aria-labelledby="featured-products-heading"
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 
                id="featured-products-heading"
                className="text-2xl sm:text-3xl lg:text-4xl font-mono font-bold mb-4"
              >
                Featured <span className="text-electric-violet">Products</span>
              </h2>
              <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto px-4">
                Handpicked templates and tools to accelerate your next project.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
              {loading ? (
                // Loading state
                <div className="col-span-full flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-electric-violet" />
                  <span className="ml-3 text-gray-400">Loading featured products...</span>
                </div>
              ) : error ? (
                // Error state
                <div className="col-span-full text-center py-12">
                  <p className="text-red-400 mb-4">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="btn-secondary"
                  >
                    Try Again
                  </button>
                </div>
              ) : (
                // Products loaded successfully
                featuredProducts.map((product, index) => (
                  <motion.article
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="card group"
                  >
                    <div className="aspect-video bg-code-gray-dark rounded-sm mb-4 overflow-hidden">
                      <img
                        src={product.image_url || "/api/placeholder/400/300"}
                        alt={`${product.title} preview`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/api/placeholder/400/300";
                        }}
                      />
                    </div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs text-electric-violet font-mono">
                        {(product as any).categories?.name || 'Product'}
                      </span>
                      <span className="text-lg sm:text-xl font-mono font-bold text-electric-violet">
                        ${product.price}
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-mono font-bold mb-2">
                      {product.title}
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {product.tags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <Link
                      to={`/product/${product.id}`}
                      className="btn-primary w-full text-center text-sm sm:text-base"
                    >
                      View Details
                    </Link>
                  </motion.article>
                ))
              )}
            </div>

            {featuredProducts.length > 0 && (
              <div className="text-center mt-8 sm:mt-12">
                <Link 
                  to="/products" 
                  className="btn-secondary inline-flex items-center"
                  aria-label="View all products in our catalog"
                >
                  View All Products
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" aria-hidden="true" />
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section 
        className="py-20"
        aria-labelledby="cta-heading"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 
              id="cta-heading"
              className="text-3xl md:text-4xl font-mono font-bold mb-4"
            >
              Ready to <span className="text-electric-violet">Ship</span>?
            </h2>
            <p className="text-gray-400 text-lg mb-8">
              Join thousands of developers who trust Studio Nullbyte for their projects.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/products" 
                className="btn-primary flex"
                aria-describedby="get-started-description"
              >
                <Download className="w-5 h-5 mr-2" aria-hidden="true" />
                Get Started
              </Link>
              <span id="get-started-description" className="sr-only">
                Browse our product catalog to find the perfect template for your project
              </span>
              <Link 
                to="/contact" 
                className="btn-secondary flex"
                aria-label="Contact us for support or custom solutions"
              >
                <Contact className="w-5 h-5 mr-2" aria-hidden="true" />
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Home
