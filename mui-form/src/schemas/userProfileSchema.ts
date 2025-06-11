import { z } from 'zod'
import { v4 as uuidv4 } from 'uuid'

// --- Reusable Constants ---
export const addressTypes = ['Billing', 'Shipping', 'Home'] as const
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

// --- Schemas for validation logic ---
export const usaAddressValidation = z.object({
  usaStreetAddress: z.string().min(1, 'Street address is required for USA'),
  usaCity: z.string().min(1, 'City is required for USA'),
  usaState: z.string().min(1, 'State is required for USA'),
  usaZipCode: z
    .string()
    .regex(/^\d{5}(?:[-\s]\d{4})?$/, 'Invalid USA ZIP code format'),
})

export const canadaAddressValidation = z.object({
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

export const ukAddressValidation = z.object({
  ukStreetAddress: z.string().min(1, 'Street address is required for UK'),
  ukTownCity: z.string().min(1, 'Town/City is required for UK'),
  ukCounty: z.string().optional(),
  ukPostcode: z
    .string()
    .regex(/^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i, 'Invalid UK postcode format'),
})

export const genericAddressValidation = z.object({
  addressLine1: z.string().min(1, 'Address Line 1 is required'),
  cityOrTown: z.string().min(1, 'City / Town is required'),
  stateOrProvinceOrRegion: z.string().optional(),
  postalOrZipCode: z.string().optional(),
})

// --- Schema for a SINGLE Address ---
export const addressSchema = z
  .object({
    id: z.string().uuid(),
    addressType: z.enum(addressTypes, {
      required_error: 'Please select an address type',
    }),
    country: z
      .enum(countries, { required_error: 'Please select a country' })
      .refine((value) => !!value, { message: 'Please select a country' }),
    addressLine2: z.string().optional(),
    // All specific and generic address fields are optional at the base level
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
    addressLine1: z.string().optional(),
    cityOrTown: z.string().optional(),
    stateOrProvinceOrRegion: z.string().optional(),
    postalOrZipCode: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const addIssues = (errors: z.ZodIssue[]) => {
      errors.forEach((err) => ctx.addIssue({ ...err, path: err.path }))
    }
    switch (data.country) {
      case 'USA':
        const usaResult = usaAddressValidation.safeParse(data)
        if (!usaResult.success) addIssues(usaResult.error.errors)
        break
      case 'Canada':
        const canadaResult = canadaAddressValidation.safeParse(data)
        if (!canadaResult.success) addIssues(canadaResult.error.errors)
        break
      case 'UK':
        const ukResult = ukAddressValidation.safeParse(data)
        if (!ukResult.success) addIssues(ukResult.error.errors)
        break
      default:
        if (data.country) {
          // Only apply generic validation if a country is selected
          const genericResult = genericAddressValidation.safeParse(data)
          if (!genericResult.success) addIssues(genericResult.error.errors)
        }
        break
    }
  })

export type AddressFormData = z.infer<typeof addressSchema>

// --- Schema for the ENTIRE User Profile Form ---
export const userProfileSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  deliveryInstructions: z.string().optional(),
  newsletter: z.boolean().optional(),
  addresses: z.array(addressSchema),
})

export type UserProfileFormData = z.infer<typeof userProfileSchema>

// --- Default Values ---
export const getNewAddressDefaultValues = (): AddressFormData => ({
  id: uuidv4(),
  addressType: 'Home',
  country: 'USA',
  addressLine2: '',
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
  addressLine1: '',
  cityOrTown: '',
  stateOrProvinceOrRegion: '',
  postalOrZipCode: '',
})

export const defaultUserProfileValues: UserProfileFormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  deliveryInstructions: '',
  newsletter: false,
  addresses: [],
}
