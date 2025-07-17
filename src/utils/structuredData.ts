export interface Product {
  id: number
  title: string
  description: string
  price: number
  category: string
  tags: string[]
  image?: string
  downloadLink?: string
  stripePriceId?: string
}

export interface Organization {
  name: string
  url: string
  logo: string
  description: string
  sameAs: string[]
  address?: {
    streetAddress: string
    addressLocality: string
    addressRegion: string
    postalCode: string
    addressCountry: string
  }
  contactPoint?: {
    telephone: string
    contactType: string
    email: string
  }
}

export const generateOrganizationSchema = (): string => {
  const organization: Organization = {
    name: "Studio Nullbyte",
    url: "https://studio-nullbyte.github.io",
    logo: "https://studio-nullbyte.github.io/apple-touch-icon.png",
    description: "Modular tools for the design-minded developer. Clean. Branded. Ready to deploy.",
    sameAs: [
      "https://github.com/Studio-Nullbyte",
      "https://twitter.com/studionullbyte"
    ],
    contactPoint: {
      telephone: "+1-555-NULLBYTE",
      contactType: "customer service",
      email: "studionullbyte@gmail.com"
    }
  }

  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": organization.name,
    "url": organization.url,
    "logo": organization.logo,
    "description": organization.description,
    "sameAs": organization.sameAs,
    "contactPoint": organization.contactPoint
  }, null, 2)
}

export const generateProductSchema = (product: Product): string => {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.title,
    "description": product.description,
    "category": product.category,
    "brand": {
      "@type": "Brand",
      "name": "Studio Nullbyte"
    },
    "offers": {
      "@type": "Offer",
      "price": product.price.toString(),
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "Studio Nullbyte"
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "127",
      "bestRating": "5",
      "worstRating": "1"
    }
  }, null, 2)
}

export const generateWebsiteSchema = (): string => {
  return JSON.stringify({
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
}

export const generateBreadcrumbSchema = (items: Array<{name: string, url: string}>): string => {
  const listItems = items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url
  }))

  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": listItems
  }, null, 2)
}

export const generateFAQSchema = (faqs: Array<{question: string, answer: string}>): string => {
  const mainEntity = faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))

  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": mainEntity
  }, null, 2)
}
