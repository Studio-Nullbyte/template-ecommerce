# Copilot Instructions - Studio Nullbyte

## Project Overview

Studio Nullbyte is a multi-page React + T### Styling Conventions

#### CSS Import Order (Critical)
```css
/* 1. External imports (fonts, etc.) must come first */
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono...');

/* 2. Tailwind directives */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* 3. Custom CSS layers */
@layer base { ... }
@layer components { ... }
```

#### CSS ClassesScript + Tailwind CSS website for selling digital templates and tools. The site serves as both an informational platform and digital product marketplace with a dark, code-glitch aesthetic and hacker vibe.

**Tagline**: "Modular tools for the design-minded developer. Clean. Branded. Ready to deploy."

## Target Audience

- Freelancers leveling up their brand
- Indie developers launching microproducts  
- AI creators and prompt engineers
- Small business owners seeking plug-and-play visuals
- Marketing agencies outsourcing assets

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS with custom utilities
- **Animations**: Framer Motion
- **Routing**: React Router DOM
- **SEO**: React Helmet Async
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Deployment**: GitHub Pages ready

## Design System

### Brand Identity
- **Vibe**: Code-glitch, minimal, stealthy, dev-first with hacker aesthetic
- **Tone**: Strategic, slightly mysterious, focused on clarity
- **Approach**: Avoid overhype — let aesthetic precision do the work

### Color Palette
```css
/* Primary Colors */
--electric-violet: #8B5CF6
--electric-violet-light: #A78BFA  
--electric-violet-dark: #7C3AED

/* Backgrounds */
--black: #000000
--code-gray: #1E1E1E
--code-gray-light: #2D2D2D
--code-gray-dark: #0A0A0A

/* Text */
--white: #FFFFFF
--gray-300: #D1D5DB
--gray-400: #9CA3AF

/* Accent */
--terminal-green: #00FF41
```

### Typography
- **Primary**: IBM Plex Mono (monospace)
- **Fallbacks**: JetBrains Mono, Söhne Mono, Courier New
- **Usage**: All text uses font-mono class for consistency

### Animation Guidelines
- **Blinking Cursor**: Use `cursor-blink` class with `::after { content: '_'; }`
- **Glitch Effects**: Apply `glitch-text` class for hover states
- **Page Transitions**: 0.3s duration with opacity and slight Y transform
- **Scroll Animations**: Use Framer Motion with `whileInView` for section reveals
- **Hover States**: Subtle scale transforms (1.05) with color transitions

## Component Architecture

### File Structure
```
src/
├── components/
│   ├── Header.tsx          # Fixed navigation with scroll effects
│   └── Footer.tsx          # Company info, links, terminal CTA
├── pages/
│   ├── Home.tsx           # Hero, features, stats, featured products
│   ├── Products.tsx       # Filterable catalog with search
│   ├── Product.tsx        # Individual product details
│   ├── About.tsx          # Mission, values, team, stats
│   └── Contact.tsx        # Form, contact info, FAQ
├── hooks/
│   ├── useScrollToTop.ts  # Auto-scroll on route change
│   └── useIntersectionObserver.ts # Scroll-triggered animations
```

### Component Standards

#### Header Component
- Fixed positioning with scroll-triggered background
- Logo: Custom "N_" SVG logo + "Studio<Nullbyte>" text with electric violet accent
- Desktop navigation + mobile hamburger menu
- Shopping cart icon placeholder
- Electric violet highlights for active routes
- Logo hover effects with scale transform

#### Footer Component  
- Multi-column layout with brand, navigation, products
- Custom "N_" logo with hover effects
- Social links (GitHub, Twitter, Email)
- Terminal-style contact prompt
- "Built with ☕ and code" tagline

#### Page Components
- All pages use React Helmet for SEO meta tags
- Consistent padding: `pt-20` for fixed header clearance
- Section spacing: `py-20` for vertical rhythm
- Container: `container mx-auto px-4` for responsive layout

## Styling Conventions

### CSS Classes

#### Layout
- `container mx-auto px-4` - Responsive container
- `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3` - Responsive grids
- `flex items-center justify-between` - Flex layouts

#### Typography
- `font-mono` - All text uses monospace font
- `text-4xl md:text-5xl lg:text-7xl` - Responsive headings
- `text-gray-400` - Secondary text color
- `text-electric-violet` - Brand accent color

#### Interactive Elements
- `btn-primary` - Electric violet background button
- `btn-secondary` - Electric violet border button  
- `btn-ghost` - Text-only button
- `card` - Standard content card with hover effects

#### Effects
- `glitch-text` - Hover glitch animation
- `cursor-blink` - Blinking underscore cursor
- `terminal-prompt::before` - "$ " prefix
- `noise-overlay` - Subtle line noise on hover

### Responsive Design
- Mobile-first approach
- Breakpoints: `md:` (768px), `lg:` (1024px), `xl:` (1280px)
- Grid systems: 1 column mobile → 2-3 columns desktop
- Typography scaling: `text-4xl md:text-5xl lg:text-7xl`

## Content Guidelines

### Product Categories
- **Web Templates**: React, Next.js, landing pages, portfolios
- **Notion Templates**: Productivity, project management, documentation  
- **Document Templates**: Technical docs, proposals, contracts
- **AI Prompts**: ChatGPT, Claude, Midjourney libraries
- **UI Components**: React component libraries, design systems

### Copy Tone
- Technical but accessible
- Confident without being boastful
- Developer-focused language
- Emphasis on modularity and quality
- "Ship in silence" mentality

### CTAs (Call-to-Actions)
- "Browse Templates" - Primary action
- "View Details" - Product exploration
- "Get Started" - Onboarding
- "Ship Now" / "Deploy" - Urgency variants

## Development Guidelines

### State Management
- React hooks for local state
- No global state library needed currently
- Form state managed with controlled components

### Performance
- Lazy load images with aspect ratio containers
- Framer Motion animations with reduced motion support
- Minimal JavaScript bundle size
- Optimized font loading

### SEO Requirements
- Unique meta titles and descriptions per page
- Structured data for products
- Semantic HTML5 elements
- Alt text for all images
- Fast loading scores

### Accessibility
- WCAG AA compliance target
- Keyboard navigation support
- Screen reader compatibility
- Sufficient color contrast ratios
- Focus indicators on interactive elements

## API Integration (Future)

### E-commerce Features
- Product catalog with filtering/search
- Shopping cart functionality  
- Payment processing (Stripe integration)
- Digital delivery automation
- User accounts and order history

### Content Management
- Product data from headless CMS
- Blog/tutorial content
- Dynamic pricing and promotions
- Inventory management

## Deployment

### Build Process
```bash
npm install         # Install dependencies
npm run dev        # Development server
npm run build      # Production build (Vite only)
npm run build:check # Production build with TypeScript check
npm run type-check # TypeScript type checking only
npm run preview    # Preview build locally
```

**Note**: The main build script uses only Vite for faster builds. Vite handles TypeScript compilation internally. Use `build:check` when you need explicit TypeScript validation.

### TypeScript Configuration
- **Main Config**: `tsconfig.json` - Uses `moduleResolution: "node"` for compatibility
- **Node Config**: `tsconfig.node.json` - For Vite configuration with ESModuleInterop
- **Path Aliases**: `@/*` maps to `./src/*` for clean imports
- **Vite Alias**: Uses `/src` for simple path resolution
- **Build Issues**: Use `moduleResolution: "node"` instead of `"bundler"` for TypeScript compatibility

### Environment Variables
```env
VITE_STRIPE_PUBLIC_KEY=    # Payment processing
VITE_API_BASE_URL=         # Backend API
VITE_ANALYTICS_ID=         # Google Analytics
```

### GitHub Pages Setup
- Build output: `dist/` directory
- Base URL: `/studio-nullbyte.github.io/`
- Custom domain support ready

## Code Style

### TypeScript
- Strict mode enabled
- Explicit return types for functions
- Interface definitions for props
- No `any` types allowed

### React Patterns
- Functional components with hooks
- Props destructuring in parameters
- Conditional rendering with ternary operators
- Key props for lists and maps

### Import Organization
```typescript
// External libraries
import React from 'react'
import { Link } from 'react-router-dom'

// Internal components
import Header from './components/Header'

// Types (if separate file)
import { ProductType } from './types'
```

## Brand Voice Examples

### Headlines
- "Modular tools for the design-minded developer"
- "Ship in silence, deploy with confidence"
- "Code-first templates for the discerning developer"

### Descriptions  
- "Clean. Branded. Ready to deploy."
- "Aesthetic precision meets functional excellence"
- "Tools that think in syntax and speak in pixels"

### Technical Copy
- "React 18 + TypeScript foundation"
- "Tailwind CSS with custom utilities"
- "Performance-optimized, accessibility-first"

---

**Contact**: studionullbyte@gmail.com  
**Last Updated**: January 2025
