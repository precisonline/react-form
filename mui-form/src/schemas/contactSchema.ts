import { z } from 'zod'

// Expanded list of countries for the dropdown
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

export type ContactFormData = {
  // Core contact fields
  firstName: string
  lastName: string
  email: string
  phone: string
  country: (typeof countries)[number] | ''
  message?: string
  newsletter?: boolean

  // --- Generic Address Fields ---
  addressLine1?: string
  addressLine2?: string // Optional
  cityOrTown?: string
  stateOrProvinceOrRegion?: string // Optional
  postalOrZipCode?: string // Optional and generic

  // --- USA Specific ---
  usaStreetAddress?: string
  usaCity?: string
  usaState?: string
  usaZipCode?: string

  // --- Canada Specific ---
  canadaStreetAddress?: string
  canadaCity?: string
  canadaProvince?: string
  canadaPostalCode?: string

  // --- UK Specific ---
  ukStreetAddress?: string
  ukTownCity?: string
  ukCounty?: string // Optional
  ukPostcode?: string
}

// --- Default values including all fields ---
export const defaultValues: ContactFormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  country: '',
  message: '',
  newsletter: false,

  addressLine1: '',
  addressLine2: '',
  cityOrTown: '',
  stateOrProvinceOrRegion: '',
  postalOrZipCode: '',

  usaStreetAddress: '',
  usaCity: '',
  usaState: '',
  usaZipCode: '',

  canadaStreetAddress: '',
  canadaCity: '',
  canadaProvince: '',
  canadaPostalCode: '',

  ukStreetAddress: '',
  ukTownCity: '',
  ukCounty: '',
  ukPostcode: '',
}

// --- Zod Validation Schemas ---

// Part 1: Base contact information
export const baseContactSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  country: z
    .enum(['', ...countries], { required_error: 'Please select a country' })
    .refine((value) => value !== '', {
      message: 'Please select a country',
    }),
  message: z.string().optional(),
  newsletter: z.boolean().optional(),
  addressLine2: z.string().optional(),
})

export const usaAddressSchema = z.object({
  usaStreetAddress: z.string().min(1, 'Street address is required for USA'),
  usaCity: z.string().min(1, 'City is required for USA'),
  usaState: z.string().min(1, 'State is required for USA'),
  usaZipCode: z
    .string()
    .regex(/^\d{5}(?:[-\s]\d{4})?$/, 'Invalid USA ZIP code format'),
})

export const canadaAddressSchema = z.object({
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

export const ukAddressSchema = z.object({
  ukStreetAddress: z.string().min(1, 'Street address is required for UK'),
  ukTownCity: z.string().min(1, 'Town/City is required for UK'),
  ukCounty: z.string().optional(),
  ukPostcode: z
    .string()
    .regex(/^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i, 'Invalid UK postcode format'),
})

export const genericAddressSchema = z.object({
  addressLine1: z.string().min(1, 'Address Line 1 is required'),
  cityOrTown: z.string().min(1, 'City / Town is required'),
  stateOrProvinceOrRegion: z.string().optional(),
  postalOrZipCode: z.string().optional(),
})

export const contactSchema = baseContactSchema
  .extend({
    addressLine1: z.string().optional(),
    cityOrTown: z.string().optional(),
    stateOrProvinceOrRegion: z.string().optional(),
    postalOrZipCode: z.string().optional(),

    usaStreetAddress: z.string().optional(),
    usaCity: z.string().optional(),
    usaState: z.string().optional(),
    usaZipCode: z.string().optional(),

    canadaStreetAddress: z.string().optional(),
    canadaCity: z.string().optional(),
    canadaProvince: z.string().optional(),
    canadaPostalCode: z.string().optional(),

    ukStreetAddress: z.string().optional(),
    ukTownCity: z.string().optional(),
    ukCounty: z.string().optional(),
    ukPostcode: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const addIssues = (errors: z.ZodIssue[]) => {
      errors.forEach((err) => ctx.addIssue({ ...err, path: err.path }))
    }

    switch (data.country) {
      case 'USA':
        const usaResult = usaAddressSchema.safeParse(data)
        if (!usaResult.success) addIssues(usaResult.error.errors)
        break
      case 'Canada':
        const canadaResult = canadaAddressSchema.safeParse(data)
        if (!canadaResult.success) addIssues(canadaResult.error.errors)
        break
      case 'UK':
        const ukResult = ukAddressSchema.safeParse(data)
        if (!ukResult.success) addIssues(ukResult.error.errors)
        break
      default:
        const genericResult = genericAddressSchema.safeParse(data)
        if (!genericResult.success) addIssues(genericResult.error.errors)
        break
    }
  })
