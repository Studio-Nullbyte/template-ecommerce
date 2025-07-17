import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Heart, Share2, ArrowLeft, Check } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useCart } from '../contexts/CartContext'
import { useToast } from '../contexts/ToastContext'

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
  stripe_price_id?: string | null
  created_at: string
  updated_at: string
}

const Product: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { addToCart, isInCart } = useCart()
  const { showToast } = useToast()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setError('Product ID not found')
        setLoading(false)
        return
      }

      try {
        const { data, error } = await supabase
          .from('products')
          .select(`
            *,
            category:categories(name, slug)
          `)
          .eq('id', id)
          .eq('active', true)
          .single()

        if (error) {
          setError('Product not found')
        } else {
          setProduct(data)
        }
      } catch (err) {
        setError('Failed to load product')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  const handleAddToCart = async () => {
    if (!product) return
    
    setIsAddingToCart(true)
    try {
      addToCart({
        id: product.id,
        title: product.title,
        price: product.price,
        image_url: product.image_url,
        stripe_price_id: product.stripe_price_id
      })
      
      // Show success toast
      showToast({
        type: 'success',
        title: 'Added to Cart!',
        message: `${product.title} has been added to your cart.`
      })
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to add item to cart. Please try again.'
      })
    } finally {
      setIsAddingToCart(false)
    }
  }

  const handleBuyNow = async () => {
    if (!product) return
    
    setIsAddingToCart(true)
    try {
      // Add to cart if not already there
      if (!isInCart(product.id)) {
        addToCart({
          id: product.id,
          title: product.title,
          price: product.price,
          image_url: product.image_url,
          stripe_price_id: product.stripe_price_id
        })
      }
      
      // Navigate to checkout
      navigate('/checkout')
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to proceed to checkout. Please try again.'
      })
    } finally {
      setIsAddingToCart(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white pt-20">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <div className="font-mono text-gray-400">Loading product...</div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-black text-white pt-20">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <div className="font-mono text-red-400 mb-4">{error || 'Product not found'}</div>
            <button 
              onClick={() => navigate('/products')}
              className="btn-secondary"
            >
              Back to Products
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>{product.title} - Studio Nullbyte</title>
        <meta name="description" content={product.description} />
      </Helmet>

      <div className="min-h-screen pt-20">
        {/* Back Button */}
        <div className="container mx-auto px-4 py-8">
          <button 
            onClick={() => navigate('/products')}
            className="flex items-center text-gray-400 hover:text-white transition-colors font-mono text-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </button>
        </div>

        {/* Product Header */}
        <section className="py-12 bg-code-gray">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Product Images */}
              <div className="space-y-4">
                <div className="aspect-video bg-code-gray-dark rounded-sm overflow-hidden">
                  {product.image_url ? (
                    <img
                      src={`${product.image_url}?t=${product.updated_at || Date.now()}`}
                      alt={product.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                      <span className="font-mono text-sm">No Image Available</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Product Info */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-sm text-electric-violet font-mono">
                    {product.category?.name || 'Uncategorized'}
                  </span>
                  {product.featured && (
                    <>
                      <span className="text-gray-400">•</span>
                      <span className="text-xs bg-electric-violet text-black px-2 py-1 rounded-sm font-mono font-bold">
                        FEATURED
                      </span>
                    </>
                  )}
                </div>

                <h1 className="text-3xl md:text-4xl font-mono font-bold mb-4">
                  {product.title}
                </h1>

                <p className="text-gray-400 text-lg mb-6">
                  {product.description}
                </p>

                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-mono font-bold text-electric-violet">
                      ${product.price}
                    </span>
                  </div>
                </div>

                <div className="flex gap-4 mb-6">
                  <button 
                    onClick={handleAddToCart}
                    disabled={isAddingToCart || isInCart(product.id)}
                    className={`flex-1 ${
                      isInCart(product.id) 
                        ? 'btn-secondary cursor-not-allowed' 
                        : 'btn-primary'
                    }`}
                  >
                    {isAddingToCart ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Adding...
                      </span>
                    ) : isInCart(product.id) ? (
                      <span className="flex items-center justify-center gap-2">
                        <Check className="w-4 h-4" />
                        In Cart
                      </span>
                    ) : (
                      `Add to Cart - $${product.price}`
                    )}
                  </button>
                  
                  <button 
                    onClick={handleBuyNow}
                    disabled={isAddingToCart}
                    className="btn-primary flex-1"
                  >
                    {isAddingToCart ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Loading...
                      </span>
                    ) : (
                      'Buy Now'
                    )}
                  </button>
                </div>

                <div className="flex gap-4 mb-8">
                  <button className="btn-secondary">
                    <Heart className="w-5 h-5" />
                  </button>
                  <button className="btn-secondary">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>

                {/* Show demo and download links if available */}
                <div className="flex gap-4 mb-8">
                  {product.preview_url && (
                    <a
                      href={product.preview_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-ghost"
                    >
                      Live Demo
                    </a>
                  )}
                  {product.download_url && (
                    <a
                      href={product.download_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-ghost"
                    >
                      Download
                    </a>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Product Details */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2">
                <h2 className="text-2xl font-mono font-bold mb-6">
                  About This Product
                </h2>
                <div className="prose prose-invert max-w-none">
                  <p className="text-gray-400 leading-relaxed text-lg">
                    {product.description}
                  </p>
                </div>
              </div>

              <div className="space-y-8">
                <div className="card">
                  <h3 className="text-lg font-mono font-bold mb-4">Product Details</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Category</span>
                      <span className="font-mono">{product.category?.name || 'Uncategorized'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Price</span>
                      <span className="font-mono text-electric-violet">${product.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Status</span>
                      <span className="font-mono text-green-400">
                        {product.featured ? 'Featured' : 'Available'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <h3 className="text-lg font-mono font-bold mb-4">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="text-xs bg-electric-violet bg-opacity-20 text-electric-violet px-2 py-1 rounded-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="card">
                  <h3 className="text-lg font-mono font-bold mb-4">License</h3>
                  <p className="text-gray-400 text-sm">
                    Single-use license for personal and commercial projects. 
                    Full source code included with lifetime updates.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default Product
