import { z } from 'zod'
import {
  contactSchema,
  ContactFormData,
  defaultContactValues,
} from '../../schemas/contactSchema'
import { commonEnums } from '../../schemas/common'

describe('Contact Schema Validation', () => {
  // Test valid contact data
  const validContactData: ContactFormData[] = [
    {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '1234567890',
      preferredContactMethod: 'Email',
    },
    {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      phone: '0987654321',
    },
    {
      firstName: 'Alice',
      lastName: 'Johnson',
      email: 'alice.johnson@example.com',
      phone: '+11234567890',
      preferredContactMethod: 'Phone',
    },
  ]

  // Test invalid contact data
  const invalidContactData: Partial<ContactFormData>[] = [
    // Missing required fields
    {
      firstName: '',
      lastName: '',
      email: 'invalid-email',
      phone: '123',
    },
    // Invalid email format
    {
      firstName: 'John',
      lastName: 'Doe',
      email: 'invalid-email',
      phone: '1234567890',
    },
    // Invalid phone number
    {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      phone: '123',
    },
    // Invalid preferred contact method
    {
      firstName: 'Bob',
      lastName: 'Brown',
      email: 'bob.brown@example.com',
      phone: '1234567890',
      preferredContactMethod:
        'Carrier Pigeon' as unknown as ContactFormData['preferredContactMethod'],
    },
  ]

  // Helper function to log validation errors
  const logValidationErrors = (
    result: z.SafeParseReturnType<ContactFormData, ContactFormData>
  ) => {
    if (!result.success) {
      console.error('Validation Errors:', result.error.errors)
    }
  }

  // Validate correct contact structures
  describe('Valid Contact Validation', () => {
    validContactData.forEach((contactData, index) => {
      it(`should validate contact (Case ${index + 1})`, () => {
        const result = contactSchema.safeParse(contactData)
        logValidationErrors(result)
        expect(result.success).toBe(true)
      })
    })
  })

  // Validate incorrect contact structures
  describe('Invalid Contact Validation', () => {
    invalidContactData.forEach((contactData, index) => {
      it(`should fail validation for invalid contact (Case ${
        index + 1
      })`, () => {
        const result = contactSchema.safeParse(contactData)
        expect(result.success).toBe(false)
      })
    })
  })

  // Test default values
  describe('Default Values', () => {
    it('should have correct default contact values', () => {
      const defaultContact = defaultContactValues

      expect(defaultContact.firstName).toBe('')
      expect(defaultContact.lastName).toBe('')
      expect(defaultContact.email).toBe('')
      expect(defaultContact.phone).toBe('')
      expect(defaultContact.preferredContactMethod).toBeUndefined()
    })

    it('should validate against schema with default values', () => {
      const result = contactSchema.safeParse(defaultContactValues)
      expect(result.success).toBe(true)
    })
  })

  // Test contact method enum
  describe('Contact Method Enum', () => {
    it('should have correct contact method options', () => {
      expect(commonEnums.contactMethod).toEqual(['Email', 'Phone', 'Mail'])
    })

    it('should validate preferred contact method', () => {
      const validContactMethods: ContactFormData[] =
        commonEnums.contactMethod.map((method) => ({
          firstName: 'Test',
          lastName: 'User',
          email: `test.${method.toLowerCase()}@example.com`,
          phone: '1234567890',
          preferredContactMethod: method,
        }))

      validContactMethods.forEach((contactData) => {
        const result = contactSchema.safeParse(contactData)
        expect(result.success).toBe(true)
      })
    })
  })

  // Specific field validation
  describe('Specific Field Validations', () => {
    it('should validate email format', () => {
      const validEmails = [
        'user@example.com',
        'user.name@example.co.uk',
        'user+tag@example.com',
      ]

      const invalidEmails = [
        'invalid-email',
        'user@',
        '@example.com',
        'user@.com',
      ]

      validEmails.forEach((email) => {
        const validContact: ContactFormData = {
          firstName: 'Valid',
          lastName: 'User',
          email,
          phone: '1234567890',
        }
        const result = contactSchema.safeParse(validContact)
        expect(result.success).toBe(true)
      })

      invalidEmails.forEach((email) => {
        const invalidContact: ContactFormData = {
          firstName: 'Invalid',
          lastName: 'User',
          email,
          phone: '1234567890',
        }
        const result = contactSchema.safeParse(invalidContact)
        expect(result.success).toBe(false)
      })
    })
  })
})
