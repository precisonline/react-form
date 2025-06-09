import { z } from 'zod'

// Zod schema for form validation
export const PrioritySchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  color: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, 'Must be a valid hex color code.'),
  active: z.boolean(),
})

// TypeScript type derived from the schema
export type PriorityFormData = z.infer<typeof PrioritySchema>

// The full data structure for a priority item, including its unique ID and order
export interface PriorityItem extends PriorityFormData {
  id: string
  order: number
}
