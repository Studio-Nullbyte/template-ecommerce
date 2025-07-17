import React from 'react'
import { motion } from 'framer-motion'
import { Code, Users, Zap, Target, Coffee } from 'lucide-react'
import SEO from '../components/SEO'

const About: React.FC = () => {
  const values = [
    {
      icon: <Code className="w-8 h-8" aria-hidden="true" />,
      title: "Developer-First",
      description: "Built by developers, for developers. We understand the tools you need."
    },
    {
      icon: <Target className="w-8 h-8" aria-hidden="true" />,
      title: "Quality Focus",
      description: "Every template is carefully crafted with attention to detail and best practices."
    },
    {
      icon: <Zap className="w-8 h-8" aria-hidden="true" />,
      title: "Performance",
      description: "Fast, efficient, and optimized for modern web standards."
    },
    {
      icon: <Users className="w-8 h-8" aria-hidden="true" />,
      title: "Community",
      description: "Building tools that bring the developer community together."
    }
  ]

  const stats = [
    { value: "2023", label: "Founded" },
    { value: "500+", label: "Templates" },
    { value: "10k+", label: "Happy Users" },
    { value: "99%", label: "Satisfaction" }
  ]

  const team = [
    {
      name: "Alex Chen",
      role: "Founder & Lead Developer",
      bio: "Full-stack developer with 8 years of experience in React, Node.js, and design systems.",
      image: "/api/placeholder/200/200"
    },
    {
      name: "Sarah Kim",
      role: "UI/UX Designer",
      bio: "Design systems specialist focused on creating intuitive and accessible user experiences.",
      image: "/api/placeholder/200/200"
    },
    {
      name: "Marcus Rodriguez",
      role: "Frontend Engineer",
      bio: "React and TypeScript expert with a passion for clean code and performance optimization.",
      image: "/api/placeholder/200/200"
    }
  ]

  const structuredData = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "About Studio Nullbyte",
    "description": "Learn about Studio Nullbyte's mission to create modular tools for design-minded developers.",
    "url": "https://studio-nullbyte.github.io/about",
    "publisher": {
      "@type": "Organization",
      "name": "Studio Nullbyte"
    }
  }, null, 2)

  return (
    <>
      <SEO
        title="About - Studio Nullbyte"
        description="Learn about Studio Nullbyte's mission to create modular tools for design-minded developers. Founded in 2023, we build quality templates and tools."
        keywords="about studio nullbyte, company, mission, team, developer tools, template creators"
        url="/about"
        type="website"
        structuredData={structuredData}
      />

      {/* Skip Link */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <div className="min-h-screen pt-16 sm:pt-20">
        {/* Hero Section */}
        <section 
          id="main-content"
          className="py-12 sm:py-16 lg:py-20 bg-code-gray"
          aria-labelledby="about-heading"
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <motion.h1
                id="about-heading"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl sm:text-4xl lg:text-5xl font-mono font-bold mb-4 sm:mb-6"
              >
                About <span className="text-electric-violet">Studio Nullbyte</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-gray-400 mb-8"
              >
                We're a team of developers and designers creating modular tools for the modern web.
              </motion.p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl font-mono font-bold mb-6">
                    Our Mission
                  </h2>
                  <p className="text-gray-400 text-lg mb-6">
                    We believe that great tools should empower creators, not constrain them. 
                    Our mission is to provide modular, high-quality templates and tools that 
                    help developers and designers ship faster without compromising on quality.
                  </p>
                  <p className="text-gray-400 text-lg">
                    Every template in our collection is built with modern best practices, 
                    accessibility in mind, and the flexibility to adapt to your unique needs.
                  </p>
                </div>
                <div className="relative">
                  <div className="aspect-square bg-code-gray rounded-sm p-8 flex items-center justify-center">
                    <div className="text-center">
                      <Coffee className="w-16 h-16 text-electric-violet mx-auto mb-4" />
                      <p className="font-mono text-sm text-gray-400">
                        Crafted with ☕ and code
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-code-gray">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-mono font-bold mb-4">
                Our Values
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                These principles guide everything we create and how we work with our community.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="card text-center"
                >
                  <div className="text-electric-violet mb-4 flex justify-center">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-mono font-bold mb-2">
                    {value.title}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-4xl md:text-5xl font-mono font-bold text-electric-violet mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-400 font-mono text-sm">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 bg-code-gray">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-mono font-bold mb-4">
                Meet the Team
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                The people behind Studio Nullbyte, working to create amazing tools for developers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="card text-center"
                >
                  <div className="w-24 h-24 bg-code-gray-dark rounded-full mx-auto mb-4 overflow-hidden">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-mono font-bold mb-1">
                    {member.name}
                  </h3>
                  <p className="text-electric-violet text-sm font-mono mb-3">
                    {member.role}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {member.bio}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-mono font-bold mb-4">
                Ready to Build Something <span className="text-electric-violet">Amazing</span>?
              </h2>
              <p className="text-gray-400 text-lg mb-8">
                Join our community of developers and start creating with our tools today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/products" className="btn-primary">
                  Browse Products
                </a>
                <a href="/contact" className="btn-secondary">
                  Get in Touch
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default About
