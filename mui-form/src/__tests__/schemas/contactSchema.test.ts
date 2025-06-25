import {
  contactSchema,
  baseDefaultValues,
  countrySpecificDefaultValues,
  ContactFormData,
} from '../../schemas/contactSchema'

describe('Contact Form Schema Validation', () => {
  // Base valid data for all tests
  const baseValidData = {
    ...baseDefaultValues,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '1234567890',
  }

  describe('Base Contact Information Validation', () => {
    it('should fail if base fields are invalid', () => {
      const invalidData = {
        ...baseValidData,
        firstName: 'J',
        email: 'not-an-email',
        country: 'USA',
        ...countrySpecificDefaultValues.USA,
        usaStreetAddress: '123 Main St',
        usaCity: 'Anytown',
        usaState: 'CA',
        usaZipCode: '12345',
      }
      const result = contactSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        const errorMessages = result.error.issues.map((issue) => issue.message)
        expect(errorMessages).toContain(
          'First name must be at least 2 characters'
        )
        expect(errorMessages).toContain('Invalid email address')
        expect(errorMessages.length).toBe(2)
      }
    })
  })

  describe('Country-Specific Address Validation', () => {
    it('should validate a complete USA address', () => {
      const data: ContactFormData = {
        ...baseValidData,
        country: 'USA',
        ...countrySpecificDefaultValues.USA,
        usaStreetAddress: '123 Main St',
        usaCity: 'Anytown',
        usaState: 'CA',
        usaZipCode: '12345',
      }
      const result = contactSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should fail validation for an incomplete USA address', () => {
      const data = {
        ...baseValidData,
        country: 'USA',
        ...countrySpecificDefaultValues.USA,
      }
      const result = contactSchema.safeParse(data)
      expect(result.success).toBe(false)
    })

    it('should validate a complete Canada address', () => {
      const data: ContactFormData = {
        ...baseValidData,
        country: 'Canada',
        ...countrySpecificDefaultValues.Canada,
        canadaStreetAddress: '456 Maple Ave',
        canadaCity: 'Toronto',
        canadaProvince: 'ON',
        canadaPostalCode: 'M5H 2N2',
      }
      const result = contactSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should validate a complete UK address', () => {
      const data: ContactFormData = {
        ...baseValidData,
        country: 'UK',
        ...countrySpecificDefaultValues.UK,
        ukStreetAddress: '10 Downing Street',
        ukTownCity: 'London',
        ukPostcode: 'SW1A 2AA',
      }
      const result = contactSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should validate a complete "Other" country address', () => {
      const data: ContactFormData = {
        ...baseValidData,
        country: 'Germany',
        ...countrySpecificDefaultValues.Other,
        addressLine1: 'Musterstraße 1',
        cityOrTown: 'Berlin',
      }
      const result = contactSchema.safeParse(data)
      expect(result.success).toBe(true)
    })
  })

  describe('Default Values', () => {
    it('should provide valid base default values', () => {
      expect(baseDefaultValues.firstName).toBe('')
      expect(baseDefaultValues.newsletter).toBe(false)
    })

    it('should provide valid country-specific default values', () => {
      expect(countrySpecificDefaultValues.USA.usaCity).toBe('')
      expect(countrySpecificDefaultValues.Canada.canadaCity).toBe('')
      expect(countrySpecificDefaultValues.UK.ukTownCity).toBe('')
      expect(countrySpecificDefaultValues.Other.cityOrTown).toBe('')
    })
  })
})
