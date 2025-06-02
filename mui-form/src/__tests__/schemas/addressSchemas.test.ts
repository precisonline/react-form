// src/__tests__/schemas/addressSchemas.test.ts
import {
  usaAddressSchema,
  canadaAddressSchema,
  ukAddressSchema,
  genericAddressSchema,
} from '../../schemas/contactSchema'

describe('Individual Address Schema Unit Tests', () => {
  describe('USA Address Schema', () => {
    const validUsaAddress = {
      usaStreetAddress: '123 Main Street',
      usaCity: 'Los Angeles',
      usaState: 'California',
      usaZipCode: '90210',
    }

    it('should validate basic USA address', () => {
      const result = usaAddressSchema.safeParse(validUsaAddress)
      expect(result.success).toBe(true)
    })

    describe('ZIP code validation', () => {
      const zipCodeTests = [
        { code: '12345', valid: true, description: 'basic 5-digit ZIP' },
        { code: '12345-6789', valid: true, description: 'ZIP+4 with dash' },
        { code: '12345 6789', valid: true, description: 'ZIP+4 with space' },
        { code: '1234', valid: false, description: 'too short' },
        {
          code: '123456',
          valid: false,
          description: 'too long without separator',
        },
        { code: 'ABCDE', valid: false, description: 'letters only' },
        {
          code: '12345-ABC',
          valid: false,
          description: 'letters in extension',
        },
        {
          code: '12345-12345',
          valid: false,
          description: 'extension too long',
        },
        { code: '123456789', valid: false, description: 'too many digits' },
        { code: '12345-', valid: false, description: 'incomplete extension' },
        { code: '-12345', valid: false, description: 'dash at start' },
      ]

      zipCodeTests.forEach(({ code, valid, description }) => {
        it(`should ${
          valid ? 'accept' : 'reject'
        } ${description}: "${code}"`, () => {
          const address = { ...validUsaAddress, usaZipCode: code }
          const result = usaAddressSchema.safeParse(address)
          expect(result.success).toBe(valid)

          if (!valid && !result.success) {
            expect(
              result.error.issues.some(
                (issue) => issue.message === 'Invalid USA ZIP code format'
              )
            ).toBe(true)
          }
        })
      })
    })

    describe('Required field validation', () => {
      const requiredFields = [
        {
          field: 'usaStreetAddress',
          message: 'Street address is required for USA',
        },
        { field: 'usaCity', message: 'City is required for USA' },
        { field: 'usaState', message: 'State is required for USA' },
      ]

      requiredFields.forEach(({ field, message }) => {
        it(`should require ${field}`, () => {
          const address = { ...validUsaAddress, [field]: '' }
          const result = usaAddressSchema.safeParse(address)
          expect(result.success).toBe(false)

          if (!result.success) {
            expect(
              result.error.issues.some((issue) => issue.message === message)
            ).toBe(true)
          }
        })
      })
    })
  })

  describe('Canada Address Schema', () => {
    const validCanadaAddress = {
      canadaStreetAddress: '123 Main Street',
      canadaCity: 'Toronto',
      canadaProvince: 'Ontario',
      canadaPostalCode: 'M5V 3A1',
    }

    it('should validate basic Canada address', () => {
      const result = canadaAddressSchema.safeParse(validCanadaAddress)
      expect(result.success).toBe(true)
    })

    describe('Postal code validation', () => {
      const postalCodeTests = [
        {
          code: 'M5V 3A1',
          valid: true,
          description: 'standard format with space',
        },
        { code: 'M5V3A1', valid: true, description: 'no space' },
        { code: 'M5V-3A1', valid: true, description: 'with dash' },
        { code: 'K1A 0A6', valid: true, description: 'government postal code' },
        { code: 'H3Z 2Y7', valid: true, description: 'Quebec format' },
        { code: 'T2X 3M4', valid: true, description: 'Alberta format' },
        { code: 'V6B 1A1', valid: true, description: 'BC format' },
        { code: 'm5v 3a1', valid: true, description: 'lowercase' },
        { code: 'M5V  3A1', valid: false, description: 'double space' },
        { code: '12345', valid: false, description: 'numbers only' },
        { code: 'ABCDEF', valid: false, description: 'letters only' },
        { code: 'M5V 3A', valid: false, description: 'incomplete' },
        { code: 'M5V 3A12', valid: false, description: 'too long' },
        { code: '123 456', valid: false, description: 'wrong pattern' },
        { code: 'M55 3A1', valid: false, description: 'wrong middle digit' },
        { code: '5MV 3A1', valid: false, description: 'number first' },
      ]

      postalCodeTests.forEach(({ code, valid, description }) => {
        it(`should ${
          valid ? 'accept' : 'reject'
        } ${description}: "${code}"`, () => {
          const address = { ...validCanadaAddress, canadaPostalCode: code }
          const result = canadaAddressSchema.safeParse(address)
          expect(result.success).toBe(valid)

          if (!valid && !result.success) {
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

    describe('Required field validation', () => {
      const requiredFields = [
        {
          field: 'canadaStreetAddress',
          message: 'Street address is required for Canada',
        },
        { field: 'canadaCity', message: 'City is required for Canada' },
        { field: 'canadaProvince', message: 'Province is required for Canada' },
      ]

      requiredFields.forEach(({ field, message }) => {
        it(`should require ${field}`, () => {
          const address = { ...validCanadaAddress, [field]: '' }
          const result = canadaAddressSchema.safeParse(address)
          expect(result.success).toBe(false)

          if (!result.success) {
            expect(
              result.error.issues.some((issue) => issue.message === message)
            ).toBe(true)
          }
        })
      })
    })

    describe('Real Canadian postal code examples', () => {
      const realPostalCodes = [
        'K1A 0A6', // Government of Canada
        'M5V 3A8', // Toronto downtown
        'V6B 1A1', // Vancouver downtown
        'H2Y 1C6', // Montreal downtown
        'T2P 2M5', // Calgary downtown
        'S7N 2R4', // Saskatoon
        'R3C 4A5', // Winnipeg downtown
        'B3J 3K1', // Halifax downtown
        'A1A 1A1', // St. John's
        'X1A 1N4', // Yellowknife
      ]

      realPostalCodes.forEach((code) => {
        it(`should accept real postal code: ${code}`, () => {
          const address = { ...validCanadaAddress, canadaPostalCode: code }
          const result = canadaAddressSchema.safeParse(address)
          expect(result.success).toBe(true)
        })
      })
    })
  })

  describe('UK Address Schema', () => {
    const validUkAddress = {
      ukStreetAddress: '123 High Street',
      ukTownCity: 'London',
      ukPostcode: 'SW1A 1AA',
    }

    it('should validate basic UK address', () => {
      const result = ukAddressSchema.safeParse(validUkAddress)
      expect(result.success).toBe(true)
    })

    it('should accept optional county', () => {
      const addressWithCounty = {
        ...validUkAddress,
        ukCounty: 'Greater London',
      }
      const result = ukAddressSchema.safeParse(addressWithCounty)
      expect(result.success).toBe(true)
    })

    describe('Postcode validation', () => {
      const postcodeTests = [
        // Valid formats
        { code: 'M1 1AA', valid: true, description: 'M1 1AA format' },
        { code: 'M60 1NW', valid: true, description: 'M60 1NW format' },
        { code: 'CR0 2YR', valid: true, description: 'CR0 2YR format' },
        { code: 'DN55 1PT', valid: true, description: 'DN55 1PT format' },
        { code: 'W1A 0AX', valid: true, description: 'W1A 0AX format' },
        { code: 'EC1A 1BB', valid: true, description: 'EC1A 1BB format' },
        { code: 'SW1A1AA', valid: true, description: 'no space' },
        { code: 'sw1a 1aa', valid: true, description: 'lowercase' },
        { code: 'B33 8TH', valid: true, description: 'Birmingham format' },
        { code: 'W1A 9WA', valid: true, description: 'Westminster format' },
        { code: 'CR9 2ER', valid: true, description: 'Croydon format' },

        // Invalid formats
        { code: '12345', valid: false, description: 'numbers only' },
        { code: 'ABCDEF', valid: false, description: 'too many letters' },
        { code: 'SW1A 1A', valid: false, description: 'incomplete end' },
        { code: 'SW1A 1AAA', valid: false, description: 'too long end' },
        { code: '123 456', valid: false, description: 'wrong pattern' },
        { code: 'S1A 1AA', valid: false, description: 'invalid start' },
        {
          code: 'SW1 1AA',
          valid: false,
          description: 'missing letter after number',
        },
        {
          code: 'SW1AA 1AA',
          valid: false,
          description: 'too many letters in first part',
        },
      ]

      postcodeTests.forEach(({ code, valid, description }) => {
        it(`should ${
          valid ? 'accept' : 'reject'
        } ${description}: "${code}"`, () => {
          const address = { ...validUkAddress, ukPostcode: code }
          const result = ukAddressSchema.safeParse(address)
          expect(result.success).toBe(valid)

          if (!valid && !result.success) {
            expect(
              result.error.issues.some(
                (issue) => issue.message === 'Invalid UK postcode format'
              )
            ).toBe(true)
          }
        })
      })
    })

    describe('Required field validation', () => {
      const requiredFields = [
        {
          field: 'ukStreetAddress',
          message: 'Street address is required for UK',
        },
        { field: 'ukTownCity', message: 'Town/City is required for UK' },
      ]

      requiredFields.forEach(({ field, message }) => {
        it(`should require ${field}`, () => {
          const address = { ...validUkAddress, [field]: '' }
          const result = ukAddressSchema.safeParse(address)
          expect(result.success).toBe(false)

          if (!result.success) {
            expect(
              result.error.issues.some((issue) => issue.message === message)
            ).toBe(true)
          }
        })
      })
    })

    describe('Real UK postcode examples', () => {
      const realPostcodes = [
        'SW1A 1AA', // Westminster (Buckingham Palace)
        'SW1A 2AA', // Downing Street
        'EC4M 7RF', // Bank of England
        'WC2N 5DU', // Trafalgar Square
        'E20 2ST', // Olympic Park
        'M1 1AA', // Manchester city center
        'B33 8TH', // Birmingham
        'EH1 1YZ', // Edinburgh city center
        'CF10 3AT', // Cardiff city center
        'BT1 5GS', // Belfast city center
        'G2 3PR', // Glasgow city center
        'PL1 2AA', // Plymouth
        'EX1 1DR', // Exeter
        'NE1 4ST', // Newcastle
        'LS1 4DY', // Leeds
      ]

      realPostcodes.forEach((postcode) => {
        it(`should accept real UK postcode: ${postcode}`, () => {
          const address = { ...validUkAddress, ukPostcode: postcode }
          const result = ukAddressSchema.safeParse(address)
          expect(result.success).toBe(true)
        })
      })
    })
  })

  describe('Generic Address Schema', () => {
    const validGenericAddress = {
      addressLine1: '123 Main Street',
      cityOrTown: 'Anytown',
      stateOrProvinceOrRegion: 'Any State',
      postalOrZipCode: '12345',
    }

    it('should validate basic generic address', () => {
      const result = genericAddressSchema.safeParse(validGenericAddress)
      expect(result.success).toBe(true)
    })

    it('should validate minimal required fields only', () => {
      const minimalAddress = {
        addressLine1: '123 Main Street',
        cityOrTown: 'Anytown',
      }
      const result = genericAddressSchema.safeParse(minimalAddress)
      expect(result.success).toBe(true)
    })

    describe('Required field validation', () => {
      it('should require addressLine1', () => {
        const address = { ...validGenericAddress, addressLine1: '' }
        const result = genericAddressSchema.safeParse(address)
        expect(result.success).toBe(false)

        if (!result.success) {
          expect(
            result.error.issues.some(
              (issue) => issue.message === 'Address Line 1 is required'
            )
          ).toBe(true)
        }
      })

      it('should require cityOrTown', () => {
        const address = { ...validGenericAddress, cityOrTown: '' }
        const result = genericAddressSchema.safeParse(address)
        expect(result.success).toBe(false)

        if (!result.success) {
          expect(
            result.error.issues.some(
              (issue) => issue.message === 'City / Town is required'
            )
          ).toBe(true)
        }
      })
    })

    describe('International flexibility', () => {
      it('should handle various international postal codes', () => {
        const internationalCodes = [
          '12345', // USA style
          'ABC 123', // Generic with space
          '12345-6789', // USA ZIP+4
          'D-12345', // German style
          '100-0001', // Japanese style
          '75001', // French style
          'SW1A 1AA', // UK style
          'M5V 3A1', // Canadian style
        ]

        internationalCodes.forEach((code) => {
          const address = {
            ...validGenericAddress,
            postalOrZipCode: code,
          }
          const result = genericAddressSchema.safeParse(address)
          expect(result.success).toBe(true)
        })
      })
    })
  })

  describe('Schema Comparison Tests', () => {
    it('should have different validation rules for each country', () => {
      const streetAddress = '123 Main Street'
      const city = 'Test City'

      // USA requires state and specific ZIP format
      const usaResult = usaAddressSchema.safeParse({
        usaStreetAddress: streetAddress,
        usaCity: city,
        usaState: '',
        usaZipCode: '12345',
      })
      expect(usaResult.success).toBe(false) // Missing state

      // Generic is more flexible
      const genericResult = genericAddressSchema.safeParse({
        addressLine1: streetAddress,
        cityOrTown: city,
        postalOrZipCode: '12345',
      })
      expect(genericResult.success).toBe(true)
    })

    it('should validate postal code formats are country-specific', () => {
      // USA ZIP code should fail in Canada schema
      const usaZipInCanada = canadaAddressSchema.safeParse({
        canadaStreetAddress: '123 Main St',
        canadaCity: 'Toronto',
        canadaProvince: 'ON',
        canadaPostalCode: '12345', // USA format
      })
      expect(usaZipInCanada.success).toBe(false)

      // Canadian postal code should fail in USA schema
      const canadaPostalInUsa = usaAddressSchema.safeParse({
        usaStreetAddress: '123 Main St',
        usaCity: 'New York',
        usaState: 'NY',
        usaZipCode: 'M5V 3A1', // Canada format
      })
      expect(canadaPostalInUsa.success).toBe(false)
    })
  })
})
