# Coffee Shop API Specification

## Overview
This document outlines the API specification for the Coffee Shop Online Store backend service. The API provides endpoints for product management, shopping cart operations, and order processing.

## Base URL
```
http://localhost:8000/api
```

## Authentication
- Session-based authentication using HTTP-only cookies
- No user authentication required (guest checkout only)

## API Endpoints

### 1. Products Endpoints

#### GET /api/products
Retrieve a list of all coffee products with optional filtering and pagination.

**Query Parameters:**
- `category` (string, optional): Filter by product category ("beans", "ground", "pods")
- `page` (integer, optional): Page number for pagination (default: 1)
- `per_page` (integer, optional): Number of items per page (default: 12, max: 50)

**Response:** `200 OK`
```json
{
  "products": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "price": "number",
      "category": "string",
      "roast_level": "Light|Medium|Dark",
      "origin": "string",
      "image_url": "string",
      "in_stock": "boolean",
      "weight": "string",
      "flavor_notes": ["string"],
      "processing_method": "string"
    }
  ],
  "categories": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "display_order": "number",
      "image_url": "string"
    }
  ],
  "total": "number",
  "page": "number",
  "per_page": "number"
}
```

**Error Responses:**
- `400 Bad Request`: Invalid query parameters
- `500 Internal Server Error`: Server error

#### GET /api/products/{id}
Retrieve details for a specific product.

**Path Parameters:**
- `id` (string, required): Product ID

**Response:** `200 OK`
```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "price": "number",
  "category": "string",
  "roast_level": "Light|Medium|Dark",
  "origin": "string",
  "image_url": "string",
  "in_stock": "boolean",
  "weight": "string",
  "flavor_notes": ["string"],
  "processing_method": "string"
}
```

**Error Responses:**
- `404 Not Found`: Product not found
- `500 Internal Server Error`: Server error

#### GET /api/categories
Retrieve all product categories.

**Response:** `200 OK`
```json
[
  {
    "id": "string",
    "name": "string",
    "description": "string",
    "display_order": "number",
    "image_url": "string"
  }
]
```

### 2. Shopping Cart Endpoints

#### POST /api/cart
Add an item to the shopping cart.

**Request Body:**
```json
{
  "product_id": "string",
  "quantity": "number"
}
```

**Response:** `201 Created`
```json
{
  "cart_id": "string",
  "items": [
    {
      "product_id": "string",
      "product": { /* product object */ },
      "quantity": "number",
      "subtotal": "number"
    }
  ],
  "total_items": "number",
  "subtotal": "number"
}
```

**Error Responses:**
- `400 Bad Request`: Invalid request data
- `404 Not Found`: Product not found
- `500 Internal Server Error`: Server error

#### GET /api/cart
Retrieve the current shopping cart.

**Response:** `200 OK`
```json
{
  "cart_id": "string",
  "items": [
    {
      "product_id": "string",
      "product": { /* product object */ },
      "quantity": "number",
      "subtotal": "number"
    }
  ],
  "total_items": "number",
  "subtotal": "number"
}
```

#### PUT /api/cart/{itemId}
Update the quantity of an item in the cart.

**Path Parameters:**
- `itemId` (string, required): Cart item ID (product_id)

**Request Body:**
```json
{
  "quantity": "number"
}
```

**Response:** `200 OK`
```json
{
  "cart_id": "string",
  "items": [ /* updated cart items */ ],
  "total_items": "number",
  "subtotal": "number"
}
```

**Error Responses:**
- `400 Bad Request`: Invalid quantity
- `404 Not Found`: Item not in cart
- `500 Internal Server Error`: Server error

#### DELETE /api/cart/{itemId}
Remove an item from the cart.

**Path Parameters:**
- `itemId` (string, required): Cart item ID (product_id)

**Response:** `200 OK`
```json
{
  "cart_id": "string",
  "items": [ /* remaining cart items */ ],
  "total_items": "number",
  "subtotal": "number"
}
```

**Error Responses:**
- `404 Not Found`: Item not in cart
- `500 Internal Server Error`: Server error

### 3. Order Endpoints

#### POST /api/orders
Create a new order from the current cart.

**Request Body:**
```json
{
  "customer_info": {
    "name": "string",
    "email": "string",
    "phone": "string",
    "shipping_address": {
      "street": "string",
      "city": "string",
      "state": "string",
      "zip": "string"
    }
  },
  "payment_info": {
    "method": "credit_card",
    "last_four": "string"
  }
}
```

**Response:** `201 Created`
```json
{
  "id": "string",
  "order_number": "string",
  "items": [
    {
      "product_id": "string",
      "product_name": "string",
      "quantity": "number",
      "price": "number",
      "subtotal": "number"
    }
  ],
  "customer_info": { /* customer object */ },
  "subtotal": "number",
  "tax": "number",
  "shipping": "number",
  "total": "number",
  "status": "pending|processing|shipped|delivered",
  "created_at": "ISO 8601 datetime",
  "tracking_number": "string|null"
}
```

**Error Responses:**
- `400 Bad Request`: Invalid order data or empty cart
- `500 Internal Server Error`: Server error

#### GET /api/orders/{id}
Retrieve order details.

**Path Parameters:**
- `id` (string, required): Order ID

**Response:** `200 OK`
```json
{
  "id": "string",
  "order_number": "string",
  "items": [ /* order items */ ],
  "customer_info": { /* customer object */ },
  "subtotal": "number",
  "tax": "number",
  "shipping": "number",
  "total": "number",
  "status": "pending|processing|shipped|delivered",
  "created_at": "ISO 8601 datetime",
  "tracking_number": "string|null"
}
```

**Error Responses:**
- `404 Not Found`: Order not found
- `500 Internal Server Error`: Server error

## Error Response Format
All error responses follow this format:
```json
{
  "error": {
    "code": "string",
    "message": "string",
    "details": {} // optional additional error details
  }
}
```

## Project Structure

### Backend (FastAPI)
```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI application entry point
│   ├── api/
│   │   ├── __init__.py
│   │   ├── endpoints/
│   │   │   ├── __init__.py
│   │   │   ├── products.py     # Product endpoints
│   │   │   ├── cart.py         # Cart endpoints
│   │   │   └── orders.py       # Order endpoints
│   │   └── dependencies.py     # Shared dependencies
│   ├── core/
│   │   ├── __init__.py
│   │   ├── config.py           # Configuration settings
│   │   └── exceptions.py       # Custom exceptions
│   ├── models/
│   │   ├── __init__.py
│   │   ├── product.py          # Product Pydantic models
│   │   ├── cart.py             # Cart Pydantic models
│   │   └── order.py            # Order Pydantic models
│   ├── services/
│   │   ├── __init__.py
│   │   ├── data_loader.py      # JSON file loading service
│   │   ├── cart_service.py     # Cart business logic
│   │   └── order_service.py    # Order processing logic
│   └── data/                   # Static JSON data files
│       ├── categories.json
│       └── coffee.json
├── tests/
│   ├── __init__.py
│   ├── test_products.py
│   ├── test_cart.py
│   └── test_orders.py
├── requirements.txt
├── .env.example
└── README.md
```

### Frontend (Next.js/React)
```
frontend/
├── app/                        # Next.js 15 app directory
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Home page
│   ├── products/
│   │   ├── page.tsx           # Products listing
│   │   └── [id]/
│   │       └── page.tsx       # Product detail
│   ├── cart/
│   │   └── page.tsx           # Shopping cart
│   └── checkout/
│       └── page.tsx           # Checkout flow
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── products/
│   │   ├── ProductCard.tsx
│   │   ├── ProductGrid.tsx
│   │   └── CategoryFilter.tsx
│   ├── cart/
│   │   ├── CartIcon.tsx
│   │   ├── CartItem.tsx
│   │   └── CartSummary.tsx
│   └── ui/                    # shadcn/ui components
├── lib/
│   ├── api/                   # API client
│   ├── hooks/                 # Custom hooks
│   └── utils/                 # Utilities
├── contexts/
│   └── CartContext.tsx
├── types/
│   └── index.ts              # TypeScript types
├── package.json
└── README.md
```

## Functional Requirements for Coffee Details Display

### Product List Display
1. **Grid Layout**: Products must be displayed in a responsive grid (4 columns on desktop, 2 on tablet, 1 on mobile)
2. **Product Card**: Each product card must show:
   - Product image
   - Product name
   - Price (formatted with currency)
   - Roast level badge
   - Origin country
   - "Add to Cart" button

### Product Detail Page
1. **Image Display**: Large product image with zoom capability
2. **Product Information**:
   - Name (heading)
   - Price (prominent display)
   - Description (full text)
   - Roast level with visual indicator
   - Origin with map icon
   - Weight/size
   - Processing method
3. **Flavor Profile**:
   - Display flavor notes as tags
   - Visual representation of roast level (light to dark scale)
4. **Actions**:
   - Quantity selector (1-10)
   - "Add to Cart" button with loading state
   - Stock status indicator
5. **Related Products**: Show 4-6 related products from the same category

### Category Filtering
1. **Filter Bar**: Sticky filter bar below header showing all categories
2. **Active State**: Visual indication of selected category
3. **Count Badge**: Show number of products in each category
4. **All Products**: Default option to show all products

### Responsive Behavior
1. **Mobile**: Single column layout, collapsible filters
2. **Tablet**: 2-column grid, side filter panel
3. **Desktop**: 4-column grid, top filter bar
4. **Touch Optimization**: Larger tap targets on mobile devices

### Performance Requirements
1. **Image Loading**: Progressive image loading with blur placeholder
2. **Pagination**: Load 12 products initially, infinite scroll or pagination
3. **Caching**: Cache product data for 5 minutes
4. **Loading States**: Skeleton screens while loading