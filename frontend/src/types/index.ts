/**
 * TypeScript type definitions for the Coffee Shop application
 */

/**
 * Product interface representing coffee products
 */
export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  roast_level: "Light" | "Medium" | "Dark"
  origin: string
  image_url: string
  in_stock: boolean
  weight: string
  flavor_notes: string[]
  processing_method: string
}

/**
 * Category interface for product categories
 */
export interface Category {
  id: string
  name: string
  description: string
  display_order: number
  image_url: string
}

/**
 * Shopping cart item interface
 */
export interface CartItem {
  product_id: string
  product: Product
  quantity: number
  subtotal: number
}

/**
 * Shopping cart interface
 */
export interface Cart {
  cart_id: string
  items: CartItem[]
  total_items: number
  subtotal: number
}

/**
 * Customer information interface
 */
export interface CustomerInfo {
  name: string
  email: string
  phone: string
  shipping_address: {
    street: string
    city: string
    state: string
    zip: string
  }
}

/**
 * Payment information interface
 */
export interface PaymentInfo {
  method: "credit_card"
  last_four: string
}

/**
 * Order item interface
 */
export interface OrderItem {
  product_id: string
  product_name: string
  quantity: number
  price: number
  subtotal: number
}

/**
 * Order interface
 */
export interface Order {
  id: string
  order_number: string
  items: OrderItem[]
  customer_info: CustomerInfo
  subtotal: number
  tax: number
  shipping: number
  total: number
  status: "pending" | "processing" | "shipped" | "delivered"
  created_at: string
  tracking_number: string | null
}

/**
 * API response wrapper for products endpoint
 */
export interface ProductsResponse {
  products: Product[]
  categories: Category[]
  total: number
  page: number
  per_page: number
}

/**
 * API error response interface
 */
export interface ApiError {
  error: {
    code: string
    message: string
    details?: Record<string, unknown>
  }
}

/**
 * Form state interface for checkout
 */
export interface CheckoutFormData {
  customer_info: CustomerInfo
  payment_info: {
    card_number: string
    cardholder_name: string
    expiry_date: string
    security_code: string
    billing_same_as_shipping: boolean
  }
}