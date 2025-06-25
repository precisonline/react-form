import {
  userProfileSchema,
  addressSchema,
  getNewAddressDefaultValues,
  defaultUserProfileValues,
  UserProfileFormData,
} from '../../schemas/userProfileSchema'

// Mock the uuidv4 function to return a predictable value
jest.mock('uuid', () => ({
  v4: () => 'a-real-uuid-v4-for-testing',
}))

describe('Form Schemas and Default Values', () => {
  // Test Suite for defaultUserProfileValues
  describe('defaultUserProfileValues', () => {
    it('should match the expected structure and default values', () => {
      expect(defaultUserProfileValues).toEqual({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        deliveryInstructions: '',
        newsletter: false,
        addresses: [],
      })
    })
  })

  // Test Suite for getNewAddressDefaultValues
  describe('getNewAddressDefaultValues', () => {
    it('should return a new address object with a unique ID and default values for USA', () => {
      const newAddress = getNewAddressDefaultValues()
      expect(newAddress).toEqual({
        id: 'a-real-uuid-v4-for-testing',
        addressType: 'Home',
        country: 'USA',
        addressLine2: '',
        usaStreetAddress: '',
        usaCity: '',
        usaState: '',
        usaZipCode: '',
      })
    })
  })

  // Test Suite for userProfileSchema
  describe('userProfileSchema', () => {
    it('should validate a correct user profile object', () => {
      const validProfile: UserProfileFormData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '1234567890',
        deliveryInstructions: 'Leave at the front door',
        newsletter: true,
        addresses: [],
      }
      const result = userProfileSchema.safeParse(validProfile)
      expect(result.success).toBe(true)
    })

    it('should fail validation for an invalid user profile object', () => {
      const invalidProfile = {
        firstName: 'J', // Too short
        lastName: '', // Too short
        email: 'not-an-email',
        phone: '123', // Too short
        addresses: [],
      }
      const result = userProfileSchema.safeParse(invalidProfile)
      expect(result.success).toBe(false)
      expect(result.error?.errors).toHaveLength(4)
    })
  })

  // Test Suite for addressSchema with discriminated union
  describe('addressSchema discriminated union', () => {
    const testUUID = 'f47ac10b-58cc-4372-a567-0e02b2c3d479'

    // Test for USA addresses
    describe('USA Address Validation', () => {
      it('should validate a correct USA address', () => {
        const validUsaAddress = {
          id: testUUID,
          addressType: 'Shipping',
          country: 'USA',
          usaStreetAddress: '123 Main St',
          usaCity: 'Anytown',
          usaState: 'CA',
          usaZipCode: '12345',
        }
        const result = addressSchema.safeParse(validUsaAddress)
        expect(result.success).toBe(true)
      })

      it('should fail validation for an incomplete USA address', () => {
        const invalidUsaAddress = {
          id: testUUID,
          addressType: 'Billing',
          country: 'USA',
          usaStreetAddress: '', // Missing required field
        }
        const result = addressSchema.safeParse(invalidUsaAddress)
        expect(result.success).toBe(false)
      })
    })

    // Test for Canada addresses
    describe('Canada Address Validation', () => {
      it('should validate a correct Canada address', () => {
        const validCanadaAddress = {
          id: testUUID,
          addressType: 'Home',
          country: 'Canada',
          canadaStreetAddress: '456 Maple Ave',
          canadaCity: 'Toronto',
          canadaProvince: 'ON',
          canadaPostalCode: 'M5H 2N2',
        }
        const result = addressSchema.safeParse(validCanadaAddress)
        expect(result.success).toBe(true)
      })

      it('should fail validation for an invalid Canadian postal code', () => {
        const invalidCanadaAddress = {
          id: testUUID,
          addressType: 'Shipping',
          country: 'Canada',
          canadaStreetAddress: '789 Oak Rd',
          canadaCity: 'Vancouver',
          canadaProvince: 'BC',
          canadaPostalCode: '123 456', // Invalid format
        }
        const result = addressSchema.safeParse(invalidCanadaAddress)
        expect(result.success).toBe(false)
      })
    })

    // Test for UK addresses
    describe('UK Address Validation', () => {
      it('should validate a correct UK address', () => {
        const validUkAddress = {
          id: testUUID,
          addressType: 'Billing',
          country: 'UK',
          ukStreetAddress: '10 Downing Street',
          ukTownCity: 'London',
          ukPostcode: 'SW1A 2AA',
        }
        const result = addressSchema.safeParse(validUkAddress)
        expect(result.success).toBe(true)
      })

      it('should fail validation for an incomplete UK address', () => {
        const incompleteUkAddress = {
          id: testUUID,
          addressType: 'Home',
          country: 'UK',
          ukStreetAddress: '10 Downing Street',
          // Missing town/city and postcode
        }
        const result = addressSchema.safeParse(incompleteUkAddress)
        expect(result.success).toBe(false)
      })
    })

    // Test for "Other" countries
    describe('Other Country Address Validation', () => {
      it('should validate a correct address for Germany', () => {
        const validGenericAddress = {
          id: testUUID,
          addressType: 'Other',
          country: 'Germany',
          addressLine1: 'Musterstraße 1',
          cityOrTown: 'Berlin',
          postalOrZipCode: '10115',
        }
        const result = addressSchema.safeParse(validGenericAddress)
        expect(result.success).toBe(true)
      })

      it('should fail validation for an incomplete address for France', () => {
        const incompleteGenericAddress = {
          id: testUUID,
          addressType: 'Other',
          country: 'France',
          // Missing address line 1
        }
        const result = addressSchema.safeParse(incompleteGenericAddress)
        expect(result.success).toBe(false)
      })
    })
  })
})
