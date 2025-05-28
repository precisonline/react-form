import type { BaseProduct } from '../common/productTypes' // Import the BaseProduct

// Tenant1PhysicalProduct includes all fields from BaseProduct
// plus the fields defined specifically here.
export interface Tenant1PhysicalProduct extends BaseProduct {
  // Fields specific to Tenant 1's physical products
  weightKg: number
  dimensions?: {
    lengthCm: number
    widthCm: number
    heightCm: number
  }
  material?: string
  colorOptions?: string[]
  stockQuantity: number
  shippingClass?: string
}
