'use client';

import { X, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';

export default function Cart({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem, onProceedCheckout }) {
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = Math.floor(total * 0.1); // 10% discount
  const finalTotal = total - discount;

  return (
    <>
      {/* Overlay with Blur */}
      {isOpen && (
        <div
          className="fixed inset-0  bg-opacity-40 backdrop-blur-xs z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Cart */}
      <div
        className={`fixed right-0 top-0 h-full w-full md:w-96 bg-white shadow-2xl transform transition-transform duration-300 z-50 ${isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Shopping Cart</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Items Container */}
        <div className="flex-1 overflow-y-auto h-[calc(100%-280px)]">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-6">
              <div className="text-5xl mb-4">🛒</div>
              <p className="text-gray-600 text-center">Your cart is empty</p>
              <p className="text-sm text-gray-500 text-center mt-2">Add some beautiful jewelry to get started!</p>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-4 bg-gray-50 p-4 rounded-lg">
                  {/* Product Image */}
                  <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                    <img
                      src={
                        item.name.includes('Ring')
                          ? 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=200&q=80'
                          : item.name.includes('Necklace')
                            ? 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=200&q=80'
                            : item.name.includes('Earrings')
                              ? 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=200&q=80'
                              : item.name.includes('Bracelet') || item.name.includes('Bangle')
                                ? 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=200&q=80'
                                : item.name.includes('Pendant')
                                  ? 'https://images.unsplash.com/photo-1589128777073-263566ae5e4d?w=200&q=80'
                                  : 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=200&q=80'
                      }
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">
                      {item.name}
                    </h3>
                    <p className="text-amber-700 font-bold mt-1">
                      ₹{item.price.toLocaleString()}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="p-1 hover:bg-gray-300 rounded transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-6 text-center text-sm font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:bg-gray-300 rounded transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="text-red-500 hover:text-red-700 transition-colors p-2"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer - Checkout Info */}
        {cartItems.length > 0 && (
          <div className="border-t border-gray-200 p-6 space-y-4">
            {/* Price Breakdown */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-green-600 font-semibold">
                <span>Discount (10%)</span>
                <span>-₹{discount.toLocaleString()}</span>
              </div>
              <div className="border-t border-gray-200 pt-2 flex justify-between text-lg font-bold text-gray-900">
                <span>Total</span>
                <span>₹{finalTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button onClick={onProceedCheckout} className="w-full bg-amber-700 text-white py-3 rounded-lg hover:bg-amber-800 transition-colors font-semibold flex items-center justify-center gap-2">
              Proceed to Checkout
              <ArrowRight size={18} />
            </button>

            {/* Continue Shopping */}
            <button
              onClick={onClose}
              className="w-full border-2 border-amber-700 text-amber-700 py-2 rounded-lg hover:bg-amber-50 transition-colors font-semibold"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
