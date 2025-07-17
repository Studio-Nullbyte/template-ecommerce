// PayPal configuration
export const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID || ''

// PayPal API endpoints
export const PAYPAL_API_BASE = import.meta.env.VITE_PAYPAL_API_BASE || 'https://api.sandbox.paypal.com'

// Return and Cancel URLs (can be overridden with environment variables)
export const PAYPAL_RETURN_URL = import.meta.env.VITE_PAYPAL_RETURN_URL || `${window.location.origin}/success`
export const PAYPAL_CANCEL_URL = import.meta.env.VITE_PAYPAL_CANCEL_URL || `${window.location.origin}/cancel`

// Validate PayPal configuration
if (!PAYPAL_CLIENT_ID) {
  console.error('VITE_PAYPAL_CLIENT_ID is required for PayPal integration')
}

export const PAYPAL_OPTIONS = {
  clientId: PAYPAL_CLIENT_ID,
  currency: "USD",
  intent: "capture",
  components: "buttons",
  "enable-funding": "venmo,paylater",
  "disable-funding": "card"
}

export const PAYPAL_STYLES = {
  layout: 'vertical' as const,
  color: 'gold' as const,
  shape: 'rect' as const,
  label: 'paypal' as const,
  height: 40
}

export interface PayPalOrderData {
  intent: string
  purchase_units: Array<{
    reference_id?: string
    amount: {
      currency_code: string
      value: string
    }
    payee?: {
      merchant_id?: string
    }
    description?: string
    custom_id?: string
    invoice_id?: string
    soft_descriptor?: string
  }>
  application_context?: {
    brand_name?: string
    locale?: string
    landing_page?: string
    shipping_preference?: string
    user_action?: string
    return_url?: string
    cancel_url?: string
  }
}

export interface PayPalAddress {
  address_line_1: string
  address_line_2?: string
  admin_area_2: string // City
  admin_area_1: string // State
  postal_code: string
  country_code: string
}
