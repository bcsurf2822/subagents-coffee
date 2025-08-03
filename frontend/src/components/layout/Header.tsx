"use client";

/**
 * Header component with navigation and cart icon
 * Displays site logo, navigation, and cart status
 */

import Link from "next/link";
import { useCart } from "@/contexts/CartContext";

/**
 * Cart icon component with item count badge
 */
function CartIcon() {
  const { getItemCount } = useCart();
  const itemCount = getItemCount();

  return (
    <Link
      href="/cart"
      className="relative flex items-center space-x-2 text-coffee-brown hover:text-coffee-dark transition-colors"
    >
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-label="Shopping cart"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h8m-8 0a2 2 0 100 4 2 2 0 000-4zm8 0a2 2 0 100 4 2 2 0 000-4z"
        />
      </svg>

      {itemCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-coffee-accent text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center min-w-[20px]">
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      )}

      <span className="hidden sm:inline font-medium">
        Cart {itemCount > 0 && `(${itemCount})`}
      </span>
    </Link>
  );
}

/**
 * Main header component
 */
export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-coffee-light/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2 text-coffee-brown hover:text-coffee-dark transition-colors"
          >
            <span className="text-xl font-bold">Coffee Shop</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-coffee-brown hover:text-coffee-dark font-medium transition-colors"
            >
              Home
            </Link>
            <Link
              href="/products"
              className="text-coffee-brown hover:text-coffee-dark font-medium transition-colors"
            >
              Products
            </Link>
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="search"
                placeholder="Search coffees..."
                className="w-full px-4 py-2 pl-10 pr-4 text-coffee-brown bg-coffee-cream/30 border border-coffee-light/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-coffee-accent focus:border-transparent"
              />
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-coffee-brown/60"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Cart Icon */}
          <CartIcon />
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-4">
          <div className="relative">
            <input
              type="search"
              placeholder="Search coffees..."
              className="w-full px-4 py-2 pl-10 pr-4 text-coffee-brown bg-coffee-cream/30 border border-coffee-light/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-coffee-accent focus:border-transparent"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-coffee-brown/60"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Mobile Navigation */}
          <nav className="flex items-center space-x-6 mt-3">
            <Link
              href="/"
              className="text-coffee-brown hover:text-coffee-dark font-medium transition-colors"
            >
              Home
            </Link>
            <Link
              href="/products"
              className="text-coffee-brown hover:text-coffee-dark font-medium transition-colors"
            >
              Products
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
