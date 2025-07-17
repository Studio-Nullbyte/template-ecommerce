-- Create custom types
DO $$ BEGIN
    CREATE TYPE contact_status AS ENUM ('new', 'in_progress', 'resolved');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create tables
create table if not exists public.user_profiles (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  full_name text,
  avatar_url text,
  email text not null,
  role text not null default 'user' check (role in ('user', 'admin')),
  is_active boolean not null default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  constraint user_profiles_user_id_key unique (user_id)
);

-- Add missing columns to existing user_profiles table if they don't exist
DO $$ BEGIN
    ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS role text DEFAULT 'user' CHECK (role IN ('user', 'admin'));
EXCEPTION
    WHEN duplicate_column THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;
EXCEPTION
    WHEN duplicate_column THEN NULL;
END $$;

create table if not exists public.categories (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text not null unique,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.products (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text not null,
  price decimal(10,2) not null default 0,
  category_id uuid references public.categories(id) on delete cascade not null,
  image_url text,
  download_url text,
  preview_url text,
  tags text[] default '{}',
  featured boolean default false,
  active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add missing columns to existing products table if they don't exist
DO $$ BEGIN
    ALTER TABLE public.products ADD COLUMN IF NOT EXISTS active boolean DEFAULT true;
EXCEPTION
    WHEN duplicate_column THEN NULL;
END $$;

create table if not exists public.download_history (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete cascade not null,
  downloaded_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  constraint download_history_user_product_unique unique (user_id, product_id)
);

create table if not exists public.reviews (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete cascade not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  constraint reviews_user_product_unique unique (user_id, product_id)
);

create table if not exists public.contact_submissions (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  submitted_at timestamp with time zone default timezone('utc'::text, now()) not null,
  status contact_status default 'new'
);

create table if not exists public.orders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  total_amount decimal(10,2) not null default 0,
  status text not null default 'pending' check (status in ('pending', 'processing', 'completed', 'cancelled', 'refunded')),
  payment_method text,
  payment_id text,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.order_items (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references public.orders(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete cascade not null,
  quantity integer not null default 1,
  price decimal(10,2) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes for better performance
create index if not exists idx_user_profiles_role on public.user_profiles(role);
create index if not exists idx_user_profiles_is_active on public.user_profiles(is_active);
create index if not exists idx_products_category_id on public.products(category_id);
create index if not exists idx_products_featured on public.products(featured) where featured = true;
create index if not exists idx_products_active on public.products(active) where active = true;
create index if not exists idx_download_history_user_id on public.download_history(user_id);
create index if not exists idx_download_history_product_id on public.download_history(product_id);
create index if not exists idx_reviews_product_id on public.reviews(product_id);
create index if not exists idx_reviews_rating on public.reviews(rating);
create index if not exists idx_contact_submissions_status on public.contact_submissions(status);
create index if not exists idx_orders_user_id on public.orders(user_id);
create index if not exists idx_orders_status on public.orders(status);
create index if not exists idx_order_items_order_id on public.order_items(order_id);
create index if not exists idx_order_items_product_id on public.order_items(product_id);

-- Functions (must be defined before RLS policies that use them)

-- Function to check if current user is admin (avoiding recursion)
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.user_profiles
    where user_id = auth.uid() and role = 'admin' and is_active = true
  );
end;
$$ language plpgsql security definer;

-- Function to handle user profile creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.user_profiles (user_id, full_name, avatar_url, email)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url', new.email);
  return new;
end;
$$ language plpgsql security definer;

-- Function to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Enable Row Level Security (RLS)
alter table public.user_profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.download_history enable row level security;
alter table public.reviews enable row level security;
alter table public.contact_submissions enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- RLS Policies

-- Drop all existing policies to avoid conflicts
DO $$ 
BEGIN
    -- Drop user_profiles policies
    DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
    DROP POLICY IF EXISTS "Admins can view all profiles" ON public.user_profiles;
    DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
    DROP POLICY IF EXISTS "Admins can update all profiles" ON public.user_profiles;
    DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;
    
    -- Drop categories policies
    DROP POLICY IF EXISTS "Categories are viewable by everyone" ON public.categories;
    DROP POLICY IF EXISTS "Admins can manage categories" ON public.categories;
    
    -- Drop products policies
    DROP POLICY IF EXISTS "Active products are viewable by everyone" ON public.products;
    DROP POLICY IF EXISTS "Admins can view all products" ON public.products;
    DROP POLICY IF EXISTS "Admins can manage products" ON public.products;
    
    -- Drop download_history policies
    DROP POLICY IF EXISTS "Users can view own downloads" ON public.download_history;
    DROP POLICY IF EXISTS "Users can insert own downloads" ON public.download_history;
    
    -- Drop reviews policies
    DROP POLICY IF EXISTS "Reviews are viewable by everyone" ON public.reviews;
    DROP POLICY IF EXISTS "Authenticated users can create reviews" ON public.reviews;
    DROP POLICY IF EXISTS "Users can update own reviews" ON public.reviews;
    
    -- Drop contact_submissions policies
    DROP POLICY IF EXISTS "Anyone can submit contact forms" ON public.contact_submissions;
    DROP POLICY IF EXISTS "Admins can view and manage contact submissions" ON public.contact_submissions;
    
    -- Drop orders policies
    DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
    DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
    DROP POLICY IF EXISTS "Users can create own orders" ON public.orders;
    DROP POLICY IF EXISTS "Admins can manage all orders" ON public.orders;
    
    -- Drop order_items policies
    DROP POLICY IF EXISTS "Users can view own order items" ON public.order_items;
    DROP POLICY IF EXISTS "Admins can view all order items" ON public.order_items;
    DROP POLICY IF EXISTS "Users can create items for own orders" ON public.order_items;
    DROP POLICY IF EXISTS "Admins can manage all order items" ON public.order_items;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Some policies may not have existed to drop: %', SQLERRM;
END $$;

-- Drop existing policies if they exist
drop policy if exists "Users can view own profile" on public.user_profiles;
drop policy if exists "Admins can view all profiles" on public.user_profiles;
drop policy if exists "Users can update own profile" on public.user_profiles;
drop policy if exists "Admins can update all profiles" on public.user_profiles;
drop policy if exists "Users can insert own profile" on public.user_profiles;

-- User Profiles: Users can only see and edit their own profile, admins can see all
create policy "Users can view own profile" on public.user_profiles
  for select using (auth.uid() = user_id);

create policy "Admins can view all profiles" on public.user_profiles
  for select using (public.is_admin());

create policy "Users can update own profile" on public.user_profiles
  for update using (auth.uid() = user_id);

create policy "Admins can update all profiles" on public.user_profiles
  for update using (public.is_admin());

create policy "Users can insert own profile" on public.user_profiles
  for insert with check (auth.uid() = user_id);

-- Drop existing policies if they exist
drop policy if exists "Categories are viewable by everyone" on public.categories;
drop policy if exists "Admins can manage categories" on public.categories;

-- Categories: Public read access, admins can manage
create policy "Categories are viewable by everyone" on public.categories
  for select using (true);

create policy "Admins can manage categories" on public.categories
  for all using (public.is_admin());

-- Drop existing policies if they exist
drop policy if exists "Active products are viewable by everyone" on public.products;
drop policy if exists "Admins can view all products" on public.products;
drop policy if exists "Admins can manage products" on public.products;

-- Products: Public read access for active products, admins can manage all
create policy "Active products are viewable by everyone" on public.products
  for select using (active = true);

create policy "Admins can view all products" on public.products
  for select using (public.is_admin());

create policy "Admins can manage products" on public.products
  for all using (public.is_admin());

-- Drop existing policies if they exist
drop policy if exists "Users can view own downloads" on public.download_history;
drop policy if exists "Users can insert own downloads" on public.download_history;

-- Download History: Users can only see their own downloads
create policy "Users can view own downloads" on public.download_history
  for select using (auth.uid() = user_id);

create policy "Users can insert own downloads" on public.download_history
  for insert with check (auth.uid() = user_id);

-- Drop existing policies if they exist
drop policy if exists "Reviews are viewable by everyone" on public.reviews;
drop policy if exists "Authenticated users can create reviews" on public.reviews;
drop policy if exists "Users can update own reviews" on public.reviews;

-- Reviews: Public read access, authenticated users can create their own
create policy "Reviews are viewable by everyone" on public.reviews
  for select using (true);

create policy "Authenticated users can create reviews" on public.reviews
  for insert with check (auth.role() = 'authenticated' and auth.uid() = user_id);

create policy "Users can update own reviews" on public.reviews
  for update using (auth.uid() = user_id);

-- Drop existing policies if they exist
drop policy if exists "Anyone can submit contact forms" on public.contact_submissions;
drop policy if exists "Admins can view and manage contact submissions" on public.contact_submissions;

-- Contact Submissions: Users can only insert, admins can view and manage
create policy "Anyone can submit contact forms" on public.contact_submissions
  for insert with check (true);

create policy "Admins can view and manage contact submissions" on public.contact_submissions
  for all using (public.is_admin());

-- Drop existing policies if they exist
drop policy if exists "Users can view own orders" on public.orders;
drop policy if exists "Admins can view all orders" on public.orders;
drop policy if exists "Users can create own orders" on public.orders;
drop policy if exists "Admins can manage all orders" on public.orders;

-- Orders: Users can view their own orders, admins can view all
create policy "Users can view own orders" on public.orders
  for select using (auth.uid() = user_id);

create policy "Admins can view all orders" on public.orders
  for select using (public.is_admin());

create policy "Users can create own orders" on public.orders
  for insert with check (auth.uid() = user_id);

create policy "Admins can manage all orders" on public.orders
  for all using (public.is_admin());

-- Drop existing policies if they exist
drop policy if exists "Users can view own order items" on public.order_items;
drop policy if exists "Admins can view all order items" on public.order_items;
drop policy if exists "Users can create items for own orders" on public.order_items;
drop policy if exists "Admins can manage all order items" on public.order_items;

-- Order Items: Users can view items from their own orders, admins can view all
create policy "Users can view own order items" on public.order_items
  for select using (
    exists (
      select 1 from public.orders o
      where o.id = order_items.order_id and o.user_id = auth.uid()
    )
  );

create policy "Admins can view all order items" on public.order_items
  for select using (public.is_admin());

create policy "Users can create items for own orders" on public.order_items
  for insert with check (
    exists (
      select 1 from public.orders o
      where o.id = order_items.order_id and o.user_id = auth.uid()
    )
  );

create policy "Admins can manage all order items" on public.order_items
  for all using (public.is_admin());

-- Triggers

-- Trigger to automatically create profile on signup
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Triggers for updated_at
drop trigger if exists handle_updated_at on public.user_profiles;
create trigger handle_updated_at before update on public.user_profiles
  for each row execute procedure public.handle_updated_at();

drop trigger if exists handle_updated_at on public.products;
create trigger handle_updated_at before update on public.products
  for each row execute procedure public.handle_updated_at();

-- Insert sample data
insert into public.categories (name, slug, description) values
  ('Web Templates', 'web', 'Modern web templates built with React, Next.js, and more'),
  ('Notion Templates', 'notion', 'Productivity and organization templates for Notion'),
  ('AI Prompts', 'ai', 'Carefully crafted prompts for ChatGPT, Claude, and other AI models'),
  ('Document Templates', 'docs', 'Professional document templates for business and personal use'),
  ('UI Components', 'ui', 'Reusable UI components and design systems')
on conflict (slug) do nothing;

-- Sample products
insert into public.products (title, description, price, category_id, tags, featured, image_url, preview_url) 
select 
  'Developer Portfolio Kit',
  'Complete portfolio template with dark mode, animations, and responsive design. Perfect for showcasing your development projects.',
  49.00,
  c.id,
  array['React', 'TypeScript', 'Tailwind', 'Framer Motion'],
  true,
  '/api/placeholder/400/300',
  'https://portfolio-demo.studionullbyte.com'
from public.categories c where c.slug = 'web'
on conflict do nothing;

insert into public.products (title, description, price, category_id, tags, featured, image_url, preview_url)
select 
  'AI Prompt Engineering Library',
  '200+ tested prompts for ChatGPT, Claude, and other AI models. Boost your productivity with proven prompt templates.',
  29.00,
  c.id,
  array['ChatGPT', 'Claude', 'Midjourney', 'Productivity'],
  true,
  '/api/placeholder/400/300',
  null
from public.categories c where c.slug = 'ai'
on conflict do nothing;

insert into public.products (title, description, price, category_id, tags, featured, image_url, preview_url)
select 
  'Notion Productivity System',
  'Complete productivity system with project management, habit tracking, and goal setting templates.',
  19.00,
  c.id,
  array['Productivity', 'GTD', 'Projects', 'Habits'],
  false,
  '/api/placeholder/400/300',
  'https://notion-template.studionullbyte.com'
from public.categories c where c.slug = 'notion'
on conflict do nothing;
