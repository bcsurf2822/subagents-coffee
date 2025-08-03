'use client'

/**
 * Product Card Component
 * Displays product information in a card format with add to cart functionality
 */

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import type { Product } from '@/types'
import { useCart } from '@/contexts/CartContext'
import { formatPrice, getRoastLevelColor } from '@/lib/api/client'

interface ProductCardProps {
  product: Product
}

/**
 * Product card component showing coffee product details
 */
export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart()
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  /**
   * Handle add to cart action
   */
  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault() // Prevent navigation when clicking button inside Link
    
    if (isAddingToCart || !product.in_stock) return

    setIsAddingToCart(true)
    try {
      await addToCart(product, 1)
    } catch (error) {
      console.error('[PRODUCTCARD-handleAddToCart] Error adding to cart:', error)
    } finally {
      setIsAddingToCart(false)
    }
  }

  /**
   * Get country flag emoji from origin
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
    <div className="group relative bg-white rounded-lg shadow-sm border border-coffee-light/20 hover:shadow-md transition-all duration-200 overflow-hidden">
      <Link href={`/products/${product.id}`}>
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-coffee-cream/20">
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-200"
          />
          
          {/* Stock Status Overlay */}
          {!product.in_stock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-semibold text-lg">Out of Stock</span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Product Name */}
          <h3 className="text-lg font-semibold text-coffee-brown line-clamp-2 mb-2 group-hover:text-coffee-dark transition-colors">
            {product.name}
          </h3>

          {/* Roast Level Badge */}
          <div className="flex items-center space-x-2 mb-2">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoastLevelColor(product.roast_level)}`}>
              ● {product.roast_level} Roast
            </span>
          </div>

          {/* Origin */}
          <div className="flex items-center text-coffee-brown/70 text-sm mb-3">
            <span className="mr-1">{getCountryFlag(product.origin)}</span>
            <span>{product.origin}</span>
          </div>

          {/* Flavor Notes */}
          {product.flavor_notes && product.flavor_notes.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {product.flavor_notes.slice(0, 3).map((note, index) => (
                <span 
                  key={index}
                  className="inline-block px-2 py-1 text-xs bg-coffee-cream/40 text-coffee-brown rounded"
                >
                  {note}
                </span>
              ))}
              {product.flavor_notes.length > 3 && (
                <span className="inline-block px-2 py-1 text-xs bg-coffee-cream/40 text-coffee-brown rounded">
                  +{product.flavor_notes.length - 3} more
                </span>
              )}
            </div>
          )}

          {/* Price */}
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-coffee-brown">
              {formatPrice(product.price)}
            </span>
            <span className="text-sm text-coffee-brown/60">
              {product.weight}
            </span>
          </div>
        </div>
      </Link>

      {/* Add to Cart Button */}
      <div className="p-4 pt-0">
        <button
          onClick={handleAddToCart}
          disabled={isAddingToCart || !product.in_stock}
          className={`w-full py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
            product.in_stock 
              ? 'bg-coffee-brown text-white hover:bg-coffee-dark focus:outline-none focus:ring-2 focus:ring-coffee-accent focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isAddingToCart ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Adding...
            </span>
          ) : product.in_stock ? (
            'Add to Cart'
          ) : (
            'Out of Stock'
          )}
        </button>
      </div>
    </div>
  )
}