import { z } from 'zod'
import {
  userProfileSchema,
  UserProfileFormData,
  defaultUserProfileValues,
} from '../../schemas/userProfileSchema'
import { addressSchema, AddressFormData } from '../../schemas/addressSchema'
import { contactSchema, ContactFormData } from '../../schemas/contactSchema'

describe('User Profile Schema Validation', () => {
  // Test valid user profile data
  const validUserProfiles: UserProfileFormData[] = [
    {
      contact: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '1234567890',
      },
      newsletter: true,
      addresses: [
        {
          addressType: 'Home',
          country: 'USA',
          usaStreetAddress: '123 Main St',
          usaCity: 'Denver',
          usaState: 'CO',
          usaZipCode: '80202',
        },
      ],
    },
    {
      contact: {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        phone: '0987654321',
      },
      newsletter: false,
      addresses: [],
    },
  ]

  // Test invalid user profile data
  const invalidUserProfiles: Partial<UserProfileFormData>[] = [
    // Missing required contact information
    {
      contact: {
        firstName: '',
        lastName: '',
        email: 'invalid-email',
        phone: '123',
      },
    },
    // Invalid address
    {
      contact: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '1234567890',
      },
      addresses: [
        {
          addressType: 'Home',
          country: 'USA',
          usaStreetAddress: '',
          usaCity: '',
          usaState: '',
          usaZipCode: '',
        },
      ],
    },
  ]

  // More complex invalid scenarios
  const moreInvalidProfiles: Partial<UserProfileFormData>[] = [
    // Overflow address array
    {
      contact: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '1234567890',
      },
      addresses: [
        {
          addressType: 'Home',
          country: 'USA',
          usaStreetAddress: '',
          usaCity: '',
          usaState: '',
          usaZipCode: '',
        },
      ],
    },
    // Malformed contact information
    {
      contact: {
        firstName: 'A', // Too short
        lastName: 'B', // Too short
        email: 'not-an-email',
        phone: 'invalid-phone',
      },
    },
  ]

  // Helper function to log validation errors
  const logValidationErrors = (
    result: z.SafeParseReturnType<UserProfileFormData, UserProfileFormData>
  ) => {
    if (!result.success) {
      console.error('Validation Errors:', result.error.errors)
    }
  }

  // Validate correct user profile structures
  describe('Valid User Profile Validation', () => {
    validUserProfiles.forEach((profileData, index) => {
      it(`should validate user profile (Case ${index + 1})`, () => {
        const result = userProfileSchema.safeParse(profileData)
        logValidationErrors(result)
        expect(result.success).toBe(true)
      })
    })
  })

  // Validate incorrect user profile structures
  describe('Invalid User Profile Validation', () => {
    // Combine both sets of invalid profiles
    const allInvalidProfiles = [...invalidUserProfiles, ...moreInvalidProfiles]

    allInvalidProfiles.forEach((profileData, index) => {
      it(`should fail validation for invalid profile (Case ${
        index + 1
      })`, () => {
        const result = userProfileSchema.safeParse(profileData)
        expect(result.success).toBe(false)
      })
    })
  })

  // Test default values
  describe('Default Values', () => {
    it('should have correct default user profile values', () => {
      const defaultProfile = defaultUserProfileValues

      expect(defaultProfile.contact.firstName).toBe('')
      expect(defaultProfile.contact.lastName).toBe('')
      expect(defaultProfile.contact.email).toBe('')
      expect(defaultProfile.contact.phone).toBe('')
      expect(defaultProfile.newsletter).toBe(false)
      expect(defaultProfile.addresses).toEqual([])
    })

    it('should validate against schema with default values', () => {
      const result = userProfileSchema.safeParse(defaultUserProfileValues)
      expect(result.success).toBe(true)
    })
  })

  // Nested schema validation
  describe('Nested Schema Validation', () => {
    it('should validate contact sub-schema', () => {
      const validContact: ContactFormData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '1234567890',
      }

      const result = contactSchema.safeParse(validContact)
      expect(result.success).toBe(true)
    })

    it('should validate address sub-schema', () => {
      const validAddress: AddressFormData = {
        addressType: 'Home',
        country: 'USA',
        usaStreetAddress: '123 Main St',
        usaCity: 'Denver',
        usaState: 'CO',
        usaZipCode: '80202',
      }

      const result = addressSchema.safeParse(validAddress)
      expect(result.success).toBe(true)
    })
  })

  // Performance and edge case testing
  describe('Performance and Edge Cases', () => {
    it('should handle large number of addresses', () => {
      const largeProfileWithManyAddresses: UserProfileFormData = {
        contact: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '1234567890',
        },
        newsletter: true,
        addresses: Array.from({ length: 10 }, (_, i) => ({
          addressType: 'Home',
          country: 'USA',
          usaStreetAddress: `${i + 1} Main St`,
          usaCity: 'Denver',
          usaState: 'CO',
          usaZipCode: '80202',
        })),
      }

      const result = userProfileSchema.safeParse(largeProfileWithManyAddresses)
      expect(result.success).toBe(true)
    })

    it('should handle empty optional fields', () => {
      const profileWithOptionalFields: UserProfileFormData = {
        contact: {
          firstName: 'Jane',
          lastName: 'Doe',
          email: 'jane.doe@example.com',
          phone: '0987654321',
        },
        newsletter: false,
        // No addresses
      }

      const result = userProfileSchema.safeParse(profileWithOptionalFields)
      expect(result.success).toBe(true)
    })
  })

  // Optional: Cross-field validation examples
  describe('Advanced Validation Scenarios', () => {
    it('should ensure contact information is complete', () => {
      const incompleteContact: UserProfileFormData = {
        contact: {
          firstName: '', // Missing
          lastName: 'Doe',
          email: 'jane.doe@example.com',
          phone: '', // Missing
        },
        newsletter: false,
      }

      const result = userProfileSchema.safeParse(incompleteContact)
      expect(result.success).toBe(false)
    })
  })
})
