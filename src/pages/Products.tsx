import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Filter, Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import SEO from '../components/SEO'

interface Product {
  id: string
  title: string
  description: string
  price: number
  category_id: string
  category?: {
    name: string
    slug: string
  }
  image_url: string | null
  download_url: string | null
  preview_url: string | null
  tags: string[]
  featured: boolean
  active: boolean
  created_at: string
  updated_at: string
}

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

const Products: React.FC = () => {
  const navigate = useNavigate()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch products and categories from database
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch products
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select(`
            *,
            category:categories(name, slug)
          `)
          .eq('active', true)
          .order('created_at', { ascending: false })

        if (productsError) {
          console.error('Error fetching products:', productsError)
        } else {
          setProducts(productsData || [])
        }

        // Fetch categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('*')
          .eq('is_active', true)
          .order('name')

        if (categoriesError) {
          console.error('Error fetching categories:', categoriesError)
        } else {
          setCategories(categoriesData || [])
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Handler for viewing product details
  const handleViewDetails = (productId: string) => {
    navigate(`/product/${productId}`)
  }

  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = searchTerm === '' || 
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesCategory = selectedCategory === 'all' || product.category_id === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  // Create categories with counts
  const categoriesWithCounts = [
    { id: 'all', name: 'All Products', count: products.length },
    ...categories.map(category => ({
      id: category.id,
      name: category.name,
      count: products.filter(p => p.category_id === category.id).length
    }))
  ]

  const structuredData = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Products - Studio Nullbyte",
    "description": "Browse our collection of web templates, Notion templates, AI prompts, and more.",
    "url": "https://studio-nullbyte.github.io/products",
    "publisher": {
      "@type": "Organization",
      "name": "Studio Nullbyte"
    },
    "mainEntity": {
      "@type": "ItemList",
      "name": "Digital Products",
      "numberOfItems": products.length
    }
  }, null, 2)

  return (
    <>
      <SEO
        title="Products - Studio Nullbyte"
        description="Browse our collection of web templates, Notion templates, AI prompts, UI components, and document templates for developers and creators."
        keywords="web templates, notion templates, AI prompts, UI components, react templates, developer tools, digital products, freelancer tools"
        url="/products"
        type="website"
        structuredData={structuredData}
      />

      <div className="min-h-screen pt-16 sm:pt-20">
        {/* Skip Link for Keyboard Navigation */}
        <a 
          href="#main-content" 
          className="skip-link"
          onFocus={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          onBlur={(e) => e.currentTarget.style.transform = 'translateY(-100%)'}
        >
          Skip to main content
        </a>

        {/* Header */}
        <section className="py-12 sm:py-16 lg:py-20 bg-code-gray" role="banner">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-12">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-mono font-bold mb-4">
                Browse <span className="text-electric-violet">Products</span>
              </h1>
              <p className="text-gray-300 text-base sm:text-lg max-w-2xl mx-auto px-4">
                Handcrafted templates and tools to accelerate your next project.
              </p>
            </div>

            {/* Search and Filters */}
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col gap-4 mb-6 sm:mb-8">
                <div className="relative">
                  <label htmlFor="product-search" className="sr-only">
                    Search products by name, description, or tags
                  </label>
                  <Search 
                    className="w-4 h-4 sm:w-5 sm:h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
                    aria-hidden="true"
                  />
                  <input
                    id="product-search"
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input-field pl-10"
                    aria-describedby="search-description"
                  />
                  <div id="search-description" className="sr-only">
                    Search through {products.length} products by name, description, or tags
                  </div>
                </div>
                <div className="flex items-center justify-center sm:justify-start space-x-2">
                  <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" aria-hidden="true" />
                  <span className="text-xs sm:text-sm text-gray-300 font-mono">Filter by category</span>
                </div>
              </div>

              {/* Category Filters */}
              <fieldset className="mb-6 sm:mb-8">
                <legend className="sr-only">Filter products by category</legend>
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start" role="group">
                  {categoriesWithCounts.map(category => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`px-3 py-2 sm:px-4 rounded-sm font-mono text-xs sm:text-sm transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-electric-violet text-black'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                      aria-pressed={selectedCategory === category.id}
                      aria-describedby={`category-${category.id}-count`}
                    >
                      {category.name}
                      <span id={`category-${category.id}-count`} className="sr-only">
                        {category.count} products
                      </span>
                      <span aria-hidden="true"> ({category.count})</span>
                    </button>
                  ))}
                </div>
              </fieldset>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <main id="main-content" className="py-12 sm:py-16 lg:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="text-center py-12" role="status" aria-live="polite">
                <div className="font-mono text-gray-300">Loading products...</div>
                <div className="sr-only">Please wait while we load the products</div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-16" role="status" aria-live="polite">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 bg-electric-violet/20 rounded-lg flex items-center justify-center mx-auto mb-6">
                    <Search className="w-8 h-8 text-electric-violet" />
                  </div>
                  <h2 className="text-2xl font-mono font-bold text-white mb-4">
                    No products found
                  </h2>
                  <p className="text-gray-400 font-mono text-sm mb-6">
                    {searchTerm && selectedCategory !== 'all' ? (
                      <>We couldn't find any products matching "{searchTerm}" in the selected category.</>
                    ) : searchTerm ? (
                      <>We couldn't find any products matching "{searchTerm}".</>
                    ) : selectedCategory !== 'all' ? (
                      <>No products available in the selected category.</>
                    ) : products.length === 0 ? (
                      <>No products are currently available. Check back soon for new releases!</>
                    ) : (
                      <>No products found matching your criteria.</>
                    )}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm('')}
                        className="btn-secondary"
                      >
                        Clear search
                      </button>
                    )}
                    {selectedCategory !== 'all' && (
                      <button
                        onClick={() => setSelectedCategory('all')}
                        className="btn-secondary"
                      >
                        View all products
                      </button>
                    )}
                  </div>
                </div>
                <div className="sr-only">
                  {searchTerm ? `No products found for search term "${searchTerm}"` : 'No products in selected category'}
                </div>
              </div>
            ) : (
              <>
                <div className="sr-only" aria-live="polite" aria-atomic="true">
                  Showing {filteredProducts.length} of {products.length} products
                  {selectedCategory !== 'all' && ` in ${categoriesWithCounts.find(c => c.id === selectedCategory)?.name}`}
                  {searchTerm && ` matching "${searchTerm}"`}
                </div>
                <div 
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
                  role="region"
                  aria-label="Product listings"
                >
                  {filteredProducts.map((product, index) => (
                    <article
                      key={product.id}
                      className="card group relative"
                      aria-labelledby={`product-title-${product.id}`}
                    >
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        {product.featured && (
                          <div 
                            className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-electric-violet text-black px-2 py-1 rounded-sm text-xs font-mono font-bold z-10"
                            aria-label="Featured product"
                          >
                            FEATURED
                          </div>
                        )}
                        
                        <div className="aspect-video bg-code-gray-dark rounded-sm mb-4 overflow-hidden">
                          {product.image_url ? (
                            <img
                              src={`${product.image_url}?t=${product.updated_at || Date.now()}`}
                              alt={`Preview image for ${product.title}`}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.style.display = 'none'
                                target.nextElementSibling?.classList.remove('hidden')
                              }}
                            />
                          ) : null}
                          <div className={`w-full h-full flex items-center justify-center text-gray-500 ${product.image_url ? 'hidden' : ''}`}>
                            <span className="font-mono text-sm">No preview available</span>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-xs text-electric-violet font-mono uppercase">
                            {product.category?.name || 'Uncategorized'}
                          </span>
                          <span 
                            className="text-lg sm:text-xl font-mono font-bold text-electric-violet"
                            aria-label={`Price: $${product.price}`}
                          >
                            ${product.price}
                          </span>
                        </div>
                      
                        <h3 
                          id={`product-title-${product.id}`}
                          className="text-base sm:text-lg font-mono font-bold mb-2 group-hover:text-electric-violet transition-colors"
                        >
                          {product.title}
                        </h3>
                        
                        <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                          {product.description}
                        </p>
                        
                        <div className="flex flex-wrap gap-2 mb-4" role="list" aria-label="Product tags">
                          {product.tags.slice(0, 3).map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded-sm"
                              role="listitem"
                            >
                              {tag}
                            </span>
                          ))}
                          {product.tags.length > 3 && (
                            <span className="text-xs text-gray-400" aria-label={`${product.tags.length - 3} additional tags`}>
                              +{product.tags.length - 3} more
                            </span>
                          )}
                        </div>
                        
                        <button 
                          className="btn-primary w-full"
                          onClick={() => handleViewDetails(product.id)}
                          aria-describedby={`product-description-${product.id}`}
                        >
                          View Details
                          <span className="sr-only"> for {product.title}</span>
                        </button>
                        <div id={`product-description-${product.id}`} className="sr-only">
                          {product.description}
                        </div>
                      </motion.div>
                    </article>
                  ))}
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </>
  )
}

export default Products
