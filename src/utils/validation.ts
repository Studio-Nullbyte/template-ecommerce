/**
 * Input validation and sanitization utilities
 * Provides secure input handling for forms and user data
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  sanitized?: string;
}

/**
 * Sanitize HTML content to prevent XSS attacks
 */
export function sanitizeHtml(input: string): string {
  if (!input || typeof input !== 'string') return '';
  
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Validate email addresses
 */
export function validateEmail(email: string): ValidationResult {
  const sanitized = sanitizeHtml(email.trim());
  
  if (!sanitized) {
    return { isValid: false, error: 'Email is required' };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(sanitized)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }
  
  if (sanitized.length > 254) {
    return { isValid: false, error: 'Email address is too long' };
  }
  
  return { isValid: true, sanitized };
}

/**
 * Validate names (first name, last name, company name)
 */
export function validateName(name: string, fieldName: string = 'Name'): ValidationResult {
  const sanitized = sanitizeHtml(name.trim());
  
  if (!sanitized) {
    return { isValid: false, error: `${fieldName} is required` };
  }
  
  if (sanitized.length < 2) {
    return { isValid: false, error: `${fieldName} must be at least 2 characters` };
  }
  
  if (sanitized.length > 50) {
    return { isValid: false, error: `${fieldName} must be less than 50 characters` };
  }
  
  // Allow letters, spaces, hyphens, and apostrophes
  const nameRegex = /^[a-zA-Z\s\-']+$/;
  if (!nameRegex.test(sanitized)) {
    return { isValid: false, error: `${fieldName} can only contain letters, spaces, hyphens, and apostrophes` };
  }
  
  return { isValid: true, sanitized };
}

/**
 * Validate product names/titles
 */
export function validateTitle(title: string): ValidationResult {
  const sanitized = sanitizeHtml(title.trim());
  
  if (!sanitized) {
    return { isValid: false, error: 'Title is required' };
  }
  
  if (sanitized.length < 3) {
    return { isValid: false, error: 'Title must be at least 3 characters' };
  }
  
  if (sanitized.length > 100) {
    return { isValid: false, error: 'Title must be less than 100 characters' };
  }
  
  return { isValid: true, sanitized };
}

/**
 * Validate descriptions
 */
export function validateDescription(description: string): ValidationResult {
  const sanitized = sanitizeHtml(description.trim());
  
  if (!sanitized) {
    return { isValid: false, error: 'Description is required' };
  }
  
  if (sanitized.length < 10) {
    return { isValid: false, error: 'Description must be at least 10 characters' };
  }
  
  if (sanitized.length > 1000) {
    return { isValid: false, error: 'Description must be less than 1000 characters' };
  }
  
  return { isValid: true, sanitized };
}

/**
 * Validate URLs
 */
export function validateUrl(url: string): ValidationResult {
  const sanitized = sanitizeHtml(url.trim());
  
  if (!sanitized) {
    return { isValid: false, error: 'URL is required' };
  }
  
  try {
    new URL(sanitized);
    
    // Additional security: only allow http/https
    if (!sanitized.startsWith('http://') && !sanitized.startsWith('https://')) {
      return { isValid: false, error: 'URL must start with http:// or https://' };
    }
    
    return { isValid: true, sanitized };
  } catch {
    return { isValid: false, error: 'Please enter a valid URL' };
  }
}

/**
 * Validate prices
 */
export function validatePrice(price: string): ValidationResult {
  const sanitized = sanitizeHtml(price.trim());
  
  if (!sanitized) {
    return { isValid: false, error: 'Price is required' };
  }
  
  const priceNumber = parseFloat(sanitized);
  
  if (isNaN(priceNumber)) {
    return { isValid: false, error: 'Price must be a valid number' };
  }
  
  if (priceNumber < 0) {
    return { isValid: false, error: 'Price cannot be negative' };
  }
  
  if (priceNumber > 999999.99) {
    return { isValid: false, error: 'Price cannot exceed $999,999.99' };
  }
  
  // Round to 2 decimal places
  const roundedPrice = Math.round(priceNumber * 100) / 100;
  
  return { isValid: true, sanitized: roundedPrice.toString() };
}

/**
 * Validate slugs (URL-friendly identifiers)
 */
export function validateSlug(slug: string): ValidationResult {
  const sanitized = slug.trim().toLowerCase();
  
  if (!sanitized) {
    return { isValid: false, error: 'Slug is required' };
  }
  
  if (sanitized.length < 3) {
    return { isValid: false, error: 'Slug must be at least 3 characters' };
  }
  
  if (sanitized.length > 50) {
    return { isValid: false, error: 'Slug must be less than 50 characters' };
  }
  
  // Only allow lowercase letters, numbers, and hyphens
  const slugRegex = /^[a-z0-9-]+$/;
  if (!slugRegex.test(sanitized)) {
    return { isValid: false, error: 'Slug can only contain lowercase letters, numbers, and hyphens' };
  }
  
  // Don't allow starting or ending with hyphen
  if (sanitized.startsWith('-') || sanitized.endsWith('-')) {
    return { isValid: false, error: 'Slug cannot start or end with a hyphen' };
  }
  
  return { isValid: true, sanitized };
}

/**
 * Validate message content (for contact forms)
 */
export function validateMessage(message: string): ValidationResult {
  const sanitized = sanitizeHtml(message.trim());
  
  if (!sanitized) {
    return { isValid: false, error: 'Message is required' };
  }
  
  if (sanitized.length < 10) {
    return { isValid: false, error: 'Message must be at least 10 characters' };
  }
  
  if (sanitized.length > 2000) {
    return { isValid: false, error: 'Message must be less than 2000 characters' };
  }
  
  return { isValid: true, sanitized };
}

/**
 * Generic text validation
 */
export function validateText(text: string, minLength: number = 1, maxLength: number = 255): ValidationResult {
  const sanitized = sanitizeHtml(text.trim());
  
  if (!sanitized) {
    return { isValid: false, error: 'This field is required' };
  }
  
  if (sanitized.length < minLength) {
    return { isValid: false, error: `Must be at least ${minLength} characters` };
  }
  
  if (sanitized.length > maxLength) {
    return { isValid: false, error: `Must be less than ${maxLength} characters` };
  }
  
  return { isValid: true, sanitized };
}

/**
 * Validate form data object
 */
export function validateFormData(data: Record<string, any>, schema: Record<string, (value: any) => ValidationResult>): {
  isValid: boolean;
  errors: Record<string, string>;
  sanitized: Record<string, any>;
} {
  const errors: Record<string, string> = {};
  const sanitized: Record<string, any> = {};
  
  for (const [field, validator] of Object.entries(schema)) {
    const result = validator(data[field]);
    
    if (!result.isValid) {
      errors[field] = result.error || 'Invalid input';
    } else {
      sanitized[field] = result.sanitized;
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitized
  };
}
