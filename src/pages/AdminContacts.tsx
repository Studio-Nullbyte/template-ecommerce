import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { 
  Mail, 
  Search, 
  Eye,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Calendar,
  User,
  Filter
} from 'lucide-react'
import { useAdmin } from '../hooks/useAdmin'
import AdminLayout from '../components/AdminLayout'
import AdminProtectedRoute from '../components/AdminProtectedRoute'

interface ContactSubmission {
  id: string
  name: string
  email: string
  subject: string
  message: string
  submitted_at: string
  status: 'new' | 'in_progress' | 'resolved'
}

export default function AdminContacts() {
  const { isAdmin, getContactSubmissions, updateContactSubmissionStatus } = useAdmin()
  
  const [contacts, setContacts] = useState<ContactSubmission[]>([])
  const [filteredContacts, setFilteredContacts] = useState<ContactSubmission[]>([])
  const [contactsLoading, setContactsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedContact, setSelectedContact] = useState<ContactSubmission | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  // Remove the problematic redirect - AdminProtectedRoute will handle it

  useEffect(() => {
    const fetchContacts = async () => {
      if (isAdmin) {
        try {
          const contactsData = await getContactSubmissions()
          setContacts(contactsData)
        } catch (error) {
          console.error('AdminContacts: Error fetching contacts:', error)
          setError('Failed to load contact submissions: ' + (error instanceof Error ? error.message : String(error)))
        } finally {
          setContactsLoading(false)
        }
      } else {
        setContactsLoading(false)
      }
    }

    fetchContacts()
  }, [isAdmin, getContactSubmissions])

  // Filter contacts
  useEffect(() => {
    let filtered = contacts

    if (statusFilter !== 'all') {
      filtered = filtered.filter(contact => contact.status === statusFilter)
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(contact => 
        contact.name.toLowerCase().includes(term) ||
        contact.email.toLowerCase().includes(term) ||
        contact.subject.toLowerCase().includes(term) ||
        contact.message.toLowerCase().includes(term)
      )
    }

    setFilteredContacts(filtered)
  }, [contacts, searchTerm, statusFilter])

  const handleStatusChange = async (contactId: string, newStatus: 'new' | 'in_progress' | 'resolved') => {
    try {
      const result = await updateContactSubmissionStatus(contactId, newStatus)
      
      if (result.error) {
        setError('Failed to update status: ' + (result.error instanceof Error ? result.error.message : String(result.error)))
      } else {
        setMessage('Status updated successfully!')
        
        // Update local state
        setContacts(contacts.map(contact => 
          contact.id === contactId 
            ? { ...contact, status: newStatus }
            : contact
        ))
        
        // Update selected contact if it's the one being updated
        if (selectedContact?.id === contactId) {
          setSelectedContact({ ...selectedContact, status: newStatus })
        }
        
        // Close the modal after successful status update
        setTimeout(() => {
          setMessage('')
          closeDetailModal()
        }, 1500) // Show success message briefly before closing
      }
    } catch (error) {
      console.error('❌ AdminContacts: Unexpected error during status change', error)
      setError('An unexpected error occurred: ' + (error instanceof Error ? error.message : String(error)))
    }
  }

  const openContactDetail = (contact: ContactSubmission) => {
    setSelectedContact(contact)
    setIsDetailModalOpen(true)
    
    // Mark as in_progress if it's new (since 'read' is not a valid enum value)
    if (contact.status === 'new') {
      handleStatusChange(contact.id, 'in_progress')
    }
  }

  const closeDetailModal = () => {
    setSelectedContact(null)
    setIsDetailModalOpen(false)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-mono bg-blue-500/20 text-blue-400 border border-blue-500/30">
            <MessageSquare className="w-3 h-3" />
            New
          </span>
        )
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-mono bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
            <Clock className="w-3 h-3" />
            In Progress
          </span>
        )
      case 'resolved':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-mono bg-terminal-green/20 text-terminal-green border border-terminal-green/30">
            <CheckCircle className="w-3 h-3" />
            Resolved
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-mono bg-gray-500/20 text-gray-400 border border-gray-500/30">
            {status}
          </span>
        )
    }
  }

  const getContactStats = () => {
    return {
      total: contacts.length,
      new: contacts.filter(c => c.status === 'new').length,
      in_progress: contacts.filter(c => c.status === 'in_progress').length,
      resolved: contacts.filter(c => c.status === 'resolved').length
    }
  }

  if (contactsLoading) {
    return (
      <AdminProtectedRoute>
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-electric-violet"></div>
        </div>
      </AdminProtectedRoute>
    )
  }

  const stats = getContactStats()

  return (
    <AdminProtectedRoute>
      <AdminLayout>
        <Helmet>
          <title>Contact Messages - Admin - Studio Nullbyte</title>
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
              <div className="flex items-center gap-3 mb-4">
                <Mail className="w-6 h-6 text-electric-violet" />
                <h1 className="text-3xl font-mono text-white">Contact Messages</h1>
              </div>
              <p className="text-gray-400 font-mono">
                Review and respond to customer inquiries
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
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              <div className="bg-code-gray-light border border-gray-700 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <Mail className="w-6 h-6 text-electric-violet" />
                  <div>
                    <p className="text-xl font-mono text-white font-bold">{stats.total}</p>
                    <p className="text-gray-400 font-mono text-xs">Total</p>
                  </div>
                </div>
              </div>

              <div className="bg-code-gray-light border border-gray-700 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-6 h-6 text-blue-400" />
                  <div>
                    <p className="text-xl font-mono text-white font-bold">{stats.new}</p>
                    <p className="text-gray-400 font-mono text-xs">New</p>
                  </div>
                </div>
              </div>

              <div className="bg-code-gray-light border border-gray-700 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-6 h-6 text-yellow-400" />
                  <div>
                    <p className="text-xl font-mono text-white font-bold">{stats.in_progress}</p>
                    <p className="text-gray-400 font-mono text-xs">In Progress</p>
                  </div>
                </div>
              </div>

              <div className="bg-code-gray-light border border-gray-700 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-terminal-green" />
                  <div>
                    <p className="text-xl font-mono text-white font-bold">{stats.resolved}</p>
                    <p className="text-gray-400 font-mono text-xs">Resolved</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-code-gray-light border border-gray-700 rounded-lg p-6 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search contacts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-code-gray border border-gray-600 pl-10 pr-4 py-2 rounded font-mono text-white placeholder-gray-500 focus:outline-none focus:border-electric-violet transition-colors"
                  />
                </div>

                {/* Status Filter */}
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-code-gray border border-gray-600 pl-10 pr-8 py-2 rounded font-mono text-white focus:outline-none focus:border-electric-violet transition-colors appearance-none"
                  >
                    <option value="all">All Status</option>
                    <option value="new">New</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Contacts List */}
            <div className="bg-code-gray-light border border-gray-700 rounded-lg overflow-hidden">
              {filteredContacts.length > 0 ? (
                <div className="divide-y divide-gray-700">
                  {filteredContacts.map((contact, index) => (
                    <motion.div
                      key={contact.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-6 hover:bg-code-gray transition-colors cursor-pointer"
                      onClick={() => openContactDetail(contact)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-electric-violet/20 rounded-lg flex items-center justify-center">
                            <User className="w-5 h-5 text-electric-violet" />
                          </div>
                          <div>
                            <h3 className="font-mono text-white text-lg">{contact.name}</h3>
                            <p className="text-gray-400 font-mono text-sm">{contact.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {getStatusBadge(contact.status)}
                          <Eye className="w-4 h-4 text-gray-400" />
                        </div>
                      </div>

                      <h4 className="font-mono text-white text-base mb-2">{contact.subject}</h4>
                      
                      <p className="text-gray-400 font-mono text-sm mb-3 line-clamp-2">
                        {contact.message}
                      </p>

                      <div className="flex items-center gap-4 text-xs font-mono text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(contact.submitted_at).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(contact.submitted_at).toLocaleTimeString()}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Mail className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-mono text-gray-400 mb-2">No contact messages found</h3>
                  <p className="text-gray-500 font-mono text-sm">
                    {searchTerm || statusFilter !== 'all' ? 'Try adjusting your filters' : 'No messages have been submitted yet'}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Contact Detail Modal */}
      {isDetailModalOpen && selectedContact && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-code-gray-light border border-gray-700 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-mono text-white">Contact Details</h2>
                <button
                  onClick={closeDetailModal}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Contact Info */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-electric-violet" />
                  <div>
                    <p className="text-sm font-mono text-gray-400">Name</p>
                    <p className="text-white font-mono">{selectedContact.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-electric-violet" />
                  <div>
                    <p className="text-sm font-mono text-gray-400">Email</p>
                    <p className="text-white font-mono">{selectedContact.email}</p>
                    <a 
                      href={`mailto:${selectedContact.email}`}
                      className="text-electric-violet hover:text-electric-violet-light font-mono text-sm flex items-center gap-1 mt-1"
                    >
                      Reply via email <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MessageSquare className="w-5 h-5 text-electric-violet" />
                  <div>
                    <p className="text-sm font-mono text-gray-400">Subject</p>
                    <p className="text-white font-mono">{selectedContact.subject}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-electric-violet" />
                  <div>
                    <p className="text-sm font-mono text-gray-400">Submitted</p>
                    <p className="text-white font-mono">
                      {new Date(selectedContact.submitted_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Message */}
              <div className="mb-6">
                <p className="text-sm font-mono text-gray-400 mb-2">Message</p>
                <div className="bg-code-gray border border-gray-600 rounded p-4">
                  <p className="text-white font-mono text-sm whitespace-pre-wrap">
                    {selectedContact.message}
                  </p>
                </div>
              </div>

              {/* Status Controls */}
              <div className="border-t border-gray-700 pt-6">
                <p className="text-sm font-mono text-gray-400 mb-3">Update Status</p>
                <div className="flex flex-wrap gap-2">
                  {(['new', 'in_progress', 'resolved'] as const).map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(selectedContact.id, status)}
                      disabled={selectedContact.status === status}
                      className={`px-3 py-2 rounded font-mono text-sm transition-colors ${
                        selectedContact.status === status
                          ? 'bg-electric-violet text-white cursor-not-allowed'
                          : 'bg-gray-600 hover:bg-gray-700 text-white'
                      }`}
                    >
                      Mark as {status === 'in_progress' ? 'In Progress' : status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
      </AdminLayout>
    </AdminProtectedRoute>
  )
}
