'use client'

/**
 * Product detail page
 * Displays detailed information about a single product
 */

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import type { Product } from '@/types'
import { productsApi, formatPrice, getRoastLevelColor } from '@/lib/api/client'
import { useCart } from '@/contexts/CartContext'

/**
 * Quantity selector component
 */
function QuantitySelector({ 
  quantity, 
  onQuantityChange, 
  max = 10 
}: { 
  quantity: number
  onQuantityChange: (quantity: number) => void
  max?: number 
}) {
  const handleDecrease = () => {
    if (quantity > 1) {
      onQuantityChange(quantity - 1)
    }
  }

  const handleIncrease = () => {
    if (quantity < max) {
      onQuantityChange(quantity + 1)
    }
  }

  return (
    <div className="flex items-center space-x-3">
      <span className="text-coffee-brown font-medium">Quantity:</span>
      <div className="flex items-center border border-coffee-light/30 rounded-lg">
        <button
          onClick={handleDecrease}
          disabled={quantity <= 1}
          className="px-3 py-2 text-coffee-brown hover:bg-coffee-cream/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          −
        </button>
        <span className="px-4 py-2 font-medium text-coffee-brown min-w-[3rem] text-center">
          {quantity}
        </span>
        <button
          onClick={handleIncrease}
          disabled={quantity >= max}
          className="px-3 py-2 text-coffee-brown hover:bg-coffee-cream/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          +
        </button>
      </div>
    </div>
  )
}

/**
 * Breadcrumb component
 */
function Breadcrumb({ productName }: { productName: string }) {
  return (
    <nav className="text-sm text-coffee-brown/60 mb-6">
      <Link href="/" className="hover:text-coffee-brown transition-colors">
        Home
      </Link>
      <span className="mx-2">›</span>
      <Link href="/products" className="hover:text-coffee-brown transition-colors">
        Products
      </Link>
      <span className="mx-2">›</span>
      <span className="text-coffee-brown">{productName}</span>
    </nav>
  )
}

/**
 * Main product detail page component
 */
export default function ProductDetailPage() {
  const params = useParams()
  const productId = params.id as string
  const { addToCart } = useCart()

  const [product, setProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  /**
   * Load product data
   */
  useEffect(() => {
    const loadProduct = async () => {
      if (!productId) return

      try {
        setLoading(true)
        const productData = await productsApi.getProduct(productId)
        setProduct(productData)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load product'
        console.error('[PRODUCTDETAIL-loadProduct] Error loading product:', errorMessage)
        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  }, [productId])

  /**
   * Handle add to cart
   */
  const handleAddToCart = async () => {
    if (!product || isAddingToCart || !product.in_stock) return

    setIsAddingToCart(true)
    try {
      await addToCart(product, quantity)
      // Reset quantity after successful add
      setQuantity(1)
    } catch (error) {
      console.error('[PRODUCTDETAIL-handleAddToCart] Error adding to cart:', error)
    } finally {
      setIsAddingToCart(false)
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

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-coffee-brown mx-auto mb-4"></div>
            <p className="text-coffee-brown">Loading product...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-600 mb-4">
              {error || 'Product not found'}
            </p>
            <Link
              href="/products"
              className="bg-coffee-brown text-white px-4 py-2 rounded-lg hover:bg-coffee-dark transition-colors"
            >
              Back to Products
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const totalPrice = product.price * quantity

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb productName={product.name} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="space-y-4">
          <div className="relative aspect-square bg-coffee-cream/20 rounded-lg overflow-hidden">
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />
            {!product.in_stock && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white font-semibold text-xl">Out of Stock</span>
              </div>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-coffee-brown mb-4">
              {product.name}
            </h1>
            <div className="text-3xl font-bold text-coffee-brown mb-6">
              {formatPrice(product.price)}
              <span className="text-base font-normal text-coffee-brown/60 ml-2">
                / {product.weight}
              </span>
            </div>
          </div>

          {/* Roast Level */}
          <div className="flex items-center space-x-4">
            <span className="text-coffee-brown font-medium">Roast Level:</span>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRoastLevelColor(product.roast_level)}`}>
              ● {product.roast_level} Roast
            </span>
          </div>

          {/* Origin & Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <span className="text-coffee-brown/70">Origin:</span>
              <span className="font-medium text-coffee-brown">
                {getCountryFlag(product.origin)} {product.origin}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-coffee-brown/70">Processing:</span>
              <span className="font-medium text-coffee-brown">{product.processing_method}</span>
            </div>
          </div>

          {/* Flavor Notes */}
          {product.flavor_notes && product.flavor_notes.length > 0 && (
            <div>
              <h3 className="text-coffee-brown font-medium mb-3">Flavor Notes:</h3>
              <div className="flex flex-wrap gap-2">
                {product.flavor_notes.map((note, index) => (
                  <span 
                    key={index}
                    className="inline-block px-3 py-1 text-sm bg-coffee-cream/40 text-coffee-brown rounded-full"
                  >
                    {note}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <h3 className="text-coffee-brown font-medium mb-3">Description:</h3>
            <p className="text-coffee-brown/80 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Quantity & Add to Cart */}
          <div className="space-y-4 pt-6 border-t border-coffee-light/20">
            <QuantitySelector 
              quantity={quantity} 
              onQuantityChange={setQuantity}
            />

            <div className="flex items-center justify-between text-lg font-semibold text-coffee-brown">
              <span>Total:</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart || !product.in_stock}
              className={`w-full py-4 px-6 rounded-lg font-medium text-lg transition-all duration-200 ${
                product.in_stock 
                  ? 'bg-coffee-brown text-white hover:bg-coffee-dark focus:outline-none focus:ring-2 focus:ring-coffee-accent focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isAddingToCart ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Adding to Cart...
                </span>
              ) : product.in_stock ? (
                `Add to Cart - ${formatPrice(totalPrice)}`
              ) : (
                'Out of Stock'
              )}
            </button>

            {product.in_stock && (
              <p className="text-green-600 text-sm flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                In Stock
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}