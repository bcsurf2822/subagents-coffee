"""
Coffee Shop API - FastAPI Backend

A minimal FastAPI backend implementation for the Coffee Shop Online Store.
Provides endpoints for product management and shopping cart operations.
"""

import json
import uuid
from pathlib import Path
from typing import Dict, List, Optional, Union
from datetime import datetime

from fastapi import FastAPI, HTTPException, Request, Response, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field


# Pydantic Models
class Product(BaseModel):
    """Product model representing a coffee product."""
    id: str
    name: str
    description: str
    price: float
    category: str
    roast_level: str
    origin: str
    image_url: str
    in_stock: bool
    weight: str
    flavor_notes: List[str]
    processing_method: str


class Category(BaseModel):
    """Category model representing a product category."""
    id: str
    name: str
    description: str
    display_order: int
    image_url: str


class AddToCartRequest(BaseModel):
    """Request model for adding items to cart."""
    product_id: str = Field(..., description="Product ID to add to cart")
    quantity: int = Field(..., gt=0, description="Quantity of items to add")


class UpdateCartRequest(BaseModel):
    """Request model for updating cart item quantity."""
    quantity: int = Field(..., ge=0, description="New quantity (0 to remove)")


class CartItem(BaseModel):
    """Cart item model."""
    product_id: str
    product: Product
    quantity: int
    subtotal: float


class Cart(BaseModel):
    """Shopping cart model."""
    cart_id: str
    items: List[CartItem]
    total_items: int
    subtotal: float


class ProductsResponse(BaseModel):
    """Response model for products endpoint."""
    products: List[Product]
    categories: List[Category]
    total: int
    page: int
    per_page: int


# Initialize FastAPI app
app = FastAPI(
    title="Coffee Shop API",
    description="Backend API for Coffee Shop Online Store",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data storage
DATA_DIR = Path(__file__).parent / "data"
products_data: List[Product] = []
categories_data: List[Category] = []
carts: Dict[str, Dict] = {}  # In-memory cart storage


def load_data() -> None:
    """Load product and category data from JSON files."""
    global products_data, categories_data
    
    try:
        # Load products
        with open(DATA_DIR / "coffee.json", "r", encoding="utf-8") as f:
            coffee_data = json.load(f)
            products_data = [Product(**product) for product in coffee_data["products"]]
        
        # Load categories
        with open(DATA_DIR / "categories.json", "r", encoding="utf-8") as f:
            categories_json = json.load(f)
            categories_data = [Category(**category) for category in categories_json["categories"]]
            
        print(f"[MAIN-load_data] Loaded {len(products_data)} products and {len(categories_data)} categories")
    except Exception as e:
        print(f"[MAIN-load_data] Error loading data: {e}")
        raise


def get_or_create_cart_id(request: Request, response: Response) -> str:
    """Get cart ID from session cookie or create a new one."""
    cart_id = request.cookies.get("cart_id")
    
    if not cart_id or cart_id not in carts:
        cart_id = str(uuid.uuid4())
        carts[cart_id] = {"items": {}, "created_at": datetime.now().isoformat()}
        response.set_cookie(
            key="cart_id",
            value=cart_id,
            max_age=7 * 24 * 60 * 60,  # 7 days
            httponly=True,
            samesite="lax"
        )
        print(f"[MAIN-get_or_create_cart_id] Created new cart: {cart_id}")
    
    return cart_id


def get_product_by_id(product_id: str) -> Optional[Product]:
    """Get product by ID."""
    for product in products_data:
        if product.id == product_id:
            return product
    return None


def build_cart_response(cart_id: str) -> Cart:
    """Build cart response from cart data."""
    cart_data = carts.get(cart_id, {"items": {}})
    cart_items = []
    total_items = 0
    subtotal = 0.0
    
    for product_id, item_data in cart_data["items"].items():
        product = get_product_by_id(product_id)
        if product:
            quantity = item_data["quantity"]
            item_subtotal = product.price * quantity
            cart_items.append(CartItem(
                product_id=product_id,
                product=product,
                quantity=quantity,
                subtotal=item_subtotal
            ))
            total_items += quantity
            subtotal += item_subtotal
    
    return Cart(
        cart_id=cart_id,
        items=cart_items,
        total_items=total_items,
        subtotal=subtotal
    )


# Startup event
@app.on_event("startup")
async def startup_event():
    """Load data on startup."""
    load_data()


# API Endpoints

@app.get("/api/products", response_model=ProductsResponse)
async def get_products(
    category: Optional[str] = None,
    page: int = 1,
    per_page: int = 12
) -> ProductsResponse:
    """
    Retrieve a list of all coffee products with optional filtering and pagination.
    
    Args:
        category: Optional category filter ("beans", "ground", "pods")
        page: Page number for pagination (default: 1)
        per_page: Number of items per page (default: 12, max: 50)
    
    Returns:
        ProductsResponse containing products, categories, and pagination info
    
    Raises:
        HTTPException: If query parameters are invalid
    """
    print(f"[MAIN-get_products] Fetching products - category: {category}, page: {page}, per_page: {per_page}")
    
    # Validate pagination parameters
    if page < 1:
        raise HTTPException(status_code=400, detail="Page must be >= 1")
    if per_page < 1 or per_page > 50:
        raise HTTPException(status_code=400, detail="Per page must be between 1 and 50")
    
    # Filter products by category if specified
    filtered_products = products_data
    if category:
        # Validate category exists
        valid_categories = [cat.id for cat in categories_data]
        if category not in valid_categories:
            raise HTTPException(status_code=400, detail=f"Invalid category. Must be one of: {valid_categories}")
        
        filtered_products = [p for p in products_data if p.category == category]
    
    # Apply pagination
    total = len(filtered_products)
    start_idx = (page - 1) * per_page
    end_idx = start_idx + per_page
    paginated_products = filtered_products[start_idx:end_idx]
    
    print(f"[MAIN-get_products] Returning {len(paginated_products)} products out of {total} total")
    
    return ProductsResponse(
        products=paginated_products,
        categories=categories_data,
        total=total,
        page=page,
        per_page=per_page
    )


@app.get("/api/products/{product_id}", response_model=Product)
async def get_product(product_id: str) -> Product:
    """
    Retrieve details for a specific product.
    
    Args:
        product_id: Product ID to retrieve
    
    Returns:
        Product details
    
    Raises:
        HTTPException: If product is not found
    """
    print(f"[MAIN-get_product] Fetching product with ID: {product_id}")
    
    product = get_product_by_id(product_id)
    if not product:
        print(f"[MAIN-get_product] Product not found: {product_id}")
        raise HTTPException(status_code=404, detail="Product not found")
    
    return product


@app.get("/api/categories", response_model=List[Category])
async def get_categories() -> List[Category]:
    """
    Retrieve all product categories.
    
    Returns:
        List of all categories
    """
    print(f"[MAIN-get_categories] Returning {len(categories_data)} categories")
    return categories_data


@app.post("/api/cart", response_model=Cart, status_code=status.HTTP_201_CREATED)
async def add_to_cart(
    item: AddToCartRequest,
    request: Request,
    response: Response
) -> Cart:
    """
    Add an item to the shopping cart.
    
    Args:
        item: Item to add to cart (product_id and quantity)
        request: HTTP request object
        response: HTTP response object
    
    Returns:
        Updated cart contents
    
    Raises:
        HTTPException: If product is not found or request is invalid
    """
    print(f"[MAIN-add_to_cart] Adding product {item.product_id} (qty: {item.quantity}) to cart")
    
    # Validate product exists
    product = get_product_by_id(item.product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    if not product.in_stock:
        raise HTTPException(status_code=400, detail="Product is out of stock")
    
    # Get or create cart
    cart_id = get_or_create_cart_id(request, response)
    
    # Add item to cart
    if item.product_id in carts[cart_id]["items"]:
        # Update existing item
        carts[cart_id]["items"][item.product_id]["quantity"] += item.quantity
    else:
        # Add new item
        carts[cart_id]["items"][item.product_id] = {"quantity": item.quantity}
    
    print(f"[MAIN-add_to_cart] Added to cart {cart_id}, new quantity: {carts[cart_id]['items'][item.product_id]['quantity']}")
    
    return build_cart_response(cart_id)


@app.get("/api/cart", response_model=Cart)
async def get_cart(request: Request, response: Response) -> Cart:
    """
    Retrieve the current shopping cart.
    
    Args:
        request: HTTP request object
        response: HTTP response object
    
    Returns:
        Current cart contents
    """
    cart_id = get_or_create_cart_id(request, response)
    print(f"[MAIN-get_cart] Fetching cart: {cart_id}")
    
    return build_cart_response(cart_id)


@app.put("/api/cart/{item_id}", response_model=Cart)
async def update_cart_item(
    item_id: str,
    update_data: UpdateCartRequest,
    request: Request,
    response: Response
) -> Cart:
    """
    Update the quantity of an item in the cart.
    
    Args:
        item_id: Cart item ID (product_id)
        update_data: New quantity data
        request: HTTP request object
        response: HTTP response object
    
    Returns:
        Updated cart contents
    
    Raises:
        HTTPException: If item is not in cart or quantity is invalid
    """
    print(f"[MAIN-update_cart_item] Updating item {item_id} to quantity: {update_data.quantity}")
    
    cart_id = get_or_create_cart_id(request, response)
    
    # Check if item exists in cart
    if item_id not in carts[cart_id]["items"]:
        raise HTTPException(status_code=404, detail="Item not in cart")
    
    # Update or remove item
    if update_data.quantity == 0:
        # Remove item from cart
        del carts[cart_id]["items"][item_id]
        print(f"[MAIN-update_cart_item] Removed item {item_id} from cart")
    else:
        # Update quantity
        carts[cart_id]["items"][item_id]["quantity"] = update_data.quantity
        print(f"[MAIN-update_cart_item] Updated item {item_id} quantity to {update_data.quantity}")
    
    return build_cart_response(cart_id)


@app.delete("/api/cart/{item_id}", response_model=Cart)
async def remove_from_cart(
    item_id: str,
    request: Request,
    response: Response
) -> Cart:
    """
    Remove an item from the cart.
    
    Args:
        item_id: Cart item ID (product_id)
        request: HTTP request object
        response: HTTP response object
    
    Returns:
        Updated cart contents
    
    Raises:
        HTTPException: If item is not in cart
    """
    print(f"[MAIN-remove_from_cart] Removing item {item_id} from cart")
    
    cart_id = get_or_create_cart_id(request, response)
    
    # Check if item exists in cart
    if item_id not in carts[cart_id]["items"]:
        raise HTTPException(status_code=404, detail="Item not in cart")
    
    # Remove item
    del carts[cart_id]["items"][item_id]
    print(f"[MAIN-remove_from_cart] Removed item {item_id} from cart")
    
    return build_cart_response(cart_id)


# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)