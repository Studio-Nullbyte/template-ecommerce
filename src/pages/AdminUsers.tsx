import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { 
  Users, 
  Search, 
  Filter,
  Edit3, 
  Trash2,
  Shield,
  ShieldCheck,
  Mail,
  Calendar,
  AlertCircle,
  CheckCircle,
  Save,
  X,
  Crown,
  User as UserIcon
} from 'lucide-react'
import { useAdmin } from '../hooks/useAdmin'
import { useNavigate } from 'react-router-dom'
import AdminLayout from '../components/AdminLayout'

interface AdminUser {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  avatar_url: string | null
  role: 'user' | 'admin'
  is_active: boolean
  created_at: string
  last_sign_in_at: string | null | undefined
  email_confirmed_at: string | null | undefined
}

export default function AdminUsers() {
  const { isAdmin, loading, getUsers, updateUser, deleteUser } = useAdmin()
  const navigate = useNavigate()
  
  const [users, setUsers] = useState<AdminUser[]>([])
  const [filteredUsers, setFilteredUsers] = useState<AdminUser[]>([])
  const [usersLoading, setUsersLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null)
  const [formLoading, setFormLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  // Form state
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    role: 'user' as 'user' | 'admin',
    is_active: true
  })

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate('/')
    }
  }, [isAdmin, loading, navigate])

  useEffect(() => {
    const fetchUsers = async () => {
      if (isAdmin) {
        try {
          const usersData = await getUsers()
          setUsers(usersData)
        } catch (error) {
          setError('Failed to load users')
        } finally {
          setUsersLoading(false)
        }
      }
    }

    fetchUsers()
  }, [isAdmin, getUsers])

  // Filter users
  useEffect(() => {
    let filtered = users

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(user => 
        user.email.toLowerCase().includes(term) ||
        (user.first_name && user.first_name.toLowerCase().includes(term)) ||
        (user.last_name && user.last_name.toLowerCase().includes(term))
      )
    }

    if (roleFilter) {
      filtered = filtered.filter(user => user.role === roleFilter)
    }

    if (statusFilter) {
      if (statusFilter === 'active') {
        filtered = filtered.filter(user => user.is_active)
      } else if (statusFilter === 'inactive') {
        filtered = filtered.filter(user => !user.is_active)
      } else if (statusFilter === 'verified') {
        filtered = filtered.filter(user => user.email_confirmed_at !== null)
      } else if (statusFilter === 'unverified') {
        filtered = filtered.filter(user => user.email_confirmed_at === null)
      }
    }

    setFilteredUsers(filtered)
  }, [users, searchTerm, roleFilter, statusFilter])

  const resetForm = () => {
    setFormData({
      first_name: '',
      last_name: '',
      role: 'user',
      is_active: true
    })
    setEditingUser(null)
    setIsFormOpen(false)
    setError('')
    setMessage('')
  }

  const openEditForm = (user: AdminUser) => {
    setFormData({
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      role: user.role,
      is_active: user.is_active
    })
    setEditingUser(user)
    setIsFormOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormLoading(true)
    setError('')

    if (!editingUser) {
      setError('No user selected for editing')
      setFormLoading(false)
      return
    }

    try {
      const userData = {
        first_name: formData.first_name.trim() || null,
        last_name: formData.last_name.trim() || null,
        role: formData.role,
        is_active: formData.is_active
      }

      const result = await updateUser(editingUser.id, userData)

      if (result.error) {
        setError('Failed to update user')
      } else {
        setMessage('User updated successfully!')
        
        // Update local state
        setUsers(users.map(user => 
          user.id === editingUser.id 
            ? { ...user, ...userData }
            : user
        ))
        
        setTimeout(() => {
          resetForm()
        }, 1500)
      }
    } catch (error: any) {
      setError(error.message || 'An unexpected error occurred')
    } finally {
      setFormLoading(false)
    }
  }

  const handleDelete = async (userId: string, userEmail: string) => {
    if (!confirm(`Are you sure you want to delete user "${userEmail}"? This action cannot be undone.`)) {
      return
    }

    try {
      const result = await deleteUser(userId)
      if (result.error) {
        setError('Failed to delete user')
      } else {
        setMessage('User deleted successfully!')
        
        // Remove from local state
        setUsers(users.filter(u => u.id !== userId))
      }
    } catch (error) {
      setError('An unexpected error occurred')
    }
  }

  const getUserDisplayName = (user: AdminUser) => {
    if (user.first_name || user.last_name) {
      return `${user.first_name || ''} ${user.last_name || ''}`.trim()
    }
    return user.email.split('@')[0]
  }

  const getUserStats = () => {
    return {
      total: users.length,
      active: users.filter(u => u.is_active).length,
      admins: users.filter(u => u.role === 'admin').length,
      verified: users.filter(u => u.email_confirmed_at !== null).length
    }
  }

  if (loading || usersLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-electric-violet"></div>
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  const stats = getUserStats()

  return (
    <AdminLayout>
      <Helmet>
        <title>Manage Users - Admin - Studio Nullbyte</title>
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
                  <Users className="w-6 h-6 text-electric-violet" />
                  <h1 className="text-3xl font-mono text-white">Manage Users</h1>
                </div>
              </div>
              <p className="text-gray-400 font-mono">
                View and manage user accounts and permissions
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="bg-code-gray-light border border-gray-700 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <Users className="w-8 h-8 text-electric-violet" />
                  <div>
                    <p className="text-2xl font-mono text-white font-bold">{stats.total}</p>
                    <p className="text-gray-400 font-mono text-sm">Total Users</p>
                  </div>
                </div>
              </div>

              <div className="bg-code-gray-light border border-gray-700 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-8 h-8 text-terminal-green" />
                  <div>
                    <p className="text-2xl font-mono text-white font-bold">{stats.active}</p>
                    <p className="text-gray-400 font-mono text-sm">Active Users</p>
                  </div>
                </div>
              </div>

              <div className="bg-code-gray-light border border-gray-700 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <Crown className="w-8 h-8 text-yellow-500" />
                  <div>
                    <p className="text-2xl font-mono text-white font-bold">{stats.admins}</p>
                    <p className="text-gray-400 font-mono text-sm">Administrators</p>
                  </div>
                </div>
              </div>

              <div className="bg-code-gray-light border border-gray-700 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-8 h-8 text-blue-500" />
                  <div>
                    <p className="text-2xl font-mono text-white font-bold">{stats.verified}</p>
                    <p className="text-gray-400 font-mono text-sm">Verified Emails</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-code-gray-light border border-gray-700 rounded-lg p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-code-gray border border-gray-600 pl-10 pr-4 py-2 rounded font-mono text-white placeholder-gray-500 focus:outline-none focus:border-electric-violet transition-colors"
                  />
                </div>

                {/* Role Filter */}
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="w-full bg-code-gray border border-gray-600 pl-10 pr-4 py-2 rounded font-mono text-white focus:outline-none focus:border-electric-violet transition-colors appearance-none"
                  >
                    <option value="">All Roles</option>
                    <option value="user">Users</option>
                    <option value="admin">Admins</option>
                  </select>
                </div>

                {/* Status Filter */}
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full bg-code-gray border border-gray-600 pl-10 pr-4 py-2 rounded font-mono text-white focus:outline-none focus:border-electric-violet transition-colors appearance-none"
                  >
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="verified">Verified</option>
                    <option value="unverified">Unverified</option>
                  </select>
                </div>

                {/* Results Count */}
                <div className="flex items-center justify-end">
                  <span className="font-mono text-gray-400 text-sm">
                    {filteredUsers.length} of {users.length} users
                  </span>
                </div>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-code-gray-light border border-gray-700 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-code-gray border-b border-gray-700">
                    <tr>
                      <th className="text-left p-4 font-mono text-gray-300 text-sm">User</th>
                      <th className="text-left p-4 font-mono text-gray-300 text-sm">Email</th>
                      <th className="text-left p-4 font-mono text-gray-300 text-sm">Role</th>
                      <th className="text-left p-4 font-mono text-gray-300 text-sm">Status</th>
                      <th className="text-left p-4 font-mono text-gray-300 text-sm">Joined</th>
                      <th className="text-left p-4 font-mono text-gray-300 text-sm">Last Sign In</th>
                      <th className="text-left p-4 font-mono text-gray-300 text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user, index) => (
                      <motion.tr
                        key={user.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-gray-700/50 hover:bg-code-gray/50 transition-colors"
                      >
                        {/* User Info */}
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-electric-violet/20 rounded-full flex items-center justify-center">
                              {user.avatar_url ? (
                                <img
                                  src={user.avatar_url}
                                  alt={getUserDisplayName(user)}
                                  className="w-8 h-8 rounded-full object-cover"
                                />
                              ) : (
                                <UserIcon className="w-4 h-4 text-electric-violet" />
                              )}
                            </div>
                            <div>
                              <p className="font-mono text-white text-sm">
                                {getUserDisplayName(user)}
                              </p>
                              {user.role === 'admin' && (
                                <div className="flex items-center gap-1 mt-1">
                                  <Crown className="w-3 h-3 text-yellow-500" />
                                  <span className="text-xs font-mono text-yellow-500">Admin</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Email */}
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span className="font-mono text-white text-sm">{user.email}</span>
                            {user.email_confirmed_at && (
                              <CheckCircle className="w-4 h-4 text-terminal-green" />
                            )}
                          </div>
                        </td>

                        {/* Role */}
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-mono ${
                            user.role === 'admin' 
                              ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                              : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          }`}>
                            {user.role === 'admin' ? (
                              <Shield className="w-3 h-3" />
                            ) : (
                              <UserIcon className="w-3 h-3" />
                            )}
                            {user.role}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-mono ${
                              user.is_active 
                                ? 'bg-terminal-green/20 text-terminal-green border border-terminal-green/30'
                                : 'bg-red-500/20 text-red-400 border border-red-500/30'
                            }`}>
                              {user.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </td>

                        {/* Joined Date */}
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="font-mono text-gray-300 text-sm">
                              {new Date(user.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </td>

                        {/* Last Sign In */}
                        <td className="p-4">
                          <span className="font-mono text-gray-300 text-sm">
                            {user.last_sign_in_at 
                              ? new Date(user.last_sign_in_at).toLocaleDateString()
                              : 'Never'
                            }
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openEditForm(user)}
                              className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs font-mono transition-colors"
                            >
                              <Edit3 className="w-3 h-3" />
                              Edit
                            </button>
                            
                            <button
                              onClick={() => handleDelete(user.id, user.email)}
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

              {filteredUsers.length === 0 && (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-mono text-gray-400 mb-2">No users found</h3>
                  <p className="text-gray-500 font-mono text-sm">
                    {searchTerm || roleFilter || statusFilter ? 'Try adjusting your filters' : 'No users have registered yet'}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* User Edit Form Modal */}
      {isFormOpen && editingUser && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-code-gray-light border border-gray-700 rounded-lg w-full max-w-md"
          >
            <form onSubmit={handleSubmit} className="p-6">
              {/* Form Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-mono text-white">Edit User</h2>
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* User Info */}
              <div className="bg-code-gray border border-gray-600 rounded p-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-electric-violet/20 rounded-full flex items-center justify-center">
                    {editingUser.avatar_url ? (
                      <img
                        src={editingUser.avatar_url}
                        alt={getUserDisplayName(editingUser)}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <UserIcon className="w-5 h-5 text-electric-violet" />
                    )}
                  </div>
                  <div>
                    <p className="font-mono text-white">{editingUser.email}</p>
                    <p className="font-mono text-gray-400 text-sm">
                      Joined {new Date(editingUser.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                {/* First Name */}
                <div>
                  <label className="block text-sm font-mono text-gray-300 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={formData.first_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                    className="w-full bg-code-gray border border-gray-600 px-4 py-3 rounded font-mono text-white placeholder-gray-500 focus:outline-none focus:border-electric-violet transition-colors"
                    placeholder="Enter first name"
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-mono text-gray-300 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={formData.last_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                    className="w-full bg-code-gray border border-gray-600 px-4 py-3 rounded font-mono text-white placeholder-gray-500 focus:outline-none focus:border-electric-violet transition-colors"
                    placeholder="Enter last name"
                  />
                </div>

                {/* Role */}
                <div>
                  <label className="block text-sm font-mono text-gray-300 mb-2">
                    Role
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as 'user' | 'admin' }))}
                    className="w-full bg-code-gray border border-gray-600 px-4 py-3 rounded font-mono text-white focus:outline-none focus:border-electric-violet transition-colors"
                  >
                    <option value="user">User</option>
                    <option value="admin">Administrator</option>
                  </select>
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
                    <span className="font-mono text-white text-sm">Active User</span>
                  </label>
                  <p className="text-gray-500 font-mono text-xs mt-1">
                    Inactive users cannot sign in to their account
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
                  {formLoading ? 'Saving...' : 'Update User'}
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
  )
}
