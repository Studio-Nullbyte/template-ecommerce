// Test script to verify slug generation
import { generateSlug, generateUniqueSlug } from '../src/utils/slugify.js'

// Test cases
const testCases = [
  'Web Templates',
  'Mobile Apps & Games',
  'Photography & Media',
  'Business & Corporate',
  'E-commerce Solutions',
  'Special Characters!@#$%',
  'Multiple    Spaces',
  'Already-Has-Hyphens'
]

console.log('Testing slug generation:')
testCases.forEach(name => {
  const slug = generateSlug(name)
  console.log(`"${name}" -> "${slug}"`)
})

// Test unique slug generation
const existingSlugs = ['web-templates', 'mobile-apps', 'business']
const newSlug = generateUniqueSlug('Web Templates', existingSlugs)
console.log(`\nUnique slug for "Web Templates" with existing ["web-templates", "mobile-apps", "business"]: "${newSlug}"`)

const duplicateSlug = generateUniqueSlug('Mobile Apps', existingSlugs)
console.log(`Unique slug for "Mobile Apps" with existing ["web-templates", "mobile-apps", "business"]: "${duplicateSlug}"`)
