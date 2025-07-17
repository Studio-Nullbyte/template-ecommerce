import React from 'react'
import { motion } from 'framer-motion'
import { FileText, Scale, AlertTriangle, Shield, CreditCard, Download, User, Mail, Clock, Globe } from 'lucide-react'
import SEO from '../components/SEO'

const TermsOfService: React.FC = () => {
  const lastUpdated = "January 2025"

  const sections = [
    {
      id: 'acceptance',
      title: 'Acceptance of Terms',
      icon: <FileText className="w-5 h-5" />,
      content: [
        {
          subtitle: 'Agreement',
          items: [
            'By accessing or using Studio Nullbyte, you agree to be bound by these Terms of Service',
            'These terms apply to all users, including browsers, vendors, customers, and contributors',
            'If you do not agree to these terms, you may not access or use our services',
            'We reserve the right to refuse service to anyone for any reason at any time'
          ]
        },
        {
          subtitle: 'Modifications',
          items: [
            'We may modify these terms at any time without prior notice',
            'Updated terms will be posted on this page with a new "Last Updated" date',
            'Your continued use of the service constitutes acceptance of modified terms',
            'It is your responsibility to review these terms periodically'
          ]
        }
      ]
    },
    {
      id: 'services',
      title: 'Services Description',
      icon: <Download className="w-5 h-5" />,
      content: [
        {
          subtitle: 'Digital Products',
          items: [
            'Studio Nullbyte offers digital templates, tools, and resources for developers',
            'Products include web templates, Notion templates, AI prompts, and UI components',
            'All products are delivered digitally via email and download links',
            'Products are licensed for use, not sold - you receive usage rights only'
          ]
        },
        {
          subtitle: 'Service Availability',
          items: [
            'We strive to maintain 99.9% uptime but cannot guarantee uninterrupted service',
            'Services may be temporarily unavailable for maintenance or updates',
            'We reserve the right to modify or discontinue services at any time',
            'No compensation will be provided for service interruptions'
          ]
        }
      ]
    },
    {
      id: 'accounts',
      title: 'User Accounts',
      icon: <User className="w-5 h-5" />,
      content: [
        {
          subtitle: 'Account Registration',
          items: [
            'You must provide accurate and complete information when creating an account',
            'You are responsible for maintaining the confidentiality of your account credentials',
            'You must notify us immediately of any unauthorized use of your account',
            'You are responsible for all activities that occur under your account'
          ]
        },
        {
          subtitle: 'Account Restrictions',
          items: [
            'You must be at least 18 years old to create an account',
            'One account per person - multiple accounts are not permitted',
            'Accounts may not be transferred or sold to other parties',
            'We may suspend or terminate accounts that violate these terms'
          ]
        }
      ]
    },
    {
      id: 'purchases',
      title: 'Purchases & Payments',
      icon: <CreditCard className="w-5 h-5" />,
      content: [
        {
          subtitle: 'Payment Processing',
          items: [
            'Payments are processed securely through PayPal and Square',
            'All prices are in USD and subject to applicable taxes',
            'Payment must be received before product delivery',
            'We do not store credit card information on our servers'
          ]
        },
        {
          subtitle: 'Digital Delivery',
          items: [
            'Products are delivered instantly via email after successful payment',
            'Download links are valid for 30 days from purchase date',
            'You may re-download products from your account dashboard',
            'Technical support is provided for download and access issues'
          ]
        },
        {
          subtitle: 'Refunds',
          items: [
            'Digital products are non-refundable due to their instant delivery nature',
            'Refunds may be considered for technical issues preventing product access',
            'Refund requests must be submitted within 7 days of purchase',
            'Refunds, if approved, will be processed within 5-10 business days'
          ]
        }
      ]
    },
    {
      id: 'licenses',
      title: 'Product Licenses',
      icon: <Scale className="w-5 h-5" />,
      content: [
        {
          subtitle: 'Usage Rights',
          items: [
            'You receive a non-exclusive, non-transferable license to use purchased products',
            'Products may be used for personal and commercial projects',
            'You may modify and customize products to suit your needs',
            'Usage rights are perpetual - no recurring fees or expiration'
          ]
        },
        {
          subtitle: 'Restrictions',
          items: [
            'You may not redistribute, resell, or sublicense the products',
            'You may not claim ownership of the original product designs',
            'You may not use products to compete directly with Studio Nullbyte',
            'Products may not be used for illegal or harmful purposes'
          ]
        }
      ]
    },
    {
      id: 'conduct',
      title: 'User Conduct',
      icon: <Shield className="w-5 h-5" />,
      content: [
        {
          subtitle: 'Prohibited Activities',
          items: [
            'Attempting to gain unauthorized access to our systems',
            'Uploading malicious code or attempting to harm our infrastructure',
            'Harassing, abusing, or threatening other users or staff',
            'Violating any applicable laws or regulations'
          ]
        },
        {
          subtitle: 'Content Guidelines',
          items: [
            'User-generated content must be appropriate and legal',
            'No spam, promotional content, or irrelevant material',
            'Respect intellectual property rights of others',
            'Report any inappropriate content or behavior to our support team'
          ]
        }
      ]
    },
    {
      id: 'intellectual-property',
      title: 'Intellectual Property',
      icon: <Globe className="w-5 h-5" />,
      content: [
        {
          subtitle: 'Our Rights',
          items: [
            'Studio Nullbyte owns all rights to the website, branding, and original content',
            'Product designs and templates are protected by intellectual property laws',
            'Our trademarks and logos may not be used without permission',
            'We retain all rights not explicitly granted to users'
          ]
        },
        {
          subtitle: 'User Content',
          items: [
            'You retain ownership of content you create using our products',
            'You grant us a license to use your feedback and suggestions',
            'User reviews and testimonials may be used for promotional purposes',
            'We respect the intellectual property rights of third parties'
          ]
        }
      ]
    },
    {
      id: 'disclaimers',
      title: 'Disclaimers & Limitations',
      icon: <AlertTriangle className="w-5 h-5" />,
      content: [
        {
          subtitle: 'Service Disclaimers',
          items: [
            'Services are provided "as is" without warranties of any kind',
            'We do not guarantee that products will meet your specific requirements',
            'We are not responsible for third-party integrations or compatibility',
            'Results may vary based on individual implementation and usage'
          ]
        },
        {
          subtitle: 'Limitation of Liability',
          items: [
            'Our liability is limited to the amount you paid for the specific product',
            'We are not liable for indirect, incidental, or consequential damages',
            'We are not responsible for lost profits, data, or business interruption',
            'Some jurisdictions do not allow liability limitations - local laws may apply'
          ]
        }
      ]
    },
    {
      id: 'termination',
      title: 'Termination',
      icon: <Clock className="w-5 h-5" />,
      content: [
        {
          subtitle: 'Account Termination',
          items: [
            'You may terminate your account at any time by contacting support',
            'We may terminate accounts for violations of these terms',
            'Termination does not affect your license to use previously purchased products',
            'We may retain certain information as required by law or for legitimate business purposes'
          ]
        },
        {
          subtitle: 'Effect of Termination',
          items: [
            'Access to your account and download history will be removed',
            'Previously purchased products remain licensed for use',
            'Outstanding payment obligations survive termination',
            'Provisions that should survive termination will remain in effect'
          ]
        }
      ]
    },
    {
      id: 'governing-law',
      title: 'Governing Law',
      icon: <Scale className="w-5 h-5" />,
      content: [
        {
          subtitle: 'Legal Framework',
          items: [
            'These terms are governed by the laws of the United States',
            'Any disputes will be resolved in courts of competent jurisdiction',
            'If any provision is found invalid, the remaining terms remain in effect',
            'These terms constitute the entire agreement between you and Studio Nullbyte'
          ]
        }
      ]
    }
  ]

  return (
    <>
      <SEO 
        title="Terms of Service - Studio Nullbyte"
        description="Terms of Service for Studio Nullbyte. Learn about our service terms, user responsibilities, and product licenses."
        canonical="https://studio-nullbyte.github.io/terms-of-service"
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
              <Scale className="w-8 h-8 text-electric-violet" />
              <h1 className="text-4xl md:text-5xl font-mono text-white">
                Terms of Service
              </h1>
            </div>
            <p className="text-xl text-gray-400 font-mono max-w-3xl mx-auto">
              Please read these terms carefully before using Studio Nullbyte's services and products.
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
                Welcome to Studio Nullbyte! These Terms of Service ("Terms") govern your use of our 
                website and services. By accessing or using our platform, you agree to be bound by 
                these Terms and our Privacy Policy.
              </p>
              <p className="text-gray-400 font-mono leading-relaxed">
                Studio Nullbyte provides digital templates, tools, and resources for developers. 
                These Terms explain your rights and responsibilities when using our services.
              </p>
            </div>
          </motion.div>

          {/* Terms Sections */}
          <div className="space-y-8">
            {sections.map((section, index) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
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

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-12"
          >
            <div className="bg-electric-violet/10 border border-electric-violet/30 rounded-lg p-6">
              <h2 className="text-2xl font-mono text-white mb-4">Questions About These Terms?</h2>
              <p className="text-gray-400 font-mono leading-relaxed mb-4">
                If you have any questions about these Terms of Service, please contact us at:
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
                We will respond to your inquiry within 48 hours.
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
                These Terms of Service are effective as of {lastUpdated} and will remain in effect 
                until modified or terminated.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  )
}

export default TermsOfService
