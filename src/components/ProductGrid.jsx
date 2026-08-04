import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  Search, ShoppingCart, Package, AlertCircle, RefreshCw,
  Filter, ChevronDown, X, Check, Loader2,
} from 'lucide-react';
import { addToCart } from './Cartservice';
import { THEMES } from './themes';
import useStore from './Usestore';

const fp = (p) => '₹' + Number(p || 0).toLocaleString('en-IN');

const getItemImage = (name = '') => {
  const n = name.toLowerCase();
  if (n.includes('ring')) return 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80';
  if (n.includes('necklace') || n.includes('chain')) return 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80';
  if (n.includes('earring') || n.includes('ear')) return 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80';
  if (n.includes('bracelet') || n.includes('bangle') || n.includes('kada')) return 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&q=80';
  if (n.includes('pendant') || n.includes('locket')) return 'https://images.unsplash.com/photo-1589128777073-263566ae5e4d?w=600&q=80';
  if (n.includes('diamond')) return 'https://images.unsplash.com/photo-1543294001-f7cd5d7fb516?w=600&q=80';
  return 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=600&q=80';
};

const getStockStatus = (stock) => {
  if (!stock || stock <= 0) return { label: 'Out of Stock', color: '#ef4444', bg: '#fef2f2' };
  if (stock < 10) return { label: 'Low Stock', color: '#f59e0b', bg: '#fffbeb' };
  return { label: 'In Stock', color: '#22c55e', bg: '#f0fdf4' };
};

const itemCategory = (i) => i.item_category || i.item_group || i.item_type || 'General';

// ─── SKELETON CARD ────────────────────────────────────────────────────────────
const SkeletonCard = ({ t }) => (
  <div style={{ background: t.cardBg, border: `1.5px solid ${t.cardBorder}`, borderRadius: 16, overflow: 'hidden' }}>
    <div style={{ height: 200, background: t.isDark ? t.accentSoft : '#f3f4f6', animation: 'pulse 1.5s ease-in-out infinite' }} />
    <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {[['50%', 10], ['80%', 14], ['60%', 14], ['45%', 18]].map(([w, h], i) => (
        <div key={i} style={{ height: h, width: w, background: t.isDark ? '#334155' : '#e5e7eb', borderRadius: 4 }} />
      ))}
      <div style={{ height: 38, background: t.isDark ? '#334155' : '#e5e7eb', borderRadius: 8, marginTop: 4 }} />
    </div>
  </div>
);

// ─── STATS BAR ────────────────────────────────────────────────────────────────
const StatsBar = ({ items, filteredCount, totalCount, t }) => {
  const inStock    = items.filter((i) => (i.current_stock || 0) > 0).length;
  const outOfStock = items.length - inStock;
  return (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 24 }}>
      {[
        { label: 'Total',        value: totalCount,    color: null },
        { label: 'Loaded',       value: items.length,  color: t.accent },
        { label: 'In Stock',     value: inStock,       color: '#22c55e' },
        { label: 'Out of Stock', value: outOfStock,    color: '#ef4444' },
      ].map(({ label, value, color }) => (
        <div key={label} style={{ flex: 1, minWidth: 110, background: t.isDark ? t.accentSoft : '#fff', border: `1px solid ${t.cardBorder}`, borderRadius: 12, padding: '12px 16px' }}>
          <p style={{ fontSize: 18, fontWeight: 700, color: color || t.pageText, margin: 0, lineHeight: 1 }}>{value}</p>
          <p style={{ fontSize: 11, color: t.subtleText, margin: '2px 0 0' }}>{label}</p>
        </div>
      ))}
    </div>
  );
};

// ─── FILTER BAR ───────────────────────────────────────────────────────────────
const FilterBar = ({ items, filters, setFilters, theme }) => {
  const t = THEMES[theme];
  const [open, setOpen] = useState(false);

  const categories = useMemo(() => {
    const cats = new Set(items.map(itemCategory).filter(Boolean));
    return ['All', ...Array.from(cats).sort()];
  }, [items]);

  const saleTypes = useMemo(() => {
    const types = new Set(items.map((i) => i.sale_type).filter(Boolean));
    return ['All', ...Array.from(types)];
  }, [items]);

  const inputStyle = {
    background: t.isDark ? t.accentSoft : '#f3f4f6', border: `1px solid ${t.cardBorder}`,
    color: t.pageText, borderRadius: 8, padding: '9px 14px', fontSize: 13, outline: 'none', cursor: 'pointer',
  };

  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ flex: 1, minWidth: 200, display: 'flex', alignItems: 'center', gap: 8, background: t.isDark ? t.accentSoft : '#f3f4f6', border: `1px solid ${t.cardBorder}`, borderRadius: 8, padding: '9px 14px' }}>
          <Search size={15} style={{ color: t.subtleText, flexShrink: 0 }} />
          <input
            type="text" placeholder="Search products…" value={filters.search}
            onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
            style={{ background: 'transparent', border: 'none', outline: 'none', color: t.pageText, fontSize: 13, width: '100%' }}
          />
          {filters.search && (
            <button onClick={() => setFilters((f) => ({ ...f, search: '' }))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: t.subtleText, display: 'flex', padding: 0 }}>
              <X size={14} />
            </button>
          )}
        </div>

        <select value={filters.stockFilter} onChange={(e) => setFilters((f) => ({ ...f, stockFilter: e.target.value }))} style={inputStyle}>
          <option value="all">All Stock</option>
          <option value="inStock">In Stock</option>
          <option value="lowStock">Low Stock</option>
          <option value="outOfStock">Out of Stock</option>
        </select>

        <select value={filters.sortBy} onChange={(e) => setFilters((f) => ({ ...f, sortBy: e.target.value }))} style={inputStyle}>
          <option value="default">Sort: Default</option>
          <option value="name_asc">Name A–Z</option>
          <option value="name_desc">Name Z–A</option>
          <option value="price_asc">Price: Low–High</option>
          <option value="price_desc">Price: High–Low</option>
          <option value="stock_desc">Stock: Highest</option>
        </select>

        <button
          onClick={() => setOpen((o) => !o)}
          style={{ display: 'flex', alignItems: 'center', gap: 6, background: open ? t.primary : 'transparent', color: open ? t.btnText : t.subtleText, border: `1px solid ${open ? t.primary : t.cardBorder}`, borderRadius: 8, padding: '9px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
        >
          <Filter size={14} /> Filters
          <ChevronDown size={13} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
        </button>
      </div>

      {open && (
        <div style={{ background: t.isDark ? t.accentSoft : '#f9fafb', border: `1px solid ${t.cardBorder}`, borderRadius: 12, padding: 16, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {[['Category', 'category', categories.slice(0, 12)], ['Sale Type', 'saleType', saleTypes]].map(([label, key, opts]) => (
            <div key={key} style={{ flex: 1, minWidth: 160 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: t.subtleText, marginBottom: 8 }}>{label}</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {opts.map((opt) => (
                  <button key={opt} onClick={() => setFilters((f) => ({ ...f, [key]: opt }))}
                    style={{ fontSize: 12, fontWeight: 500, padding: '4px 12px', borderRadius: 20, border: `1px solid ${filters[key] === opt ? t.accent : t.cardBorder}`, background: filters[key] === opt ? (t.isDark ? t.accentSoft : t.primaryLight) : 'transparent', color: filters[key] === opt ? t.accent : t.subtleText, cursor: 'pointer' }}>
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── PRODUCT CARD ─────────────────────────────────────────────────────────────
const ProductCard = ({ item, theme, onAddToCart, onSelect }) => {
  const t = THEMES[theme];
  const [hovered, setHovered]   = useState(false);
  const [btnState, setBtnState] = useState('idle');
  const [errMsg, setErrMsg]     = useState('');

  const stock      = item.current_stock || 0;
  const stockStatus = getStockStatus(stock);
  const price      = item.mrp || item.sell_rate || 0;
  const category   = itemCategory(item);
  const outOfStock = stock <= 0;
  const isLoading  = btnState === 'loading';
  const disabled   = outOfStock || isLoading;

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (outOfStock || isLoading) return;
    setBtnState('loading'); setErrMsg('');
    onAddToCart?.({ ...item, quantity: 1, mrp: price });
    const result = await addToCart({ item_id: item.id, qty: 1, itemData: item });
    if (result.success) {
      setBtnState('success');
      setTimeout(() => setBtnState('idle'), 2500);
    } else {
      setBtnState('error'); setErrMsg(result.error || 'Failed to add');
      setTimeout(() => { setBtnState('idle'); setErrMsg(''); }, 3000);
    }
  };

  const btnBg =
    btnState === 'success' ? '#16a34a'
    : btnState === 'error'  ? '#dc2626'
    : outOfStock            ? (t.isDark ? '#374151' : '#e5e7eb')
    : t.primary;

  const btnFg =
    btnState === 'success' || btnState === 'error' ? '#fff'
    : outOfStock            ? (t.isDark ? '#6b7280' : '#9ca3af')
    : t.btnText;

  return (
    <div
      onClick={() => onSelect?.(item.id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: t.cardBg, border: `1.5px solid ${hovered ? t.cardHoverBorder : t.cardBorder}`,
        borderRadius: 16, overflow: 'hidden', cursor: 'pointer', transition: 'all 0.3s ease',
        boxShadow: hovered
          ? (t.isDark ? `0 8px 32px rgba(0,0,0,0.6),0 0 0 1px ${t.cardHoverBorder}` : `0 8px 32px rgba(0,0,0,0.12),0 0 0 1px ${t.cardHoverBorder}`)
          : (t.isDark ? '0 4px 24px rgba(0,0,0,0.4)' : '0 2px 12px rgba(0,0,0,0.06)'),
        display: 'flex', flexDirection: 'column',
      }}
    >
      <div style={{ position: 'relative', height: 200, overflow: 'hidden', background: t.isDark ? t.accentSoft : '#f3f4f6', flexShrink: 0 }}>
        <img src={getItemImage(item.item_name)} alt={item.item_name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease', transform: hovered ? 'scale(1.05)' : 'scale(1)' }} />
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to top,${t.isDark ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.15)'},transparent)`, opacity: hovered ? 1 : 0, transition: 'opacity 0.3s' }} />
        {item.sale_type && (
          <div style={{ position: 'absolute', top: 10, left: 10, background: t.primary, color: t.btnText, fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 20 }}>
            {item.sale_type}
          </div>
        )}
        <div style={{ position: 'absolute', top: 10, right: 10, background: stockStatus.bg, color: stockStatus.color, fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 20, border: `1px solid ${stockStatus.color}33` }}>
          {stockStatus.label}
        </div>
      </div>

      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
        <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: t.accent, margin: 0 }}>{category}</p>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: t.pageText, margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.4 }}>
          {item.item_name}
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 }}>
          <span style={{ fontSize: 18, fontWeight: 700, color: t.priceColor }}>
            {price > 0 ? fp(price) : 'Price on request'}
          </span>
          {stock > 0 && (
            <span style={{ fontSize: 10, color: t.subtleText, background: t.tagBg, padding: '2px 8px', borderRadius: 12 }}>
              Qty: {stock.toLocaleString('en-IN')}
            </span>
          )}
        </div>
        {item.sku && <p style={{ fontSize: 10, color: t.subtleText, margin: 0 }}>SKU: {item.sku}</p>}
        <div style={{ height: 1, background: t.cardBorder, margin: '4px 0' }} />

        <button
          onClick={handleAddToCart} disabled={disabled}
          style={{
            background: btnBg, color: btnFg,
            border: 'none',
            borderRadius: 8, padding: '10px 0', fontSize: 13, fontWeight: 600,
            cursor: disabled ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            transition: 'all 0.2s ease', width: '100%',
          }}
        >
          {btnState === 'loading' && <><Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> Adding…</>}
          {btnState === 'success' && <><Check size={13} /> Added!</>}
          {btnState === 'error'   && <><AlertCircle size={13} /> {errMsg.slice(0, 24)}</>}
          {btnState === 'idle'    && (outOfStock ? 'Out of Stock' : <><ShoppingCart size={13} /> Add to Cart</>)}
        </button>
      </div>
    </div>
  );
};

// ─── INFINITE SCROLL SENTINEL ─────────────────────────────────────────────────
const ScrollSentinel = ({ onVisible, t }) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) onVisible(); },
      { rootMargin: '200px' }   // trigger 200px before hitting bottom
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [onVisible]);

  return (
    <div ref={ref} style={{ textAlign: 'center', padding: '32px 0', color: t.subtleText }}>
      <Loader2 size={24} style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }} />
      <p style={{ fontSize: 13, marginTop: 8 }}>Loading more products…</p>
    </div>
  );
};

// ─── MAIN EXPORT ──────────────────────────────────────────────────────────────
export default function ProductListing({ theme = 'amber', onAddToCart, onProductSelect, selectedCategory = 'All', onSignInRequest }) {
  const t = THEMES[theme];
  const { customerId, clientId, businessId } = useStore();

  // ── Infinite scroll state ────────────────────────────────────────────────
  const [items, setItems]           = useState([]);       // accumulated across pages
  const [page, setPage]             = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loadingFirst, setLoadingFirst] = useState(true); // skeleton on first load
  const [loadingMore,  setLoadingMore]  = useState(false); // spinner at bottom
  const [error, setError]           = useState(null);
  const fetchingRef = useRef(false);  // guard against double-fetch

  const [filters, setFilters] = useState({
    search: '', category: 'All', saleType: 'All', stockFilter: 'all', sortBy: 'default',
  });

  useEffect(() => {
    setFilters((f) => ({ ...f, category: selectedCategory }));
  }, [selectedCategory]);

  // ── Fetch a single page and APPEND to items ──────────────────────────────
  const fetchPage = useCallback(async (pg, isFirst = false) => {
    if (fetchingRef.current) return;
    fetchingRef.current = true;
    if (isFirst) { setLoadingFirst(true); setError(null); }
    else          { setLoadingMore(true); }

    try {
      const res  = await fetch(
        `http://127.0.0.1:8000/api/inventory/${13}/business/${2}/items?page=${pg}&limit=12`
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.message || 'Fetch failed');

      // handle paginated response: { data: { items: { data: [...], last_page, total } } }
      const meta  = json.data?.items;
      const list  = Array.isArray(meta)       ? meta          // plain array fallback
                  : Array.isArray(meta?.data)  ? meta.data     // paginated object
                  : [];

      setTotalPages(meta?.last_page   ?? 1);
      setTotalCount(meta?.total       ?? list.length);
      setPage(meta?.current_page      ?? pg);

      setItems((prev) => isFirst ? list : [...prev, ...list]);
    } catch (err) {
      setError(err.message || 'Unable to load products');
    } finally {
      if (isFirst) setLoadingFirst(false);
      else          setLoadingMore(false);
      fetchingRef.current = false;
    }
  }, []);

  // initial load
  useEffect(() => {
    setItems([]);
    setPage(1);
    fetchPage(1, true);
  }, [fetchPage]);

  // refresh (reset to page 1)
  const handleRefresh = () => {
    setItems([]);
    setPage(1);
    setError(null);
    fetchPage(1, true);
  };

  // called by sentinel when it becomes visible
  const handleLoadMore = useCallback(() => {
    const nextPage = page + 1;
    if (nextPage > totalPages || fetchingRef.current || loadingMore) return;
    fetchPage(nextPage, false);
  }, [page, totalPages, loadingMore, fetchPage]);

  const hasMore = page < totalPages;

  // ── Client-side filter + sort on accumulated items ───────────────────────
  const filteredItems = useMemo(() => {
    let r = [...items];
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      r = r.filter((i) => (i.item_name || '').toLowerCase().includes(q) || (i.sku || '').toLowerCase().includes(q));
    }
    if (filters.category !== 'All') r = r.filter((i) => itemCategory(i) === filters.category);
    if (filters.saleType  !== 'All') r = r.filter((i) => i.sale_type === filters.saleType);
    if (filters.stockFilter === 'inStock')    r = r.filter((i) => (i.current_stock || 0) >= 10);
    if (filters.stockFilter === 'lowStock')   r = r.filter((i) => { const s = i.current_stock || 0; return s > 0 && s < 10; });
    if (filters.stockFilter === 'outOfStock') r = r.filter((i) => (i.current_stock || 0) <= 0);
    switch (filters.sortBy) {
      case 'name_asc':   r.sort((a, b) => (a.item_name || '').localeCompare(b.item_name || '')); break;
      case 'name_desc':  r.sort((a, b) => (b.item_name || '').localeCompare(a.item_name || '')); break;
      case 'price_asc':  r.sort((a, b) => (a.mrp || 0) - (b.mrp || 0)); break;
      case 'price_desc': r.sort((a, b) => (b.mrp || 0) - (a.mrp || 0)); break;
      case 'stock_desc': r.sort((a, b) => (b.current_stock || 0) - (a.current_stock || 0)); break;
    }
    return r;
  }, [items, filters]);

  const resetFilters = () => setFilters({ search: '', category: 'All', saleType: 'All', stockFilter: 'all', sortBy: 'default' });

  return (
    <section style={{ background: t.sectionBg, minHeight: '100vh', padding: '40px 0' }}>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
        @keyframes spin  { to{transform:rotate(360deg)} }
      `}</style>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 16px' }}>

        {/* Section header */}
       
        {/* Filters */}
        {!loadingFirst && !error && items.length > 0 && (
          <FilterBar items={items} filters={filters} setFilters={setFilters} theme={theme} />
        )}

        {/* Error */}
        {error && !loadingFirst && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 12, padding: 16, marginBottom: 24 }}>
            <AlertCircle size={20} style={{ color: '#ef4444', flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 600, color: '#991b1b', fontSize: 14, margin: 0 }}>Failed to load products</p>
              <p style={{ color: '#b91c1c', fontSize: 13, margin: 0 }}>{error}</p>
            </div>
            <button onClick={handleRefresh} style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Retry</button>
          </div>
        )}

        {/* First-load skeleton */}
        {loadingFirst && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 20 }}>
            {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} t={t} />)}
          </div>
        )}

        {/* Grid */}
        {!loadingFirst && !error && (
          filteredItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <Package size={48} style={{ color: t.subtleText, margin: '0 auto 16px' }} />
              <p style={{ fontSize: 18, fontWeight: 700, color: t.pageText, marginBottom: 8 }}>No products found</p>
              <p style={{ fontSize: 14, color: t.subtleText, marginBottom: 24 }}>Try adjusting your filters or search term</p>
              <button onClick={resetFilters} style={{ background: t.primary, color: t.btnText, border: 'none', borderRadius: 8, padding: '10px 24px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Reset Filters</button>
            </div>
          ) : (
            <>
              <p style={{ fontSize: 13, color: t.subtleText, marginBottom: 16 }}>
                Showing {filteredItems.length} of {totalCount} products
                {hasMore && <span style={{ marginLeft: 6, color: t.accent, fontWeight: 600 }}>· scroll for more</span>}
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 20 }}>
                {filteredItems.map((item) => (
                  <ProductCard
                    key={item.id}
                    item={item}
                    theme={theme}
                    onAddToCart={onAddToCart}
                    onSelect={onProductSelect}
                    customerId={customerId}
                    onSignInRequest={onSignInRequest}
                  />
                ))}
              </div>

              {/* Sentinel — triggers next page load when scrolled into view */}
              {hasMore && !loadingMore && (
                <ScrollSentinel onVisible={handleLoadMore} t={t} />
              )}

              {/* Loading more spinner */}
              {loadingMore && (
                <div style={{ textAlign: 'center', padding: '32px 0', color: t.subtleText }}>
                  <Loader2 size={24} style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }} />
                  <p style={{ fontSize: 13, marginTop: 8, color: t.subtleText }}>Loading more…</p>
                </div>
              )}

              {/* End of results */}
              {!hasMore && items.length > 0 && (
                <div style={{ textAlign: 'center', padding: '32px 0', color: t.subtleText, fontSize: 13 }}>
                  ✓ All {totalCount} products loaded
                </div>
              )}
            </>
          )
        )}
      </div>
    </section>
  );
}