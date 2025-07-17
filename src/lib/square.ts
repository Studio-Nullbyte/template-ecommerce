// Square configuration
export const SQUARE_APPLICATION_ID = import.meta.env.VITE_SQUARE_APPLICATION_ID || 'sandbox-sq0idb-your-app-id'
export const SQUARE_LOCATION_ID = import.meta.env.VITE_SQUARE_LOCATION_ID || 'your-location-id'
export const SQUARE_ENVIRONMENT = import.meta.env.VITE_SQUARE_ENVIRONMENT || 'sandbox' // 'sandbox' or 'production'

// Square Web SDK configuration
export const SQUARE_WEB_SDK_CONFIG = {
  applicationId: SQUARE_APPLICATION_ID,
  locationId: SQUARE_LOCATION_ID,
  environment: SQUARE_ENVIRONMENT
}

// Square payment form styles
export const SQUARE_CARD_STYLES = {
  '.input-container': {
    borderColor: '#374151',
    borderRadius: '4px',
    borderWidth: '1px',
    backgroundColor: '#1F2937',
    color: '#FFFFFF',
    fontSize: '14px',
    fontFamily: 'JetBrains Mono, monospace',
    padding: '12px'
  },
  '.input-container:focus': {
    borderColor: '#8B5CF6',
    outline: 'none'
  },
  '.input-container.is-error': {
    borderColor: '#EF4444'
  },
  '.input-container.is-valid': {
    borderColor: '#10B981'
  },
  '.message-text': {
    color: '#EF4444',
    fontSize: '12px',
    fontFamily: 'JetBrains Mono, monospace'
  }
}

// Square payment request (simplified for frontend use)
export interface SquarePaymentRequest {
  sourceId: string
  amount: number
  currency: string
  locationId: string
  referenceId?: string
  note?: string
  buyerEmailAddress?: string
  billingAddress?: {
    firstName?: string
    lastName?: string
    addressLine1?: string
    addressLine2?: string
    locality?: string
    administrativeDistrictLevel1?: string
    postalCode?: string
    country?: string
  }
}

// Square payment response
export interface SquarePaymentResponse {
  payment: {
    id: string
    status: string
    amountMoney: {
      amount: number
      currency: string
    }
    sourceType: string
    cardDetails?: {
      card: {
        cardBrand: string
        last4: string
        expMonth: number
        expYear: number
        fingerprint: string
        cardType: string
      }
      status: string
      entryMethod: string
    }
    receiptNumber?: string
    receiptUrl?: string
    orderId?: string
    locationId: string
    createdAt: string
    updatedAt: string
  }
}

// Square error response
export interface SquareErrorResponse {
  errors: Array<{
    category: string
    code: string
    detail: string
    field?: string
  }>
}
