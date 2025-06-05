import { z } from 'zod'

// Zod schemas for validation
export const OptionSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Name is required'),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format'),
  order: z.number().int().min(0),
  active: z.boolean(),
  type: z.enum(['status', 'priority', 'classification']),
  icon: z.string().optional(),
})

export const OptionFormSchema = OptionSchema.omit({ id: true, order: true })

// TypeScript types derived from schemas
export type Option = z.infer<typeof OptionSchema>
export type OptionFormData = z.infer<typeof OptionFormSchema>
export type OptionType = 'status' | 'priority' | 'classification'

// Props interfaces for components
export interface OptionsManagerProps {
  title: string
  options: Option[]
  type: 'priority' | 'classification'
  onSave: (options: Option[]) => Promise<void>
  onReorder: (startIndex: number, endIndex: number) => void
  maxOptions?: number
  allowReorder?: boolean
  allowDelete?: boolean
}

export interface StatusFlowManagerProps {
  options: Option[]
  onSave: (options: Option[]) => Promise<void>
  onReorder: (startIndex: number, endIndex: number) => void
}
