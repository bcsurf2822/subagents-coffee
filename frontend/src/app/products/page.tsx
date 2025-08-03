'use client'

/**
 * Products listing page
 * Displays all products with filtering and pagination
 */

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import type { Product, Category } from '@/types'
import { productsApi } from '@/lib/api/client'
import ProductCard from '@/components/products/ProductCard'

/**
 * Category filter component
 */
function CategoryFilter({ 
  categories, 
  selectedCategory, 
  onCategoryChange,
  productCounts 
}: { 
  categories: Category[]
  selectedCategory: string | null
  onCategoryChange: (category: string | null) => void
  productCounts: Record<string, number>
}) {
  return (
    <div className="flex flex-wrap gap-2 mb-8">
      <button
        onClick={() => onCategoryChange(null)}
        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
          selectedCategory === null
            ? 'bg-coffee-brown text-white'
            : 'bg-coffee-cream/40 text-coffee-brown hover:bg-coffee-cream/60'
        }`}
      >
        All ({Object.values(productCounts).reduce((sum, count) => sum + count, 0)})
      </button>
      {categories.map(category => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            selectedCategory === category.id
              ? 'bg-coffee-brown text-white'
              : 'bg-coffee-cream/40 text-coffee-brown hover:bg-coffee-cream/60'
          }`}
        >
          {category.name} ({productCounts[category.id] || 0})
        </button>
      ))}
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
      <span className="text-coffee-brown">Products</span>
    </nav>
  )
}

/**
 * Main products listing page component
 */
export default function ProductsPage() {
  const searchParams = useSearchParams()
  const initialCategory = searchParams.get('category')

  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  /**
   * Load products and categories data
   */
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const [productsResponse, categoriesResponse] = await Promise.all([
          productsApi.getProducts(),
          productsApi.getCategories()
        ])
        setProducts(productsResponse.products)
        setCategories(categoriesResponse)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load products'
        console.error('[PRODUCTSPAGE-loadData] Error loading data:', errorMessage)
        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  /**
   * Filter products when category selection changes
   */
  useEffect(() => {
    if (selectedCategory) {
      setFilteredProducts(products.filter(product => product.category === selectedCategory))
    } else {
      setFilteredProducts(products)
    }
  }, [products, selectedCategory])

  /**
   * Calculate product counts per category
   */
  const getProductCounts = (): Record<string, number> => {
    const counts: Record<string, number> = {}
    categories.forEach(category => {
      counts[category.id] = products.filter(product => product.category === category.id).length
    })
    return counts
  }

  /**
   * Handle category filter change
   */
  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category)
    // Update URL without page reload
    const url = new URL(window.location.href)
    if (category) {
      url.searchParams.set('category', category)
    } else {
      url.searchParams.delete('category')
    }
    window.history.replaceState({}, '', url.toString())
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-coffee-brown mx-auto mb-4"></div>
            <p className="text-coffee-brown">Loading products...</p>
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

  const productCounts = getProductCounts()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb />
      
      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-coffee-brown mb-4">
          Our Coffee Collection
        </h1>
        <p className="text-xl text-coffee-brown/70">
          {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} available
        </p>
      </div>

      {/* Category Filter */}
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        productCounts={productCounts}
      />

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-coffee-brown/60 text-lg mb-4">
            No products found in this category.
          </p>
          <button
            onClick={() => handleCategoryChange(null)}
            className="text-coffee-brown hover:text-coffee-dark font-medium underline"
          >
            View all products
          </button>
        </div>
      )}
    </div>
  )
}