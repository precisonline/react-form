// src/__tests__/schemas/contactSchema.test.ts
import { contactSchema, ContactFormData } from '../../schemas/contactSchema'

describe('Contact Form Schema Validation', () => {
  const validData: ContactFormData = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '1234567890',
    country: 'United States',
    message: 'This is a test message that is long enough.',
    newsletter: false,
  }

  describe('firstName validation', () => {
    it('should accept valid first name', () => {
      const result = contactSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject empty first name', () => {
      const data = { ...validData, firstName: '' }
      const result = contactSchema.safeParse(data)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('First name is required')
      }
    })

    it('should reject first name with less than 2 characters', () => {
      const data = { ...validData, firstName: 'J' }
      const result = contactSchema.safeParse(data)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'First name must be at least 2 characters'
        )
      }
    })

    it('should reject first name with more than 50 characters', () => {
      const data = { ...validData, firstName: 'A'.repeat(51) }
      const result = contactSchema.safeParse(data)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'First name must be less than 50 characters'
        )
      }
    })

    it('should reject first name with numbers', () => {
      const data = { ...validData, firstName: 'John123' }
      const result = contactSchema.safeParse(data)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'First name can only contain letters and spaces'
        )
      }
    })

    it('should accept first name with spaces', () => {
      const data = { ...validData, firstName: 'John Paul' }
      const result = contactSchema.safeParse(data)
      expect(result.success).toBe(true)
    })
  })

  describe('lastName validation', () => {
    it('should accept valid last name', () => {
      const result = contactSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject empty last name', () => {
      const data = { ...validData, lastName: '' }
      const result = contactSchema.safeParse(data)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Last name is required')
      }
    })
  })

  describe('email validation', () => {
    it('should accept valid email', () => {
      const result = contactSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject invalid email format', () => {
      const data = { ...validData, email: 'invalid-email' }
      const result = contactSchema.safeParse(data)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'Please enter a valid email address'
        )
      }
    })

    it('should reject empty email', () => {
      const data = { ...validData, email: '' }
      const result = contactSchema.safeParse(data)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Email is required')
      }
    })

    it('should reject email over 100 characters', () => {
      const data = { ...validData, email: 'a'.repeat(90) + '@email.com' }
      const result = contactSchema.safeParse(data)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'Email must be less than 100 characters'
        )
      }
    })
  })

  describe('phone validation', () => {
    it('should accept valid phone number', () => {
      const result = contactSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should accept phone with country code', () => {
      const data = { ...validData, phone: '+1234567890' }
      const result = contactSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should reject empty phone', () => {
      const data = { ...validData, phone: '' }
      const result = contactSchema.safeParse(data)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Phone number is required')
      }
    })

    it('should reject invalid phone format', () => {
      const data = { ...validData, phone: '123-abc-4567' }
      const result = contactSchema.safeParse(data)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'Please enter a valid phone number'
        )
      }
    })
  })

  describe('country validation', () => {
    it('should accept valid country', () => {
      const result = contactSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject empty country', () => {
      const data = { ...validData, country: '' }
      const result = contactSchema.safeParse(data)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Please select a country')
      }
    })
  })

  describe('message validation (optional)', () => {
    it('should accept valid message', () => {
      const result = contactSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should accept empty message (optional)', () => {
      const data = { ...validData, message: '' }
      const result = contactSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should accept undefined message (optional)', () => {
      const data = { ...validData }
      delete data.message
      const result = contactSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should reject message less than 10 characters when provided', () => {
      const data = { ...validData, message: 'Short' }
      const result = contactSchema.safeParse(data)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'Message must be at least 10 characters if provided'
        )
      }
    })

    it('should reject message over 1000 characters', () => {
      const data = { ...validData, message: 'A'.repeat(1001) }
      const result = contactSchema.safeParse(data)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'Message must be less than 1000 characters'
        )
      }
    })
  })

  describe('newsletter validation', () => {
    it('should accept newsletter as false', () => {
      const result = contactSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should accept newsletter as true', () => {
      const data = { ...validData, newsletter: true }
      const result = contactSchema.safeParse(data)
      expect(result.success).toBe(true)
    })
  })

  describe('complete form validation', () => {
    it('should validate complete valid form', () => {
      const result = contactSchema.safeParse(validData)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toEqual(validData)
      }
    })

    it('should handle multiple validation errors', () => {
      const invalidData = {
        firstName: '',
        lastName: 'A',
        email: 'invalid-email',
        phone: '',
        country: '',
        message: 'Short',
        newsletter: false,
      }
      const result = contactSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThan(1)
      }
    })
  })
})
