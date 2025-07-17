import emailjs from '@emailjs/browser'
import { logger } from '../utils/logger'

// EmailJS configuration
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

interface OrderEmailData {
  customerName: string
  customerEmail: string
  productName: string
  productPrice: number
  downloadLink: string
  orderNumber: string
  purchaseDate: string
}

interface ContactEmailData {
  name: string
  email: string
  subject: string
  message: string
}

class EmailService {
  private initialized = false

  constructor() {
    this.init()
  }

  private init() {
    if (this.initialized || !EMAILJS_PUBLIC_KEY) {
      return
    }

    try {
      emailjs.init(EMAILJS_PUBLIC_KEY)
      this.initialized = true
    } catch (error) {
      console.error('EmailJS initialization failed:', error)
    }
  }

  /**
   * Send order confirmation email with download link
   */
  async sendOrderConfirmation(orderData: OrderEmailData): Promise<boolean> {
    if (!this.initialized) {
      console.error('EmailJS not initialized')
      return false
    }

    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID) {
      console.error('EmailJS configuration missing')
      return false
    }

    try {
      const templateParams = {
        customer_name: orderData.customerName,
        customer_email: orderData.customerEmail,
        product_name: orderData.productName,
        product_price: `$${orderData.productPrice.toFixed(2)}`,
        download_link: orderData.downloadLink,
        order_number: orderData.orderNumber,
        purchase_date: orderData.purchaseDate,
        company_name: 'Studio Nullbyte',
        support_email: 'studionullbyte@gmail.com',
        website_url: 'https://studio-nullbyte.github.io/studio-nullbyte.github.io/',
      }

      const response = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams
      )

      logger.info('Order confirmation email sent:', response)
      return response.status === 200
    } catch (error) {
      logger.error('Failed to send order confirmation email:', error)
      return false
    }
  }

  /**
   * Send contact form email
   */
  async sendContactForm(contactData: ContactEmailData): Promise<boolean> {
    if (!this.initialized) {
      console.error('EmailJS not initialized')
      return false
    }

    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID) {
      console.error('EmailJS configuration missing')
      return false
    }

    try {
      const templateParams = {
        from_name: contactData.name,
        from_email: contactData.email,
        subject: contactData.subject,
        message: contactData.message,
        to_email: 'studionullbyte@gmail.com',
        reply_to: contactData.email,
      }

      const response = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams
      )

      logger.info('Contact form email sent:', response)
      return response.status === 200
    } catch (error) {
      logger.error('Failed to send contact form email:', error)
      return false
    }
  }

  /**
   * Test email configuration
   */
  async testConfiguration(): Promise<boolean> {
    const testData: OrderEmailData = {
      customerName: 'Test Customer',
      customerEmail: 'test@example.com',
      productName: 'Test Product',
      productPrice: 29.99,
      downloadLink: 'https://example.com/download/test',
      orderNumber: 'TEST-001',
      purchaseDate: new Date().toLocaleDateString(),
    }

    return this.sendOrderConfirmation(testData)
  }
}

// Export singleton instance
export const emailService = new EmailService()
export default emailService
