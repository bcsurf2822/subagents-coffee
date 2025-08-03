#!/usr/bin/env python3
"""
End-to-End Test Script for Coffee Shop MVP
Tests the full integration between frontend and backend
"""

import requests
import time
import json

def test_backend_health():
    """Test if backend is responding"""
    try:
        response = requests.get('http://localhost:8000/health')
        if response.status_code == 200:
            print("✅ Backend health check passed")
            return True
        else:
            print(f"❌ Backend health check failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Backend not responding: {e}")
        return False

def test_products_api():
    """Test products API endpoint"""
    try:
        response = requests.get('http://localhost:8000/api/products')
        if response.status_code == 200:
            data = response.json()
            products = data.get('products', [])
            categories = data.get('categories', [])
            
            print(f"✅ Products API working - Found {len(products)} products, {len(categories)} categories")
            
            # Test individual product
            if products:
                product_id = products[0]['id']
                response = requests.get(f'http://localhost:8000/api/products/{product_id}')
                if response.status_code == 200:
                    print(f"✅ Individual product API working - Product {product_id}")
                    return True
                else:
                    print(f"❌ Individual product API failed: {response.status_code}")
                    return False
            return True
        else:
            print(f"❌ Products API failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Products API error: {e}")
        return False

def test_cart_functionality():
    """Test shopping cart operations"""
    try:
        session = requests.Session()
        
        # Add item to cart
        add_payload = {"product_id": "1", "quantity": 2}
        response = session.post('http://localhost:8000/api/cart', json=add_payload)
        if response.status_code == 201:
            cart_data = response.json()
            print(f"✅ Add to cart working - Cart has {cart_data['total_items']} items")
            
            # Get cart
            response = session.get('http://localhost:8000/api/cart')
            if response.status_code == 200:
                cart_data = response.json()
                print(f"✅ Get cart working - Subtotal: ${cart_data['subtotal']}")
                
                # Update quantity
                response = session.put('http://localhost:8000/api/cart/1', json={"quantity": 3})
                if response.status_code == 200:
                    cart_data = response.json()
                    print(f"✅ Update cart working - New quantity: {cart_data['items'][0]['quantity']}")
                    
                    # Remove item
                    response = session.delete('http://localhost:8000/api/cart/1')
                    if response.status_code == 200:
                        cart_data = response.json()
                        print(f"✅ Remove from cart working - Items remaining: {len(cart_data['items'])}")
                        return True
                    else:
                        print(f"❌ Remove from cart failed: {response.status_code}")
                        return False
                else:
                    print(f"❌ Update cart failed: {response.status_code}")
                    return False
            else:
                print(f"❌ Get cart failed: {response.status_code}")
                return False
        else:
            print(f"❌ Add to cart failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Cart functionality error: {e}")
        return False

def test_frontend_connection():
    """Test if frontend is responding"""
    try:
        response = requests.get('http://localhost:3000')
        if response.status_code == 200:
            content = response.text
            if "Coffee Shop" in content:
                print("✅ Frontend is responding and has correct title")
                return True
            else:
                print("❌ Frontend responding but missing title")
                return False
        else:
            print(f"❌ Frontend not responding: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Frontend connection error: {e}")
        return False

def main():
    """Run all end-to-end tests"""
    print("🧪 Starting Coffee Shop MVP End-to-End Tests")
    print("=" * 50)
    
    tests = [
        ("Backend Health", test_backend_health),
        ("Products API", test_products_api),
        ("Cart Functionality", test_cart_functionality),
        ("Frontend Connection", test_frontend_connection),
    ]
    
    passed = 0
    total = len(tests)
    
    for test_name, test_func in tests:
        print(f"\n🔍 Testing: {test_name}")
        if test_func():
            passed += 1
        time.sleep(0.5)  # Small delay between tests
    
    print("\n" + "=" * 50)
    print(f"📊 Test Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! The Coffee Shop MVP is working end-to-end!")
        print("\n🚀 Ready for testing:")
        print("   - Backend: http://localhost:8000/api")
        print("   - Frontend: http://localhost:3000")
        print("   - API Docs: http://localhost:8000/docs")
    else:
        print("❌ Some tests failed. Please check the issues above.")
    
    return passed == total

if __name__ == "__main__":
    main()