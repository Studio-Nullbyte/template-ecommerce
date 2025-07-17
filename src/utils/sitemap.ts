interface SitemapEntry {
  url: string
  lastmod: string
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority: number
}

export const generateSitemap = (): string => {
  const baseUrl = 'https://studio-nullbyte.github.io'
  const currentDate = new Date().toISOString().split('T')[0]
  
  const urls: SitemapEntry[] = [
    {
      url: `${baseUrl}/`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 1.0
    },
    {
      url: `${baseUrl}/products`,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: 0.9
    },
    {
      url: `${baseUrl}/about`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: 0.8
    },
    {
      url: `${baseUrl}/contact`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: 0.7
    },
    // Add product pages - these would be dynamically generated in a real app
    {
      url: `${baseUrl}/products/web-templates`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 0.8
    },
    {
      url: `${baseUrl}/products/notion-templates`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 0.8
    },
    {
      url: `${baseUrl}/products/ai-prompts`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 0.8
    }
  ]

  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>\n'
  const xmlNamespace = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
  
  const urlEntries = urls.map(entry => `  <url>
    <loc>${entry.url}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`).join('\n')
  
  const xmlFooter = '\n</urlset>'
  
  return xmlHeader + xmlNamespace + urlEntries + xmlFooter
}

// Static sitemap for build time generation
export const sitemapXml = generateSitemap()
