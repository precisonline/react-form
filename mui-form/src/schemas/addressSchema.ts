import { z } from 'zod'
import { ENUMS, VALIDATION, validate } from './common'

const baseAddressSchema = z.object({
  id: z.string().optional(),
  addressType: z.enum(ENUMS.addressTypes),
  addressLine2: z.string().optional(),
})

const usaAddressSchema = baseAddressSchema.extend({
  country: z.literal('USA'),
  streetAddress: validate.required('Street address is required'),
  city: validate.required('City is required'),
  state: z.string().length(2, 'State must be 2 letters'),
  zipCode: z.string().regex(VALIDATION.zipCode.usa, 'Invalid ZIP code'),
})

const canadaAddressSchema = baseAddressSchema.extend({
  country: z.literal('Canada'),
  streetAddress: validate.required('Street address is required'),
  city: validate.required('City is required'),
  province: z.string().length(2, 'Province must be 2 letters'),
  postalCode: z
    .string()
    .regex(VALIDATION.zipCode.canada, 'Invalid postal code'),
})

export const addressSchema = z.discriminatedUnion('country', [
  usaAddressSchema,
  canadaAddressSchema,
])

export type Address = z.infer<typeof addressSchema>

export const defaultAddress: Address = {
  addressType: 'Home',
  country: 'USA',
  streetAddress: '',
  city: '',
  state: '',
  zipCode: '',
}
