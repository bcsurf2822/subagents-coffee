/**
 * API client for Coffee Shop backend
 * Provides functions to interact with the FastAPI backend
 */

import type { 
  Product, 
  ProductsResponse, 
  Cart, 
  Order, 
  CustomerInfo, 
  PaymentInfo,
  Category 
} from '@/types'

const API_BASE_URL = 'http://localhost:8000/api'

/**
 * Generic fetch wrapper with error handling
 */
async function apiRequest<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include', // Include cookies for session management
    ...options,
  }

  try {
    const response = await fetch(url, config)
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        error: { code: 'UNKNOWN_ERROR', message: 'An unknown error occurred' }
      }))
      throw new Error(errorData.error?.message || `HTTP ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`[CLIENT-apiRequest] API request failed for ${endpoint}:`, error)
    throw error
  }
}

/**
 * Products API functions
 */
export const productsApi = {
  /**
   * Get all products with optional filtering
   */
  async getProducts(params?: {
    category?: string
    page?: number
    per_page?: number
  }): Promise<ProductsResponse> {
    const searchParams = new URLSearchParams()
    if (params?.category) searchParams.set('category', params.category)
    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.per_page) searchParams.set('per_page', params.per_page.toString())
    
    const endpoint = `/products${searchParams.toString() ? `?${searchParams}` : ''}`
    return apiRequest<ProductsResponse>(endpoint)
  },

  /**
   * Get a single product by ID
   */
  async getProduct(id: string): Promise<Product> {
    return apiRequest<Product>(`/products/${id}`)
  },

  /**
   * Get all categories
   */
  async getCategories(): Promise<Category[]> {
    return apiRequest<Category[]>('/categories')
  }
}

/**
 * Shopping cart API functions
 */
export const cartApi = {
  /**
   * Get current cart
   */
  async getCart(): Promise<Cart> {
    return apiRequest<Cart>('/cart')
  },

  /**
   * Add item to cart
   */
  async addToCart(productId: string, quantity: number): Promise<Cart> {
    return apiRequest<Cart>('/cart', {
      method: 'POST',
      body: JSON.stringify({
        product_id: productId,
        quantity
      })
    })
  },

  /**
   * Update cart item quantity
   */
  async updateCartItem(productId: string, quantity: number): Promise<Cart> {
    return apiRequest<Cart>(`/cart/${productId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity })
    })
  },

  /**
   * Remove item from cart
   */
  async removeFromCart(productId: string): Promise<Cart> {
    return apiRequest<Cart>(`/cart/${productId}`, {
      method: 'DELETE'
    })
  }
}

/**
 * Orders API functions
 */
export const ordersApi = {
  /**
   * Create a new order
   */
  async createOrder(
    customerInfo: CustomerInfo, 
    paymentInfo: PaymentInfo
  ): Promise<Order> {
    return apiRequest<Order>('/orders', {
      method: 'POST',
      body: JSON.stringify({
        customer_info: customerInfo,
        payment_info: paymentInfo
      })
    })
  },

  /**
   * Get order by ID
   */
  async getOrder(id: string): Promise<Order> {
    return apiRequest<Order>(`/orders/${id}`)
  }
}

/**
 * Utility function to format price for display
 */
export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`
}

/**
 * Utility function to get roast level color
 */
export function getRoastLevelColor(roastLevel: string): string {
  switch (roastLevel.toLowerCase()) {
    case 'light':
      return 'bg-yellow-200 text-yellow-800'
    case 'medium':
      return 'bg-orange-200 text-orange-800'
    case 'dark':
      return 'bg-amber-800 text-amber-100'
    default:
      return 'bg-gray-200 text-gray-800'
  }
}