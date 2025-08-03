"use client";

/**
 * Home page component
 * Displays hero section, category navigation, and featured products
 */

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import type { Product, Category } from "@/types";
import { productsApi } from "@/lib/api/client";
import ProductCard from "@/components/products/ProductCard";

/**
 * Hero section component
 */
function HeroSection() {
  return (
    <section className="relative bg-gradient-to-r from-coffee-brown to-coffee-dark text-white h-screen overflow-hidden">
      <Image
        src="/images/coffee-shop.png"
        alt="Coffee Shop"
        fill
        className="object-cover object-bottom"
        priority
      />
      <div className="absolute inset-0 bg-black/30"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center h-full flex flex-col justify-center z-10">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          <span className="text-white font-extrabold drop-shadow-2xl">
            Premium Coffee
          </span>
          <br />
          <span className="text-white font-extrabold drop-shadow-2xl">
            Delivered to Your Door
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-white font-semibold drop-shadow-xl mb-8 max-w-3xl mx-auto">
          Discover our carefully curated selection of single-origin and blended
          coffees from around the world
        </p>
        <div className="flex justify-center">
          <Link
            href="/products"
            className="inline-block bg-white/95 hover:bg-white text-black font-bold py-2 px-3 rounded text-base transition-colors shadow-xl border border-white"
          >
            Shop Now
          </Link>
        </div>
      </div>
    </section>
  );
}

/**
 * Category card component
 */
function CategoryCard({
  category,
  productCount,
}: {
  category: Category;
  productCount: number;
}) {
  return (
    <Link
      href={`/products?category=${category.id}`}
      className="group block bg-white rounded-lg shadow-sm border border-coffee-light/20 hover:shadow-md transition-all duration-200 overflow-hidden"
    >
      <div className="aspect-square bg-coffee-cream/20 relative overflow-hidden">
        <Image
          src={category.image_url}
          alt={category.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-200"
        />
      </div>
      <div className="p-6 text-center">
        <h3 className="text-xl font-semibold text-coffee-brown group-hover:text-coffee-dark transition-colors mb-2">
          {category.name}
        </h3>
        <p className="text-coffee-brown/70 mb-3">{category.description}</p>
        <p className="text-coffee-accent font-medium">
          {productCount} Product{productCount !== 1 ? "s" : ""}
        </p>
      </div>
    </Link>
  );
}

/**
 * Categories section component
 */
function CategoriesSection({
  categories,
  products,
}: {
  categories: Category[];
  products: Product[];
}) {
  const getCategoryProductCount = (categoryId: string) => {
    return products.filter((product) => product.category === categoryId).length;
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-coffee-brown mb-4">
            Shop by Category
          </h2>
          <p className="text-xl text-coffee-brown/70 max-w-2xl mx-auto">
            Find the perfect coffee for your taste and brewing method
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              productCount={getCategoryProductCount(category.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Featured products section component
 */
function FeaturedProductsSection({ products }: { products: Product[] }) {
  return (
    <section className="py-16 bg-coffee-cream/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-coffee-brown mb-4">
            Featured Products
          </h2>
          <p className="text-xl text-coffee-brown/70 max-w-2xl mx-auto">
            Hand-picked favorites from our collection
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="text-center mt-12">
          <Link
            href="/products"
            className="inline-block bg-coffee-brown hover:bg-coffee-dark text-white font-medium py-3 px-8 rounded-lg transition-colors"
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
}

/**
 * Main home page component
 */
export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [productsResponse, categoriesResponse] = await Promise.all([
          productsApi.getProducts(),
          productsApi.getCategories(),
        ]);
        setProducts(productsResponse.products);
        setCategories(categoriesResponse);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load data";
        console.error("[HOMEPAGE-loadData] Error loading data:", errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-coffee-brown mx-auto mb-4"></div>
          <p className="text-coffee-brown">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
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
    );
  }

  return (
    <div>
      <HeroSection />
      <CategoriesSection categories={categories} products={products} />
      <FeaturedProductsSection products={products} />
    </div>
  );
}
