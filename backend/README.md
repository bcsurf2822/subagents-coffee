# Coffee Shop API Backend

A minimal FastAPI backend implementation for the Coffee Shop Online Store MVP.

## Features

- **Product Management**: Browse coffee products with filtering and pagination
- **Shopping Cart**: Session-based cart operations (add, update, remove items)
- **Categories**: Product category management
- **CORS Enabled**: Ready for frontend integration

## Quick Start

1. **Setup Environment**:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Run Server**:
   ```bash
   python main.py
   # OR
   uvicorn main:app --reload
   ```

4. **Access API**:
   - API Base URL: http://localhost:8000/api
   - API Docs: http://localhost:8000/docs
   - Health Check: http://localhost:8000/health

## API Endpoints

### Products
- `GET /api/products` - List products with optional category filtering and pagination
- `GET /api/products/{id}` - Get single product details
- `GET /api/categories` - List all categories

### Shopping Cart
- `POST /api/cart` - Add item to cart
- `GET /api/cart` - Get current cart
- `PUT /api/cart/{itemId}` - Update item quantity
- `DELETE /api/cart/{itemId}` - Remove item from cart

### Example Usage

```bash
# Get all products
curl http://localhost:8000/api/products

# Filter by category
curl "http://localhost:8000/api/products?category=beans"

# Add to cart
curl -X POST http://localhost:8000/api/cart \
  -H "Content-Type: application/json" \
  -d '{"product_id": "1", "quantity": 2}'
```

## Data Storage

- **Products**: Loaded from `data/coffee.json`
- **Categories**: Loaded from `data/categories.json`
- **Cart**: In-memory storage with session cookies

## Architecture

- **Framework**: FastAPI with Pydantic models
- **Session Management**: HTTP-only cookies
- **Data Loading**: JSON files loaded at startup
- **Error Handling**: HTTP exceptions with proper status codes
- **CORS**: Configured for localhost:3000 (frontend)

## Development

The implementation follows Python backend best practices:
- Complete type hints using modern Python syntax
- Comprehensive Google-style docstrings
- Proper error handling with meaningful messages
- Resource management and validation
- Logging with structured format