'use client';

import { useState } from 'react';
import { ShoppingCart, Menu, X, Search, Heart } from 'lucide-react';

export default function Header({ cartCount, onCartClick, selectedCategory, onCategoryChange }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const categories = ['All', 'Rings', 'Necklaces', 'Bracelets', 'Earrings', 'Pendants'];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      {/* Top Navigation */}
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <h1 className="text-2xl font-bold text-amber-700">✨ Jewels</h1>
          </div>

          {/* Search Bar - Desktop */}
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
          <div className="flex items-center gap-3 md:gap-6">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <Search size={20} />
            </button>
            <button className="hidden md:flex items-center gap-1 text-gray-600 hover:text-amber-700">
              <Heart size={20} />
              <span className="text-sm">Wishlist</span>
            </button>
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

        {/* Search Bar Mobile */}
        {searchOpen && (
          <div className="mt-3 md:hidden">
            <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2">
              <Search size={16} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent w-full ml-2 outline-none text-sm"
              />
            </div>
          </div>
        )}
      </div>

      {/* Category Navigation */}
      <nav className="border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          {/* Desktop Categories */}
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

          {/* Mobile Categories */}
          {mobileMenuOpen && (
            <div className="md:hidden flex flex-col">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    onCategoryChange(cat);
                    setMobileMenuOpen(false);
                  }}
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
  );
}
