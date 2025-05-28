// This interface defines the core fields shared by ALL product types in your system.
export interface BaseProduct {
  id: string // Unique identifier, always present
  name: string // Product name, always present
  price: number // Price, always present
  description?: string // Optional detailed description
  sku?: string // Stock Keeping Unit, potentially common, optional
  imageUrl?: string // URL for a primary image, optional
  category?: string // General product category, optional
  // You could add other truly universal fields here, e.g.:
  // isActive?: boolean;
  // tags?: string[];
}

/**
 * A simplified product structure specifically for populating UI elements
 * like select dropdowns. This allows layout components to remain generic.
 * The page component will be responsible for mapping its tenant-specific
 * product data to this shape before passing it to a layout.
 */
export interface SelectableProduct {
  id: string // Will be the 'value' of the <option>
  name: string // Will be part of the displayed text in the <option>
  displayInfo?: string // Optional additional text for display (e.g., price, SKU)
}
