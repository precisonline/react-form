import { z } from 'zod'
import { v4 as uuidv4 } from 'uuid'

// --- Reusable Constants ---
export const addressTypes = ['Billing', 'Shipping', 'Home', 'Other'] as const
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

// --- Country-Specific Schemas (Standalone) ---
const usaAddressSchema = z.object({
  id: z.string().uuid(),
  addressType: z.enum(addressTypes),
  addressLine2: z.string().optional(),
  country: z.literal('USA'),
  usaStreetAddress: z.string().min(1, 'Street address is required for USA'),
  usaCity: z.string().min(1, 'City is required for USA'),
  usaState: z.string().min(1, 'State is required for USA'),
  usaZipCode: z
    .string()
    .regex(/^\d{5}(?:[-\s]\d{4})?$/, 'Invalid USA ZIP code format'),
})

const canadaAddressSchema = z.object({
  id: z.string().uuid(),
  addressType: z.enum(addressTypes),
  addressLine2: z.string().optional(),
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

const ukAddressSchema = z.object({
  id: z.string().uuid(),
  addressType: z.enum(addressTypes),
  addressLine2: z.string().optional(),
  country: z.literal('UK'),
  ukStreetAddress: z.string().min(1, 'Street address is required for UK'),
  ukTownCity: z.string().min(1, 'Town/City is required for UK'),
  ukCounty: z.string().optional(),
  ukPostcode: z
    .string()
    .regex(/^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i, 'Invalid UK postcode format'),
})

const otherCountrySchema = z.object({
  id: z.string().uuid(),
  addressType: z.enum(addressTypes),
  addressLine2: z.string().optional(),
  country: z.enum(otherCountries),
  addressLine1: z.string().min(1, 'Address Line 1 is required'),
  cityOrTown: z.string().min(1, 'City / Town is required'),
  stateOrProvinceOrRegion: z.string().optional(),
  postalOrZipCode: z.string().optional(),
})

// --- Discriminated Union for Address ---
export const addressSchema = z.discriminatedUnion(
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
