'use client'

/**
 * Checkout Page
 * Handles customer information and payment processing
 */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCart } from '@/contexts/CartContext'
import { ordersApi, formatPrice } from '@/lib/api/client'
import type { CustomerInfo, PaymentInfo } from '@/types'

/**
 * Form input component
 */
function FormInput({ 
  label, 
  type = 'text', 
  required = false, 
  value, 
  onChange, 
  placeholder = '',
  error 
}: {
  label: string
  type?: string
  required?: boolean
  value: string
  onChange: (value: string) => void
  placeholder?: string
  error?: string
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-coffee-brown mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-coffee-accent focus:border-transparent ${
          error ? 'border-red-300' : 'border-coffee-light/30'
        }`}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}

/**
 * Order summary component
 */
function CheckoutSummary({ cart }: { cart: { items: Array<{ product_id: string; product: { name: string }; quantity: number; subtotal: number }>; subtotal: number } }) {
  const shipping = cart.subtotal >= 75 ? 0 : 5.99
  const tax = cart.subtotal * 0.0875
  const total = cart.subtotal + shipping + tax

  return (
    <div className="bg-white rounded-lg border border-coffee-light/20 p-6">
      <h2 className="text-xl font-semibold text-coffee-brown mb-4">Order Summary</h2>
      
      <div className="space-y-3 mb-6">
        {cart.items.map((item) => (
          <div key={item.product_id} className="flex justify-between text-sm">
            <span className="text-coffee-brown line-clamp-1">
              {item.product.name} × {item.quantity}
            </span>
            <span className="font-medium text-coffee-brown">
              {formatPrice(item.subtotal)}
            </span>
          </div>
        ))}
      </div>

      <hr className="border-coffee-light/30 mb-4" />

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-coffee-brown/70">Subtotal</span>
          <span className="font-medium text-coffee-brown">{formatPrice(cart.subtotal)}</span>
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
      <Link href="/cart" className="hover:text-coffee-brown transition-colors">
        Cart
      </Link>
      <span className="mx-2">›</span>
      <span className="text-coffee-brown">Checkout</span>
    </nav>
  )
}

/**
 * Main checkout page component
 */
export default function CheckoutPage() {
  const { cart, loading } = useCart()
  const router = useRouter()
  
  // Form state
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    name: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    cardNumber: '',
    cardholderName: '',
    expiryDate: '',
    securityCode: '',
    billingSameAsShipping: true
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  /**
   * Update form field
   */
  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  /**
   * Validate form
   */
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Required fields
    if (!formData.email) newErrors.email = 'Email is required'
    if (!formData.name) newErrors.name = 'Full name is required'
    if (!formData.street) newErrors.street = 'Street address is required'
    if (!formData.city) newErrors.city = 'City is required'
    if (!formData.state) newErrors.state = 'State is required'
    if (!formData.zip) newErrors.zip = 'ZIP code is required'
    if (!formData.cardNumber) newErrors.cardNumber = 'Card number is required'
    if (!formData.cardholderName) newErrors.cardholderName = 'Cardholder name is required'
    if (!formData.expiryDate) newErrors.expiryDate = 'Expiry date is required'
    if (!formData.securityCode) newErrors.securityCode = 'Security code is required'

    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    // ZIP code validation
    if (formData.zip && !/^\d{5}(-\d{4})?$/.test(formData.zip)) {
      newErrors.zip = 'Please enter a valid ZIP code'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!cart || cart.items.length === 0) {
      alert('Your cart is empty')
      return
    }

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const customerInfo: CustomerInfo = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        shipping_address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zip: formData.zip
        }
      }

      const paymentInfo: PaymentInfo = {
        method: 'credit_card',
        last_four: formData.cardNumber.slice(-4)
      }

      const order = await ordersApi.createOrder(customerInfo, paymentInfo)
      
      // Redirect to order confirmation
      router.push(`/order-confirmation/${order.id}`)
      
    } catch (error) {
      console.error('[CHECKOUT-handleSubmit] Error creating order:', error)
      alert('There was an error processing your order. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-coffee-brown mx-auto mb-4"></div>
            <p className="text-coffee-brown">Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-semibold text-coffee-brown mb-4">
            Your cart is empty
          </h1>
          <Link
            href="/products"
            className="inline-block bg-coffee-brown text-white px-6 py-3 rounded-lg hover:bg-coffee-dark transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb />
      
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-coffee-brown">Checkout</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Customer Information */}
            <div className="bg-white rounded-lg border border-coffee-light/20 p-6">
              <h2 className="text-xl font-semibold text-coffee-brown mb-6">Customer Information</h2>
              
              <div className="space-y-4">
                <FormInput
                  label="Email Address"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(value) => updateField('email', value)}
                  placeholder="your@email.com"
                  error={errors.email}
                />
                
                <FormInput
                  label="Phone Number"
                  type="tel"
                  value={formData.phone}
                  onChange={(value) => updateField('phone', value)}
                  placeholder="(555) 123-4567"
                  error={errors.phone}
                />
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg border border-coffee-light/20 p-6">
              <h2 className="text-xl font-semibold text-coffee-brown mb-6">Shipping Address</h2>
              
              <div className="space-y-4">
                <FormInput
                  label="Full Name"
                  required
                  value={formData.name}
                  onChange={(value) => updateField('name', value)}
                  error={errors.name}
                />
                
                <FormInput
                  label="Street Address"
                  required
                  value={formData.street}
                  onChange={(value) => updateField('street', value)}
                  error={errors.street}
                />
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <FormInput
                    label="City"
                    required
                    value={formData.city}
                    onChange={(value) => updateField('city', value)}
                    error={errors.city}
                  />
                  
                  <FormInput
                    label="State"
                    required
                    value={formData.state}
                    onChange={(value) => updateField('state', value)}
                    error={errors.state}
                  />
                  
                  <FormInput
                    label="ZIP Code"
                    required
                    value={formData.zip}
                    onChange={(value) => updateField('zip', value)}
                    error={errors.zip}
                  />
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-lg border border-coffee-light/20 p-6">
              <h2 className="text-xl font-semibold text-coffee-brown mb-6">Payment Information</h2>
              
              <div className="space-y-4">
                <FormInput
                  label="Card Number"
                  required
                  value={formData.cardNumber}
                  onChange={(value) => updateField('cardNumber', value)}
                  placeholder="1234 5678 9012 3456"
                  error={errors.cardNumber}
                />
                
                <FormInput
                  label="Cardholder Name"
                  required
                  value={formData.cardholderName}
                  onChange={(value) => updateField('cardholderName', value)}
                  error={errors.cardholderName}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormInput
                    label="Expiry Date"
                    required
                    value={formData.expiryDate}
                    onChange={(value) => updateField('expiryDate', value)}
                    placeholder="MM/YY"
                    error={errors.expiryDate}
                  />
                  
                  <FormInput
                    label="Security Code"
                    required
                    value={formData.securityCode}
                    onChange={(value) => updateField('securityCode', value)}
                    placeholder="123"
                    error={errors.securityCode}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <CheckoutSummary cart={cart} />
            
            <div className="mt-6 space-y-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-coffee-brown hover:bg-coffee-dark text-white font-medium py-4 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing Order...
                  </span>
                ) : (
                  'Place Order'
                )}
              </button>
              
              <Link
                href="/cart"
                className="block w-full text-center text-coffee-brown hover:text-coffee-dark font-medium py-2 transition-colors"
              >
                ← Back to Cart
              </Link>
            </div>

            <div className="mt-6 text-center text-xs text-coffee-brown/60">
              <p className="flex items-center justify-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                Your payment information is secure
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}