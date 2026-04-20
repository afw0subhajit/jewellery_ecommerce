'use client';

import { useState } from 'react';
import { X, Star, ShoppingCart, Heart, Shield, Truck, RotateCcw, ChevronLeft, ChevronRight, Share2, Check } from 'lucide-react';

// Map product name to multiple gallery images
const getProductGallery = (name) => {
  if (name.includes('Ring')) return [
    'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80',
    'https://images.unsplash.com/photo-1586105251261-72a756497a11?w=800&q=80',
    'https://images.unsplash.com/photo-1543294001-f7cd5d7fb516?w=800&q=80',
    'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80',
  ];
  if (name.includes('Necklace')) return [
    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80',
    'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80',
    'https://images.unsplash.com/photo-1589128777073-263566ae5e4d?w=800&q=80',
    'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&q=80',
  ];
  if (name.includes('Earrings')) return [
    'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80',
    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80',
    'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80',
    'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&q=80',
  ];
  if (name.includes('Bracelet') || name.includes('Bangle')) return [
    'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80',
    'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80',
    'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80',
    'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&q=80',
  ];
  if (name.includes('Pendant')) return [
    'https://images.unsplash.com/photo-1589128777073-263566ae5e4d?w=800&q=80',
    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80',
    'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80',
    'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&q=80',
  ];
  return [
    'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&q=80',
    'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80',
    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80',
    'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80',
  ];
};

const getProductDescription = (name, category) => {
  const descriptions = {
    Ring: `This exquisite ring is meticulously handcrafted by master artisans with over two decades of experience. Featuring a brilliant-cut gemstone set in 22KT gold, every facet is precision-cut to maximize light reflection. The band is ergonomically shaped for all-day comfort and is hallmarked for purity. A perfect heirloom piece that transcends generations.`,
    Necklace: `A statement of timeless elegance, this necklace is crafted in 22KT gold with hand-set stones that catch light from every angle. The delicate chain flows gracefully and is secured with a lobster clasp for reliability. Each link is polished to a mirror finish. Ideal for festive occasions, weddings, or gifting to someone special.`,
    Earrings: `Lightweight yet impactful, these earrings are designed for the modern woman who values both beauty and comfort. Set with hand-picked gemstones in a secure bezel setting, they feature a butterfly back closure. The gold is hallmarked BIS 916, ensuring authenticity and lasting brilliance with every wear.`,
    Bracelet: `An artful fusion of tradition and contemporary design, this bracelet is crafted from 22KT gold with intricate filigree work inspired by ancient Indian motifs. Flexible and adjustable, it fits most wrist sizes comfortably. Each bangle is finished with a high-polish sheen and comes in a premium gift box.`,
    Pendant: `This pendant is a miniature work of art — every detail carved with exceptional precision. Suspended from a delicate gold chain, it rests perfectly at the collarbone. Set with a certified gemstone, it carries both aesthetic and symbolic value. An ideal gift for birthdays, anniversaries, or milestones.`,
  };
  return descriptions[category] || descriptions['Ring'];
};

const ratingBreakdown = [
  { stars: 5, pct: 68 },
  { stars: 4, pct: 20 },
  { stars: 3, pct: 8 },
  { stars: 2, pct: 2 },
  { stars: 1, pct: 2 },
];

const reviews = [
  { name: 'Priya S.', rating: 5, date: 'Mar 2025', text: 'Absolutely stunning piece! The craftsmanship is impeccable and it arrived beautifully packaged. Highly recommend.' },
  { name: 'Ananya R.', rating: 5, date: 'Feb 2025', text: 'Gifted this to my mother for her anniversary. She was in tears — it is that beautiful. Worth every rupee.' },
  { name: 'Meena K.', rating: 4, date: 'Jan 2025', text: 'Lovely design, very elegant. Delivery was prompt and the quality matches the price point perfectly.' },
];

export default function ProductDetail({ product, isOpen, onClose, onAddToCart }) {
  const [activeImg, setActiveImg] = useState(0);
  const [wishlisted, setWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [qty, setQty] = useState(1);

  if (!product) return null;

  const images = getProductGallery(product.name);
  const description = getProductDescription(product.name, product.category);
  const discount = product.discount || 0;
  const savings = product.originalPrice ? product.originalPrice - product.price : 0;

  const handleAddToCart = () => {
    onAddToCart({ ...product, quantity: qty });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const prevImg = () => setActiveImg((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  const nextImg = () => setActiveImg((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Slide-in Panel */}
      <div
        className={`fixed inset-y-0 right-0 w-full md:w-[85vw] lg:w-[75vw] max-w-5xl bg-white z-50 shadow-2xl transform transition-transform duration-500 ease-in-out overflow-y-auto ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Top Bar */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors font-medium"
          >
            <ChevronLeft size={20} />
            <span className="text-sm">Back to Collection</span>
          </button>
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Share2 size={18} className="text-gray-600" />
            </button>
            <button
              onClick={() => setWishlisted(!wishlisted)}
              className="p-2 hover:bg-red-50 rounded-full transition-colors"
            >
              <Heart
                size={18}
                className={wishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'}
              />
            </button>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X size={20} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">

          {/* ── LEFT: Images ── */}
          <div className="p-6 lg:p-8 lg:border-r border-gray-100">
            {/* Main Image */}
            <div className="relative rounded-2xl overflow-hidden bg-gray-50 aspect-square mb-4 group">
              <img
                key={activeImg}
                src={images[activeImg]}
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-500"
              />

              {/* Discount badge */}
              {discount > 0 && (
                <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  -{discount}% OFF
                </div>
              )}
              {product.isNew && (
                <div className="absolute top-4 right-4 bg-amber-700 text-white text-xs font-bold px-3 py-1 rounded-full">
                  NEW
                </div>
              )}

              {/* Arrows */}
              <button
                onClick={prevImg}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={nextImg}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-3">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`aspect-square rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                    activeImg === i ? 'border-amber-600 scale-105 shadow-md' : 'border-gray-200 hover:border-amber-300'
                  }`}
                >
                  <img src={img} alt={`view ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Details ── */}
          <div className="p-6 lg:p-8 flex flex-col gap-6">

            {/* Category & Title */}
            <div>
              <p className="text-xs text-amber-700 font-bold uppercase tracking-widest mb-2">
                {product.category}
              </p>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-snug mb-3">
                {product.name}
              </h1>

              {/* Rating Row */}
              <div className="flex items-center gap-3">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={i < product.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}
                    />
                  ))}
                </div>
                <span className="text-sm font-semibold text-gray-800">{product.rating}.0</span>
                <span className="text-sm text-gray-500">({product.reviews} reviews)</span>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">In Stock</span>
              </div>
            </div>

            {/* Price */}
            <div className="bg-amber-50 rounded-xl p-4">
              <div className="flex items-baseline gap-3 mb-1">
                <span className="text-3xl font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
                {product.originalPrice && (
                  <span className="text-lg text-gray-400 line-through">₹{product.originalPrice.toLocaleString()}</span>
                )}
              </div>
              {savings > 0 && (
                <p className="text-green-600 text-sm font-semibold">
                  You save ₹{savings.toLocaleString()} ({discount}% off)
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1">Inclusive of all taxes • Free hallmarking</p>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-2">About this piece</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
            </div>

            {/* Specs */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Purity', value: '22KT / BIS 916' },
                { label: 'Material', value: 'Hallmarked Gold' },
                { label: 'Occasion', value: 'Festive / Wedding' },
                { label: 'Warranty', value: '1 Year' },
              ].map((spec) => (
                <div key={spec.label} className="bg-gray-50 rounded-lg px-3 py-2">
                  <p className="text-xs text-gray-500 mb-0.5">{spec.label}</p>
                  <p className="text-sm font-semibold text-gray-800">{spec.value}</p>
                </div>
              ))}
            </div>

            {/* Quantity + Add to Cart */}
            <div className="flex items-center gap-3">
              {/* Qty */}
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="px-3 py-2 hover:bg-gray-100 transition-colors text-gray-700 font-bold"
                >
                  −
                </button>
                <span className="px-4 py-2 text-sm font-semibold text-gray-900 border-x border-gray-200">
                  {qty}
                </span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="px-3 py-2 hover:bg-gray-100 transition-colors text-gray-700 font-bold"
                >
                  +
                </button>
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                className={`flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 ${
                  addedToCart
                    ? 'bg-green-600 text-white'
                    : 'bg-amber-700 hover:bg-amber-800 text-white'
                }`}
              >
                {addedToCart ? (
                  <><Check size={16} /> Added to Cart!</>
                ) : (
                  <><ShoppingCart size={16} /> Add to Cart</>
                )}
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 border-t border-gray-100 pt-5">
              {[
                { icon: Shield, label: 'Certified', sub: 'BIS Hallmarked' },
                { icon: Truck, label: 'Free Delivery', sub: 'Orders above ₹999' },
                { icon: RotateCcw, label: 'Easy Returns', sub: '7-day policy' },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="flex flex-col items-center text-center gap-1">
                  <div className="bg-amber-50 p-2 rounded-lg">
                    <Icon size={18} className="text-amber-700" />
                  </div>
                  <p className="text-xs font-semibold text-gray-800">{label}</p>
                  <p className="text-xs text-gray-500">{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Rating Breakdown + Reviews ── */}
        <div className="border-t border-gray-100 px-6 lg:px-12 py-10">
          <h2 className="text-xl font-bold text-gray-900 mb-8">Customer Reviews</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
            {/* Overall */}
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-6xl font-bold text-gray-900">{product.rating}.0</p>
                <div className="flex justify-center gap-0.5 my-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className={i < product.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'} />
                  ))}
                </div>
                <p className="text-sm text-gray-500">{product.reviews} reviews</p>
              </div>
              {/* Bar chart */}
              <div className="flex-1 space-y-2">
                {ratingBreakdown.map(({ stars, pct }) => (
                  <div key={stars} className="flex items-center gap-2 text-xs">
                    <span className="w-4 text-gray-600 text-right">{stars}</span>
                    <Star size={11} className="fill-amber-400 text-amber-400 flex-shrink-0" />
                    <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-2 bg-amber-400 rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-7 text-gray-500">{pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Review Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {reviews.map((r) => (
              <div key={r.name} className="bg-gray-50 rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{r.name}</p>
                    <p className="text-xs text-gray-400">{r.date}</p>
                  </div>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={12} className={i < r.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'} />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}