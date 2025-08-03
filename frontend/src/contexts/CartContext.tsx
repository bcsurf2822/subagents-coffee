'use client'

/**
 * Cart Context Provider for global cart state management
 * Manages shopping cart state and provides cart operations
 */

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import type { Cart, Product } from '@/types'
import { cartApi } from '@/lib/api/client'

/**
 * Cart context state interface
 */
interface CartContextState {
  cart: Cart | null
  loading: boolean
  error: string | null
}

/**
 * Cart context actions
 */
type CartAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CART'; payload: Cart }
  | { type: 'CLEAR_CART' }

/**
 * Cart context interface
 */
interface CartContextType extends CartContextState {
  addToCart: (product: Product, quantity: number) => Promise<void>
  updateQuantity: (productId: string, quantity: number) => Promise<void>
  removeFromCart: (productId: string) => Promise<void>
  refreshCart: () => Promise<void>
  getItemCount: () => number
  getCartTotal: () => number
}

/**
 * Initial state
 */
const initialState: CartContextState = {
  cart: null,
  loading: false,
  error: null
}

/**
 * Cart reducer
 */
function cartReducer(state: CartContextState, action: CartAction): CartContextState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false }
    case 'SET_CART':
      return { ...state, cart: action.payload, loading: false, error: null }
    case 'CLEAR_CART':
      return { ...state, cart: null }
    default:
      return state
  }
}

/**
 * Create cart context
 */
const CartContext = createContext<CartContextType | undefined>(undefined)

/**
 * Cart provider component
 */
export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  /**
   * Load cart on component mount
   */
  useEffect(() => {
    refreshCart()
  }, [])

  /**
   * Refresh cart data from server
   */
  const refreshCart = async (): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      const cart = await cartApi.getCart()
      dispatch({ type: 'SET_CART', payload: cart })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load cart'
      console.error('[CARTCONTEXT-refreshCart] Error loading cart:', errorMessage)
      dispatch({ type: 'SET_ERROR', payload: errorMessage })
    }
  }

  /**
   * Add product to cart
   */
  const addToCart = async (product: Product, quantity: number): Promise<void> => {
    if (quantity <= 0) return
    
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      const updatedCart = await cartApi.addToCart(product.id, quantity)
      dispatch({ type: 'SET_CART', payload: updatedCart })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add item to cart'
      console.error('[CARTCONTEXT-addToCart] Error adding item to cart:', errorMessage)
      dispatch({ type: 'SET_ERROR', payload: errorMessage })
    }
  }

  /**
   * Update item quantity in cart
   */
  const updateQuantity = async (productId: string, quantity: number): Promise<void> => {
    if (quantity <= 0) {
      await removeFromCart(productId)
      return
    }

    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      const updatedCart = await cartApi.updateCartItem(productId, quantity)
      dispatch({ type: 'SET_CART', payload: updatedCart })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update cart item'
      console.error('[CARTCONTEXT-updateQuantity] Error updating cart item:', errorMessage)
      dispatch({ type: 'SET_ERROR', payload: errorMessage })
    }
  }

  /**
   * Remove item from cart
   */
  const removeFromCart = async (productId: string): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      const updatedCart = await cartApi.removeFromCart(productId)
      dispatch({ type: 'SET_CART', payload: updatedCart })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to remove item from cart'
      console.error('[CARTCONTEXT-removeFromCart] Error removing cart item:', errorMessage)
      dispatch({ type: 'SET_ERROR', payload: errorMessage })
    }
  }

  /**
   * Get total number of items in cart
   */
  const getItemCount = (): number => {
    return state.cart?.total_items || 0
  }

  /**
   * Get cart total amount
   */
  const getCartTotal = (): number => {
    return state.cart?.subtotal || 0
  }

  const contextValue: CartContextType = {
    ...state,
    addToCart,
    updateQuantity,
    removeFromCart,
    refreshCart,
    getItemCount,
    getCartTotal
  }

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  )
}

/**
 * Hook to use cart context
 */
export function useCart(): CartContextType {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}