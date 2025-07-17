# Studio Nullbyte

[![Deploy to GitHub Pages](https://github.com/Studio-Nullbyte/studio-nullbyte.github.io/actions/workflows/deploy.yml/badge.svg)](https://github.com/Studio-Nullbyte/studio-nullbyte.github.io/actions/workflows/deploy.yml)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

> **Modular tools for the design-minded developer. Clean. Branded. Ready to deploy.**

Studio Nullbyte is a modern, full-featured React application serving as both an informational platform and digital product marketplace. Built with a dark, code-glitch aesthetic and hacker vibe, it's designed for developers, designers, and digital creators.

## ✨ Features

### 🎨 **Design & UI**
- **Dark Theme**: Code-glitch aesthetic with electric violet accents
- **Responsive Design**: Mobile-first approach with fluid layouts
- **Smooth Animations**: Framer Motion for engaging interactions
- **Accessibility**: WCAG AA compliant design principles
- **Modern Typography**: IBM Plex Mono for consistent developer aesthetic

### 🚀 **Technical Stack**
- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Build Tool**: Vite for fast development and optimized builds
- **Backend**: Supabase for authentication, database, and storage
- **Payments**: Stripe and PayPal integration
- **Email**: EmailJS for contact forms and notifications
- **SEO**: React Helmet Async for meta tags and structured data

### 🔧 **Development Tools**
- **Testing**: Vitest + React Testing Library + Coverage reporting
- **Code Quality**: ESLint + Prettier with automated formatting
- **Type Safety**: Full TypeScript coverage with strict mode
- **CI/CD**: GitHub Actions for automated deployment
- **Dependency Management**: Dependabot for security updates
- **Error Handling**: Comprehensive error boundaries and logging

### 📊 **Admin Features**
- **Dashboard**: Real-time analytics and user management
- **Product Management**: CRUD operations for digital products
- **Order Processing**: Complete order lifecycle management
- **User Analytics**: Comprehensive user behavior tracking
- **Content Management**: Dynamic content with Supabase CMS

## 🎯 Target Audience

- **Freelancers** leveling up their brand
- **Indie developers** launching microproducts
- **AI creators** and prompt engineers
- **Small business owners** seeking plug-and-play visuals
- **Marketing agencies** outsourcing digital assets

## 📦 Product Categories

- **Web Templates** (React, Next.js, landing pages, portfolios)
- **Notion Templates** (Productivity, project management, documentation)
- **Document Templates** (Technical docs, proposals, contracts)
- **AI Prompts** (ChatGPT, Claude, Midjourney libraries)
- **UI Components** (React component libraries, design systems)

## 🎨 Design System

### Colors
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

## 🚀 Getting Started

### Prerequisites
- **Node.js**: 18.19.0 or higher (see `.nvmrc`)
- **npm**: 9.0.0 or higher
- **Git**: Latest version

### Quick Start

```bash
# Clone the repository
git clone https://github.com/Studio-Nullbyte/studio-nullbyte.github.io.git
cd studio-nullbyte.github.io

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your actual values

# Start development server
npm run dev
```

### Environment Setup

Create a `.env.local` file with your configuration:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Payment Processing
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_key
VITE_PAYPAL_CLIENT_ID=your_paypal_client_id

# Communication
VITE_CRISP_WEBSITE_ID=your_crisp_id
VITE_EMAILJS_SERVICE_ID=your_emailjs_service_id
VITE_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
VITE_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
```

## 📁 Project Structure

```
studio-nullbyte.github.io/
├── .github/                 # GitHub workflows and templates
│   ├── workflows/
│   │   └── deploy.yml      # Automated deployment
│   ├── ISSUE_TEMPLATE/     # Issue templates
│   ├── dependabot.yml      # Dependency updates
│   └── pull_request_template.md
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── ErrorBoundary.tsx
│   ├── pages/             # Main page components
│   │   ├── Home.tsx
│   │   ├── Products.tsx
│   │   ├── Product.tsx
│   │   ├── About.tsx
│   │   └── Contact.tsx
│   ├── hooks/             # Custom React hooks
│   │   ├── useScrollToTop.ts
│   │   ├── useIntersectionObserver.ts
│   │   └── useAdmin.ts
│   ├── contexts/          # React contexts
│   │   └── AuthContext.tsx
│   ├── lib/              # External service configurations
│   │   ├── supabase.ts
│   │   └── types/
│   ├── utils/            # Utility functions
│   │   ├── logger.ts
│   │   └── supabaseDiagnostics.ts
│   ├── test/             # Test setup and utilities
│   │   └── setup.ts
│   └── styles/           # Global styles
├── tests/                # Test files
├── public/               # Static assets
├── docs/                 # Documentation
├── .vscode/              # VS Code configuration
├── CONTRIBUTING.md       # Contribution guidelines
├── SECURITY.md          # Security policy
├── CHANGELOG.md         # Version history
└── README.md            # This file
```

## 🛠️ Available Scripts

### Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Testing
```bash
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage
npm run test:ui      # Run tests with UI
```

### Code Quality
```bash
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run format       # Format code with Prettier
npm run format:check # Check code formatting
npm run type-check   # Run TypeScript checks
npm run validate     # Run all quality checks
```

### Database (Supabase)
```bash
npm run supabase:start   # Start local Supabase
npm run supabase:stop    # Stop local Supabase
npm run supabase:status  # Check Supabase status
npm run db:types         # Generate TypeScript types
npm run db:reset         # Reset local database
```

## 🔧 Development Tools

### Code Quality
- **ESLint**: Linting with React, TypeScript, and accessibility rules
- **Prettier**: Code formatting with consistent style
- **TypeScript**: Full type safety with strict mode
- **Husky**: Git hooks for pre-commit checks (optional)
- **lint-staged**: Run linters on staged files

### Testing
- **Vitest**: Fast unit testing framework
- **React Testing Library**: Component testing utilities
- **jsdom**: Browser environment simulation
- **Coverage**: Built-in code coverage reporting

### Build & Deployment
- **Vite**: Fast build tool and dev server
- **GitHub Actions**: Automated CI/CD pipeline
- **GitHub Pages**: Static site deployment
- **Dependabot**: Automated dependency updates

## 📊 Key Features

### 🏠 **Home Page**
- **Hero Section**: Animated tagline with glitch effects
- **Featured Products**: Curated showcase of top templates
- **Company Values**: Mission statement and brand positioning
- **Statistics**: Real-time metrics and achievements
- **Call-to-Action**: Strategic conversion elements

### 🛍️ **Products Catalog**
- **Advanced Filtering**: Category, price, and tag-based filtering
- **Search Functionality**: Real-time search with suggestions
- **Product Cards**: Ratings, downloads, and preview images
- **Pagination**: Optimized loading for large catalogs
- **Responsive Grid**: Mobile-first product layout

### 📱 **Product Details**
- **Comprehensive Info**: Detailed descriptions and specifications
- **Image Gallery**: High-quality product screenshots
- **Feature Lists**: Bullet-point benefits and features
- **Download System**: Secure file delivery
- **Reviews**: User feedback and ratings

### 👤 **User Authentication**
- **Registration**: Email verification and profile setup
- **Login System**: Secure authentication with Supabase
- **Password Recovery**: Email-based password reset
- **Profile Management**: User settings and preferences
- **Session Handling**: Persistent login state

### 💰 **Payment Integration**
- **Stripe Checkout**: Secure payment processing
- **PayPal Support**: Alternative payment method
- **Order Management**: Complete purchase lifecycle
- **Receipt Generation**: Automated email confirmations
- **Refund System**: Customer service tools

### 🔐 **Admin Dashboard**
- **Analytics**: User behavior and sales metrics
- **Product Management**: CRUD operations for catalog
- **Order Processing**: Order status and fulfillment
- **User Management**: Customer support tools
- **Content Management**: Dynamic content updates

### 📞 **Contact & Support**
- **Contact Form**: Direct communication with validation
- **Live Chat**: Crisp Chat integration
- **FAQ Section**: Common questions and answers
- **Support Tickets**: Issue tracking and resolution
- **Email Notifications**: Automated response system

## 🛡️ Security Features

- **Environment Variables**: Secure configuration management
- **Input Validation**: XSS and injection protection
- **Authentication**: JWT-based secure sessions
- **HTTPS Enforcement**: SSL/TLS encryption
- **Content Security Policy**: XSS protection headers
- **Error Boundaries**: Graceful error handling

## 🎯 Performance Optimizations

- **Code Splitting**: Lazy loading for optimal bundles
- **Image Optimization**: WebP format with fallbacks
- **Caching Strategy**: Browser and CDN caching
- **Bundle Analysis**: Optimized chunk sizes
- **Lazy Loading**: On-demand component loading
- **SEO Optimization**: Meta tags and structured data

## 📱 Responsive Design

- **Mobile-First**: Optimized for touch devices
- **Breakpoint System**: Tailored layouts for all screens
- **Touch Gestures**: Swipe and tap interactions
- **Performance**: Fast loading on mobile networks
- **Accessibility**: Screen reader and keyboard support

## 🚀 Deployment

The project is configured for automatic deployment to GitHub Pages:

1. **Push to Main**: Triggers automated deployment
2. **Build Process**: Vite builds optimized production assets
3. **GitHub Pages**: Serves static files from `dist/` directory
4. **Custom Domain**: Optional custom domain configuration

### Manual Deployment

```bash
# Build for GitHub Pages
npm run build:gh-pages

# Preview GitHub Pages build
npm run preview:gh-pages
```

## 🤝 Contributing

We welcome contributions! Please read our [Contributing Guidelines](CONTRIBUTING.md) for details on:

- Code of conduct
- Development setup
- Pull request process
- Coding standards
- Testing requirements

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `npm run test`
5. Run linting: `npm run lint`
6. Commit changes: `git commit -m 'Add amazing feature'`
7. Push to branch: `git push origin feature/amazing-feature`
8. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔒 Security

Please review our [Security Policy](SECURITY.md) for reporting vulnerabilities and security best practices.

## 📚 Documentation

- [Contributing Guidelines](CONTRIBUTING.md)
- [Security Policy](SECURITY.md)
- [Changelog](CHANGELOG.md)
- [GitHub Workflows](.github/workflows/)

## 🆘 Support

- **Email**: studionullbyte@gmail.com
- **GitHub Issues**: [Report bugs or request features](https://github.com/Studio-Nullbyte/studio-nullbyte.github.io/issues)
- **Discussions**: [Community discussions](https://github.com/Studio-Nullbyte/studio-nullbyte.github.io/discussions)

## 📈 Project Status

- **Version**: 1.0.0
- **Status**: Active Development
- **Last Updated**: July 2025
- **Node.js**: 18.19.0+
- **Dependencies**: Regularly updated via Dependabot

---

**Built with ☕ and code by Studio Nullbyte**

*"Ship in silence, deploy with confidence"*
- Purchase integration ready

### About
- Company mission and values
- Team member profiles
- Statistics and achievements
- Community focus

### Contact
- Contact form with validation
- Multiple contact methods
- FAQ section
- Terminal-style CTA

## Customization

### Branding
- Update logo placeholder in `Header.tsx`
- Modify color scheme in `tailwind.config.js`
- Update contact information throughout

### Content
- Edit product data in respective components
- Update company information in About page
- Modify FAQ content in Contact page

### Styling
- Customize animations in `index.css`
- Adjust component styles using Tailwind classes
- Modify theme colors and fonts

## Performance Optimizations

- Lazy loading for images
- Code splitting with React.lazy
- Optimized bundle size
- Efficient re-renders with React.memo

## SEO Features

- Dynamic meta tags with React Helmet
- Structured data markup
- Semantic HTML5 structure
- Optimized images and assets

## Deployment

### GitHub Pages (Automated)
This site is configured for automatic deployment to GitHub Pages using GitHub Actions.

- **Live Site**: https://studio-nullbyte.github.io/studio-nullbyte.github.io/
- **Auto-Deploy**: Pushes to `main` branch trigger automatic builds
- **Build Status**: Check the Actions tab for deployment status

For detailed setup instructions, see the [GitHub Pages documentation](https://docs.github.com/en/pages).

### Vercel
```bash
# Connect GitHub repository to Vercel
# Auto-deploy on push to main branch
```

### Netlify
```bash
# Connect GitHub repository to Netlify
# Build command: npm run build
# Publish directory: dist
```

## Backend & Database

### Supabase Integration
Studio Nullbyte uses Supabase for backend services:

- **Authentication**: User registration, login, and session management
- **Database**: PostgreSQL with real-time capabilities
- **Storage**: File uploads and asset management
- **API**: Auto-generated RESTful API with Row Level Security

### Database Schema
- **Products**: Digital templates and tools catalog
- **Categories**: Product organization (Web, Notion, AI, etc.)
- **Users**: Profile management and authentication
- **Downloads**: Purchase and download tracking
- **Reviews**: Product ratings and feedback
- **Contact**: Form submissions and support

See [SUPABASE_SETUP.md](./docs/SUPABASE_SETUP.md) for complete setup instructions.

## 🚀 Deployment

This site is configured for automatic deployment to GitHub Pages with Supabase backend.

### Prerequisites
1. GitHub repository with Pages enabled
2. Supabase project configured
3. GitHub Secrets configured with Supabase credentials

### Quick Deploy
1. Add GitHub Secrets:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key
2. Push to main branch
3. GitHub Actions will automatically build and deploy

### Detailed Instructions
See [DEPLOYMENT_WITH_SUPABASE.md](./docs/DEPLOYMENT_WITH_SUPABASE.md) for step-by-step deployment guide.

**⚠️ Important**: The site will **NOT** connect to Supabase automatically without proper GitHub Secrets configuration.

## Contact

For questions or support, contact us at:
- Email: studionullbyte@gmail.com
- Website: https://studio-nullbyte.github.io

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

*Built with ☕ and code by Studio Nullbyte*