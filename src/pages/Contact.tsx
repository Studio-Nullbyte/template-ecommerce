import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, Mail, MessageCircle, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import { submitContactForm } from '../lib/supabase'
import SEO from '../components/SEO'

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setSubmitStatus('idle')
    
    try {
      const { error } = await submitContactForm(formData)
      
      if (error) {
        setSubmitStatus('error')
        setErrorMessage(error.message)
      } else {
        setSubmitStatus('success')
        setFormData({ name: '', email: '', subject: '', message: '' })
      }
    } catch (err) {
      setSubmitStatus('error')
      setErrorMessage(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email",
      content: "studionullbyte@gmail.com",
      link: "mailto:studionullbyte@gmail.com"
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: "Live Chat",
      content: "Available 24/7",
      link: "#"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Response Time",
      content: "Usually within 24 hours",
      link: null
    }
  ]

  const faqs = [
    {
      question: "How do I download my purchased templates?",
      answer: "After purchase, you'll receive an email with download links. You can also access your downloads from your account dashboard."
    },
    {
      question: "Do you offer refunds?",
      answer: "Yes, we offer a 30-day money-back guarantee if you're not satisfied with your purchase."
    },
    {
      question: "Can I use these templates for commercial projects?",
      answer: "Absolutely! All our templates come with commercial licenses unless otherwise specified."
    },
    {
      question: "Do you provide customization services?",
      answer: "Yes, we offer custom development services. Contact us to discuss your specific requirements."
    }
  ]

  const structuredData = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact Studio Nullbyte",
    "description": "Get in touch with Studio Nullbyte. We're here to help with your questions and projects.",
    "url": "https://studio-nullbyte.github.io/contact",
    "publisher": {
      "@type": "Organization",
      "name": "Studio Nullbyte"
    }
  }, null, 2)

  return (
    <>
      <SEO
        title="Contact - Studio Nullbyte"
        description="Get in touch with Studio Nullbyte. We're here to help with your questions, custom projects, and support requests."
        keywords="contact studio nullbyte, support, custom projects, help, customer service"
        url="/contact"
        type="website"
        structuredData={structuredData}
      />

      <div className="min-h-screen pt-16 sm:pt-20">
        {/* Hero Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-code-gray">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl sm:text-4xl lg:text-5xl font-mono font-bold mb-4 sm:mb-6"
              >
                Get in <span className="text-electric-violet">Touch</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-base sm:text-lg lg:text-xl text-gray-400 mb-6 sm:mb-8 px-4"
              >
                Have questions about our products or need custom development? We're here to help.
              </motion.p>
            </div>
          </div>
        </section>

        {/* Contact Form & Info */}
        <section className="py-12 sm:py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="text-2xl font-mono font-bold mb-6">
                  Send us a Message
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-mono text-gray-300 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-code-gray border border-gray-700 rounded-sm focus:border-electric-violet focus:outline-none font-mono"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-mono text-gray-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-code-gray border border-gray-700 rounded-sm focus:border-electric-violet focus:outline-none font-mono"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-mono text-gray-300 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-code-gray border border-gray-700 rounded-sm focus:border-electric-violet focus:outline-none font-mono"
                      placeholder="What's this about?"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-mono text-gray-300 mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 bg-code-gray border border-gray-700 rounded-sm focus:border-electric-violet focus:outline-none font-mono resize-none"
                      placeholder="Tell us more about your project or question..."
                    />
                  </div>
                  
                  {/* Status Messages */}
                  {submitStatus === 'success' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center space-x-2 text-terminal-green bg-terminal-green/10 border border-terminal-green/20 rounded-sm p-3"
                    >
                      <CheckCircle className="w-5 h-5" />
                      <span className="text-sm font-mono">Message sent successfully! We'll get back to you soon.</span>
                    </motion.div>
                  )}
                  
                  {submitStatus === 'error' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center space-x-2 text-red-400 bg-red-400/10 border border-red-400/20 rounded-sm p-3"
                    >
                      <AlertCircle className="w-5 h-5" />
                      <span className="text-sm font-mono">{errorMessage || 'Failed to send message. Please try again.'}</span>
                    </motion.div>
                  )}
                  
                  <button 
                    type="submit" 
                    disabled={submitting}
                    className={`btn-primary flex w-full ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <Send className={`w-5 h-5 mr-2 ${submitting ? 'animate-pulse' : ''}`} />
                    {submitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </motion.div>

              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h2 className="text-2xl font-mono font-bold mb-6">
                  Other Ways to Reach Us
                </h2>
                <div className="space-y-6">
                  {contactInfo.map((info, index) => (
                    <div key={index} className="card">
                      <div className="flex items-start gap-4">
                        <div className="text-electric-violet">
                          {info.icon}
                        </div>
                        <div>
                          <h3 className="font-mono font-bold mb-1">
                            {info.title}
                          </h3>
                          {info.link ? (
                            <a
                              href={info.link}
                              className="text-gray-400 hover:text-electric-violet transition-colors"
                            >
                              {info.content}
                            </a>
                          ) : (
                            <p className="text-gray-400">{info.content}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 p-6 bg-code-gray rounded-sm border border-gray-800">
                  <h3 className="font-mono font-bold mb-3">
                    Quick Response Promise
                  </h3>
                  <p className="text-gray-400 text-sm">
                    We typically respond to all inquiries within 24 hours during business days. 
                    For urgent matters, please include "URGENT" in your subject line.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-code-gray">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-mono font-bold text-center mb-12">
                Frequently Asked <span className="text-electric-violet">Questions</span>
              </h2>
              <div className="space-y-6">
                {faqs.map((faq, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="card"
                  >
                    <h3 className="font-mono font-bold text-lg mb-3">
                      {faq.question}
                    </h3>
                    <p className="text-gray-400">
                      {faq.answer}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default Contact
