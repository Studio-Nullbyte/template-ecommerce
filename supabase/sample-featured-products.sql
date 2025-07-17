-- Sample data for featured products
-- Run this in your Supabase SQL editor to populate the database with sample featured products

-- First, let's create some categories
INSERT INTO public.categories (name, slug, description, is_active) VALUES
('Web Templates', 'web-templates', 'Professional web templates and themes', true),
('AI Prompts', 'ai-prompts', 'Curated AI prompts for various use cases', true),
('Notion Templates', 'notion-templates', 'Productivity templates for Notion', true),
('UI Components', 'ui-components', 'Reusable UI components and libraries', true)
ON CONFLICT (slug) DO NOTHING;

-- Now let's create some sample featured products
INSERT INTO public.products (title, description, price, category_id, image_url, download_url, preview_url, tags, featured, active) VALUES
(
  'Developer Portfolio Kit',
  'A comprehensive portfolio template built with React, TypeScript, and Tailwind CSS. Perfect for developers who want to showcase their work professionally.',
  49.00,
  (SELECT id FROM public.categories WHERE slug = 'web-templates'),
  '/api/placeholder/400/300',
  '/downloads/portfolio-kit.zip',
  '/preview/portfolio-kit',
  ARRAY['React', 'TypeScript', 'Tailwind', 'Portfolio', 'Developer'],
  true,
  true
),
(
  'AI Prompt Engineering Library',
  'A curated collection of 500+ AI prompts for ChatGPT, Claude, and other AI models. Boost your productivity with proven prompts.',
  29.00,
  (SELECT id FROM public.categories WHERE slug = 'ai-prompts'),
  '/api/placeholder/400/300',
  '/downloads/ai-prompts.zip',
  '/preview/ai-prompts',
  ARRAY['ChatGPT', 'Claude', 'Midjourney', 'AI', 'Prompts'],
  true,
  true
),
(
  'Notion Productivity System',
  'Complete productivity system for Notion with project management, goal tracking, and daily planning templates.',
  19.00,
  (SELECT id FROM public.categories WHERE slug = 'notion-templates'),
  '/api/placeholder/400/300',
  '/downloads/notion-productivity.zip',
  '/preview/notion-productivity',
  ARRAY['Notion', 'Productivity', 'GTD', 'Projects', 'Planning'],
  true,
  true
),
(
  'React Component Library',
  'Modern React components with TypeScript and Storybook. 50+ components ready to use in your projects.',
  79.00,
  (SELECT id FROM public.categories WHERE slug = 'ui-components'),
  '/api/placeholder/400/300',
  '/downloads/react-components.zip',
  '/preview/react-components',
  ARRAY['React', 'TypeScript', 'Storybook', 'Components', 'UI'],
  true,
  true
);

-- Verify the data was inserted
SELECT 
  p.id,
  p.title,
  p.price,
  c.name as category_name,
  p.featured,
  p.active
FROM public.products p
JOIN public.categories c ON p.category_id = c.id
WHERE p.featured = true;
