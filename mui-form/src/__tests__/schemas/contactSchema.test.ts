import {
  contactSchema,
  usaAddressSchema,
  canadaAddressSchema,
  ukAddressSchema,
  genericAddressSchema,
  ContactFormData,
  defaultValues,
  countries,
} from '../../schemas/contactSchema'

describe('Revised Contact Form Schema Validation', () => {
  // Base valid data for all tests
  const baseValidData: Partial<ContactFormData> = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '1234567890',
    message: 'This is a test message',
    newsletter: false,
  }

  describe('Base Contact Information Validation', () => {
    it('should validate basic contact fields', () => {
      const data = {
        ...baseValidData,
        country: 'USA' as const,
        usaStreetAddress: '123 Main St',
        usaCity: 'Anytown',
        usaState: 'CA',
        usaZipCode: '12345',
      }

      const result = contactSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should reject invalid email', () => {
      const data = {
        ...baseValidData,
        email: 'invalid-email',
        country: 'USA' as const,
        usaStreetAddress: '123 Main St',
        usaCity: 'Anytown',
        usaState: 'CA',
        usaZipCode: '12345',
      }

      const result = contactSchema.safeParse(data)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(
          result.error.issues.some(
            (issue) => issue.message === 'Invalid email address'
          )
        ).toBe(true)
      }
    })

    it('should reject short first name', () => {
      const data = {
        ...baseValidData,
        firstName: 'J',
        country: 'USA' as const,
        usaStreetAddress: '123 Main St',
        usaCity: 'Anytown',
        usaState: 'CA',
        usaZipCode: '12345',
      }

      const result = contactSchema.safeParse(data)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(
          result.error.issues.some(
            (issue) =>
              issue.message === 'First name must be at least 2 characters'
          )
        ).toBe(true)
      }
    })

    it('should reject short phone number', () => {
      const data = {
        ...baseValidData,
        phone: '123',
        country: 'USA' as const,
        usaStreetAddress: '123 Main St',
        usaCity: 'Anytown',
        usaState: 'CA',
        usaZipCode: '12345',
      }

      const result = contactSchema.safeParse(data)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(
          result.error.issues.some(
            (issue) =>
              issue.message === 'Phone number must be at least 10 digits'
          )
        ).toBe(true)
      }
    })

    it('should require country selection', () => {
      const data = {
        ...baseValidData,
        country: '',
      }

      const result = contactSchema.safeParse(data)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(
          result.error.issues.some(
            (issue) => issue.message === 'Please select a country'
          )
        ).toBe(true)
      }
    })

    it('should accept all valid countries', () => {
      countries.forEach((country) => {
        const data = {
          ...baseValidData,
          country,
          // Add appropriate address based on country
          ...(country === 'USA' && {
            usaStreetAddress: '123 Main St',
            usaCity: 'Anytown',
            usaState: 'CA',
            usaZipCode: '12345',
          }),
          ...(country === 'Canada' && {
            canadaStreetAddress: '123 Main St',
            canadaCity: 'Toronto',
            canadaProvince: 'ON',
            canadaPostalCode: 'M5V 3A1',
          }),
          ...(country === 'UK' && {
            ukStreetAddress: '123 High Street',
            ukTownCity: 'London',
            ukPostcode: 'SW1A 1AA',
          }),
          ...(country !== 'USA' &&
            country !== 'Canada' &&
            country !== 'UK' && {
              addressLine1: '123 Main St',
              cityOrTown: 'Anytown',
            }),
        }

        const result = contactSchema.safeParse(data)
        expect(result.success).toBe(true)
      })
    })
  })

  describe('USA Address Validation', () => {
    describe('usaAddressSchema', () => {
      it('should validate correct USA address', () => {
        const usaAddress = {
          usaStreetAddress: '123 Main Street',
          usaCity: 'Los Angeles',
          usaState: 'California',
          usaZipCode: '90210',
        }

        const result = usaAddressSchema.safeParse(usaAddress)
        expect(result.success).toBe(true)
      })

      it('should accept ZIP+4 format', () => {
        const usaAddress = {
          usaStreetAddress: '123 Main Street',
          usaCity: 'Los Angeles',
          usaState: 'California',
          usaZipCode: '90210-1234',
        }

        const result = usaAddressSchema.safeParse(usaAddress)
        expect(result.success).toBe(true)
      })

      it('should accept ZIP+4 with space', () => {
        const usaAddress = {
          usaStreetAddress: '123 Main Street',
          usaCity: 'Los Angeles',
          usaState: 'California',
          usaZipCode: '90210 1234',
        }

        const result = usaAddressSchema.safeParse(usaAddress)
        expect(result.success).toBe(true)
      })

      it('should reject invalid ZIP code formats', () => {
        const invalidZipCodes = [
          '1234',
          '123456',
          'ABCDE',
          '90210-ABC',
          '90210-12345',
        ]

        invalidZipCodes.forEach((zipCode) => {
          const usaAddress = {
            usaStreetAddress: '123 Main Street',
            usaCity: 'Los Angeles',
            usaState: 'California',
            usaZipCode: zipCode,
          }

          const result = usaAddressSchema.safeParse(usaAddress)
          expect(result.success).toBe(false)
          if (!result.success) {
            expect(
              result.error.issues.some(
                (issue) => issue.message === 'Invalid USA ZIP code format'
              )
            ).toBe(true)
          }
        })
      })

      it('should require all USA address fields', () => {
        const incompleteAddress = {
          usaStreetAddress: '',
          usaCity: '',
          usaState: '',
          usaZipCode: '',
        }

        const result = usaAddressSchema.safeParse(incompleteAddress)
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues).toHaveLength(4)
          expect(
            result.error.issues.some(
              (issue) => issue.message === 'Street address is required for USA'
            )
          ).toBe(true)
          expect(
            result.error.issues.some(
              (issue) => issue.message === 'City is required for USA'
            )
          ).toBe(true)
          expect(
            result.error.issues.some(
              (issue) => issue.message === 'State is required for USA'
            )
          ).toBe(true)
        }
      })
    })

    describe('Full form with USA', () => {
      it('should validate complete USA form', () => {
        const data = {
          ...baseValidData,
          country: 'USA' as const,
          usaStreetAddress: '123 Main Street',
          usaCity: 'Los Angeles',
          usaState: 'California',
          usaZipCode: '90210',
        }

        const result = contactSchema.safeParse(data)
        expect(result.success).toBe(true)
      })

      it('should reject USA form with missing address fields', () => {
        const data = {
          ...baseValidData,
          country: 'USA' as const,
          // Missing USA address fields
        }

        const result = contactSchema.safeParse(data)
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(
            result.error.issues.some(
              (issue) => issue.message === 'Street address is required for USA'
            )
          ).toBe(true)
        }
      })
    })
  })

  describe('Canada Address Validation', () => {
    describe('canadaAddressSchema', () => {
      it('should validate correct Canada address', () => {
        const canadaAddress = {
          canadaStreetAddress: '123 Main Street',
          canadaCity: 'Toronto',
          canadaProvince: 'Ontario',
          canadaPostalCode: 'M5V 3A1',
        }

        const result = canadaAddressSchema.safeParse(canadaAddress)
        expect(result.success).toBe(true)
      })

      it('should accept postal code without space', () => {
        const canadaAddress = {
          canadaStreetAddress: '123 Main Street',
          canadaCity: 'Toronto',
          canadaProvince: 'Ontario',
          canadaPostalCode: 'M5V3A1',
        }

        const result = canadaAddressSchema.safeParse(canadaAddress)
        expect(result.success).toBe(true)
      })

      it('should accept postal code with dash', () => {
        const canadaAddress = {
          canadaStreetAddress: '123 Main Street',
          canadaCity: 'Toronto',
          canadaProvince: 'Ontario',
          canadaPostalCode: 'M5V-3A1',
        }

        const result = canadaAddressSchema.safeParse(canadaAddress)
        expect(result.success).toBe(true)
      })

      it('should reject invalid postal code formats', () => {
        const invalidPostalCodes = [
          '12345',
          'ABCDEF',
          'M5V 3A',
          'M5V 3A12',
          '123 456',
        ]

        invalidPostalCodes.forEach((postalCode) => {
          const canadaAddress = {
            canadaStreetAddress: '123 Main Street',
            canadaCity: 'Toronto',
            canadaProvince: 'Ontario',
            canadaPostalCode: postalCode,
          }

          const result = canadaAddressSchema.safeParse(canadaAddress)
          expect(result.success).toBe(false)
          if (!result.success) {
            expect(
              result.error.issues.some(
                (issue) =>
                  issue.message === 'Invalid Canadian postal code format'
              )
            ).toBe(true)
          }
        })
      })
    })

    describe('Full form with Canada', () => {
      it('should validate complete Canada form', () => {
        const data = {
          ...baseValidData,
          country: 'Canada' as const,
          canadaStreetAddress: '123 Main Street',
          canadaCity: 'Toronto',
          canadaProvince: 'Ontario',
          canadaPostalCode: 'M5V 3A1',
        }

        const result = contactSchema.safeParse(data)
        expect(result.success).toBe(true)
      })
    })
  })

  describe('UK Address Validation', () => {
    describe('ukAddressSchema', () => {
      it('should validate correct UK address', () => {
        const ukAddress = {
          ukStreetAddress: '123 High Street',
          ukTownCity: 'London',
          ukPostcode: 'SW1A 1AA',
        }

        const result = ukAddressSchema.safeParse(ukAddress)
        expect(result.success).toBe(true)
      })

      it('should accept UK postcode without space', () => {
        const ukAddress = {
          ukStreetAddress: '123 High Street',
          ukTownCity: 'London',
          ukPostcode: 'SW1A1AA',
        }

        const result = ukAddressSchema.safeParse(ukAddress)
        expect(result.success).toBe(true)
      })

      it('should accept various UK postcode formats', () => {
        const validPostcodes = [
          'M1 1AA', // Manchester format
          'M60 1NW', // Manchester format
          'CR0 2YR', // Croydon format
          'DN55 1PT', // Doncaster format
          'W1A 0AX', // London format
          'EC1A 1BB', // London format
        ]

        validPostcodes.forEach((postcode) => {
          const ukAddress = {
            ukStreetAddress: '123 High Street',
            ukTownCity: 'London',
            ukPostcode: postcode,
          }

          const result = ukAddressSchema.safeParse(ukAddress)
          expect(result.success).toBe(true)
        })
      })

      it('should reject invalid UK postcode formats', () => {
        const invalidPostcodes = [
          '12345',
          'ABCDEF',
          'SW1A 1A',
          'SW1A 1AAA',
          '123 456',
        ]

        invalidPostcodes.forEach((postcode) => {
          const ukAddress = {
            ukStreetAddress: '123 High Street',
            ukTownCity: 'London',
            ukPostcode: postcode,
          }

          const result = ukAddressSchema.safeParse(ukAddress)
          expect(result.success).toBe(false)
          if (!result.success) {
            expect(
              result.error.issues.some(
                (issue) => issue.message === 'Invalid UK postcode format'
              )
            ).toBe(true)
          }
        })
      })

      it('should accept optional county field', () => {
        const ukAddress = {
          ukStreetAddress: '123 High Street',
          ukTownCity: 'London',
          ukCounty: 'Greater London',
          ukPostcode: 'SW1A 1AA',
        }

        const result = ukAddressSchema.safeParse(ukAddress)
        expect(result.success).toBe(true)
      })
    })

    describe('Full form with UK', () => {
      it('should validate complete UK form', () => {
        const data = {
          ...baseValidData,
          country: 'UK' as const,
          ukStreetAddress: '123 High Street',
          ukTownCity: 'London',
          ukPostcode: 'SW1A 1AA',
        }

        const result = contactSchema.safeParse(data)
        expect(result.success).toBe(true)
      })
    })
  })

  describe('Generic Address Validation', () => {
    describe('genericAddressSchema', () => {
      it('should validate correct generic address', () => {
        const genericAddress = {
          addressLine1: '123 Main Street',
          cityOrTown: 'Anytown',
          stateOrProvinceOrRegion: 'Any State',
          postalOrZipCode: '12345',
        }

        const result = genericAddressSchema.safeParse(genericAddress)
        expect(result.success).toBe(true)
      })

      it('should require addressLine1 and cityOrTown', () => {
        const incompleteAddress = {
          addressLine1: '',
          cityOrTown: '',
        }

        const result = genericAddressSchema.safeParse(incompleteAddress)
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(
            result.error.issues.some(
              (issue) => issue.message === 'Address Line 1 is required'
            )
          ).toBe(true)
          expect(
            result.error.issues.some(
              (issue) => issue.message === 'City / Town is required'
            )
          ).toBe(true)
        }
      })

      it('should accept optional fields as empty', () => {
        const minimalAddress = {
          addressLine1: '123 Main Street',
          cityOrTown: 'Anytown',
          stateOrProvinceOrRegion: '',
          postalOrZipCode: '',
        }

        const result = genericAddressSchema.safeParse(minimalAddress)
        expect(result.success).toBe(true)
      })
    })

    describe('Full form with Other countries', () => {
      it('should validate form with Germany (using generic address)', () => {
        const data = {
          ...baseValidData,
          country: 'Germany' as const,
          addressLine1: '123 Hauptstraße',
          cityOrTown: 'Berlin',
          stateOrProvinceOrRegion: 'Berlin',
          postalOrZipCode: '10115',
        }

        const result = contactSchema.safeParse(data)
        expect(result.success).toBe(true)
      })

      it('should validate form with Other country', () => {
        const data = {
          ...baseValidData,
          country: 'Other' as const,
          addressLine1: '123 Main Street',
          cityOrTown: 'Anytown',
        }

        const result = contactSchema.safeParse(data)
        expect(result.success).toBe(true)
      })
    })
  })

  describe('Default Values', () => {
    it('should have all required fields in defaultValues', () => {
      expect(defaultValues).toHaveProperty('firstName')
      expect(defaultValues).toHaveProperty('lastName')
      expect(defaultValues).toHaveProperty('email')
      expect(defaultValues).toHaveProperty('phone')
      expect(defaultValues).toHaveProperty('country')
      expect(defaultValues).toHaveProperty('message')
      expect(defaultValues).toHaveProperty('newsletter')

      // Generic address fields
      expect(defaultValues).toHaveProperty('addressLine1')
      expect(defaultValues).toHaveProperty('addressLine2')
      expect(defaultValues).toHaveProperty('cityOrTown')
      expect(defaultValues).toHaveProperty('stateOrProvinceOrRegion')
      expect(defaultValues).toHaveProperty('postalOrZipCode')

      // USA fields
      expect(defaultValues).toHaveProperty('usaStreetAddress')
      expect(defaultValues).toHaveProperty('usaCity')
      expect(defaultValues).toHaveProperty('usaState')
      expect(defaultValues).toHaveProperty('usaZipCode')

      // Canada fields
      expect(defaultValues).toHaveProperty('canadaStreetAddress')
      expect(defaultValues).toHaveProperty('canadaCity')
      expect(defaultValues).toHaveProperty('canadaProvince')
      expect(defaultValues).toHaveProperty('canadaPostalCode')

      // UK fields
      expect(defaultValues).toHaveProperty('ukStreetAddress')
      expect(defaultValues).toHaveProperty('ukTownCity')
      expect(defaultValues).toHaveProperty('ukCounty')
      expect(defaultValues).toHaveProperty('ukPostcode')
    })

    it('should have empty strings for all string fields', () => {
      const stringFields = [
        'firstName',
        'lastName',
        'email',
        'phone',
        'country',
        'message',
        'addressLine1',
        'addressLine2',
        'cityOrTown',
        'stateOrProvinceOrRegion',
        'postalOrZipCode',
        'usaStreetAddress',
        'usaCity',
        'usaState',
        'usaZipCode',
        'canadaStreetAddress',
        'canadaCity',
        'canadaProvince',
        'canadaPostalCode',
        'ukStreetAddress',
        'ukTownCity',
        'ukCounty',
        'ukPostcode',
      ]

      stringFields.forEach((field) => {
        expect(defaultValues[field as keyof ContactFormData]).toBe('')
      })
    })

    it('should have false for newsletter', () => {
      expect(defaultValues.newsletter).toBe(false)
    })
  })

  describe('Complex Validation Scenarios', () => {
    it('should handle multiple validation errors across different field groups', () => {
      const invalidData = {
        firstName: 'J', // Too short
        lastName: '', // Required
        email: 'invalid-email', // Invalid format
        phone: '123', // Too short
        country: 'USA' as const,
        usaStreetAddress: '', // Required for USA
        usaCity: '', // Required for USA
        usaState: '', // Required for USA
        usaZipCode: 'invalid', // Invalid format
      }

      const result = contactSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        // Should have errors from both base contact and USA address validation
        expect(result.error.issues.length).toBeGreaterThan(5)
      }
    })

    it('should not validate USA address fields when country is not USA', () => {
      const data = {
        ...baseValidData,
        country: 'Germany' as const,
        usaStreetAddress: '', // This should be ignored
        addressLine1: '123 Hauptstraße',
        cityOrTown: 'Berlin',
      }

      const result = contactSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should not validate Canada address fields when country is not Canada', () => {
      const data = {
        ...baseValidData,
        country: 'France' as const,
        canadaStreetAddress: '', // This should be ignored
        addressLine1: '123 Rue de la Paix',
        cityOrTown: 'Paris',
      }

      const result = contactSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should switch validation context when country changes', () => {
      // First validate with USA
      const usaData = {
        ...baseValidData,
        country: 'USA' as const,
        usaStreetAddress: '123 Main St',
        usaCity: 'Anytown',
        usaState: 'CA',
        usaZipCode: '12345',
      }

      const usaResult = contactSchema.safeParse(usaData)
      expect(usaResult.success).toBe(true)

      // Then validate same base data with Canada
      const canadaData = {
        ...baseValidData,
        country: 'Canada' as const,
        canadaStreetAddress: '123 Main St',
        canadaCity: 'Toronto',
        canadaProvince: 'ON',
        canadaPostalCode: 'M5V 3A1',
      }

      const canadaResult = contactSchema.safeParse(canadaData)
      expect(canadaResult.success).toBe(true)
    })
  })

  describe('Edge Cases', () => {
    it('should handle case-insensitive UK postcodes', () => {
      const data = {
        ...baseValidData,
        country: 'UK' as const,
        ukStreetAddress: '123 High Street',
        ukTownCity: 'London',
        ukPostcode: 'sw1a 1aa', // lowercase
      }

      const result = contactSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should handle mixed case Canadian postal codes', () => {
      const data = {
        ...baseValidData,
        country: 'Canada' as const,
        canadaStreetAddress: '123 Main Street',
        canadaCity: 'Toronto',
        canadaProvince: 'Ontario',
        canadaPostalCode: 'm5v 3a1', // lowercase
      }

      const result = contactSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should validate with all optional fields filled', () => {
      const data = {
        ...baseValidData,
        country: 'UK' as const,
        message: 'This is a test message',
        newsletter: true,
        addressLine2: 'Apt 5B', // Optional field
        ukStreetAddress: '123 High Street',
        ukTownCity: 'London',
        ukCounty: 'Greater London', // Optional UK field
        ukPostcode: 'SW1A 1AA',
      }

      const result = contactSchema.safeParse(data)
      expect(result.success).toBe(true)
    })
  })
})
