'use client';

import { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductGrid from './components/ProductGrid';
import Cart from './components/Cart';
import AddressForm from './components/AddressForm';
import PaymentForm from './components/PaymentForm';
import ProductDetail from './components/ProductDetail';
import Footer from './components/Footer';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState('cart'); // cart, address, payment, confirmation
  const [cartItems, setCartItems] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [shippingAddress, setShippingAddress] = useState(null);

  // Sample Products Data
  const products = [
    {
      id: 1,
      name: 'Gold Solitaire Diamond Ring',
      category: 'Rings',
      price: 24999,
      originalPrice: 29999,
      rating: 5,
      reviews: 234,
      emoji: '💍',
      discount: 17,
      isNew: true,
    },
    {
      id: 2,
      name: 'Emerald Statement Necklace',
      category: 'Necklaces',
      price: 18999,
      originalPrice: 22999,
      rating: 4,
      reviews: 156,
      emoji: '✨',
      discount: 17,
      isNew: false,
    },
    {
      id: 3,
      name: 'Pearl Drop Earrings',
      category: 'Earrings',
      price: 8999,
      originalPrice: 11999,
      rating: 5,
      reviews: 89,
      emoji: '💎',
      discount: 25,
      isNew: false,
    },
    {
      id: 4,
      name: 'Diamond Tennis Bracelet',
      category: 'Bracelets',
      price: 35999,
      originalPrice: 42999,
      rating: 5,
      reviews: 203,
      emoji: '✨',
      discount: 16,
      isNew: true,
    },
    {
      id: 5,
      name: 'Gold Pendant with Sapphire',
      category: 'Pendants',
      price: 12999,
      originalPrice: 15999,
      rating: 4,
      reviews: 145,
      emoji: '🔱',
      discount: 19,
      isNew: false,
    },
    {
      id: 6,
      name: 'Rose Gold Wedding Ring',
      category: 'Rings',
      price: 32999,
      originalPrice: 39999,
      rating: 5,
      reviews: 267,
      emoji: '💍',
      discount: 18,
      isNew: false,
    },
    {
      id: 7,
      name: 'Diamond Bangle Set',
      category: 'Bracelets',
      price: 45999,
      originalPrice: 54999,
      rating: 5,
      reviews: 198,
      emoji: '✨',
      discount: 16,
      isNew: true,
    },
    {
      id: 8,
      name: 'Ruby Chandelier Earrings',
      category: 'Earrings',
      price: 16999,
      originalPrice: 21999,
      rating: 4,
      reviews: 112,
      emoji: '💎',
      discount: 23,
      isNew: false,
    },
    {
      id: 9,
      name: 'Gold Chain Necklace',
      category: 'Necklaces',
      price: 14999,
      originalPrice: 18999,
      rating: 5,
      reviews: 289,
      emoji: '✨',
      discount: 21,
      isNew: false,
    },
    {
      id: 10,
      name: 'Kundan Pendant Necklace',
      category: 'Pendants',
      price: 22999,
      originalPrice: 28999,
      rating: 4,
      reviews: 176,
      emoji: '🔱',
      discount: 21,
      isNew: true,
    },
    {
      id: 11,
      name: 'Platinum Diamond Ring',
      category: 'Rings',
      price: 54999,
      originalPrice: 64999,
      rating: 5,
      reviews: 156,
      emoji: '💍',
      discount: 15,
      isNew: true,
    },
    {
      id: 12,
      name: 'Gold Bangle',
      category: 'Bracelets',
      price: 18999,
      originalPrice: 24999,
      rating: 5,
      reviews: 201,
      emoji: '✨',
      discount: 24,
      isNew: false,
    },
  ];

  // Add to Cart Handler
  const handleAddToCart = (product) => {
    const existingItem = cartItems.find(item => item.id === product.id);
    
    if (existingItem) {
      setCartItems(cartItems.map(item =>
        item.id === product.id
          ? { ...item, quantity: (item.quantity || 1) + (product.quantity || 1) }
          : item
      ));
    } else {
      setCartItems([...cartItems, { ...product, quantity: product.quantity || 1 }]);
    }
    
    setCartOpen(true);
  };

  // Update Cart Quantity
  const handleUpdateQuantity = (id, quantity) => {
    if (quantity === 0) {
      setCartItems(cartItems.filter(item => item.id !== id));
    } else {
      setCartItems(cartItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      ));
    }
  };

  // Remove from Cart
  const handleRemoveItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  // Calculate total
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Handle checkout steps
  const handleProceedToCheckout = () => {
    setCheckoutStep('address');
  };

  const handleAddressSubmit = (address) => {
    setShippingAddress(address);
    setCheckoutStep('payment');
  };

  const handlePaymentSubmit = () => {
    setCheckoutStep('confirmation');
  };

  const handleBackStep = () => {
    if (checkoutStep === 'address') {
      setCheckoutStep('cart');
    } else if (checkoutStep === 'payment') {
      setCheckoutStep('address');
    }
  };

  const handleOrderComplete = () => {
    setCheckoutStep('cart');
    setCartOpen(false);
    setCartItems([]);
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <Header
        cartCount={cartItems.length}
        onCartClick={() => setCartOpen(true)}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {/* Hero Section */}
      <Hero />

      {/* Products Section */}
      <ProductGrid
        products={products}
        onAddToCart={handleAddToCart}
        selectedCategory={selectedCategory}
      />

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          onAddToCart={handleAddToCart}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {/* Shopping Cart / Checkout Flow */}
      {cartOpen && checkoutStep === 'cart' && (
        <Cart
          isOpen={cartOpen}
          onClose={() => setCartOpen(false)}
          cartItems={cartItems}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onProceedCheckout={handleProceedToCheckout}
          total={total}
        />
      )}

      {cartOpen && checkoutStep === 'address' && (
        <AddressForm
          onSubmit={handleAddressSubmit}
          onBack={handleBackStep}
        />
      )}

      {cartOpen && checkoutStep === 'payment' && (
        <PaymentForm
          shippingAddress={shippingAddress}
          cartItems={cartItems}
          onSubmit={handlePaymentSubmit}
          onBack={handleBackStep}
          total={total}
        />
      )}

      {cartOpen && checkoutStep === 'confirmation' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-8 max-w-md w-full text-center">
            <div className="text-6xl mb-4">✓</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Confirmed!</h2>
            <p className="text-gray-600 mb-2">Your order has been placed successfully.</p>
            <p className="text-sm text-amber-700 font-semibold mb-6">Order ID: #JWL{Math.random().toString().slice(2, 8)}</p>
            <button
              onClick={handleOrderComplete}
              className="w-full bg-amber-700 text-white py-3 rounded-lg hover:bg-amber-800 transition-colors font-semibold"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />

      {/* Floating Cart Button (Mobile) */}
      {cartItems.length > 0 && (
        <button
          onClick={() => setCartOpen(true)}
          className="fixed bottom-6 right-6 md:hidden bg-amber-700 text-white p-4 rounded-full shadow-lg hover:bg-amber-800 transition-colors z-30 flex items-center justify-center"
        >
          <span className="text-xl">🛒</span>
          <span className="ml-2 bg-red-500 text-xs font-bold px-2 py-1 rounded-full">
            {cartItems.length}
          </span>
        </button>
      )}
    </main>
  );
}
