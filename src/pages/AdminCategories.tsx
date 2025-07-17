import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { 
  Tag, 
  Search, 
  Edit3, 
  Trash2,
  AlertCircle,
  CheckCircle,
  Save,
  X,
  Plus
} from 'lucide-react'
import { useAdmin, type Category } from '../hooks/useAdmin'
import AdminLayout from '../components/AdminLayout'
import AdminProtectedRoute from '../components/AdminProtectedRoute'
import { generateUniqueSlug } from '../utils/slugify'

export default function AdminCategories() {
  const { isAdmin, loading, getCategories, createCategory, updateCategory, deleteCategory } = useAdmin()
  
  const [categories, setCategories] = useState<Category[]>([])
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formLoading, setFormLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    slug: '',
    is_active: true
  })

  // Remove the problematic redirect - AdminProtectedRoute will handle it
  // The old useEffect with navigate('/') was causing premature redirects

  useEffect(() => {
    const fetchCategories = async () => {
      if (isAdmin) {
        try {
          const categoriesData = await getCategories()
          setCategories(categoriesData)
        } catch (error) {
          console.error('AdminCategories: Error fetching categories:', error)
          
          let errorMessage = 'Failed to load categories'
          if (error instanceof Error) {
            errorMessage += ': ' + error.message
          } else if (error && typeof error === 'object' && 'message' in error) {
            errorMessage += ': ' + (error as any).message
          } else if (error && typeof error === 'object' && 'error' in error) {
            errorMessage += ': ' + (error as any).error
          } else {
            errorMessage += ': Unknown error occurred'
          }
          
          setError(errorMessage)
        } finally {
          setCategoriesLoading(false)
        }
      } else if (!loading) {
        setCategoriesLoading(false)
      }
    }

    // Add timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      setCategoriesLoading(false)
      if (!categories.length && isAdmin) {
        setError('Loading timeout - please refresh the page')
      }
    }, 10000) // 10 second timeout

    fetchCategories()
    
    return () => clearTimeout(timeout)
  }, [isAdmin, loading, getCategories])

  // Filter categories
  useEffect(() => {
    let filtered = categories

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(category => 
        category.name.toLowerCase().includes(term) ||
        (category.description && category.description.toLowerCase().includes(term))
      )
    }

    setFilteredCategories(filtered)
  }, [categories, searchTerm])

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      slug: '',
      is_active: true
    })
    setEditingCategory(null)
    setIsFormOpen(false)
    setError('')
    setMessage('')
  }

  const openCreateForm = () => {
    resetForm()
    setIsFormOpen(true)
  }

  const openEditForm = (category: Category) => {
    setFormData({
      name: category.name,
      description: category.description || '',
      slug: category.slug || '',
      is_active: category.is_active
    })
    setEditingCategory(category)
    setIsFormOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    setFormLoading(true)
    setError('')

    try {
      if (editingCategory) {
        // Update existing category
        const categoryData = {
          name: formData.name.trim(),
          slug: formData.slug.trim(),
          description: formData.description.trim() || undefined,
          is_active: formData.is_active
        }

        const result = await updateCategory(editingCategory.id, categoryData)

        if (result.error) {
          setError('Failed to update category')
        } else {
          setMessage('Category updated successfully!')
          
          // Update local state
          setCategories(categories.map(category => 
            category.id === editingCategory.id 
              ? { ...category, ...categoryData, description: categoryData.description || null }
              : category
          ))
          
          setTimeout(() => {
            resetForm()
          }, 1500)
        }
      } else {
        // Create new category
        if (!formData.name.trim()) {
          setError('Category name is required')
          setFormLoading(false)
          return
        }

        const categoryData = {
          name: formData.name.trim(),
          slug: formData.slug || generateUniqueSlug(formData.name.trim(), categories.map(cat => cat.slug)),
          description: formData.description.trim() || undefined
        }
        
        const result = await createCategory(categoryData)

        if (result.error) {
          console.error('Create category error:', result.error)
          setError('Failed to create category: ' + (typeof result.error === 'string' ? result.error : JSON.stringify(result.error)))
        } else {
          setMessage('Category created successfully!')
          
          // Add to local state
          const newCategory: Category = {
            id: result.data.id,
            name: categoryData.name,
            slug: categoryData.slug,
            description: categoryData.description || null,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
          
          setCategories([newCategory, ...categories])
          
          setTimeout(() => {
            resetForm()
          }, 1500)
        }
      }
    } catch (error: any) {
      setError(error.message || 'An unexpected error occurred')
    } finally {
      setFormLoading(false)
    }
  }

  const handleDelete = async (categoryId: string, categoryName: string) => {
    if (!confirm(`Are you sure you want to delete category "${categoryName}"? This action cannot be undone.`)) {
      return
    }

    try {
      const result = await deleteCategory(categoryId)
      if (result.error) {
        setError('Failed to delete category')
      } else {
        setMessage('Category deleted successfully!')
        
        // Remove from local state
        setCategories(categories.filter(c => c.id !== categoryId))
      }
    } catch (error) {
      setError('An unexpected error occurred')
    }
  }

  const getCategoryStats = () => {
    return {
      total: categories.length,
      active: categories.filter(c => c.is_active).length,
      inactive: categories.filter(c => !c.is_active).length
    }
  }

  // Auto-generate slug when name changes (only for new categories)
  const handleNameChange = (name: string) => {
    setFormData(prev => {
      const newData = { ...prev, name }
      
      // Auto-generate slug only for new categories (not when editing)
      if (!editingCategory) {
        const existingSlugs = categories.map(cat => cat.slug)
        newData.slug = generateUniqueSlug(name, existingSlugs)
      }
      
      return newData
    })
  }

  if (categoriesLoading) {
    return (
      <AdminProtectedRoute>
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-electric-violet"></div>
        </div>
      </AdminProtectedRoute>
    )
  }

  const stats = getCategoryStats()

  return (
    <AdminProtectedRoute>
      <AdminLayout>
        <Helmet>
          <title>Manage Categories - Admin - Studio Nullbyte</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>

      <div className="pb-6">
        <div className="w-full px-4 py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full"
          >
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Tag className="w-6 h-6 text-electric-violet" />
                  <h1 className="text-3xl font-mono text-white">Manage Categories</h1>
                </div>
                <button
                  onClick={openCreateForm}
                  className="flex items-center gap-2 bg-electric-violet hover:bg-electric-violet-dark px-4 py-2 rounded font-mono text-white transition-colors duration-200"
                >
                  <Plus className="w-4 h-4" />
                  Create Category
                </button>
              </div>
              <p className="text-gray-400 font-mono">
                Create and manage product categories
              </p>
            </div>

            {/* Status Messages */}
            {message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 bg-terminal-green/10 border border-terminal-green/30 rounded p-3 mb-6"
              >
                <CheckCircle className="w-4 h-4 text-terminal-green" />
                <span className="text-sm font-mono text-terminal-green">{message}</span>
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded p-3 mb-6"
              >
                <AlertCircle className="w-4 h-4 text-red-400" />
                <span className="text-sm font-mono text-red-400">{error}</span>
              </motion.div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-code-gray-light border border-gray-700 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <Tag className="w-8 h-8 text-electric-violet" />
                  <div>
                    <p className="text-2xl font-mono text-white font-bold">{stats.total}</p>
                    <p className="text-gray-400 font-mono text-sm">Total Categories</p>
                  </div>
                </div>
              </div>

              <div className="bg-code-gray-light border border-gray-700 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-8 h-8 text-terminal-green" />
                  <div>
                    <p className="text-2xl font-mono text-white font-bold">{stats.active}</p>
                    <p className="text-gray-400 font-mono text-sm">Active Categories</p>
                  </div>
                </div>
              </div>

              <div className="bg-code-gray-light border border-gray-700 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <X className="w-8 h-8 text-red-400" />
                  <div>
                    <p className="text-2xl font-mono text-white font-bold">{stats.inactive}</p>
                    <p className="text-gray-400 font-mono text-sm">Inactive Categories</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-code-gray-light border border-gray-700 rounded-lg p-6 mb-6">
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search categories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-code-gray border border-gray-600 pl-10 pr-4 py-2 rounded font-mono text-white placeholder-gray-500 focus:outline-none focus:border-electric-violet transition-colors"
                  />
                </div>

                {/* Results Count */}
                <div className="flex items-center justify-end">
                  <span className="font-mono text-gray-400 text-sm">
                    {filteredCategories.length} of {categories.length} categories
                  </span>
                </div>
              </div>
            </div>

            {/* Categories Table */}
            <div className="bg-code-gray-light border border-gray-700 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-code-gray border-b border-gray-700">
                    <tr>
                      <th className="text-left p-4 font-mono text-gray-300 text-sm">Name</th>
                      <th className="text-left p-4 font-mono text-gray-300 text-sm">Slug</th>
                      <th className="text-left p-4 font-mono text-gray-300 text-sm">Description</th>
                      <th className="text-left p-4 font-mono text-gray-300 text-sm">Status</th>
                      <th className="text-left p-4 font-mono text-gray-300 text-sm">Created</th>
                      <th className="text-left p-4 font-mono text-gray-300 text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCategories.map((category, index) => (
                      <motion.tr
                        key={category.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-gray-700 hover:bg-code-gray/50 transition-colors"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-electric-violet/20 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Tag className="w-4 h-4 text-electric-violet" />
                            </div>
                            <span className="font-mono text-white text-sm font-medium">
                              {category.name}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="font-mono text-gray-300 text-sm bg-code-gray px-2 py-1 rounded">
                            {category.slug}
                          </span>
                        </td>
                        <td className="p-4 max-w-xs">
                          <p className="font-mono text-gray-400 text-sm truncate" title={category.description || 'No description'}>
                            {category.description || 'No description'}
                          </p>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-mono border ${
                            category.is_active 
                              ? 'bg-terminal-green/20 text-terminal-green border-terminal-green/30' 
                              : 'bg-red-500/20 text-red-400 border-red-500/30'
                          }`}>
                            {category.is_active ? (
                              <>
                                <CheckCircle className="w-3 h-3" />
                                Active
                              </>
                            ) : (
                              <>
                                <X className="w-3 h-3" />
                                Inactive
                              </>
                            )}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="font-mono text-gray-400 text-sm">
                            {new Date(category.created_at).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openEditForm(category)}
                              className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs font-mono transition-colors"
                            >
                              <Edit3 className="w-3 h-3" />
                              Edit
                            </button>
                            
                            <button
                              onClick={() => handleDelete(category.id, category.name)}
                              className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs font-mono transition-colors"
                            >
                              <Trash2 className="w-3 h-3" />
                              Delete
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {filteredCategories.length === 0 && (
              <div className="text-center py-12">
                <Tag className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-mono text-gray-400 mb-2">No categories found</h3>
                <p className="text-gray-500 font-mono text-sm">
                  {searchTerm ? 'Try adjusting your search' : 'Create your first category to get started'}
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Category Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-code-gray-light border border-gray-700 rounded-lg w-full max-w-md"
          >
            <form onSubmit={handleSubmit} className="p-6">
              {/* Form Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-mono text-white">
                  {editingCategory ? 'Edit Category' : 'Create New Category'}
                </h2>
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-mono text-gray-300 mb-2">
                    Category Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="w-full bg-code-gray border border-gray-600 px-4 py-3 rounded font-mono text-white placeholder-gray-500 focus:outline-none focus:border-electric-violet transition-colors"
                    placeholder="Enter category name"
                    required
                  />
                </div>

                {/* Slug */}
                <div>
                  <label className="block text-sm font-mono text-gray-300 mb-2">
                    URL Slug <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    className="w-full bg-code-gray border border-gray-600 px-4 py-3 rounded font-mono text-white placeholder-gray-500 focus:outline-none focus:border-electric-violet transition-colors"
                    placeholder="url-friendly-slug"
                    required
                  />
                  <p className="text-gray-500 font-mono text-xs mt-1">
                    Auto-generated from name. Used in URLs (e.g., /category/web-templates)
                  </p>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-mono text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full bg-code-gray border border-gray-600 px-4 py-3 rounded font-mono text-white placeholder-gray-500 focus:outline-none focus:border-electric-violet transition-colors resize-none"
                    placeholder="Enter category description"
                    rows={3}
                  />
                </div>

                {/* Active Status */}
                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                      className="w-4 h-4 text-electric-violet bg-code-gray border-gray-600 rounded focus:ring-electric-violet focus:ring-2"
                    />
                    <span className="font-mono text-white text-sm">Active Category</span>
                  </label>
                  <p className="text-gray-500 font-mono text-xs mt-1">
                    Inactive categories won't be shown to users
                  </p>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center gap-3 mt-8 pt-6 border-t border-gray-700">
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex items-center gap-2 bg-electric-violet hover:bg-electric-violet-light disabled:opacity-50 disabled:cursor-not-allowed text-white font-mono py-3 px-6 rounded transition-colors"
                >
                  <Save className="w-4 h-4" />
                  {formLoading ? (editingCategory ? 'Updating...' : 'Creating...') : (editingCategory ? 'Update Category' : 'Create Category')}
                </button>
                
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-mono py-3 px-6 rounded transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
      </AdminLayout>
    </AdminProtectedRoute>
  )
}
