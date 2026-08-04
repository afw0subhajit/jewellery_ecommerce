import { useState } from 'react';
import {
  ShoppingCart, Menu, X, Search,
  Truck, RotateCcw, Shield,
  User, LogOut,
} from 'lucide-react';
import logo from './../public/ADIJEWELSLOGO.png';

import ProductListing from './components/ProductGrid';
import ProductDetail from './components/ProductDetail';
import Cart from './components/Cart';
import AuthModal from './components/Createcustomer';
import useStore from './components/Usestore';
import { fetchCart } from './components/Cartservice';
import { useEffect } from 'react';

// ── Constants ─────────────────────────────────────────────────────────────────
const CATEGORIES = ['All', 'Rings', 'Necklaces', 'Bracelets', 'Earrings', 'Pendants'];

const THEMES = {
  amber: { name: 'Amber Gold', primary: '#b45309', primaryHover: '#92400e', primaryLight: '#fef3c7', primaryBorder: '#d97706', accent: '#f59e0b', accentSoft: '#fde68a', navBg: '#ffffff', navText: '#1f2937', btnText: '#ffffff', heroFrom: '#fffbeb', heroTo: '#fef3c7', pageBg: '#fffbeb', pageText: '#1c1917', sectionAlt: '#fef3c7', cardBg: '#ffffff', cardBorder: '#fde68a', cardHoverBorder: '#b45309', priceColor: '#92400e', subtleText: '#92400e', tagBg: '#fef3c7', tagText: '#b45309', detailPanelBg: '#fffbeb', detailSpecBg: '#fef3c7', detailSpecBorder: '#fde68a', footerBg: '#1c0a00', isDark: false },
  silver: { name: 'Black & Silver', primary: '#e2e8f0', primaryHover: '#cbd5e1', primaryLight: '#1e293b', primaryBorder: '#475569', accent: '#94a3b8', accentSoft: '#334155', navBg: '#0f172a', navText: '#f1f5f9', btnText: '#0f172a', heroFrom: '#0f172a', heroTo: '#1e293b', pageBg: '#0f172a', pageText: '#f1f5f9', sectionAlt: '#1e293b', cardBg: '#1e293b', cardBorder: '#334155', cardHoverBorder: '#94a3b8', priceColor: '#e2e8f0', subtleText: '#94a3b8', tagBg: '#334155', tagText: '#94a3b8', detailPanelBg: '#111827', detailSpecBg: '#1e293b', detailSpecBorder: '#334155', footerBg: '#020617', isDark: true },
  royal: { name: 'Royal Brown & Gold', primary: '#ca8a04', primaryHover: '#a16207', primaryLight: '#1c0a00', primaryBorder: '#a16207', accent: '#fbbf24', accentSoft: '#78350f', navBg: '#0d0500', navText: '#fef3c7', btnText: '#0d0500', heroFrom: '#0d0500', heroTo: '#1c0a00', pageBg: '#0d0500', pageText: '#fef3c7', sectionAlt: '#1c0a00', cardBg: '#1c0a00', cardBorder: '#3b1407', cardHoverBorder: '#ca8a04', priceColor: '#fef3c7', subtleText: '#ca8a04', tagBg: '#3b1407', tagText: '#fbbf24', detailPanelBg: '#0d0500', detailSpecBg: '#1c0a00', detailSpecBorder: '#3b1407', footerBg: '#030100', isDark: true },
};

// ── Header ────────────────────────────────────────────────────────────────────
function Header({ onCartClick, selectedCategory, onCategoryChange, theme, onThemeChange, onAuthClick }) {
  const [open, setOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const t = THEMES[theme];

  const customerId = useStore((s) => s.customerId);
  const customerName = useStore((s) => s.customerName);
  const clearAuth = useStore((s) => s.clearAuth);
  const token = useStore((s) => s.token);
  const cartVersion = useStore((s) => s.cartVersion);
  const isLoggedIn = !!token;

  useEffect(() => {
    fetchCart().then((res) => {
      if (res?.success) {
        const list = Array.isArray(res.data?.items) ? res.data.items : (Array.isArray(res.data) ? res.data : []);
        setCartCount(list.length);
      }
    }).catch(() => setCartCount(0));
  }, [cartVersion, isLoggedIn]);

  return (
    <header className="sticky top-0 z-50 shadow-md" style={{ background: t.navBg, borderBottom: `1px solid ${t.isDark ? t.cardBorder : '#e5e7eb'}` }}>
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">

        {/* Mobile hamburger */}
        <button onClick={() => setOpen(!open)} className="md:hidden p-2 rounded-lg" style={{ color: t.navText }}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Logo */}
        <div className="flex items-center gap-2">
          <img src={logo} alt="Adi Jewels" style={{ height: 44, width: 'auto', objectFit: 'contain', borderRadius: 8 }} />
          <div className="leading-tight">
            <div className="font-semibold text-[18px] text-amber-600">Adi Jewels</div>
            <div className="text-[11px] tracking-wider text-gray-500">HAPPINESS OF LIFE</div>
          </div>
        </div>

        {/* Search bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-6">
          <div className="w-full flex items-center rounded-lg px-4 py-2 gap-2" style={{ background: t.isDark ? t.accentSoft : '#f3f4f6', border: `1px solid ${t.cardBorder}` }}>
            <Search size={16} style={{ color: t.subtleText }} />
            <input type="text" placeholder="Search jewelry…" className="bg-transparent w-full outline-none text-sm" style={{ color: t.navText }} />
          </div>
        </div>

        {/* Right buttons */}
        <div className="flex items-center gap-2">

          {/* ── Auth pill ── */}
          {isLoggedIn ? (
            /* Logged-in: avatar + name + logout */
            <div
              className="hidden sm:flex items-center gap-1 rounded-lg overflow-hidden"
              style={{ border: `1.5px solid ${t.cardBorder}` }}
            >
              <div style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '6px 12px',
                background: t.isDark ? t.accentSoft : t.primaryLight,
              }}>
                <div style={{
                  width: 26, height: 26, borderRadius: '50%',
                  background: t.primary,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <User size={13} style={{ color: t.btnText }} />
                </div>
                <span style={{
                  fontSize: 13, fontWeight: 700, color: t.pageText,
                  maxWidth: 90, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {customerName}
                </span>
              </div>
              <button
                onClick={clearAuth}
                title="Sign out"
                style={{
                  padding: '6px 10px', background: 'transparent', border: 'none',
                  cursor: 'pointer', color: t.subtleText,
                  display: 'flex', alignItems: 'center',
                }}
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            /* Guest: Sign In button */
            <button
              onClick={onAuthClick}
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm hover:opacity-90"
              style={{
                background: t.isDark ? t.accentSoft : t.primaryLight,
                color: t.pageText,
                border: `1.5px solid ${t.cardBorder}`,
              }}
            >
              <User size={16} style={{ color: t.accent }} />
              <span style={{ color: t.isDark ? t.navText : t.primary, fontWeight: 700 }}>Sign In</span>
            </button>
          )}

          {/* Cart */}
          <button
            onClick={onCartClick}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm hover:opacity-90 relative"
            style={{ background: t.primary, color: t.btnText }}
          >
            <ShoppingCart size={18} />
            <span className="hidden sm:inline">Cart</span>
            {cartCount > 0 && (
              <span
                style={{
                  background: t.accent,
                  color: t.isDark ? '#000' : '#fff',
                  fontSize: 11,
                  fontWeight: 800,
                  borderRadius: 12,
                  padding: '1px 6px',
                  marginLeft: 2,
                }}
              >
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile nav drawer */}
      <nav style={{ borderTop: `1px solid ${t.isDark ? t.cardBorder : '#e5e7eb'}` }}>
        <div className="max-w-7xl mx-auto hidden md:flex items-center justify-between px-4" />
        {open && (
          <div className="md:hidden" style={{ background: t.navBg }}>

            {/* Sign In row (guest) */}
            {!isLoggedIn && (
              <button
                onClick={() => { setOpen(false); onAuthClick(); }}
                className="w-full px-4 py-3 text-left text-sm font-medium flex items-center gap-2"
                style={{
                  color: t.accent,
                  borderLeft: `3px solid ${t.accent}`,
                  background: t.isDark ? t.accentSoft : t.primaryLight,
                }}
              >
                <User size={14} /> Sign In / Register
              </button>
            )}

            {/* Logged-in row */}
            {isLoggedIn && (
              <div
                className="flex items-center justify-between px-4 py-3"
                style={{ borderLeft: `3px solid ${t.accent}`, background: t.isDark ? t.accentSoft : t.primaryLight }}
              >
                <div className="flex items-center gap-2">
                  <User size={14} style={{ color: t.accent }} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: t.pageText }}>{customerName}</span>
                </div>
                <button
                  onClick={clearAuth}
                  style={{ fontSize: 12, color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}
                >
                  Sign out
                </button>
              </div>
            )}

            {/* Category links */}
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => { onCategoryChange(cat); setOpen(false); }}
                className="w-full px-4 py-3 text-left text-sm font-medium"
                style={{
                  color: selectedCategory === cat ? t.accent : t.subtleText,
                  borderLeft: `3px solid ${selectedCategory === cat ? t.accent : 'transparent'}`,
                  background: selectedCategory === cat ? (t.isDark ? t.accentSoft : t.primaryLight) : 'transparent',
                }}
              >
                {cat}
              </button>
            ))}

            {/* Theme switcher */}
            <div className="p-4 border-t" style={{ borderColor: t.cardBorder }}>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(THEMES).map(([key, th]) => (
                  <button
                    key={key}
                    onClick={() => onThemeChange(key)}
                    className="rounded-xl px-3 py-3 text-xs font-semibold border"
                    style={{
                      background: theme === key ? th.primary : 'transparent',
                      color: theme === key ? (th.isDark ? th.navBg : '#fff') : t.subtleText,
                      borderColor: theme === key ? th.primary : t.cardBorder,
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

// ── Hero ──────────────────────────────────────────────────────────────────────
function Hero({ theme }) {
  const t = THEMES[theme];
  return (
    <section className="py-12 md:py-20" style={{ background: `linear-gradient(135deg, ${t.heroFrom}, ${t.heroTo})` }}>
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="flex flex-col gap-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest w-fit" style={{ background: t.tagBg, color: t.accent, border: `1px solid ${t.cardBorder}` }}>✦ New Arrivals 2025</div>
          <h2 className="text-4xl md:text-5xl font-bold leading-tight" style={{ color: t.pageText }}>Discover <span style={{ color: t.accent }}>Timeless</span> Elegance</h2>
          <p className="text-lg" style={{ color: t.subtleText }}>Exquisite jewelry crafted with precision and passion. Each piece tells a story of elegance.</p>
          <div className="flex gap-4">
            <button className="px-8 py-3 rounded-lg font-semibold text-sm hover:opacity-90" style={{ background: t.primary, color: t.btnText }}>Shop Now</button>
            <button className="px-8 py-3 rounded-lg font-semibold text-sm border-2" style={{ borderColor: t.accent, color: t.accent }}>View Collection</button>
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
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer({ theme }) {
  const t = THEMES[theme];
  return (
    <footer style={{ background: t.footerBg, borderTop: `1px solid ${t.cardBorder}` }}>
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Adi Jewels" style={{ height: 44, width: 'auto', objectFit: 'contain', opacity: 0.85, filter: 'brightness(1.3) saturate(0.8)', borderRadius: 6 }} />
          <div>
            <div className="text-sm font-bold tracking-wide" style={{ color: '#e5e7eb' }}>Adi Jewels</div>
            <div className="text-xs tracking-widest uppercase" style={{ color: '#9ca3af' }}>Happiness of Life · India</div>
          </div>
        </div>
        <div className="flex items-center gap-6">
          {[{ icon: Shield, label: 'BIS Certified' }, { icon: Truck, label: 'Free Delivery' }, { icon: RotateCcw, label: 'Easy Returns' }].map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <Icon size={16} style={{ color: '#9ca3af' }} />
              <span className="text-xs" style={{ color: '#6b7280' }}>{label}</span>
            </div>
          ))}
        </div>
        <p className="text-xs" style={{ color: '#6b7280' }}>© 2025 Adi Jewels. All rights reserved.</p>
      </div>
    </footer>
  );
}

// ── Root App ──────────────────────────────────────────────────────────────────
export default function JewelryApp() {
  const [theme, setTheme] = useState('amber');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [authOpen, setAuthOpen] = useState(false);

  const customerId = useStore((s) => s.customerId);
  const token = useStore((s) => s.token);

  const isLoggedIn = !!token;
  const t = THEMES[theme];

  return (
    <main className="min-h-screen transition-colors duration-300" style={{ background: t.pageBg, color: t.pageText }}>
      <Header
        onCartClick={() => setCartOpen(true)}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        theme={theme}
        onThemeChange={setTheme}
        onAuthClick={() => setAuthOpen(true)}
      />

      <Hero theme={theme} />

      <ProductListing
        theme={theme}
        onAddToCart={() => setCartOpen(true)}
        onProductSelect={(id) => setSelectedItemId(id)}
        selectedCategory={selectedCategory}
        onSignInRequest={() => setAuthOpen(true)}
      />

      <ProductDetail
        itemId={selectedItemId}
        isOpen={!!selectedItemId}
        onClose={() => setSelectedItemId(null)}
        theme={theme}
        onAddToCart={() => setCartOpen(true)}
        onSignInRequest={() => setAuthOpen(true)}
      />

      <Cart
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        theme={theme}
        customerId={isLoggedIn ? customerId : null}
      />

      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        theme={theme}
      />

      <Footer theme={theme} />

      {/* Mobile floating cart */}
      <button
        onClick={() => setCartOpen(true)}
        className="fixed bottom-6 right-6 md:hidden text-white p-4 rounded-full shadow-xl flex items-center justify-center"
        style={{ background: t.primary }}
      >
        <ShoppingCart size={22} />
      </button>
    </main>
  );
}