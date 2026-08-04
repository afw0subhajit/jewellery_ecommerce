import { useState, useEffect } from 'react';
import {
  ShoppingCart, AlertCircle, RefreshCw, X, ChevronLeft,
  Shield, Truck, RotateCcw, Check, Heart, BarChart2,
  Hash, Calendar, Box, TrendingDown, TrendingUp, Tag, Layers, Loader2,
} from 'lucide-react';
import { addToCart } from './Cartservice';
import { THEMES } from './themes';
import useStore from './Usestore';

const fp = (p) => '₹' + Number(p || 0).toLocaleString('en-IN');
const fmt = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : null;

const getItemImage = (name = '') => {
  const n = name.toLowerCase();
  if (n.includes('ring')) return 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80';
  if (n.includes('necklace') || n.includes('chain')) return 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80';
  if (n.includes('earring') || n.includes('ear')) return 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80';
  if (n.includes('bracelet') || n.includes('bangle') || n.includes('kada')) return 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80';
  if (n.includes('pendant') || n.includes('locket')) return 'https://images.unsplash.com/photo-1589128777073-263566ae5e4d?w=800&q=80';
  if (n.includes('diamond')) return 'https://images.unsplash.com/photo-1543294001-f7cd5d7fb516?w=800&q=80';
  return 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&q=80';
};

const getStockStatus = (qty) => {
  if (!qty || qty <= 0) return { label: 'Out of Stock', color: '#ef4444', bg: '#fef2f2' };
  if (qty < 10) return { label: 'Low Stock', color: '#f59e0b', bg: '#fffbeb' };
  return { label: 'In Stock', color: '#22c55e', bg: '#f0fdf4' };
};

// ─── Sub-components ───────────────────────────────────────────────────────────
const InfoRow = ({ label, value, t, icon: Icon }) =>
  value != null && value !== '' ? (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: `1px solid ${t.cardBorder}` }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: t.subtleText }}>
        {Icon && <Icon size={14} style={{ color: t.accent }} />}{label}
      </span>
      <span style={{ fontSize: 13, fontWeight: 600, color: t.pageText }}>{value}</span>
    </div>
  ) : null;

const StatMini = ({ label, value, color, icon: Icon, t }) => (
  <div style={{ background: t.isDark ? t.tagBg : '#fff', border: `1px solid ${t.cardBorder}`, borderRadius: 8, padding: '10px 12px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4 }}>
      <Icon size={12} style={{ color }} /><span style={{ fontSize: 10, color: t.subtleText }}>{label}</span>
    </div>
    <p style={{ fontSize: 16, fontWeight: 700, color, margin: 0 }}>{value ?? '—'}</p>
  </div>
);

const SpecCard = ({ label, value, t }) => (
  <div style={{ background: t.detailSpecBg, border: `1px solid ${t.detailSpecBorder}`, borderRadius: 8, padding: '10px 12px' }}>
    <p style={{ fontSize: 10, color: t.subtleText, margin: '0 0 2px' }}>{label}</p>
    <p style={{ fontSize: 13, fontWeight: 600, color: t.pageText, margin: 0 }}>{value}</p>
  </div>
);

const TrustBadge = ({ icon: Icon, label, sub, t }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 6 }}>
    <div style={{ padding: 8, background: t.tagBg, borderRadius: 8 }}><Icon size={16} style={{ color: t.accent }} /></div>
    <p style={{ fontSize: 11, fontWeight: 600, color: t.pageText, margin: 0 }}>{label}</p>
    <p style={{ fontSize: 10, color: t.subtleText, margin: 0 }}>{sub}</p>
  </div>
);

// ─── Sign-in banner shown inside the detail panel ────────────────────────────
const SignInBanner = ({ t, onSignInClick }) => (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    gap: 12, background: t.isDark ? t.accentSoft : t.primaryLight,
    border: `1.5px solid ${t.cardBorder}`, borderRadius: 12,
    padding: '12px 16px', marginBottom: 12,
  }}>
    <div>
      <p style={{ fontSize: 13, fontWeight: 700, color: t.pageText, margin: '0 0 2px' }}>Guest Shopping Active</p>
      <p style={{ fontSize: 11, color: t.subtleText, margin: 0 }}>You can add to cart now and sign in or checkout as guest!</p>
    </div>
    <button
      onClick={onSignInClick}
      style={{
        flexShrink: 0, fontSize: 12, fontWeight: 700,
        color: t.btnText, background: t.primary,
        border: 'none', borderRadius: 8,
        padding: '8px 14px', cursor: 'pointer',
      }}
    >
      Sign In →
    </button>
  </div>
);

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function ProductDetail({ itemId, isOpen, onClose, theme = 'amber', onAddToCart, onSignInRequest }) {
  const t = THEMES[theme];

  const { customerId, clientId, businessId } = useStore();

  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(1);
  const [btnState, setBtnState] = useState('idle');
  const [btnErr, setBtnErr] = useState('');
  const [wishlisted, setWishlisted] = useState(false);

  useEffect(() => {
    if (!itemId || !isOpen) return;
    setDetail(null); setError(null); setQty(1); setBtnState('idle'); setBtnErr('');
    setLoading(true);
    fetch(`http://127.0.0.1:8000/api/inventory/${clientId}/business/${businessId}/items/${itemId}`)
      .then((r) => r.json())
      .then((json) => {
        if (!json.success) throw new Error(json.message || 'Fetch failed');
        setDetail(json.data?.item);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [itemId, isOpen]);

  const stockBatch = detail?.item_stock?.[0];
  const mrp = stockBatch?.mrp || detail?.mrp || 0;
  const sellRate = stockBatch?.sell_rate || detail?.sell_rate || 0;
  const purchaseRate = stockBatch?.purchase_rate || 0;
  const availableQty = stockBatch?.available_quantity ?? detail?.current_stock ?? 0;
  const inQty = stockBatch?.in_quantity || 0;
  const outQty = stockBatch?.out_quantity || 0;
  const stockStatus = getStockStatus(availableQty);
  const cgst = stockBatch?.cgst || detail?.cgst || 0;
  const sgst = stockBatch?.sgst || detail?.sgst || 0;

  const outOfStock = !detail || availableQty <= 0;
  const isLoading = btnState === 'loading';
  const outDisabled = outOfStock || isLoading;

  const handleAddToCart = async () => {
    if (outDisabled) return;

    const price = stockBatch?.mrp || stockBatch?.sell_rate || detail?.mrp || 0;
    onAddToCart?.({ ...detail, mrp: price, quantity: qty });
    setBtnState('loading'); setBtnErr('');

    const result = await addToCart({ item_id: detail.id, qty, itemData: detail });

    if (result.success) {
      setBtnState('success');
      setTimeout(() => setBtnState('idle'), 2500);
    } else {
      setBtnState('error'); setBtnErr(result.error || 'API error');
      setTimeout(() => { setBtnState('idle'); setBtnErr(''); }, 3500);
    }
  };

  const btnBg =
    outOfStock ? (t.isDark ? '#374151' : '#e5e7eb')
      : btnState === 'success' ? '#16a34a'
        : btnState === 'error' ? '#dc2626'
            : t.primary;

  const btnFg =
    outOfStock ? (t.isDark ? '#6b7280' : '#9ca3af')
      : (btnState === 'success' || btnState === 'error') ? '#fff'
          : t.btnText;

  if (!isOpen) return null;

  return (
    <>
      <style>{`
        @keyframes pdSlideIn { from { transform:translateX(100%) } to { transform:translateX(0) } }
        @keyframes spin { to { transform:rotate(360deg) } }
      `}</style>

      {/* Backdrop */}
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)', zIndex: 50 }} />

      {/* Panel */}
      <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '100%', maxWidth: 860, background: t.detailPanelBg, zIndex: 51, overflowY: 'auto', boxShadow: '-8px 0 40px rgba(0,0,0,0.3)', animation: 'pdSlideIn 0.35s cubic-bezier(0.32,0.72,0,1)' }}>

        {/* Sticky header */}
        <div style={{ position: 'sticky', top: 0, zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', background: t.detailPanelBg, borderBottom: `1px solid ${t.cardBorder}` }}>
          <button onClick={onClose} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: t.subtleText, fontSize: 13, fontWeight: 600 }}>
            <ChevronLeft size={18} /> Back to Products
          </button>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => setWishlisted((w) => !w)} style={{ padding: 8, borderRadius: '50%', background: wishlisted ? '#fef2f2' : t.tagBg, border: 'none', cursor: 'pointer', display: 'flex' }}>
              <Heart size={18} style={{ color: wishlisted ? '#ef4444' : t.subtleText, fill: wishlisted ? '#ef4444' : 'none' }} />
            </button>
            <button onClick={onClose} style={{ padding: 8, borderRadius: '50%', background: t.tagBg, border: 'none', cursor: 'pointer', display: 'flex' }}>
              <X size={18} style={{ color: t.subtleText }} />
            </button>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 80, gap: 16 }}>
            <RefreshCw size={32} style={{ color: t.accent, animation: 'spin 1s linear infinite' }} />
            <p style={{ color: t.subtleText, fontSize: 14, margin: 0 }}>Loading product details…</p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div style={{ margin: 24, display: 'flex', alignItems: 'center', gap: 12, background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 12, padding: 16 }}>
            <AlertCircle size={20} style={{ color: '#ef4444', flexShrink: 0 }} />
            <p style={{ color: '#991b1b', fontSize: 14, margin: 0 }}>{error}</p>
          </div>
        )}

        {/* Detail */}
        {detail && !loading && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>

            {/* Left column */}
            <div style={{ padding: 24, borderRight: `1px solid ${t.cardBorder}` }}>
              <div style={{ borderRadius: 16, overflow: 'hidden', aspectRatio: '1/1', background: t.isDark ? t.accentSoft : '#f3f4f6', border: `1px solid ${t.cardBorder}`, marginBottom: 16, position: 'relative' }}>
                <img src={getItemImage(detail.item_name)} alt={detail.item_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', top: 12, right: 12, background: stockStatus.bg, color: stockStatus.color, fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 20, border: `1px solid ${stockStatus.color}33` }}>
                  {stockStatus.label}
                </div>
              </div>

              {stockBatch && (
                <div style={{ background: t.detailSpecBg, border: `1px solid ${t.detailSpecBorder}`, borderRadius: 12, padding: 16 }}>
                  <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: t.accent, margin: '0 0 12px' }}>📦 Stock Batch Info</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
                    <StatMini label="Total In" value={inQty?.toLocaleString('en-IN')} color="#22c55e" icon={TrendingUp} t={t} />
                    <StatMini label="Total Out" value={outQty?.toLocaleString('en-IN')} color="#ef4444" icon={TrendingDown} t={t} />
                    <StatMini label="Available" value={availableQty?.toLocaleString('en-IN')} color={t.accent} icon={Box} t={t} />
                    <StatMini label="Batch Qty" value={stockBatch.quantity?.toLocaleString('en-IN')} color={t.pageText} icon={BarChart2} t={t} />
                  </div>
                  <InfoRow label="Batch No." value={stockBatch.batch_no} t={t} icon={Hash} />
                  <InfoRow label="Lot No." value={stockBatch.lot_no} t={t} icon={Hash} />
                  <InfoRow label="Stock Type" value={stockBatch.stock_type} t={t} icon={Box} />
                  <InfoRow label="Stock In Date" value={fmt(stockBatch.stock_in_date)} t={t} icon={Calendar} />
                  <InfoRow label="Last Out Date" value={fmt(stockBatch.last_stock_out_date)} t={t} icon={Calendar} />
                  <InfoRow label="Expiry Date" value={fmt(stockBatch.expiry_date)} t={t} icon={Calendar} />
                  <InfoRow label="Rack Location" value={stockBatch.rack_location} t={t} icon={Box} />
                  <InfoRow label="Barcode" value={stockBatch.bar_code_id} t={t} icon={Hash} />
                </div>
              )}
            </div>

            {/* Right column */}
            <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>

              <div>
                <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: t.accent, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
                  {detail.item_category || detail.item_group || detail.item_type || 'General'}
                  {detail.sale_type && (
                    <span style={{ background: t.primary, color: t.btnText, padding: '2px 8px', borderRadius: 10, fontSize: 9 }}>{detail.sale_type}</span>
                  )}
                </p>
                <h1 style={{ fontSize: 22, fontWeight: 700, color: t.pageText, lineHeight: 1.3, margin: '0 0 4px' }}>{detail.item_name}</h1>
                {detail.sku && <p style={{ fontSize: 12, color: t.subtleText, margin: 0 }}>SKU: {detail.sku}</p>}
              </div>

              <div style={{ background: t.detailSpecBg, border: `1px solid ${t.detailSpecBorder}`, borderRadius: 12, padding: 16 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 6 }}>
                  <span style={{ fontSize: 28, fontWeight: 700, color: t.priceColor }}>
                    {mrp > 0 ? fp(mrp) : 'Price on request'}
                  </span>
                  {sellRate > 0 && sellRate < mrp && (
                    <span style={{ fontSize: 16, textDecoration: 'line-through', color: t.isDark ? '#6b7280' : '#9ca3af' }}>{fp(sellRate)}</span>
                  )}
                </div>
                {purchaseRate > 0 && <p style={{ fontSize: 11, color: t.subtleText, margin: '4px 0 0' }}>Purchase rate: {fp(purchaseRate)}</p>}
                {(cgst > 0 || sgst > 0) && <p style={{ fontSize: 11, color: t.subtleText, margin: '2px 0 0' }}>GST: CGST {cgst}% + SGST {sgst}%</p>}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {[
                  ['Type', detail.item_type],
                  ['Stock Method', detail.stock_method?.toUpperCase()],
                  ['Perishable', detail.perishable === 'true' ? 'Yes' : detail.perishable === 'false' ? 'No' : null],
                  ['Web Store', detail.web_store === 'true' ? 'Yes' : detail.web_store === 'false' ? 'No' : null],
                ].filter(([, v]) => v).map(([label, value]) => (
                  <SpecCard key={label} label={label} value={value} t={t} />
                ))}
              </div>

              {!customerId && (
                <SignInBanner t={t} onSignInClick={() => { onClose(); onSignInRequest?.(); }} />
              )}

              {/* Qty stepper + Add to Cart */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', border: `1.5px solid ${t.cardBorder}`, borderRadius: 8, overflow: 'hidden' }}>
                    <button
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      disabled={isLoading}
                      style={{ padding: '10px 14px', background: t.isDark ? t.tagBg : '#f9fafb', border: 'none', cursor: isLoading ? 'not-allowed' : 'pointer', color: t.pageText, fontSize: 16, fontWeight: 700 }}
                    >−</button>
                    <span style={{ padding: '10px 18px', fontSize: 14, fontWeight: 700, color: t.pageText, borderLeft: `1px solid ${t.cardBorder}`, borderRight: `1px solid ${t.cardBorder}` }}>{qty}</span>
                    <button
                      onClick={() => setQty((q) => q + 1)}
                      disabled={isLoading}
                      style={{ padding: '10px 14px', background: t.isDark ? t.tagBg : '#f9fafb', border: 'none', cursor: isLoading ? 'not-allowed' : 'pointer', color: t.pageText, fontSize: 16, fontWeight: 700 }}
                    >+</button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    disabled={outDisabled}
                    style={{
                      flex: 1, padding: '12px 0', borderRadius: 10, border: 'none',
                      cursor: outDisabled ? 'not-allowed' : 'pointer',
                      background: btnBg, color: btnFg,
                      fontSize: 14, fontWeight: 700,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      transition: 'all 0.2s',
                    }}
                  >
                    {btnState === 'loading' && <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Adding…</>}
                    {btnState === 'success' && <><Check size={16} /> Added to Cart!</>}
                    {btnState === 'error' && <><AlertCircle size={16} /> {btnErr.slice(0, 28) || 'Failed'}</>}
                    {btnState === 'idle' && (
                      availableQty <= 0 ? 'Out of Stock' : <><ShoppingCart size={16} /> Add to Cart</>
                    )}
                  </button>
                </div>
              </div>

              {/* Trust badges */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, paddingTop: 16, borderTop: `1px solid ${t.cardBorder}` }}>
                <TrustBadge icon={Shield} label="BIS Certified" sub="Hallmarked" t={t} />
                <TrustBadge icon={Truck} label="Free Delivery" sub="Above ₹999" t={t} />
                <TrustBadge icon={RotateCcw} label="Easy Returns" sub="7-day policy" t={t} />
              </div>

              {/* Product meta */}
              <div style={{ paddingTop: 16, borderTop: `1px solid ${t.cardBorder}` }}>
                <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: t.accent, margin: '0 0 4px' }}>Product Details</p>
                <InfoRow label="Item ID" value={`#${detail.id}`} t={t} icon={Hash} />
                <InfoRow label="Item Tag" value={detail.item_tag} t={t} icon={Tag} />
                <InfoRow label="Min Level" value={detail.min_level} t={t} icon={TrendingDown} />
                <InfoRow label="Max Level" value={detail.max_level} t={t} icon={TrendingUp} />
                <InfoRow label="Opening Stock" value={detail.opening_stock} t={t} icon={Box} />
                <InfoRow label="UOM" value={detail.uom?.name || detail.uom_id} t={t} icon={Layers} />
                <InfoRow label="Created" value={fmt(detail.created_at)} t={t} icon={Calendar} />
                <InfoRow label="Last Updated" value={fmt(detail.updated_at)} t={t} icon={Calendar} />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}