import { z } from 'zod'

// --- Reusable Constants ---
export const countries = [
  'USA',
  'Canada',
  'UK',
  'Germany',
  'France',
  'Australia',
  'Japan',
  'Brazil',
  'India',
  'Other',
] as const

const otherCountries = [
  'Germany',
  'France',
  'Australia',
  'Japan',
  'Brazil',
  'India',
  'Other',
] as const

// --- Base Schema for all contact forms ---
const baseContactSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  message: z.string().optional(),
  newsletter: z.boolean().optional(),
  addressLine2: z.string().optional(),
})

// --- Country-Specific Schemas ---
const usaAddressSchema = baseContactSchema.extend({
  country: z.literal('USA'),
  usaStreetAddress: z.string().min(1, 'Street address is required for USA'),
  usaCity: z.string().min(1, 'City is required for USA'),
  usaState: z.string().min(1, 'State is required for USA'),
  usaZipCode: z
    .string()
    .regex(/^\d{5}(?:[-\s]\d{4})?$/, 'Invalid USA ZIP code format'),
})

const canadaAddressSchema = baseContactSchema.extend({
  country: z.literal('Canada'),
  canadaStreetAddress: z
    .string()
    .min(1, 'Street address is required for Canada'),
  canadaCity: z.string().min(1, 'City is required for Canada'),
  canadaProvince: z.string().min(1, 'Province is required for Canada'),
  canadaPostalCode: z
    .string()
    .regex(
      /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/,
      'Invalid Canadian postal code format'
    ),
})

const ukAddressSchema = baseContactSchema.extend({
  country: z.literal('UK'),
  ukStreetAddress: z.string().min(1, 'Street address is required for UK'),
  ukTownCity: z.string().min(1, 'Town/City is required for UK'),
  ukCounty: z.string().optional(),
  ukPostcode: z
    .string()
    .regex(/^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i, 'Invalid UK postcode format'),
})

const otherCountrySchema = baseContactSchema.extend({
  country: z.enum(otherCountries),
  addressLine1: z.string().min(1, 'Address Line 1 is required'),
  cityOrTown: z.string().min(1, 'City / Town is required'),
  stateOrProvinceOrRegion: z.string().optional(),
  postalOrZipCode: z.string().optional(),
})

// --- Discriminated Union for Contact Form ---
export const contactSchema = z.discriminatedUnion(
  'country',
  [usaAddressSchema, canadaAddressSchema, ukAddressSchema, otherCountrySchema],
  {
    errorMap: (issue, ctx) => {
      if (issue.code === 'invalid_union_discriminator') {
        return {
          message: 'Please select a valid country to see address fields.',
        }
      }
      return { message: ctx.defaultError }
    },
  }
)

export type ContactFormData = z.infer<typeof contactSchema>

// --- Default Values ---
export const baseDefaultValues = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  message: '',
  newsletter: false,
  addressLine2: '',
}

export const countrySpecificDefaultValues = {
  USA: {
    usaStreetAddress: '',
    usaCity: '',
    usaState: '',
    usaZipCode: '',
  },
  Canada: {
    canadaStreetAddress: '',
    canadaCity: '',
    canadaProvince: '',
    canadaPostalCode: '',
  },
  UK: {
    ukStreetAddress: '',
    ukTownCity: '',
    ukCounty: '',
    ukPostcode: '',
  },
  Other: {
    addressLine1: '',
    cityOrTown: '',
    stateOrProvinceOrRegion: '',
    postalOrZipCode: '',
  },
}
