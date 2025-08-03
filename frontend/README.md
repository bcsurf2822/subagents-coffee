# Coffee Shop Frontend

A modern, responsive Next.js 15 frontend for the Coffee Shop e-commerce application.

## Features

- **Next.js 15** with App Router and TypeScript
- **Tailwind CSS** for responsive design with custom coffee shop theme
- **React Context** for global cart state management
- **Fully typed** TypeScript interfaces for all data models
- **Responsive design** with mobile-first approach
- **Core E-commerce Features**:
  - Product browsing with category filtering
  - Detailed product pages with flavor profiles
  - Shopping cart management
  - Guest checkout flow
  - Order processing

## Architecture

### Pages
- `/` - Home page with hero, categories, and featured products
- `/products` - Product listing with filtering and pagination
- `/products/[id]` - Individual product detail pages
- `/cart` - Shopping cart with item management
- `/checkout` - Customer information and payment form

### Components
- `Header` - Navigation with cart icon and search
- `ProductCard` - Reusable product display component
- `CartItem` - Shopping cart item with quantity controls
- Layout components for consistent UI structure

### State Management
- `CartContext` - Global cart state using React Context
- Optimistic updates for cart operations
- Error handling and loading states

### API Integration
- RESTful API client with TypeScript
- Centralized error handling
- Session-based cart management

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Open in browser:**
   Visit http://localhost:3000

## Backend Integration

The frontend expects a FastAPI backend running on `http://localhost:8000` with the following endpoints:

- `GET /api/products` - List products with optional filtering
- `GET /api/products/{id}` - Get single product details
- `GET /api/categories` - List product categories
- `GET /api/cart` - Get current cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/{itemId}` - Update cart item quantity
- `DELETE /api/cart/{itemId}` - Remove cart item
- `POST /api/orders` - Create new order

## Design System

The application uses a warm coffee shop aesthetic with:

- **Primary Color**: Coffee Brown (#8B4513)
- **Secondary**: Coffee Cream (#F5F5DC)
- **Accent**: Gold (#DAA520)
- **Responsive breakpoints**: Mobile-first design
- **Typography**: Inter font family
- **Component patterns**: Consistent spacing and hover effects

## Development Notes

- All components are fully typed with TypeScript
- Uses Next.js 15 App Router for file-based routing
- Tailwind CSS with custom color palette
- Context-based state management for cart
- Error boundaries and loading states throughout
- Mobile-responsive design with touch-friendly interactions

## Build

```bash
npm run build
```

Builds the application for production deployment.
