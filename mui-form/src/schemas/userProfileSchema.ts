import { z } from 'zod'
import { addressSchema } from './addressSchema'
import { contactSchema } from './contactSchema'

export const userProfileSchema = z.object({
  contact: contactSchema,
  deliveryInstructions: z.string().optional(),
  addresses: z.array(addressSchema).optional(),
  newsletter: z.boolean(),
})

export type UserProfileFormData = z.infer<typeof userProfileSchema>

export const defaultUserProfileValues: UserProfileFormData = {
  contact: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  },
  addresses: [],
  newsletter: false,
  deliveryInstructions: '',
}
