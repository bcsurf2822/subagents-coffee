import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { CartProvider } from "@/contexts/CartContext"
import Header from "@/components/layout/Header"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "Coffee Shop - Premium Coffee Delivered",
  description: "Discover our carefully curated selection of single-origin and blended coffees from around the world. Premium coffee delivered to your door.",
  keywords: "coffee, single-origin, beans, ground coffee, coffee pods, premium coffee",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased bg-background text-foreground`}>
        <CartProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <footer className="bg-coffee-brown text-white py-8 mt-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Coffee Shop</h3>
                    <p className="text-coffee-cream/80">
                      Premium coffee delivered to your door
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3">Quick Links</h4>
                    <ul className="space-y-2 text-coffee-cream/80">
                      <li>About Us</li>
                      <li>Contact</li>
                      <li>Shipping Info</li>
                      <li>Returns</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3">Categories</h4>
                    <ul className="space-y-2 text-coffee-cream/80">
                      <li>Whole Bean</li>
                      <li>Ground Coffee</li>
                      <li>Coffee Pods</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3">Contact</h4>
                    <ul className="space-y-2 text-coffee-cream/80">
                      <li>1-800-COFFEE</li>
                      <li>support@coffeeshop.com</li>
                    </ul>
                  </div>
                </div>
                <div className="border-t border-coffee-cream/20 mt-8 pt-8 text-center text-coffee-cream/60">
                  <p>&copy; 2024 Coffee Shop. All rights reserved.</p>
                </div>
              </div>
            </footer>
          </div>
        </CartProvider>
      </body>
    </html>
  )
}
