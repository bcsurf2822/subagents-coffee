'use client'

/**
 * Cart Item Component
 * Displays a single item in the shopping cart with quantity controls
 */

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import type { CartItem as CartItemType } from '@/types'
import { useCart } from '@/contexts/CartContext'
import { formatPrice, getRoastLevelColor } from '@/lib/api/client'

interface CartItemProps {
  item: CartItemType
}

/**
 * Quantity selector for cart items
 */
function QuantitySelector({ 
  quantity, 
  onQuantityChange, 
  loading,
  max = 10 
}: { 
  quantity: number
  onQuantityChange: (quantity: number) => void
  loading: boolean
  max?: number 
}) {
  const handleDecrease = () => {
    if (quantity > 1 && !loading) {
      onQuantityChange(quantity - 1)
    }
  }

  const handleIncrease = () => {
    if (quantity < max && !loading) {
      onQuantityChange(quantity + 1)
    }
  }

  return (
    <div className="flex items-center border border-coffee-light/30 rounded-lg">
      <button
        onClick={handleDecrease}
        disabled={quantity <= 1 || loading}
        className="px-3 py-1 text-coffee-brown hover:bg-coffee-cream/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        −
      </button>
      <span className="px-3 py-1 font-medium text-coffee-brown min-w-[2.5rem] text-center">
        {quantity}
      </span>
      <button
        onClick={handleIncrease}
        disabled={quantity >= max || loading}
        className="px-3 py-1 text-coffee-brown hover:bg-coffee-cream/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        +
      </button>
    </div>
  )
}

/**
 * Cart item component
 */
export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart()
  const [isUpdating, setIsUpdating] = useState(false)
  const [isRemoving, setIsRemoving] = useState(false)

  /**
   * Handle quantity change
   */
  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity === item.quantity || isUpdating) return

    setIsUpdating(true)
    try {
      await updateQuantity(item.product_id, newQuantity)
    } catch (error) {
      console.error('[CARTITEM-handleQuantityChange] Error updating quantity:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  /**
   * Handle remove item
   */
  const handleRemove = async () => {
    if (isRemoving) return

    setIsRemoving(true)
    try {
      await removeFromCart(item.product_id)
    } catch (error) {
      console.error('[CARTITEM-handleRemove] Error removing item:', error)
      setIsRemoving(false)
    }
  }

  /**
   * Get country flag emoji
   */
  const getCountryFlag = (origin: string): string => {
    const flagMap: { [key: string]: string } = {
      'Ethiopia': '🇪🇹',
      'Colombia': '🇨🇴',
      'Costa Rica': '🇨🇷',
      'Kenya': '🇰🇪',
      'Guatemala': '🇬🇹',
      'Brazil': '🇧🇷',
      'Jamaica': '🇯🇲',
      'Peru': '🇵🇪',
      'Honduras': '🇭🇳',
      'Nicaragua': '🇳🇮'
    }
    return flagMap[origin] || '🌍'
  }

  return (
    <div className={`bg-white rounded-lg border border-coffee-light/20 p-4 ${isRemoving ? 'opacity-50' : ''}`}>
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Product Image */}
        <Link href={`/products/${item.product.id}`} className="flex-shrink-0">
          <div className="relative w-24 h-24 bg-coffee-cream/20 rounded-lg overflow-hidden">
            <Image
              src={item.product.image_url}
              alt={item.product.name}
              fill
              sizes="96px"
              className="object-cover hover:scale-105 transition-transform duration-200"
            />
          </div>
        </Link>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <Link 
            href={`/products/${item.product.id}`}
            className="block group"
          >
            <h3 className="text-lg font-semibold text-coffee-brown group-hover:text-coffee-dark transition-colors line-clamp-2 mb-2">
              {item.product.name}
            </h3>
          </Link>

          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoastLevelColor(item.product.roast_level)}`}>
              ● {item.product.roast_level} Roast
            </span>
            <span className="text-coffee-brown/70 text-sm">
              {getCountryFlag(item.product.origin)} {item.product.origin}
            </span>
            <span className="text-coffee-brown/70 text-sm">
              {item.product.weight}
            </span>
          </div>

          <div className="flex items-center text-coffee-brown/80 text-sm mb-3">
            <span>{formatPrice(item.product.price)} each</span>
          </div>

          {/* Mobile Layout: Stacked */}
          <div className="flex flex-col sm:hidden space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-coffee-brown/70">Quantity:</span>
              <QuantitySelector
                quantity={item.quantity}
                onQuantityChange={handleQuantityChange}
                loading={isUpdating}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-coffee-brown/70">Subtotal:</span>
              <span className="font-semibold text-coffee-brown">
                {formatPrice(item.subtotal)}
              </span>
            </div>
            <button
              onClick={handleRemove}
              disabled={isRemoving}
              className="self-start text-red-600 hover:text-red-800 text-sm font-medium transition-colors disabled:opacity-50"
            >
              {isRemoving ? 'Removing...' : 'Remove'}
            </button>
          </div>
        </div>

        {/* Desktop Layout: Right Side Controls */}
        <div className="hidden sm:flex flex-col items-end space-y-3 min-w-[120px]">
          <QuantitySelector
            quantity={item.quantity}
            onQuantityChange={handleQuantityChange}
            loading={isUpdating}
          />
          
          <div className="text-right">
            <div className="font-semibold text-coffee-brown text-lg">
              {formatPrice(item.subtotal)}
            </div>
          </div>

          <button
            onClick={handleRemove}
            disabled={isRemoving}
            className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors disabled:opacity-50"
          >
            {isRemoving ? 'Removing...' : 'Remove'}
          </button>
        </div>
      </div>
    </div>
  )
}