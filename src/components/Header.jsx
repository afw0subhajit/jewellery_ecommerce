import { useState } from 'react';
import { ShoppingCart, Menu, X, Search, Heart, User, LogOut, ChevronDown } from 'lucide-react';
import useStore from './useStore';
import AuthModal from './AuthModal';

export default function Header({ cartCount, onCartClick, selectedCategory, onCategoryChange }) {
  const [mobileMenuOpen, setMobileMenuOpen]   = useState(false);
  const [searchOpen, setSearchOpen]           = useState(false);
  const [authOpen, setAuthOpen]               = useState(false);
  const [authMode, setAuthMode]               = useState('login');
  const [profileOpen, setProfileOpen]         = useState(false);

  const { customerName, customerId, clearAuth } = useStore();
  const isLoggedIn = !!customerId;

  const categories = ['All', 'Rings', 'Necklaces', 'Bracelets', 'Earrings', 'Pendants'];

  const openAuth = (mode = 'login') => {
    setAuthMode(mode);
    setAuthOpen(true);
    setProfileOpen(false);
  };

  const handleLogout = () => {
    clearAuth();
    setProfileOpen(false);
  };

  // Derive initials for avatar
  const initials = customerName
    ? customerName.trim().split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : '';

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        {/* Top Navigation */}
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">

            {/* Logo + Mobile menu toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <h1 className="text-2xl font-bold text-amber-700">✨ Jewels</h1>
            </div>

            {/* Search Bar — Desktop */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="w-full flex items-center bg-gray-100 rounded-lg px-4 py-2">
                <Search size={18} className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Search jewelry..."
                  className="bg-transparent w-full ml-2 outline-none text-sm"
                />
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3 md:gap-4">

              {/* Mobile search toggle */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
                aria-label="Search"
              >
                <Search size={20} />
              </button>

              {/* Wishlist — desktop only */}
              <button className="hidden md:flex items-center gap-1 text-gray-600 hover:text-amber-700 transition-colors">
                <Heart size={20} />
                <span className="text-sm">Wishlist</span>
              </button>

              {/* ── Auth area ── */}
              {isLoggedIn ? (
                <div className="relative">
                  {/* Avatar + name button */}
                  <button
                    onClick={() => setProfileOpen(v => !v)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-amber-200 bg-amber-50 hover:bg-amber-100 transition-colors"
                  >
                    {/* Avatar circle */}
                    <span className="w-7 h-7 rounded-full bg-amber-700 text-white text-xs font-bold flex items-center justify-center select-none">
                      {initials || <User size={14} />}
                    </span>
                    <span className="hidden md:block text-sm font-medium text-amber-900 max-w-[100px] truncate">
                      {customerName}
                    </span>
                    <ChevronDown
                      size={14}
                      className={`text-amber-700 transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {/* Dropdown */}
                  {profileOpen && (
                    <>
                      {/* Click-away overlay */}
                      <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                      <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                        {/* User info */}
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-semibold text-gray-800 truncate">{customerName}</p>
                          <p className="text-xs text-gray-400 mt-0.5">Customer</p>
                        </div>
                        {/* Actions */}
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut size={15} />
                          Log out
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                /* Login / Register — shown when logged out */
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openAuth('login')}
                    className="hidden sm:block text-sm font-medium text-amber-700 hover:text-amber-800 px-3 py-1.5 rounded-lg hover:bg-amber-50 transition-colors"
                  >
                    Log in
                  </button>
                  <button
                    onClick={() => openAuth('register')}
                    className="text-sm font-medium bg-amber-700 text-white px-3 py-1.5 rounded-lg hover:bg-amber-800 transition-colors"
                  >
                    Sign up
                  </button>
                </div>
              )}

              {/* Cart */}
              <button
                onClick={onCartClick}
                className="relative flex items-center gap-2 bg-amber-700 text-white px-4 py-2 rounded-lg hover:bg-amber-800 transition-colors"
              >
                <ShoppingCart size={20} />
                <span className="text-sm font-medium">Cart</span>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Search Bar — Mobile expandable */}
          {searchOpen && (
            <div className="mt-3 md:hidden">
              <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2">
                <Search size={16} className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-transparent w-full ml-2 outline-none text-sm"
                  autoFocus
                />
              </div>
            </div>
          )}
        </div>

        {/* Category Navigation */}
        <nav className="border-t border-gray-200">
          <div className="max-w-7xl mx-auto">

            {/* Desktop */}
            <div className="hidden md:flex items-center overflow-x-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => onCategoryChange(cat)}
                  className={`px-4 py-3 font-medium whitespace-nowrap transition-colors border-b-2 ${
                    selectedCategory === cat
                      ? 'border-amber-700 text-amber-700'
                      : 'border-transparent text-gray-600 hover:text-amber-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Mobile */}
            {mobileMenuOpen && (
              <div className="md:hidden flex flex-col">
                {/* Auth actions at top of mobile menu when logged out */}
                {!isLoggedIn && (
                  <div className="flex gap-2 px-4 py-3 border-b border-gray-100">
                    <button
                      onClick={() => { openAuth('login'); setMobileMenuOpen(false); }}
                      className="flex-1 text-center text-sm font-medium text-amber-700 border border-amber-300 rounded-lg py-2 hover:bg-amber-50"
                    >
                      Log in
                    </button>
                    <button
                      onClick={() => { openAuth('register'); setMobileMenuOpen(false); }}
                      className="flex-1 text-center text-sm font-medium bg-amber-700 text-white rounded-lg py-2 hover:bg-amber-800"
                    >
                      Sign up
                    </button>
                  </div>
                )}

                {/* Logged-in user info in mobile menu */}
                {isLoggedIn && (
                  <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
                    <span className="w-8 h-8 rounded-full bg-amber-700 text-white text-xs font-bold flex items-center justify-center">
                      {initials || <User size={14} />}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{customerName}</p>
                      <button onClick={handleLogout} className="text-xs text-red-500 hover:underline">Log out</button>
                    </div>
                  </div>
                )}

                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => { onCategoryChange(cat); setMobileMenuOpen(false); }}
                    className={`px-4 py-3 text-left font-medium transition-colors ${
                      selectedCategory === cat
                        ? 'bg-amber-50 text-amber-700 border-l-4 border-amber-700'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>
      </header>

      {/* Auth Modal */}
      <AuthModal
        theme="amber"
        isOpen={authOpen}
        defaultMode={authMode}
        onClose={() => setAuthOpen(false)}
      />
    </>
  );
}