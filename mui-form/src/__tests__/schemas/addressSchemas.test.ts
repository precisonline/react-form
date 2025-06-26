import { z } from 'zod'
import {
  addressSchema,
  AddressFormData,
  countries,
  addressTypes,
} from '../../schemas/addressSchema'

describe('Address Schema Validation', () => {
  // Test data for different address types
  const validAddressTestCases: AddressFormData[] = [
    {
      id: 'usa-1',
      addressType: 'Home',
      country: 'USA',
      usaStreetAddress: '123 Main St',
      usaCity: 'Denver',
      usaState: 'CO',
      usaZipCode: '80202',
    },
    {
      id: 'canada-1',
      addressType: 'Work',
      country: 'Canada',
      canadaStreetAddress: '456 Maple Ave',
      canadaCity: 'Toronto',
      canadaProvince: 'ON',
      canadaPostalCode: 'M5H 2N2',
    },
  ]

  const invalidAddressTestCases = [
    // Missing required fields
    {
      id: 'invalid-1',
      addressType: 'Home',
      country: 'USA',
      usaStreetAddress: '',
      usaCity: '',
      usaState: '',
      usaZipCode: '',
    },
    // Invalid state/province format
    {
      id: 'invalid-2',
      addressType: 'Work',
      country: 'USA',
      usaStreetAddress: '789 Oak Rd',
      usaCity: 'Chicago',
      usaState: 'Illinois', // Should be 2-letter code
      usaZipCode: '60601',
    },
  ]

  // Helper function to log validation errors
  const logValidationErrors = (
    result: z.SafeParseReturnType<AddressFormData, AddressFormData>
  ) => {
    if (!result.success) {
      console.error('Validation Errors:', result.error.errors)
    }
  }

  // Validate correct address structures
  describe('Valid Address Validation', () => {
    validAddressTestCases.forEach((addressData, index) => {
      it(`should validate ${addressData.country} address (Case ${
        index + 1
      })`, () => {
        const result = addressSchema.safeParse(addressData)
        logValidationErrors(result)
        expect(result.success).toBe(true)
      })
    })
  })

  // Validate incorrect address structures
  describe('Invalid Address Validation', () => {
    invalidAddressTestCases.forEach((addressData, index) => {
      it(`should fail validation for invalid address (Case ${
        index + 1
      })`, () => {
        const result = addressSchema.safeParse(addressData)
        expect(result.success).toBe(false)
      })
    })
  })

  // Test constants
  describe('Schema Constants', () => {
    it('should have correct countries', () => {
      expect(countries).toEqual(['USA', 'Canada', 'UK', 'Other'])
    })

    it('should have correct address types', () => {
      expect(addressTypes).toContain('Home')
      expect(addressTypes).toContain('Work')
      expect(addressTypes).toContain('Shipping')
      expect(addressTypes).toContain('Billing')
      expect(addressTypes).toContain('Other')
    })
  })

  // Specific validation tests
  describe('Specific Field Validations', () => {
    it('should validate USA ZIP code format', () => {
      const validUsaAddress: AddressFormData = {
        id: 'usa-zip-valid',
        addressType: 'Home',
        country: 'USA',
        usaStreetAddress: '123 Test St',
        usaCity: 'TestCity',
        usaState: 'CA',
        usaZipCode: '12345',
      }

      const invalidUsaAddresses: AddressFormData[] = [
        {
          ...validUsaAddress,
          usaZipCode: '1234', // Too short
        },
        {
          ...validUsaAddress,
          usaZipCode: '123456789', // Too long
        },
      ]

      const validResult = addressSchema.safeParse(validUsaAddress)
      expect(validResult.success).toBe(true)

      invalidUsaAddresses.forEach((invalidAddress) => {
        const invalidResult = addressSchema.safeParse(invalidAddress)
        expect(invalidResult.success).toBe(false)
      })
    })
  })
})
