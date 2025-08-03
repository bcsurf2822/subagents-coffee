# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Coffee Shop Online Store e-commerce application, designed as a full-stack web application for browsing and purchasing coffee products. The project is in the planning/specification phase with comprehensive PRDs and sample data files ready for implementation.

## Project Specifications

The main PRD (`prd.md`) outlines:
- A Next.js 15 + TypeScript frontend with Tailwind CSS and shadcn/ui
- A Python FastAPI backend
- PostgreSQL database
- Features: product browsing, shopping cart, checkout flow
- Explicitly excludes (MVP): user accounts, real payments, inventory management, admin interface, email notifications, reviews/ratings

## Tech Stack

### Frontend
- Next.js 15 with TypeScript
- Tailwind CSS for styling
- shadcn/ui components
- React Context for cart state
- React Query for server state

### Backend
- Python with FastAPI
- PostgreSQL database
- RESTful API design

## API Endpoints

### Products
- `GET /api/products` - List all products with pagination
- `GET /api/products/:id` - Get single product details
- `GET /api/categories` - List product categories

### Shopping Cart
- `POST /api/cart` - Add item to cart
- `GET /api/cart` - Get current cart
- `PUT /api/cart/:itemId` - Update quantity
- `DELETE /api/cart/:itemId` - Remove item

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get order details

## Data Models

### Product
- `id`, `name`, `description`, `price`, `category`, `roast_level`, `origin`, `image_url`, `in_stock`
- Extended attributes in sample data: `weight`, `flavor_notes`, `processing_method`

### CartItem
- `product_id`, `quantity`, `session_id`

### Order
- `id`, `items`, `total`, `status`, `created_at`, `customer_info`
- Includes: `subtotal`, `tax`, `shipping`, `payment_info`, optional `tracking_number`

## Sample Data Files

The `/docs` directory contains comprehensive sample data:
- `/docs/coffee/coffee.json` - 12 coffee products across beans, ground, and pods categories
- `/docs/categories.json` - Product category definitions
- `/docs/sample-cart.json` - Example shopping cart sessions
- `/docs/sample-orders.json` - Sample orders with various statuses

## Development Commands

Since no implementation exists yet, here are the typical commands you'll need to set up:

### Frontend (Next.js)
```bash
# Initialize Next.js project
npx create-next-app@latest frontend --typescript --tailwind --app

# Development
cd frontend
npm run dev

# Build
npm run build

# Lint
npm run lint
```

### Backend (FastAPI)
```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install fastapi uvicorn sqlalchemy psycopg2-binary python-dotenv

# Run development server
uvicorn main:app --reload

# Run tests (when implemented)
pytest
```

## Key Implementation Notes

1. The project emphasizes a mobile-first responsive design
2. Cart should persist across sessions using session management
3. Use mock payment confirmation (no real payment processing)
4. Focus on core shopping functionality for MVP
5. Target performance metrics: <2s page load, <30% cart abandonment
6. Guest checkout only (no user authentication required)

## Project Structure

When implementing, organize the code as follows:
- `/frontend` - Next.js application
- `/backend` - FastAPI application
- `/docs` - Sample data and documentation (already created)
- Database migrations and schemas should be in `/backend/migrations`