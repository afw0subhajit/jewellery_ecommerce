'use client';

import { ArrowLeft, CreditCard, Smartphone, Banknote, Lock } from 'lucide-react';
import { useState } from 'react';

const getProductImage = (category, name) => {
  if (name.includes('Ring')) return '/ring.jpg';
  if (name.includes('Necklace')) return '/necklace.jpg';
  if (name.includes('Earrings')) return '/earrings.jpg';
  if (name.includes('Bracelet') || name.includes('Bangle')) return '/bracelet.jpg';
  if (name.includes('Pendant')) return '/ring.jpg';
  return '/ring.jpg';
};

export default function PaymentForm({ shippingAddress, cartItems, onSubmit, onBack, total }) {
  const [_paymentMethod, setPaymentMethod] = useState('card');
  const [formData, setFormData] = useState({
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    upiId: '',
  });
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState({});

  const discount = Math.floor(total * 0.1);
  const finalTotal = total - discount;
  const shipping = 100;
  const grandTotal = finalTotal + shipping;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (paymentMethod === 'card') {
      if (!formData.cardName.trim()) newErrors.cardName = 'Cardholder name is required';
      if (!formData.cardNumber.trim()) newErrors.cardNumber = 'Card number is required';
      if (!formData.expiryDate.trim()) newErrors.expiryDate = 'Expiry date is required';
      if (!formData.cvv.trim()) newErrors.cvv = 'CVV is required';
    } else if (paymentMethod === 'upi') {
      if (!formData.upiId.trim()) newErrors.upiId = 'UPI ID is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setProcessing(true);
    setTimeout(() => {
      onSubmit({
        method: paymentMethod,
        ...formData,
      });
      setProcessing(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0  bg-opacity-50 backdrop-blur-sm z-50 flex items-end md:items-center justify-center">
      <div className="bg-white w-full md:max-w-4xl md:rounded-lg rounded-t-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
        
        {/* Left Side - Order Summary (Hidden on mobile) */}
        <div className="hidden md:flex md:w-96 bg-gray-50 border-r border-gray-200 flex-col p-6">
          <h3 className="font-bold text-lg text-gray-900 mb-6">Order Summary</h3>
          
          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto space-y-4 mb-6">
            {cartItems.map((item) => (
              <div key={item.id} className="flex gap-3">
                <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                  <img
                    src={getProductImage(item.category, item.name)}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 line-clamp-2">{item.name}</p>
                  <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  <p className="text-sm font-semibold text-amber-700">₹{(item.price * item.quantity).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Price Breakdown */}
          <div className="border-t border-gray-300 pt-4 space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>₹{total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-green-600 font-semibold">
              <span>Discount (10%)</span>
              <span>-₹{discount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span>₹{shipping.toLocaleString()}</span>
            </div>
            <div className="border-t border-gray-300 pt-2 flex justify-between text-lg font-bold text-gray-900">
              <span>Total Amount</span>
              <span className="text-amber-700">₹{grandTotal.toLocaleString()}</span>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="border-t border-gray-300 pt-4 mt-4">
            <p className="text-xs font-semibold text-gray-600 uppercase mb-2">Shipping To:</p>
            <p className="text-sm font-medium text-gray-900">{shippingAddress.fullName}</p>
            <p className="text-xs text-gray-600">{shippingAddress.addressLine1}</p>
            <p className="text-xs text-gray-600">{shippingAddress.city}, {shippingAddress.state} {shippingAddress.pincode}</p>
          </div>
        </div>

        {/* Right Side - Payment Form */}
        <div className="flex-1 overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 p-4 md:p-6 flex items-center gap-4 md:hidden">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={24} className="text-gray-600" />
            </button>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Payment</h2>
              <p className="text-sm text-gray-600">Total: ₹{grandTotal.toLocaleString()}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-6">
            {/* Payment Method Selection */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Select Payment Method</h3>
              <div className="space-y-3">
                {/* Credit/Debit Card */}
                <label className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  _paymentMethod === 'card'
                    ? 'border-amber-700 bg-amber-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}>
              <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={_paymentMethod === 'card'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-4 h-4 accent-amber-700 cursor-pointer"
                />
                  <CreditCard size={20} className="text-amber-700" />
                  <div>
                    <p className="font-medium text-gray-900">Credit/Debit Card</p>
                    <p className="text-sm text-gray-500">Visa, Mastercard, RuPay</p>
                  </div>
                </label>

                {/* UPI */}
                <label className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  _paymentMethod === 'upi'
                    ? 'border-amber-700 bg-amber-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="upi"
                    checked={_paymentMethod === 'upi'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 accent-amber-700 cursor-pointer"
                  />
                  <Smartphone size={20} className="text-green-600" />
                  <div>
                    <p className="font-medium text-gray-900">UPI Payment</p>
                    <p className="text-sm text-gray-500">Google Pay, PhonePe, PayTM</p>
                  </div>
                </label>

                {/* Net Banking */}
                <label className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  _paymentMethod === 'netbanking'
                    ? 'border-amber-700 bg-amber-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="netbanking"
                    checked={_paymentMethod === 'netbanking'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 accent-amber-700 cursor-pointer"
                  />
                  <Banknote size={20} className="text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">Net Banking</p>
                    <p className="text-sm text-gray-500">All major banks</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Card Payment Form */}
            {_paymentMethod === 'card' && (
              <div className="space-y-4 border-t pt-6">
                <h4 className="font-semibold text-gray-900">Card Details</h4>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    name="cardName"
                    value={formData.cardName}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-700 ${
                      errors.cardName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="John Doe"
                  />
                  {errors.cardName && (
                    <p className="text-red-500 text-sm mt-1">{errors.cardName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-700 ${
                      errors.cardNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="1234 5678 9012 3456"
                  />
                  {errors.cardNumber && (
                    <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-700 ${
                        errors.expiryDate ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="MM/YY"
                    />
                    {errors.expiryDate && (
                      <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CVV
                    </label>
                    <input
                      type="text"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-700 ${
                        errors.cvv ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="123"
                    />
                    {errors.cvv && (
                      <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* UPI Payment Form */}
            {_paymentMethod === 'upi' && (
              <div className="space-y-4 border-t pt-6">
                <h4 className="font-semibold text-gray-900">UPI ID</h4>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Enter Your UPI ID
                  </label>
                  <input
                    type="text"
                    name="upiId"
                    value={formData.upiId}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-700 ${
                      errors.upiId ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="yourname@upi"
                  />
                  {errors.upiId && (
                    <p className="text-red-500 text-sm mt-1">{errors.upiId}</p>
                  )}
                </div>
              </div>
            )}

            {/* Security Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
              <Lock size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900">
                <p className="font-medium">Secure Payment</p>
                <p className="text-blue-700">Your payment information is encrypted and secure</p>
              </div>
            </div>

            {/* Order Summary on Mobile */}
            <div className="md:hidden border-t pt-4">
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Discount (10%)</span>
                  <span>-₹{discount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>₹{shipping.toLocaleString()}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold text-amber-700">
                  <span>Total</span>
                  <span>₹{grandTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-3 pt-6 border-t md:border-0 md:gap-4">
              <button
                type="button"
                onClick={onBack}
                className="hidden md:block flex-1 border-2 border-amber-700 text-amber-700 py-3 rounded-lg hover:bg-amber-50 transition-colors font-semibold"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={processing}
                className="flex-1 bg-amber-700 text-white py-3 rounded-lg hover:bg-amber-800 disabled:bg-gray-400 transition-colors font-semibold flex items-center justify-center gap-2"
              >
                {processing ? (
                  <>
                    <span className="animate-spin">⏳</span> Processing...
                  </>
                ) : (
                  <>
                    <Lock size={18} /> Pay ₹{grandTotal.toLocaleString()}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
