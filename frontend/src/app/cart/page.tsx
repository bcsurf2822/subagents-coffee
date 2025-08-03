'use client'

/**
 * Shopping Cart Page
 * Displays cart items, order summary, and checkout actions
 */

import Link from 'next/link'
import { useCart } from '@/contexts/CartContext'
import { formatPrice } from '@/lib/api/client'
import CartItem from '@/components/cart/CartItem'

/**
 * Order summary component
 */
function OrderSummary({ subtotal }: { subtotal: number }) {
  const shipping = subtotal >= 75 ? 0 : 5.99
  const tax = subtotal * 0.0875 // 8.75% tax rate
  const total = subtotal + shipping + tax

  return (
    <div className="bg-white rounded-lg border border-coffee-light/20 p-6 space-y-4">
      <h2 className="text-xl font-semibold text-coffee-brown">Order Summary</h2>
      
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-coffee-brown/70">Subtotal</span>
          <span className="font-medium text-coffee-brown">{formatPrice(subtotal)}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-coffee-brown/70">Shipping</span>
          <span className="font-medium text-coffee-brown">
            {shipping === 0 ? 'FREE' : formatPrice(shipping)}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-coffee-brown/70">Tax</span>
          <span className="font-medium text-coffee-brown">{formatPrice(tax)}</span>
        </div>
        
        <hr className="border-coffee-light/30" />
        
        <div className="flex justify-between text-lg">
          <span className="font-semibold text-coffee-brown">Total</span>
          <span className="font-bold text-coffee-brown">{formatPrice(total)}</span>
        </div>
      </div>

      {subtotal < 75 && (
        <div className="bg-coffee-accent/10 border border-coffee-accent/20 rounded-lg p-3 text-sm text-coffee-brown">
          <p className="font-medium">Add {formatPrice(75 - subtotal)} more for FREE shipping!</p>
        </div>
      )}

      <div className="space-y-3">
        <Link
          href="/checkout"
          className="block w-full bg-coffee-brown hover:bg-coffee-dark text-white font-medium py-3 px-4 rounded-lg text-center transition-colors"
        >
          Continue to Checkout
        </Link>
        
        <Link
          href="/products"
          className="block w-full bg-coffee-cream/40 hover:bg-coffee-cream/60 text-coffee-brown font-medium py-3 px-4 rounded-lg text-center transition-colors"
        >
          Continue Shopping
        </Link>
      </div>

      <div className="text-center text-xs text-coffee-brown/60 pt-4 border-t border-coffee-light/20">
        <p className="flex items-center justify-center">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          Secure Checkout
        </p>
      </div>
    </div>
  )
}

/**
 * Empty cart component
 */
function EmptyCart() {
  return (
    <div className="text-center py-12">
      <div className="text-6xl mb-4">🛒</div>
      <h2 className="text-2xl font-semibold text-coffee-brown mb-4">
        Your cart is empty
      </h2>
      <p className="text-coffee-brown/70 mb-8 max-w-md mx-auto">
        Looks like you haven&apos;t added any coffee to your cart yet. 
        Browse our collection to find your perfect cup.
      </p>
      <Link
        href="/products"
        className="inline-block bg-coffee-brown hover:bg-coffee-dark text-white font-medium py-3 px-8 rounded-lg transition-colors"
      >
        Start Shopping
      </Link>
    </div>
  )
}

/**
 * Breadcrumb component
 */
function Breadcrumb() {
  return (
    <nav className="text-sm text-coffee-brown/60 mb-6">
      <Link href="/" className="hover:text-coffee-brown transition-colors">
        Home
      </Link>
      <span className="mx-2">›</span>
      <span className="text-coffee-brown">Shopping Cart</span>
    </nav>
  )
}

/**
 * Main cart page component
 */
export default function CartPage() {
  const { cart, loading, error } = useCart()

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-coffee-brown mx-auto mb-4"></div>
            <p className="text-coffee-brown">Loading cart...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-600 mb-4">Error: {error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-coffee-brown text-white px-4 py-2 rounded-lg hover:bg-coffee-dark transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  const isEmpty = !cart || cart.items.length === 0

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb />
      
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-coffee-brown">
          Shopping Cart
          {cart && cart.items.length > 0 && (
            <span className="text-xl font-normal text-coffee-brown/70 ml-2">
              ({cart.total_items} item{cart.total_items !== 1 ? 's' : ''})
            </span>
          )}
        </h1>
      </div>

      {isEmpty ? (
        <EmptyCart />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart!.items.map(item => (
              <CartItem key={item.product_id} item={item} />
            ))}
            
            {/* Clear Cart Button */}
            <div className="pt-4">
              <button className="text-red-600 hover:text-red-800 font-medium transition-colors">
                Clear Cart
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <OrderSummary subtotal={cart!.subtotal} />
          </div>
        </div>
      )}
    </div>
  )
}