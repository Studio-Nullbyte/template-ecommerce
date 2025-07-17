import React from 'react'
import { Helmet } from 'react-helmet-async'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string
  image?: string
  url?: string
  type?: 'website' | 'article' | 'product'
  structuredData?: string
  noIndex?: boolean
  canonical?: string
}

const SEO: React.FC<SEOProps> = ({
  title = "Studio Nullbyte - Modular Design Tools",
  description = "Modular tools for the design-minded developer. Clean. Branded. Ready to deploy.",
  keywords = "templates, web templates, notion templates, AI prompts, developer tools, freelancers, design tools, react templates, typescript templates",
  image = "https://studio-nullbyte.github.io/android-chrome-512x512.png",
  url = "https://studio-nullbyte.github.io",
  type = "website",
  structuredData,
  noIndex = false,
  canonical
}) => {
  const fullTitle = title.includes('Studio Nullbyte') ? title : `${title} - Studio Nullbyte`
  const fullUrl = url.startsWith('http') ? url : `https://studio-nullbyte.github.io${url}`
  
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Studio Nullbyte" />
      
      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* Robots */}
      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      )}
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="512" />
      <meta property="og:image:height" content="512" />
      <meta property="og:site_name" content="Studio Nullbyte" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:site" content="@studionullbyte" />
      <meta name="twitter:creator" content="@studionullbyte" />
      
      {/* Additional Meta Tags */}
      <meta name="theme-color" content="#000000" />
      <meta name="msapplication-TileColor" content="#000000" />
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {structuredData}
        </script>
      )}
      
      {/* Preconnect to external domains for performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="https://js.stripe.com" />
      <link rel="dns-prefetch" href="https://client.crisp.chat" />
    </Helmet>
  )
}

export default SEO
