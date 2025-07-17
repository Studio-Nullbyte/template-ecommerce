import React from 'react'
import { motion } from 'framer-motion'
import { Shield, Eye, Lock, Database, Users, Mail, Settings, AlertTriangle, Globe, Clock, FileText } from 'lucide-react'
import SEO from '../components/SEO'

const PrivacyPolicy: React.FC = () => {
  const lastUpdated = "January 2025"

  const sections = [
    {
      id: 'information-collection',
      title: 'Information We Collect',
      icon: <Database className="w-5 h-5" />,
      content: [
        {
          subtitle: 'Account Information',
          items: [
            'Full name and email address (required for registration)',
            'Password (encrypted and never stored in plain text)',
            'Profile information (avatar, display preferences)',
            'Account verification status and authentication metadata'
          ]
        },
        {
          subtitle: 'Payment Information',
          items: [
            'Billing address and contact information',
            'Payment method details (processed securely by PayPal and Square)',
            'Transaction history and order information',
            'Download history and purchase records'
          ]
        },
        {
          subtitle: 'Communication Data',
          items: [
            'Contact form submissions (name, email, subject, message)',
            'Live chat conversations through Crisp Chat',
            'Email communications and support tickets',
            'User feedback and product reviews'
          ]
        },
        {
          subtitle: 'Technical Information',
          items: [
            'IP address and geographic location',
            'Device information and browser type',
            'Usage analytics and site interaction data',
            'Session data and authentication tokens'
          ]
        }
      ]
    },
    {
      id: 'information-usage',
      title: 'How We Use Your Information',
      icon: <Settings className="w-5 h-5" />,
      content: [
        {
          subtitle: 'Core Services',
          items: [
            'Account creation and authentication',
            'Processing payments and delivering digital products',
            'Providing customer support and responding to inquiries',
            'Sending order confirmations and download links via email'
          ]
        },
        {
          subtitle: 'Platform Improvement',
          items: [
            'Analyzing usage patterns to improve user experience',
            'Monitoring site performance and security',
            'Developing new features and products',
            'Preventing fraud and ensuring platform security'
          ]
        },
        {
          subtitle: 'Communications',
          items: [
            'Sending transactional emails (order confirmations, password resets)',
            'Providing customer support through multiple channels',
            'Notifying users of important account or service changes',
            'Responding to contact form submissions and support requests'
          ]
        }
      ]
    },
    {
      id: 'data-sharing',
      title: 'Information Sharing',
      icon: <Users className="w-5 h-5" />,
      content: [
        {
          subtitle: 'Third-Party Services',
          items: [
            'Supabase (database hosting and authentication)',
            'PayPal and Square (payment processing)',
            'Crisp Chat (live customer support)',
            'EmailJS (automated email delivery)',
            'GitHub Pages (website hosting)'
          ]
        },
        {
          subtitle: 'We Never Share',
          items: [
            'Personal information with advertisers or marketers',
            'User data with unauthorized third parties',
            'Payment information (handled directly by payment processors)',
            'Private communications or sensitive account details'
          ]
        },
        {
          subtitle: 'Legal Requirements',
          items: [
            'We may disclose information if required by law',
            'To protect our rights and prevent fraud',
            'To comply with legal processes or government requests',
            'To protect the safety of our users and platform'
          ]
        }
      ]
    },
    {
      id: 'data-security',
      title: 'Data Security',
      icon: <Lock className="w-5 h-5" />,
      content: [
        {
          subtitle: 'Security Measures',
          items: [
            'HTTPS encryption for all data transmission',
            'Row Level Security (RLS) policies on all database tables',
            'Secure authentication through Supabase Auth',
            'Regular security audits and monitoring'
          ]
        },
        {
          subtitle: 'Payment Security',
          items: [
            'PCI-compliant payment processing through PayPal and Square',
            'No storage of credit card information on our servers',
            'Tokenized payment methods for enhanced security',
            'Secure transaction logging and monitoring'
          ]
        },
        {
          subtitle: 'Access Controls',
          items: [
            'Role-based access control for admin functions',
            'User-specific data access restrictions',
            'Regular security updates and patches',
            'Secure session management and token handling'
          ]
        }
      ]
    },
    {
      id: 'user-rights',
      title: 'Your Rights',
      icon: <Shield className="w-5 h-5" />,
      content: [
        {
          subtitle: 'Account Control',
          items: [
            'Access and update your profile information',
            'Change your password and security settings',
            'Download your purchase history and data',
            'Delete your account and associated data'
          ]
        },
        {
          subtitle: 'Data Rights',
          items: [
            'Request a copy of your personal data',
            'Correct inaccurate or incomplete information',
            'Request deletion of your personal data',
            'Restrict or object to data processing'
          ]
        },
        {
          subtitle: 'Communication Preferences',
          items: [
            'Opt out of non-essential communications',
            'Control email notification preferences',
            'Manage live chat availability',
            'Update contact information and preferences'
          ]
        }
      ]
    },
    {
      id: 'cookies',
      title: 'Cookies & Tracking',
      icon: <Eye className="w-5 h-5" />,
      content: [
        {
          subtitle: 'Essential Cookies',
          items: [
            'Authentication and session management',
            'Shopping cart and checkout functionality',
            'Security and fraud prevention',
            'Site preferences and user settings'
          ]
        },
        {
          subtitle: 'Analytics',
          items: [
            'Usage analytics to improve site performance',
            'Error tracking and debugging information',
            'Feature usage and user interaction data',
            'Site optimization and A/B testing'
          ]
        },
        {
          subtitle: 'Third-Party Cookies',
          items: [
            'Payment processor cookies (PayPal, Square)',
            'Live chat functionality (Crisp Chat)',
            'External service integrations',
            'Social media and sharing features'
          ]
        }
      ]
    },
    {
      id: 'international',
      title: 'International Users',
      icon: <Globe className="w-5 h-5" />,
      content: [
        {
          subtitle: 'Data Transfers',
          items: [
            'Data is processed in the United States',
            'We comply with international data protection laws',
            'Adequate safeguards are in place for data transfers',
            'Users consent to international data processing'
          ]
        },
        {
          subtitle: 'Regional Compliance',
          items: [
            'GDPR compliance for European users',
            'CCPA compliance for California residents',
            'Adherence to local data protection regulations',
            'Regular compliance audits and updates'
          ]
        }
      ]
    },
    {
      id: 'data-retention',
      title: 'Data Retention',
      icon: <Clock className="w-5 h-5" />,
      content: [
        {
          subtitle: 'Retention Periods',
          items: [
            'Account data: Retained while account is active',
            'Transaction records: 7 years for tax and legal purposes',
            'Support communications: 3 years for service improvement',
            'Analytics data: Anonymized and retained for 2 years'
          ]
        },
        {
          subtitle: 'Data Deletion',
          items: [
            'Users can request immediate account deletion',
            'Automated deletion of expired session data',
            'Secure deletion of payment information',
            'Retention of minimal data for legal compliance'
          ]
        }
      ]
    },
    {
      id: 'children',
      title: 'Children\'s Privacy',
      icon: <AlertTriangle className="w-5 h-5" />,
      content: [
        {
          subtitle: 'Age Requirements',
          items: [
            'Studio Nullbyte is not intended for children under 13',
            'We do not knowingly collect data from children',
            'Users must be 18 or older to make purchases',
            'Parents can request deletion of child data'
          ]
        }
      ]
    },
    {
      id: 'changes',
      title: 'Policy Changes',
      icon: <FileText className="w-5 h-5" />,
      content: [
        {
          subtitle: 'Updates',
          items: [
            'We may update this policy to reflect changes in our practices',
            'Users will be notified of significant changes',
            'Continued use constitutes acceptance of updates',
            'Previous versions are available upon request'
          ]
        }
      ]
    }
  ]

  return (
    <>
      <SEO 
        title="Privacy Policy - Studio Nullbyte"
        description="Privacy policy for Studio Nullbyte. Learn how we collect, use, and protect your personal information."
        canonical="https://studio-nullbyte.github.io/privacy-policy"
        noIndex={true}
      />

      <div className="min-h-screen bg-black pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Shield className="w-8 h-8 text-electric-violet" />
              <h1 className="text-4xl md:text-5xl font-mono text-white">
                Privacy Policy
              </h1>
            </div>
            <p className="text-xl text-gray-400 font-mono max-w-3xl mx-auto">
              Your privacy is important to us. This policy explains how Studio Nullbyte collects, 
              uses, and protects your personal information.
            </p>
            <div className="mt-6 text-sm text-gray-500 font-mono">
              Last Updated: {lastUpdated}
            </div>
          </motion.div>

          {/* Introduction */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-12"
          >
            <div className="bg-code-gray-light border border-gray-700 rounded-lg p-6">
              <h2 className="text-2xl font-mono text-white mb-4">Introduction</h2>
              <p className="text-gray-400 font-mono leading-relaxed mb-4">
                Studio Nullbyte ("we," "our," or "us") is committed to protecting your privacy. 
                This Privacy Policy explains how we collect, use, disclose, and safeguard your 
                information when you use our website and services.
              </p>
              <p className="text-gray-400 font-mono leading-relaxed">
                By using Studio Nullbyte, you consent to the practices described in this Privacy Policy. 
                If you do not agree with this policy, please do not use our services.
              </p>
            </div>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-12"
          >
            <div className="bg-code-gray-light border border-gray-700 rounded-lg p-6">
              <h2 className="text-2xl font-mono text-white mb-4">Contact Information</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-electric-violet" />
                  <span className="text-gray-400 font-mono">studionullbyte@gmail.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-electric-violet" />
                  <span className="text-gray-400 font-mono">https://studio-nullbyte.github.io</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Privacy Policy Sections */}
          <div className="space-y-8">
            {sections.map((section, index) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                className="bg-code-gray-light border border-gray-700 rounded-lg p-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="text-electric-violet">
                    {section.icon}
                  </div>
                  <h2 className="text-2xl font-mono text-white">
                    {section.title}
                  </h2>
                </div>

                <div className="space-y-6">
                  {section.content.map((subsection, subIndex) => (
                    <div key={subIndex}>
                      <h3 className="text-lg font-mono text-electric-violet mb-3">
                        {subsection.subtitle}
                      </h3>
                      <ul className="space-y-2">
                        {subsection.items.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex items-start gap-3">
                            <span className="text-electric-violet mt-2">•</span>
                            <span className="text-gray-400 font-mono leading-relaxed">
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Data Subject Rights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-12"
          >
            <div className="bg-electric-violet/10 border border-electric-violet/30 rounded-lg p-6">
              <h2 className="text-2xl font-mono text-white mb-4">Exercise Your Rights</h2>
              <p className="text-gray-400 font-mono leading-relaxed mb-4">
                To exercise any of your privacy rights or if you have questions about this policy, 
                please contact us at:
              </p>
              <div className="flex items-center gap-3 mb-4">
                <Mail className="w-5 h-5 text-electric-violet" />
                <a 
                  href="mailto:studionullbyte@gmail.com" 
                  className="text-electric-violet font-mono hover:text-electric-violet-light transition-colors"
                >
                  studionullbyte@gmail.com
                </a>
              </div>
              <p className="text-gray-400 font-mono text-sm">
                We will respond to your request within 30 days of receipt.
              </p>
            </div>
          </motion.div>

          {/* Effective Date */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="mt-12 text-center"
          >
            <div className="bg-code-gray-light border border-gray-700 rounded-lg p-6">
              <div className="flex items-center justify-center gap-3 mb-3">
                <Clock className="w-5 h-5 text-electric-violet" />
                <h3 className="text-lg font-mono text-white">Effective Date</h3>
              </div>
              <p className="text-gray-400 font-mono">
                This Privacy Policy is effective as of {lastUpdated} and will remain in effect 
                except with respect to any changes in its provisions in the future.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  )
}

export default PrivacyPolicy
