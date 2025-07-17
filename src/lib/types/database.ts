export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          user_id: string
          full_name: string | null
          avatar_url: string | null
          email: string
          role: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          full_name?: string | null
          avatar_url?: string | null
          email: string
          role?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          full_name?: string | null
          avatar_url?: string | null
          email?: string
          role?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          created_at?: string
        }
      }
      products: {
        Row: {
          id: string
          title: string
          description: string
          price: number
          category_id: string
          image_url: string | null
          download_url: string | null
          preview_url: string | null
          tags: string[]
          featured: boolean
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          price: number
          category_id: string
          image_url?: string | null
          download_url?: string | null
          preview_url?: string | null
          tags?: string[]
          featured?: boolean
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          price?: number
          category_id?: string
          image_url?: string | null
          download_url?: string | null
          preview_url?: string | null
          tags?: string[]
          featured?: boolean
          active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      download_history: {
        Row: {
          id: string
          user_id: string
          product_id: string
          downloaded_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          downloaded_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          downloaded_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          user_id: string
          product_id: string
          rating: number
          comment: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          rating: number
          comment?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          rating?: number
          comment?: string | null
          created_at?: string
        }
      }
      contact_submissions: {
        Row: {
          id: string
          name: string
          email: string
          subject: string
          message: string
          submitted_at: string
          status: 'new' | 'in_progress' | 'resolved'
        }
        Insert: {
          id?: string
          name: string
          email: string
          subject: string
          message: string
          submitted_at?: string
          status?: 'new' | 'in_progress' | 'resolved'
        }
        Update: {
          id?: string
          name?: string
          email?: string
          subject?: string
          message?: string
          submitted_at?: string
          status?: 'new' | 'in_progress' | 'resolved'
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Convenience types
export type UserProfile = Database['public']['Tables']['user_profiles']['Row']
export type Category = Database['public']['Tables']['categories']['Row']
export type Product = Database['public']['Tables']['products']['Row']
export type DownloadHistory = Database['public']['Tables']['download_history']['Row']
export type Review = Database['public']['Tables']['reviews']['Row']
export type ContactSubmission = Database['public']['Tables']['contact_submissions']['Row']

// Product with relations
export type ProductWithDetails = Product & {
  categories: Category
  downloads: { count: number }[]
  reviews: (Review & { user_profiles: Pick<UserProfile, 'full_name'> })[]
}
