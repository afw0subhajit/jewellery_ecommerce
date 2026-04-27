'use client';

import { useState, useEffect } from 'react';
import { ShoppingCart, Menu, X, Search, Heart, Star, Plus, Minus, Trash2, ArrowRight, ArrowLeft, CreditCard, Smartphone, Banknote, Lock, Shield, Truck, RotateCcw, ChevronLeft, ChevronRight, Check } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// THEME DEFINITIONS
// ─────────────────────────────────────────────────────────────────────────────
const THEMES = {
  amber: {
    name: 'Amber Gold',
    label: '✦ Amber',
    primary: '#b45309',
    primaryHover: '#92400e',
    primaryLight: '#fef3c7',
    primaryBorder: '#d97706',
    accent: '#f59e0b',
    accentSoft: '#fde68a',
    navBg: '#ffffff',
    navText: '#1f2937',
    badge: '#b45309',
    btnText: '#ffffff',
    heroFrom: '#fffbeb',
    heroTo: '#fef3c7',
    highlight: '#d97706',
    // Page/body background
    pageBg: '#fffbeb',
    pageText: '#1c1917',
    // Section backgrounds
    sectionBg: '#fff8ed',
    sectionAlt: '#fef3c7',
    cardBg: '#ffffff',
    cardBorder: '#fde68a',
    cardHoverBorder: '#b45309',
    // Category label color
    categoryText: '#b45309',
    // Price color
    priceColor: '#92400e',
    // Subtle text
    subtleText: '#92400e',
    // Tag pill
    tagBg: '#fef3c7',
    tagText: '#b45309',
    // Detail panel
    detailPanelBg: '#fffbeb',
    detailSpecBg: '#fef3c7',
    detailSpecBorder: '#fde68a',
    // Footer
    footerBg: '#1c0a00',
    isDark: false,
  },
  silver: {
    name: 'Black & Silver',
    label: '◆ Silver',
    primary: '#e2e8f0',
    primaryHover: '#cbd5e1',
    primaryLight: '#1e293b',
    primaryBorder: '#475569',
    accent: '#94a3b8',
    accentSoft: '#334155',
    navBg: '#0f172a',
    navText: '#f1f5f9',
    badge: '#e2e8f0',
    btnText: '#0f172a',
    heroFrom: '#0f172a',
    heroTo: '#1e293b',
    highlight: '#94a3b8',
    pageBg: '#0f172a',
    pageText: '#f1f5f9',
    sectionBg: '#111827',
    sectionAlt: '#1e293b',
    cardBg: '#1e293b',
    cardBorder: '#334155',
    cardHoverBorder: '#94a3b8',
    categoryText: '#94a3b8',
    priceColor: '#e2e8f0',
    subtleText: '#94a3b8',
    tagBg: '#334155',
    tagText: '#94a3b8',
    detailPanelBg: '#111827',
    detailSpecBg: '#1e293b',
    detailSpecBorder: '#334155',
    footerBg: '#020617',
    isDark: true,
  },
  royal: {
    name: 'Royal Brown & Gold',
    label: '♛ Royal',
    primary: '#ca8a04',
    primaryHover: '#a16207',
    primaryLight: '#1c0a00',
    primaryBorder: '#a16207',
    accent: '#fbbf24',
    accentSoft: '#78350f',
    navBg: '#0d0500',
    navText: '#fef3c7',
    badge: '#78350f',
    btnText: '#0d0500',
    heroFrom: '#0d0500',
    heroTo: '#1c0a00',
    highlight: '#ca8a04',
    pageBg: '#0d0500',
    pageText: '#fef3c7',
    sectionBg: '#110600',
    sectionAlt: '#1c0a00',
    cardBg: '#1c0a00',
    cardBorder: '#3b1407',
    cardHoverBorder: '#ca8a04',
    categoryText: '#fbbf24',
    priceColor: '#fef3c7',
    subtleText: '#ca8a04',
    tagBg: '#3b1407',
    tagText: '#fbbf24',
    detailPanelBg: '#0d0500',
    detailSpecBg: '#1c0a00',
    detailSpecBorder: '#3b1407',
    footerBg: '#030100',
    isDark: true,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────
const PRODUCTS = [
  { id: 1, name: 'Gold Solitaire Diamond Ring', category: 'Rings', price: 24999, originalPrice: 29999, rating: 5, reviews: 234, discount: 17, isNew: true },
  { id: 2, name: 'Emerald Statement Necklace', category: 'Necklaces', price: 18999, originalPrice: 22999, rating: 4, reviews: 156, discount: 17, isNew: false },
  { id: 3, name: 'Pearl Drop Earrings', category: 'Earrings', price: 8999, originalPrice: 11999, rating: 5, reviews: 89, discount: 25, isNew: false },
  { id: 4, name: 'Diamond Tennis Bracelet', category: 'Bracelets', price: 35999, originalPrice: 42999, rating: 5, reviews: 203, discount: 16, isNew: true },
  { id: 5, name: 'Gold Pendant with Sapphire', category: 'Pendants', price: 12999, originalPrice: 15999, rating: 4, reviews: 145, discount: 19, isNew: false },
  { id: 6, name: 'Rose Gold Wedding Ring', category: 'Rings', price: 32999, originalPrice: 39999, rating: 5, reviews: 267, discount: 18, isNew: false },
  { id: 7, name: 'Diamond Bangle Set', category: 'Bracelets', price: 45999, originalPrice: 54999, rating: 5, reviews: 198, discount: 16, isNew: true },
  { id: 8, name: 'Ruby Chandelier Earrings', category: 'Earrings', price: 16999, originalPrice: 21999, rating: 4, reviews: 112, discount: 23, isNew: false },
  { id: 9, name: 'Gold Chain Necklace', category: 'Necklaces', price: 14999, originalPrice: 18999, rating: 5, reviews: 289, discount: 21, isNew: false },
  { id: 10, name: 'Kundan Pendant Necklace', category: 'Pendants', price: 22999, originalPrice: 28999, rating: 4, reviews: 176, discount: 21, isNew: true },
  { id: 11, name: 'Platinum Diamond Ring', category: 'Rings', price: 54999, originalPrice: 64999, rating: 5, reviews: 156, discount: 15, isNew: true },
  { id: 12, name: 'Gold Bangle', category: 'Bracelets', price: 18999, originalPrice: 24999, rating: 5, reviews: 201, discount: 24, isNew: false },
];

const CATEGORIES = ['All', 'Rings', 'Necklaces', 'Bracelets', 'Earrings', 'Pendants'];

const getProductImage = (name) => {
  if (name.includes('Ring')) return 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80';
  if (name.includes('Necklace')) return 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80';
  if (name.includes('Earrings')) return 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80';
  if (name.includes('Bracelet') || name.includes('Bangle')) return 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&q=80';
  if (name.includes('Pendant')) return 'https://images.unsplash.com/photo-1589128777073-263566ae5e4d?w=600&q=80';
  return 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=600&q=80';
};

const getGallery = (name) => [
  getProductImage(name),
  'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80',
  'https://images.unsplash.com/photo-1543294001-f7cd5d7fb516?w=800&q=80',
  'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&q=80',
];

const REVIEWS = [
  { name: 'Priya S.', rating: 5, date: 'Mar 2025', text: 'Absolutely stunning piece! The craftsmanship is impeccable and it arrived beautifully packaged.' },
  { name: 'Ananya R.', rating: 5, date: 'Feb 2025', text: 'Gifted this to my mother for her anniversary. She was in tears — it is that beautiful.' },
  { name: 'Meena K.', rating: 4, date: 'Jan 2025', text: 'Lovely design, very elegant. Delivery was prompt and the quality matches the price point.' },
];

const fp = (p) => '₹' + p.toLocaleString('en-IN');

const StarRow = ({ rating, size = 14, t }) => (
  <div className="flex gap-0.5">
    {[...Array(5)].map((_, i) => (
      <Star key={i} size={size} className={i < rating ? 'fill-yellow-400 text-yellow-400' : ''} style={i >= rating ? { color: t?.isDark ? '#4b5563' : '#d1d5db' } : {}} />
    ))}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// HEADER
// ─────────────────────────────────────────────────────────────────────────────
function Header({ cartCount, onCartClick, selectedCategory, onCategoryChange, theme, onThemeChange }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = THEMES[theme];

  return (
    <header className="sticky top-0 z-50 shadow-md" style={{ background: t.navBg, borderBottom: `1px solid ${t.isDark ? t.cardBorder : '#e5e7eb'}` }}>
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 rounded-lg" style={{ color: t.navText }}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <h1 className="text-2xl font-bold tracking-tight" style={{ color: t.accent }}>✦ Jewels</h1>

          <div className="hidden md:flex flex-1 max-w-md mx-6">
            <div className="w-full flex items-center rounded-lg px-4 py-2 gap-2" style={{ background: t.isDark ? t.accentSoft : '#f3f4f6', border: `1px solid ${t.cardBorder}` }}>
              <Search size={16} style={{ color: t.subtleText }} />
              <input type="text" placeholder="Search jewelry..." className="bg-transparent w-full outline-none text-sm" style={{ color: t.navText }} />
            </div>
          </div>

          {/* <div className="hidden md:flex items-center gap-1 rounded-xl p-1" style={{ background: t.isDark ? t.accentSoft : '#f3f4f6', border: `1px solid ${t.cardBorder}` }}>
            {Object.entries(THEMES).map(([key, th]) => (
              <button
                key={key}
                onClick={() => onThemeChange(key)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200"
                style={{
                  background: theme === key ? th.primary : 'transparent',
                  color: theme === key ? (th.isDark ? th.navBg : '#fff') : t.subtleText,
                }}
              >
                {th.label}
              </button>
            ))}
          </div> */}

          <button
            onClick={onCartClick}
            className="relative flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all hover:opacity-90"
            style={{ background: t.primary, color: t.btnText }}
          >
            <ShoppingCart size={18} />
            <span className="hidden sm:inline">Cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">{cartCount}</span>
            )}
          </button>
        </div>

        {/* <div className="md:hidden flex items-center gap-1 mt-2 rounded-xl p-1 w-full justify-center" style={{ background: t.isDark ? t.accentSoft : '#f3f4f6', border: `1px solid ${t.cardBorder}` }}>
          {Object.entries(THEMES).map(([key, th]) => (
            <button
              key={key}
              onClick={() => onThemeChange(key)}
              className="flex-1 py-1.5 rounded-lg text-xs font-bold transition-all duration-200"
              style={{
                background: theme === key ? th.primary : 'transparent',
                color: theme === key ? (th.isDark ? th.navBg : '#fff') : t.subtleText,
              }}
            >
              {th.label}
            </button>
          ))}
        </div> */}
      </div>

  <nav style={{ borderTop: `1px solid ${t.isDark ? t.cardBorder : "#e5e7eb"}` }}>

  {/* Desktop View */}
  <div className="max-w-7xl mx-auto hidden md:flex items-center justify-between px-4">

    {/* Categories */}
    <div className="flex flex-wrap items-center">
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => onCategoryChange(cat)}
          className="px-5 py-3 text-sm font-medium whitespace-nowrap transition-all border-b-2"
          style={{
            borderColor:
              selectedCategory === cat ? t.accent : "transparent",
            color:
              selectedCategory === cat ? t.accent : t.subtleText,
            background:
              selectedCategory === cat
                ? (t.isDark ? t.accentSoft : t.primaryLight)
                : "transparent",
          }}
        >
          {cat}
        </button>
      ))}
    </div>

    {/* Desktop Theme Tabs */}
    <div className="flex items-center gap-3 ml-4 shrink-0">
      {Object.entries(THEMES).map(([key, th]) => (
        <button
          key={key}
          onClick={() => onThemeChange(key)}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold border"
          style={{
            background: theme === key ? th.primary : "transparent",
            color:
              theme === key
                ? (th.isDark ? th.navBg : "#fff")
                : t.subtleText,
            borderColor:
              theme === key ? th.primary : t.cardBorder,
          }}
        >
          <span
            className="w-3 h-3 rounded-full"
            style={{ background: th.primary }}
          />
          {th.name}
        </button>
      ))}
    </div>
  </div>

  {/* Mobile Hamburger Menu */}
  {mobileMenuOpen && (
    <div
      className="md:hidden"
      style={{ background: t.navBg }}
    >
      {/* Categories */}
      <div className="flex flex-col">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              onCategoryChange(cat);
              setMobileMenuOpen(false);
            }}
            className="px-4 py-3 text-left text-sm font-medium"
            style={{
              color:
                selectedCategory === cat ? t.accent : t.subtleText,
              borderLeft:
                selectedCategory === cat
                  ? `3px solid ${t.accent}`
                  : "3px solid transparent",
              background:
                selectedCategory === cat
                  ? (t.isDark ? t.accentSoft : t.primaryLight)
                  : "transparent",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Mobile Theme Tabs */}
      <div
        className="p-4 border-t"
        style={{ borderColor: t.cardBorder }}
      >
        <p
          className="text-xs font-bold uppercase mb-3"
          style={{ color: t.subtleText }}
        >
          Theme Colors
        </p>

        <div className="grid grid-cols-3 gap-2">
          {Object.entries(THEMES).map(([key, th]) => (
            <button
              key={key}
              onClick={() => onThemeChange(key)}
              className="rounded-xl px-3 py-3 text-xs font-semibold border"
              style={{
                background:
                  theme === key ? th.primary : "transparent",
                color:
                  theme === key
                    ? (th.isDark ? th.navBg : "#fff")
                    : t.subtleText,
                borderColor:
                  theme === key ? th.primary : t.cardBorder,
              }}
            >
              {th.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  )}
</nav>
    </header>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HERO
// ─────────────────────────────────────────────────────────────────────────────
function Hero({ theme }) {
  const t = THEMES[theme];
  return (
    <section className="py-12 md:py-20" style={{ background: `linear-gradient(135deg, ${t.heroFrom}, ${t.heroTo})` }}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="flex flex-col gap-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest w-fit"
              style={{ background: t.tagBg, color: t.accent, border: `1px solid ${t.cardBorder}` }}>
              ✦ New Arrivals 2025
            </div>
            <h2 className="text-4xl md:text-5xl font-bold leading-tight" style={{ color: t.pageText }}>
              Discover{' '}
              <span style={{ color: t.accent }}>Timeless</span>{' '}
              Elegance
            </h2>
            <p className="text-lg" style={{ color: t.subtleText }}>
              Exquisite jewelry crafted with precision and passion. Each piece tells a story of elegance.
            </p>
            <div className="flex gap-4">
              <button className="px-8 py-3 rounded-lg font-semibold text-sm transition-all hover:opacity-90"
                style={{ background: t.primary, color: t.btnText }}>
                Shop Now
              </button>
              <button className="px-8 py-3 rounded-lg font-semibold text-sm border-2 transition-all"
                style={{ borderColor: t.accent, color: t.accent, background: 'transparent' }}>
                View Collection
              </button>
            </div>
          </div>
          <div className="relative h-80 md:h-96 rounded-2xl overflow-hidden shadow-2xl" style={{ border: `2px solid ${t.cardBorder}` }}>
            <img src="https://i.pinimg.com/1200x/a9/b3/e5/a9b3e5dbd20f1ab19a70cb5f2f3cfa5f.jpg" alt="Premium Jewelry Collection" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-6 left-6 text-white">
              <p className="text-xs font-semibold tracking-widest uppercase opacity-80 mb-1">Premium Collection</p>
              <p className="text-lg font-bold">Crafted for Eternity</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCT GRID
// ─────────────────────────────────────────────────────────────────────────────
function ProductGrid({ products, onAddToCart, selectedCategory, theme, onProductSelect }) {
  const t = THEMES[theme];
  const filtered = selectedCategory === 'All' ? products : products.filter(p => p.category === selectedCategory);

  return (
    <section className="py-12 md:py-16" style={{ background: t.sectionBg }}>
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="mb-10 pb-6" style={{ borderBottom: `1px solid ${t.cardBorder}` }}>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: t.accent }}>✦ Our Collection</p>
              <h2 className="text-3xl md:text-4xl font-bold" style={{ color: t.pageText }}>
                {selectedCategory === 'All' ? 'All Collections' : selectedCategory}
              </h2>
            </div>
            <p className="text-sm font-medium pb-1" style={{ color: t.subtleText }}>{filtered.length} pieces</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filtered.map((product) => (
            <div
              key={product.id}
              onClick={() => onProductSelect(product)}
              className="group rounded-xl overflow-hidden cursor-pointer transition-all duration-300"
              style={{
                background: t.cardBg,
                border: `1.5px solid ${t.cardBorder}`,
                boxShadow: t.isDark ? '0 4px 24px rgba(0,0,0,0.4)' : '0 2px 12px rgba(0,0,0,0.06)',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = t.cardHoverBorder; e.currentTarget.style.boxShadow = t.isDark ? `0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px ${t.cardHoverBorder}` : `0 8px 32px rgba(0,0,0,0.12), 0 0 0 1px ${t.cardHoverBorder}`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = t.cardBorder; e.currentTarget.style.boxShadow = t.isDark ? '0 4px 24px rgba(0,0,0,0.4)' : '0 2px 12px rgba(0,0,0,0.06)'; }}
            >
              {/* Image */}
              <div className="relative h-52 md:h-60 overflow-hidden" style={{ background: t.isDark ? t.accentSoft : '#f3f4f6' }}>
                <img
                  src={getProductImage(product.name)}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: `linear-gradient(to top, ${t.isDark ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.2)'}, transparent)` }} />

                {product.discount && (
                  <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-md">
                    -{product.discount}%
                  </div>
                )}
                {product.isNew && (
                  <div className="absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-bold shadow-md"
                    style={{ background: t.primary, color: t.btnText }}>
                    NEW
                  </div>
                )}
                <button
                  onClick={e => e.stopPropagation()}
                  className="absolute bottom-3 right-3 rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
                  style={{ background: t.isDark ? t.cardBg : '#ffffff' }}
                >
                  <Heart size={16} className="text-red-500" />
                </button>
              </div>

              {/* Info */}
              <div className="p-4">
                <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: t.accent }}>{product.category}</p>
                <h3 className="font-bold line-clamp-2 text-sm md:text-base mb-2" style={{ color: t.pageText }}>{product.name}</h3>
                <div className="flex items-center gap-1 mb-3">
                  <StarRow rating={product.rating} size={12} t={t} />
                  <span className="text-xs" style={{ color: t.subtleText }}>({product.reviews})</span>
                </div>
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-lg font-bold" style={{ color: t.priceColor }}>{fp(product.price)}</span>
                  {product.originalPrice && (
                    <span className="text-sm line-through" style={{ color: t.isDark ? '#6b7280' : '#9ca3af' }}>{fp(product.originalPrice)}</span>
                  )}
                </div>

                {/* Divider */}
                <div className="mb-3" style={{ height: 1, background: t.cardBorder }} />

                <button
                  onClick={e => { e.stopPropagation(); onAddToCart(product); }}
                  className="w-full py-2.5 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-95"
                  style={{ background: t.primary, color: t.btnText }}
                >
                  <ShoppingCart size={14} /> Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCT DETAIL PANEL
// ─────────────────────────────────────────────────────────────────────────────
function ProductDetail({ product, isOpen, onClose, onAddToCart, theme }) {
  const [activeImg, setActiveImg] = useState(0);
  const [wishlisted, setWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [qty, setQty] = useState(1);
  const t = THEMES[theme];

  useEffect(() => { setActiveImg(0); setQty(1); setAddedToCart(false); }, [product]);

  if (!product) return null;
  const images = getGallery(product.name);
  const savings = product.originalPrice - product.price;

  const handleAdd = () => {
    onAddToCart({ ...product, quantity: qty });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50" onClick={onClose} />}
      <div
        className={`fixed inset-y-0 right-0 w-full md:w-[80vw] lg:w-[70vw] max-w-5xl z-50 shadow-2xl transform transition-transform duration-500 overflow-y-auto ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ background: t.detailPanelBg }}
      >
        {/* Top bar */}
        <div className="sticky top-0 z-10 px-6 py-4 flex items-center justify-between"
          style={{ background: t.detailPanelBg, borderBottom: `1px solid ${t.cardBorder}` }}>
          <button onClick={onClose} className="flex items-center gap-2 font-medium text-sm hover:opacity-70 transition-opacity"
            style={{ color: t.subtleText }}>
            <ChevronLeft size={18} /> Back to Collection
          </button>
          <div className="flex gap-2">
            <button onClick={() => setWishlisted(!wishlisted)}
              className="p-2 rounded-full transition-colors"
              style={{ background: wishlisted ? '#fef2f2' : t.tagBg }}>
              <Heart size={18} className={wishlisted ? 'fill-red-500 text-red-500' : ''} style={!wishlisted ? { color: t.subtleText } : {}} />
            </button>
            <button onClick={onClose} className="p-2 rounded-full transition-colors" style={{ background: t.tagBg }}>
              <X size={18} style={{ color: t.subtleText }} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Images */}
          <div className="p-6" style={{ borderRight: `1px solid ${t.cardBorder}` }}>
            <div className="relative rounded-2xl overflow-hidden aspect-square mb-4 group"
              style={{ background: t.isDark ? t.accentSoft : '#f3f4f6', border: `1px solid ${t.cardBorder}` }}>
              <img src={images[activeImg]} alt={product.name} className="w-full h-full object-cover transition-all duration-500" />
              {product.discount > 0 && (
                <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  -{product.discount}% OFF
                </div>
              )}
              <button onClick={() => setActiveImg(p => p === 0 ? images.length - 1 : p - 1)}
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: t.isDark ? t.cardBg : 'rgba(255,255,255,0.9)' }}>
                <ChevronLeft size={16} style={{ color: t.pageText }} />
              </button>
              <button onClick={() => setActiveImg(p => p === images.length - 1 ? 0 : p + 1)}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: t.isDark ? t.cardBg : 'rgba(255,255,255,0.9)' }}>
                <ChevronRight size={16} style={{ color: t.pageText }} />
              </button>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {images.map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)}
                  className="aspect-square rounded-xl overflow-hidden border-2 transition-all"
                  style={{ borderColor: activeImg === i ? t.accent : t.cardBorder }}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="p-6 flex flex-col gap-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: t.accent }}>{product.category}</p>
              <h1 className="text-2xl md:text-3xl font-bold mb-3" style={{ color: t.pageText }}>{product.name}</h1>
              <div className="flex items-center gap-3">
                <StarRow rating={product.rating} size={16} t={t} />
                <span className="text-sm font-semibold" style={{ color: t.pageText }}>{product.rating}.0</span>
                <span className="text-sm" style={{ color: t.subtleText }}>({product.reviews} reviews)</span>
                <span className="text-xs bg-green-900/30 text-green-400 px-2 py-0.5 rounded-full font-medium border border-green-700/30">In Stock</span>
              </div>
            </div>

            {/* Price block */}
            <div className="rounded-xl p-4" style={{ background: t.detailSpecBg, border: `1px solid ${t.detailSpecBorder}` }}>
              <div className="flex items-baseline gap-3 mb-1">
                <span className="text-3xl font-bold" style={{ color: t.priceColor }}>{fp(product.price)}</span>
                {product.originalPrice && <span className="text-lg line-through" style={{ color: t.isDark ? '#4b5563' : '#9ca3af' }}>{fp(product.originalPrice)}</span>}
              </div>
              {savings > 0 && <p className="text-green-500 text-sm font-semibold">You save {fp(savings)} ({product.discount}% off)</p>}
              <p className="text-xs mt-1" style={{ color: t.subtleText }}>Inclusive of all taxes • Free hallmarking</p>
            </div>

            <p className="text-sm leading-relaxed" style={{ color: t.subtleText }}>
              This exquisite piece is meticulously handcrafted by master artisans. Featuring brilliant-cut gemstones set in 22KT gold, every facet is precision-cut to maximize light reflection. Hallmarked for purity — a perfect heirloom that transcends generations.
            </p>

            <div className="grid grid-cols-2 gap-3">
              {[['Purity', '22KT / BIS 916'], ['Material', 'Hallmarked Gold'], ['Occasion', 'Festive / Wedding'], ['Warranty', '1 Year']].map(([label, value]) => (
                <div key={label} className="rounded-lg px-3 py-2" style={{ background: t.detailSpecBg, border: `1px solid ${t.detailSpecBorder}` }}>
                  <p className="text-xs mb-0.5" style={{ color: t.subtleText }}>{label}</p>
                  <p className="text-sm font-semibold" style={{ color: t.pageText }}>{value}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center rounded-lg overflow-hidden" style={{ border: `1.5px solid ${t.cardBorder}` }}>
                <button onClick={() => setQty(Math.max(1, qty - 1))}
                  className="px-3 py-2 font-bold transition-colors"
                  style={{ color: t.pageText, background: t.isDark ? t.tagBg : '#f9fafb' }}>−</button>
                <span className="px-4 py-2 text-sm font-semibold" style={{ color: t.pageText, borderLeft: `1px solid ${t.cardBorder}`, borderRight: `1px solid ${t.cardBorder}` }}>{qty}</span>
                <button onClick={() => setQty(qty + 1)}
                  className="px-3 py-2 font-bold transition-colors"
                  style={{ color: t.pageText, background: t.isDark ? t.tagBg : '#f9fafb' }}>+</button>
              </div>
              <button
                onClick={handleAdd}
                className="flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95"
                style={{ background: addedToCart ? '#16a34a' : t.primary, color: addedToCart ? '#fff' : t.btnText }}
              >
                {addedToCart ? <><Check size={16} /> Added!</> : <><ShoppingCart size={16} /> Add to Cart</>}
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-4" style={{ borderTop: `1px solid ${t.cardBorder}` }}>
              {[[Shield, 'Certified', 'BIS Hallmarked'], [Truck, 'Free Delivery', 'Above ₹999'], [RotateCcw, 'Easy Returns', '7-day policy']].map(([Icon, label, sub]) => (
                <div key={label} className="flex flex-col items-center text-center gap-1">
                  <div className="p-2 rounded-lg" style={{ background: t.tagBg }}>
                    <Icon size={16} style={{ color: t.accent }} />
                  </div>
                  <p className="text-xs font-semibold" style={{ color: t.pageText }}>{label}</p>
                  <p className="text-xs" style={{ color: t.subtleText }}>{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="px-6 lg:px-12 py-10" style={{ borderTop: `1px solid ${t.cardBorder}`, background: t.sectionAlt }}>
          <h2 className="text-xl font-bold mb-6" style={{ color: t.pageText }}>Customer Reviews</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {REVIEWS.map((r) => (
              <div key={r.name} className="rounded-xl p-5" style={{ background: t.cardBg, border: `1px solid ${t.cardBorder}` }}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-bold text-sm" style={{ color: t.pageText }}>{r.name}</p>
                    <p className="text-xs" style={{ color: t.subtleText }}>{r.date}</p>
                  </div>
                  <StarRow rating={r.rating} size={12} t={t} />
                </div>
                <p className="text-sm leading-relaxed" style={{ color: t.subtleText }}>{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CART SIDEBAR
// ─────────────────────────────────────────────────────────────────────────────
function Cart({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem, onProceedCheckout, theme }) {
  const t = THEMES[theme];
  const total = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const discount = Math.floor(total * 0.1);
  const finalTotal = total - discount;

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={onClose} />}
      <div className={`fixed right-0 top-0 h-full w-full md:w-96 shadow-2xl transform transition-transform duration-300 z-50 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ background: t.detailPanelBg }}>
        <div className="flex items-center justify-between p-6" style={{ borderBottom: `1px solid ${t.cardBorder}` }}>
          <h2 className="text-xl font-bold" style={{ color: t.pageText }}>Shopping Cart</h2>
          <button onClick={onClose} className="p-2 rounded-lg transition-colors" style={{ background: t.tagBg }}>
            <X size={22} style={{ color: t.pageText }} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <div className="text-5xl mb-4">🛒</div>
              <p className="font-medium" style={{ color: t.pageText }}>Your cart is empty</p>
              <p className="text-sm mt-1" style={{ color: t.subtleText }}>Add beautiful jewelry to get started!</p>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-3 p-3 rounded-xl" style={{ background: t.detailSpecBg, border: `1px solid ${t.cardBorder}` }}>
                  <div className="rounded-lg flex-shrink-0 overflow-hidden" style={{ width: 72, height: 72, background: t.isDark ? '#0f0f0f' : '#e5e7eb' }}>
                    <img src={getProductImage(item.name)} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm line-clamp-2" style={{ color: t.pageText }}>{item.name}</h3>
                    <p className="font-bold text-sm mt-1" style={{ color: t.accent }}>{fp(item.price)}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="p-1 rounded transition-colors" style={{ background: t.tagBg, color: t.pageText }}>
                        <Minus size={12} />
                      </button>
                      <span className="w-5 text-center text-sm font-semibold" style={{ color: t.pageText }}>{item.quantity}</span>
                      <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="p-1 rounded transition-colors" style={{ background: t.tagBg, color: t.pageText }}>
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                  <button onClick={() => onRemoveItem(item.id)} className="text-red-400 hover:text-red-500 p-1">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="p-5 space-y-4" style={{ borderTop: `1px solid ${t.cardBorder}` }}>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between" style={{ color: t.subtleText }}>
                <span>Subtotal</span><span style={{ color: t.pageText }}>{fp(total)}</span>
              </div>
              <div className="flex justify-between font-semibold text-green-500">
                <span>Discount (10%)</span><span>-{fp(discount)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2" style={{ borderTop: `1px solid ${t.cardBorder}`, color: t.pageText }}>
                <span>Total</span><span style={{ color: t.accent }}>{fp(finalTotal)}</span>
              </div>
            </div>
            <button onClick={onProceedCheckout}
              className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all hover:opacity-90"
              style={{ background: t.primary, color: t.btnText }}>
              Proceed to Checkout <ArrowRight size={16} />
            </button>
            <button onClick={onClose}
              className="w-full border-2 py-2.5 rounded-xl font-semibold text-sm transition-all hover:opacity-80"
              style={{ borderColor: t.cardBorder, color: t.pageText }}>
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ADDRESS FORM
// ─────────────────────────────────────────────────────────────────────────────
function AddressForm({ onSubmit, onBack, theme }) {
  const t = THEMES[theme];
  const [formData, setFormData] = useState({ fullName: '', phone: '', email: '', addressLine1: '', addressLine2: '', city: '', state: '', pincode: '' });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(f => ({ ...f, [name]: value }));
    if (errors[name]) setErrors(e => ({ ...e, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    ['fullName', 'phone', 'email', 'addressLine1', 'city', 'state', 'pincode'].forEach(k => {
      if (!formData[k].trim()) newErrors[k] = 'Required';
    });
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) onSubmit(formData);
  };

  const inputStyle = (name) => ({
    background: t.detailSpecBg,
    border: `1.5px solid ${errors[name] ? '#f87171' : t.cardBorder}`,
    color: t.pageText,
    borderRadius: 8,
    padding: '10px 16px',
    width: '100%',
    fontSize: 14,
    outline: 'none',
  });

  return (
    <div className="fixed inset-0 backdrop-blur-sm z-50 flex items-end md:items-center justify-center" style={{ background: 'rgba(0,0,0,0.6)' }}>
      <div className="w-full md:max-w-2xl md:rounded-2xl rounded-t-2xl shadow-2xl overflow-y-auto max-h-[90vh]"
        style={{ background: t.detailPanelBg, border: `1px solid ${t.cardBorder}` }}>
        <div className="sticky top-0 p-4 md:p-6 flex items-center gap-3"
          style={{ background: t.detailPanelBg, borderBottom: `1px solid ${t.cardBorder}` }}>
          <button onClick={onBack} className="p-2 rounded-lg" style={{ background: t.tagBg }}>
            <ArrowLeft size={20} style={{ color: t.pageText }} />
          </button>
          <h2 className="text-xl font-bold" style={{ color: t.pageText }}>Delivery Address</h2>
        </div>
        <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[['fullName', 'Full Name', 'text', 'John Doe'], ['phone', 'Phone', 'tel', '9876543210']].map(([name, label, type, ph]) => (
              <div key={name}>
                <label className="block text-sm font-medium mb-1" style={{ color: t.subtleText }}>{label}</label>
                <input type={type} name={name} value={formData[name]} onChange={handleChange} placeholder={ph} style={inputStyle(name)} />
                {errors[name] && <p className="text-red-400 text-xs mt-1">{errors[name]}</p>}
              </div>
            ))}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1" style={{ color: t.subtleText }}>Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" style={inputStyle('email')} />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
            </div>
          </div>
          {[['addressLine1', 'Address Line 1', '123, Main Street'], ['addressLine2', 'Address Line 2 (Optional)', 'Area, Colony']].map(([name, label, ph]) => (
            <div key={name}>
              <label className="block text-sm font-medium mb-1" style={{ color: t.subtleText }}>{label}</label>
              <input type="text" name={name} value={formData[name]} onChange={handleChange} placeholder={ph} style={inputStyle(name)} />
              {errors[name] && <p className="text-red-400 text-xs mt-1">{errors[name]}</p>}
            </div>
          ))}
          <div className="grid grid-cols-3 gap-4">
            {[['city', 'City', 'Mumbai'], ['state', 'State', 'Maharashtra'], ['pincode', 'Pincode', '400001']].map(([name, label, ph]) => (
              <div key={name}>
                <label className="block text-sm font-medium mb-1" style={{ color: t.subtleText }}>{label}</label>
                <input type="text" name={name} value={formData[name]} onChange={handleChange} placeholder={ph} style={inputStyle(name)} />
                {errors[name] && <p className="text-red-400 text-xs mt-1">{errors[name]}</p>}
              </div>
            ))}
          </div>
          <div className="flex gap-3 pt-4" style={{ borderTop: `1px solid ${t.cardBorder}` }}>
            <button type="button" onClick={onBack} className="flex-1 border-2 py-3 rounded-xl font-semibold text-sm transition-all"
              style={{ borderColor: t.cardBorder, color: t.pageText }}>Back</button>
            <button type="submit" className="flex-1 py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-all"
              style={{ background: t.primary, color: t.btnText }}>Continue to Payment</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAYMENT FORM
// ─────────────────────────────────────────────────────────────────────────────
function PaymentForm({ shippingAddress, cartItems, onSubmit, onBack, total, theme }) {
  const t = THEMES[theme];
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [formData, setFormData] = useState({ cardName: '', cardNumber: '', expiryDate: '', cvv: '', upiId: '' });
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState({});

  const discount = Math.floor(total * 0.1);
  const grandTotal = total - discount + 100;

  const handleChange = (e) => {
    setFormData(f => ({ ...f, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(er => ({ ...er, [e.target.name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (paymentMethod === 'card') {
      ['cardName', 'cardNumber', 'expiryDate', 'cvv'].forEach(k => { if (!formData[k].trim()) newErrors[k] = 'Required'; });
    } else if (paymentMethod === 'upi') {
      if (!formData.upiId.trim()) newErrors.upiId = 'Required';
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      setProcessing(true);
      setTimeout(() => { onSubmit(); setProcessing(false); }, 2000);
    }
  };

  const inputStyle = (name) => ({
    background: t.detailSpecBg,
    border: `1.5px solid ${errors[name] ? '#f87171' : t.cardBorder}`,
    color: t.pageText,
    borderRadius: 8,
    padding: '10px 16px',
    width: '100%',
    fontSize: 14,
    outline: 'none',
  });

  const payMethods = [
    { id: 'card', icon: CreditCard, label: 'Credit/Debit Card', sub: 'Visa, Mastercard, RuPay', iconColor: t.accent },
    { id: 'upi', icon: Smartphone, label: 'UPI Payment', sub: 'Google Pay, PhonePe, PayTM', iconColor: '#16a34a' },
    { id: 'netbanking', icon: Banknote, label: 'Net Banking', sub: 'All major banks', iconColor: '#2563eb' },
  ];

  return (
    <div className="fixed inset-0 backdrop-blur-sm z-50 flex items-end md:items-center justify-center" style={{ background: 'rgba(0,0,0,0.65)' }}>
      <div className="w-full md:max-w-4xl md:rounded-2xl rounded-t-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
        style={{ background: t.detailPanelBg, border: `1px solid ${t.cardBorder}` }}>

        {/* Order Summary sidebar */}
        <div className="hidden md:flex md:w-80 flex-col p-6" style={{ background: t.sectionAlt, borderRight: `1px solid ${t.cardBorder}` }}>
          <h3 className="font-bold mb-4" style={{ color: t.pageText }}>Order Summary</h3>
          <div className="flex-1 overflow-y-auto space-y-3 mb-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex gap-3">
                <div className="rounded-lg flex-shrink-0 overflow-hidden" style={{ width: 56, height: 56, background: t.tagBg }}>
                  <img src={getProductImage(item.name)} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-sm font-medium line-clamp-2" style={{ color: t.pageText }}>{item.name}</p>
                  <p className="text-xs" style={{ color: t.subtleText }}>Qty: {item.quantity}</p>
                  <p className="text-sm font-bold" style={{ color: t.accent }}>{fp(item.price * item.quantity)}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-2 text-sm pt-4" style={{ borderTop: `1px solid ${t.cardBorder}` }}>
            <div className="flex justify-between" style={{ color: t.subtleText }}><span>Subtotal</span><span style={{ color: t.pageText }}>{fp(total)}</span></div>
            <div className="flex justify-between font-semibold text-green-500"><span>Discount</span><span>-{fp(discount)}</span></div>
            <div className="flex justify-between" style={{ color: t.subtleText }}><span>Shipping</span><span style={{ color: t.pageText }}>₹100</span></div>
            <div className="flex justify-between font-bold pt-2" style={{ borderTop: `1px solid ${t.cardBorder}`, color: t.accent }}>
              <span style={{ color: t.pageText }}>Total</span><span>{fp(grandTotal)}</span>
            </div>
          </div>
          {shippingAddress && (
            <div className="pt-4 mt-4" style={{ borderTop: `1px solid ${t.cardBorder}` }}>
              <p className="text-xs font-semibold uppercase mb-1" style={{ color: t.subtleText }}>Shipping To</p>
              <p className="text-sm font-medium" style={{ color: t.pageText }}>{shippingAddress.fullName}</p>
              <p className="text-xs" style={{ color: t.subtleText }}>{shippingAddress.addressLine1}, {shippingAddress.city}</p>
            </div>
          )}
        </div>

        {/* Payment form */}
        <div className="flex-1 overflow-y-auto">
          <div className="sticky top-0 p-4 flex items-center gap-3 md:hidden"
            style={{ background: t.detailPanelBg, borderBottom: `1px solid ${t.cardBorder}` }}>
            <button onClick={onBack} className="p-2 rounded-lg" style={{ background: t.tagBg }}>
              <ArrowLeft size={20} style={{ color: t.pageText }} />
            </button>
            <div>
              <h2 className="text-lg font-bold" style={{ color: t.pageText }}>Payment</h2>
              <p className="text-sm" style={{ color: t.subtleText }}>Total: {fp(grandTotal)}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-6">
            <div>
              <h3 className="font-semibold mb-4" style={{ color: t.pageText }}>Payment Method</h3>
              <div className="space-y-3">
                {payMethods.map(({ id, icon: Icon, label, sub, iconColor }) => (
                  <label key={id}
                    className="flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all"
                    style={{
                      borderColor: paymentMethod === id ? t.accent : t.cardBorder,
                      background: paymentMethod === id ? t.detailSpecBg : 'transparent',
                    }}>
                    <input type="radio" name="paymentMethod" value={id} checked={paymentMethod === id}
                      onChange={e => setPaymentMethod(e.target.value)} className="w-4 h-4" />
                    <Icon size={20} style={{ color: iconColor }} />
                    <div>
                      <p className="font-medium text-sm" style={{ color: t.pageText }}>{label}</p>
                      <p className="text-xs" style={{ color: t.subtleText }}>{sub}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {paymentMethod === 'card' && (
              <div className="space-y-4 pt-5" style={{ borderTop: `1px solid ${t.cardBorder}` }}>
                <h4 className="font-semibold" style={{ color: t.pageText }}>Card Details</h4>
                {[['cardName', 'Cardholder Name', 'text', 'John Doe'], ['cardNumber', 'Card Number', 'text', '1234 5678 9012 3456']].map(([name, label, type, ph]) => (
                  <div key={name}>
                    <label className="block text-sm font-medium mb-1" style={{ color: t.subtleText }}>{label}</label>
                    <input type={type} name={name} value={formData[name]} onChange={handleChange} placeholder={ph} style={inputStyle(name)} />
                    {errors[name] && <p className="text-red-400 text-xs mt-1">{errors[name]}</p>}
                  </div>
                ))}
                <div className="grid grid-cols-2 gap-4">
                  {[['expiryDate', 'Expiry Date', 'MM/YY'], ['cvv', 'CVV', '123']].map(([name, label, ph]) => (
                    <div key={name}>
                      <label className="block text-sm font-medium mb-1" style={{ color: t.subtleText }}>{label}</label>
                      <input type="text" name={name} value={formData[name]} onChange={handleChange} placeholder={ph} style={inputStyle(name)} />
                      {errors[name] && <p className="text-red-400 text-xs mt-1">{errors[name]}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {paymentMethod === 'upi' && (
              <div className="pt-5" style={{ borderTop: `1px solid ${t.cardBorder}` }}>
                <label className="block text-sm font-medium mb-1" style={{ color: t.subtleText }}>UPI ID</label>
                <input type="text" name="upiId" value={formData.upiId} onChange={handleChange} placeholder="yourname@upi" style={inputStyle('upiId')} />
                {errors.upiId && <p className="text-red-400 text-xs mt-1">{errors.upiId}</p>}
              </div>
            )}

            {paymentMethod === 'netbanking' && (
              <div className="pt-5" style={{ borderTop: `1px solid ${t.cardBorder}` }}>
                <p className="text-sm" style={{ color: t.subtleText }}>You will be redirected to your bank's secure payment portal.</p>
              </div>
            )}

            <div className="rounded-xl p-4 flex gap-3" style={{ background: t.isDark ? 'rgba(37,99,235,0.15)' : '#eff6ff', border: `1px solid ${t.isDark ? 'rgba(37,99,235,0.3)' : '#bfdbfe'}` }}>
              <Lock size={18} className="text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-blue-300">Secure Payment</p>
                <p className="text-xs text-blue-400/70">Your payment information is encrypted and safe</p>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onBack} className="hidden md:block flex-1 border-2 py-3 rounded-xl font-semibold text-sm transition-all"
                style={{ borderColor: t.cardBorder, color: t.pageText }}>Back</button>
              <button type="submit" disabled={processing}
                className="flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 transition-all"
                style={{ background: t.primary, color: t.btnText }}>
                {processing ? <><span className="animate-spin">⏳</span> Processing...</> : <><Lock size={16} /> Pay {fp(grandTotal)}</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FOOTER
// ─────────────────────────────────────────────────────────────────────────────
function Footer({ theme }) {
  const t = THEMES[theme];
  return (
    <footer style={{ background: t.footerBg, borderTop: `1px solid ${t.cardBorder}` }}>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-bold mb-3" style={{ color: t.accent }}>✦ Jewels</h3>
            <p className="text-sm" style={{ color: t.subtleText }}>Premium jewelry crafted with passion and precision.</p>
          </div>
          {[
            ['Quick Links', ['About Us', 'Collections', 'New Arrivals', 'Contact']],
            ['Support', ['FAQs', 'Return Policy', 'Shipping Info', 'Track Order']],
            ['Contact', ['hello@jewels.com', '+91 9999 999 999', 'Mon–Sat, 10AM–8PM']],
          ].map(([title, items]) => (
            <div key={title}>
              <h4 className="font-semibold mb-4" style={{ color: t.pageText }}>{title}</h4>
              <ul className="space-y-2 text-sm" style={{ color: t.subtleText }}>
                {items.map(item => (
                  <li key={item}><a href="#" className="hover:opacity-100 opacity-70 transition-opacity">{item}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="pt-6 flex flex-col md:flex-row justify-between items-center text-sm" style={{ borderTop: `1px solid ${t.cardBorder}`, color: t.subtleText }}>
          <p>© 2025 Jewels. All rights reserved.</p>
          <div className="flex gap-6 mt-3 md:mt-0">
            {['Privacy Policy', 'Terms', 'Sitemap'].map(l => (
              <a key={l} href="#" className="hover:opacity-100 opacity-60 transition-opacity">{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ROOT APP
// ─────────────────────────────────────────────────────────────────────────────
export default function JewelryApp() {
  const [theme, setTheme] = useState('amber');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState('cart');
  const [cartItems, setCartItems] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [shippingAddress, setShippingAddress] = useState(null);

  const t = THEMES[theme];

  const handleAddToCart = (product) => {
    setCartItems(prev => {
      const ex = prev.find(i => i.id === product.id);
      return ex
        ? prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + (product.quantity || 1) } : i)
        : [...prev, { ...product, quantity: product.quantity || 1 }];
    });
    setCartOpen(true);
  };

  const handleUpdateQuantity = (id, quantity) => {
    if (quantity === 0) setCartItems(prev => prev.filter(i => i.id !== id));
    else setCartItems(prev => prev.map(i => i.id === id ? { ...i, quantity } : i));
  };

  const total = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    // ← The key change: the outermost wrapper now takes the page background & text from the theme
    <main className="min-h-screen transition-colors duration-300" style={{ background: t.pageBg, color: t.pageText }}>
      <Header
        cartCount={cartItems.length}
        onCartClick={() => { setCartOpen(true); setCheckoutStep('cart'); }}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        theme={theme}
        onThemeChange={setTheme}
      />

      <Hero theme={theme} />

      <ProductGrid
        products={PRODUCTS}
        onAddToCart={handleAddToCart}
        selectedCategory={selectedCategory}
        theme={theme}
        onProductSelect={(p) => { setSelectedProduct(p); setDetailOpen(true); }}
      />

      <ProductDetail
        product={selectedProduct}
        isOpen={detailOpen}
        onClose={() => setDetailOpen(false)}
        onAddToCart={handleAddToCart}
        theme={theme}
      />

      {cartOpen && checkoutStep === 'cart' && (
        <Cart
          isOpen={cartOpen}
          onClose={() => setCartOpen(false)}
          cartItems={cartItems}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={(id) => setCartItems(prev => prev.filter(i => i.id !== id))}
          onProceedCheckout={() => setCheckoutStep('address')}
          theme={theme}
        />
      )}

      {cartOpen && checkoutStep === 'address' && (
        <AddressForm
          onSubmit={(addr) => { setShippingAddress(addr); setCheckoutStep('payment'); }}
          onBack={() => setCheckoutStep('cart')}
          theme={theme}
        />
      )}

      {cartOpen && checkoutStep === 'payment' && (
        <PaymentForm
          shippingAddress={shippingAddress}
          cartItems={cartItems}
          onSubmit={() => setCheckoutStep('confirmation')}
          onBack={() => setCheckoutStep('address')}
          total={total}
          theme={theme}
        />
      )}

      {cartOpen && checkoutStep === 'confirmation' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl"
            style={{ background: t.detailPanelBg, border: `1px solid ${t.cardBorder}` }}>
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold mb-2" style={{ color: t.pageText }}>Order Confirmed!</h2>
            <p className="mb-2" style={{ color: t.subtleText }}>Your order has been placed successfully.</p>
            <p className="text-sm font-semibold mb-6" style={{ color: t.accent }}>
              Order ID: #JWL{Math.random().toString().slice(2, 8)}
            </p>
            <button
              onClick={() => { setCheckoutStep('cart'); setCartOpen(false); setCartItems([]); }}
              className="w-full py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-all"
              style={{ background: t.primary, color: t.btnText }}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}

      <Footer theme={theme} />

      {cartItems.length > 0 && (
        <button
          onClick={() => { setCartOpen(true); setCheckoutStep('cart'); }}
          className="fixed bottom-6 right-6 md:hidden text-white p-4 rounded-full shadow-xl flex items-center justify-center"
          style={{ background: t.primary }}
        >
          <ShoppingCart size={22} />
          <span className="ml-2 bg-red-500 text-xs font-bold px-2 py-0.5 rounded-full">{cartItems.length}</span>
        </button>
      )}
    </main>
  );
}