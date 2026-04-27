'use client';

import { useState } from 'react';
import Cart from '@/components/Cart';
import Checkout from '@/components/Checkout';
import AddressForm from '@/components/AddressForm';
import PaymentForm from '@/components/PaymentForm';

export default function CheckoutFlow({ cartItems, onClose, onUpdateQuantity, onRemoveItem, total }) {
  const [checkoutStep, setCheckoutStep] = useState('cart'); // 'cart', 'address', 'payment', 'confirmation'
  const [shippingAddress, setShippingAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);

  const handleProceedToCheckout = () => {
    setCheckoutStep('address');
  };

  const handleAddressSubmit = (address) => {
    setShippingAddress(address);
    setCheckoutStep('payment');
  };

  const handlePaymentSubmit = (payment) => {
    setPaymentMethod(payment);
    setCheckoutStep('confirmation');
  };

  const handleBackStep = () => {
    if (checkoutStep === 'address') {
      setCheckoutStep('cart');
    } else if (checkoutStep === 'payment') {
      setCheckoutStep('address');
    } else if (checkoutStep === 'confirmation') {
      setCheckoutStep('payment');
    }
  };

  return (
    <>
      {checkoutStep === 'cart' && (
        <Cart
          cartItems={cartItems}
          onUpdateQuantity={onUpdateQuantity}
          onRemoveItem={onRemoveItem}
          onProceedCheckout={handleProceedToCheckout}
          onClose={onClose}
          total={total}
        />
      )}

      {checkoutStep === 'address' && (
        <AddressForm
          onSubmit={handleAddressSubmit}
          onBack={handleBackStep}
        />
      )}

      {checkoutStep === 'payment' && (
        <PaymentForm
          shippingAddress={shippingAddress}
          cartItems={cartItems}
          onSubmit={handlePaymentSubmit}
          onBack={handleBackStep}
          total={total}
        />
      )}

      {checkoutStep === 'confirmation' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-8 max-w-md w-full text-center">
            <div className="text-5xl mb-4">✓</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Confirmed!</h2>
            <p className="text-gray-600 mb-6">Your order has been placed successfully.</p>
            <button
              onClick={onClose}
              className="w-full bg-amber-700 text-white py-3 rounded-lg hover:bg-amber-800 transition-colors font-semibold"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </>
  );
}
