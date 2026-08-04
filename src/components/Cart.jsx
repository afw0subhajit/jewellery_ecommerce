import { useState, useEffect, useCallback } from 'react';
import { ShoppingCart, X, Plus, Minus, Trash2, ArrowRight, Loader2, RefreshCw, PackageOpen, AlertCircle } from 'lucide-react';
import useStore from './Usestore';
import CheckoutModal from './CheckoutModal';
import { fetchCart, updateCartItem, removeCartItem } from './Cartservice';

const fp = (p) => '₹' + Number(p || 0).toLocaleString('en-IN');

const getProductImage = (name = '') => {
  const n = name.toLowerCase();
  if (n.includes('ring')) return 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=200&q=70';
  if (n.includes('necklace') || n.includes('chain')) return 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=200&q=70';
  if (n.includes('earring') || n.includes('ear')) return 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=200&q=70';
  if (n.includes('bracelet') || n.includes('bangle') || n.includes('kada')) return 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=200&q=70';
  if (n.includes('pendant') || n.includes('locket')) return 'https://images.unsplash.com/photo-1589128777073-263566ae5e4d?w=200&q=70';
  return 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=200&q=70';
};

const itemName  = (i) => i?.item?.item_name ?? i?.item_name ?? i?.name ?? 'Product';
const itemQty   = (i) => parseFloat(i?.qty ?? i?.quantity ?? 1);
const itemPrice = (i) => parseFloat(i?.sell_rate ?? i?.item?.sell_rate ?? i?.mrp ?? i?.item?.mrp ?? i?.price ?? 0);
const itemMrp   = (i) => parseFloat(i?.mrp ?? i?.item?.mrp ?? 0);
const itemImage = (i) => i?.item?.image ?? i?.image ?? null;
const itemKey   = (i) => i?.id ?? i?.item_id;

export default function Cart({ isOpen, onClose }) {
  const { businessId, userId } = useStore();
  const cartVersion = useStore((s) => s.cartVersion);

  const [items,      setItems]      = useState([]);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [removingId, setRemovingId] = useState(null);
  const [checkout,   setCheckout]   = useState(false);

  const loadCart = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetchCart();
      if (res.success) {
        const cartData = res.data;
        const list = Array.isArray(cartData?.items) ? cartData.items : (Array.isArray(cartData) ? cartData : []);
        setItems(list);
      } else {
        setError(res.error || 'Failed to load cart');
      }
    } catch (e) {
      setError(e?.message || 'Failed to load cart');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) loadCart();
    else { setItems([]); setError(''); setCheckout(false); }
  }, [isOpen, cartVersion, loadCart]);

  const handleUpdate = async (id, newQty) => {
    setUpdatingId(id);
    setItems((prev) => prev.map((i) => itemKey(i) === id ? { ...i, qty: newQty } : i));
    try {
      await updateCartItem(id, newQty);
    } catch {
      loadCart();
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRemove = async (id) => {
    setRemovingId(id);
    setItems((prev) => prev.filter((i) => itemKey(i) !== id));
    try {
      await removeCartItem(id);
    } catch {
      loadCart();
    } finally {
      setRemovingId(null);
    }
  };

  const total   = items.reduce((s, i) => s + itemPrice(i) * itemQty(i), 0);
  const savings = items.reduce((s, i) => {
    const m = itemMrp(i), p = itemPrice(i), q = itemQty(i);
    return m > p && p > 0 ? s + (m - p) * q : s;
  }, 0);

  return (
    <>
      <style>{`
        @keyframes cartSlideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes shimmer { 0%{background-position:-400px 0} 100%{background-position:400px 0} }
        .cart-spin { animation: spin 0.7s linear infinite; }
        .cart-shimmer {
          background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
          background-size: 400px 100%;
          animation: shimmer 1.2s infinite linear;
          border-radius: 8px;
        }
      `}</style>

      {/* Backdrop */}
      {isOpen && !checkout && (
        <div
          onClick={onClose}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 40 }}
        />
      )}

      {/* Drawer */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: 380, zIndex: 50,
        background: '#fff',
        boxShadow: '-4px 0 24px rgba(0,0,0,0.12)',
        transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.28s cubic-bezier(0.32,0.72,0,1)',
        display: 'flex', flexDirection: 'column',
        fontFamily: "'Inter', system-ui, sans-serif",
      }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid #f0f0f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ShoppingCart size={18} color="#111" />
            <span style={{ fontSize: 15, fontWeight: 600, color: '#111' }}>Cart</span>
            {items.length > 0 && (
              <span style={{ background: '#111', color: '#fff', fontSize: 11, fontWeight: 600, padding: '1px 7px', borderRadius: 20 }}>
                {items.length}
              </span>
            )}
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            <button onClick={loadCart} disabled={loading} style={{ padding: 7, borderRadius: 8, border: '1px solid #f0f0f0', background: '#fafafa', cursor: 'pointer', display: 'flex' }}>
              <RefreshCw size={14} color="#888" className={loading ? 'cart-spin' : ''} style={loading ? { animation: 'spin 0.7s linear infinite' } : {}} />
            </button>
            <button onClick={onClose} style={{ padding: 7, borderRadius: 8, border: '1px solid #f0f0f0', background: '#fafafa', cursor: 'pointer', display: 'flex' }}>
              <X size={14} color="#888" />
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{ margin: '12px 16px 0', padding: '10px 12px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#b91c1c' }}>
            <AlertCircle size={13} color="#ef4444" />
            <span style={{ flex: 1 }}>{error}</span>
            <button onClick={() => setError('')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}><X size={12} color="#b91c1c" /></button>
          </div>
        )}

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>

          {/* Skeletons */}
          {loading && [1, 2, 3].map((k) => (
            <div key={k} style={{ display: 'flex', gap: 12, padding: 12, border: '1px solid #f0f0f0', borderRadius: 12 }}>
              <div className="cart-shimmer" style={{ width: 60, height: 60, flexShrink: 0 }} />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 4 }}>
                <div className="cart-shimmer" style={{ height: 12, width: '65%' }} />
                <div className="cart-shimmer" style={{ height: 12, width: '40%' }} />
                <div className="cart-shimmer" style={{ height: 28, width: '55%' }} />
              </div>
            </div>
          ))}

          {/* Empty */}
          {!loading && items.length === 0 && !error && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40, gap: 12, textAlign: 'center' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#f9f9f9', border: '1.5px dashed #ddd', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <PackageOpen size={26} color="#ccc" />
              </div>
              <p style={{ fontSize: 14, fontWeight: 600, color: '#111', margin: 0 }}>Your cart is empty</p>
              <p style={{ fontSize: 12, color: '#999', margin: 0 }}>Add items to get started</p>
              <button onClick={onClose} style={{ marginTop: 4, padding: '8px 18px', borderRadius: 8, border: '1px solid #e5e5e5', background: '#fff', fontSize: 13, cursor: 'pointer', color: '#333' }}>
                Continue shopping
              </button>
            </div>
          )}

          {/* Items */}
          {!loading && items.map((item) => {
            const id      = itemKey(item);
            const name    = itemName(item);
            const qty     = itemQty(item);
            const price   = itemPrice(item);
            const mrp     = itemMrp(item);
            const img     = itemImage(item) ?? getProductImage(name);
            const hasDisc = mrp > 0 && price > 0 && mrp > price;
            const isBusy  = updatingId === id || removingId === id;
            const isGone  = removingId === id;

            return (
              <div key={id} style={{ display: 'flex', gap: 12, padding: 12, border: '1px solid #f0f0f0', borderRadius: 12, background: '#fafafa', opacity: isGone ? 0.4 : 1, transition: 'opacity 0.2s' }}>
                {/* Image */}
                <div style={{ width: 60, height: 60, borderRadius: 8, overflow: 'hidden', flexShrink: 0, background: '#f0f0f0' }}>
                  <img src={img} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 5 }}>
                  <p style={{ fontSize: 13, fontWeight: 500, color: '#111', margin: 0, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{name}</p>

                  {/* Price row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#111' }}>{fp(price)}</span>
                    {hasDisc && (
                      <>
                        <span style={{ fontSize: 11, color: '#aaa', textDecoration: 'line-through' }}>{fp(mrp)}</span>
                        <span style={{ fontSize: 10, fontWeight: 700, color: '#16a34a', background: '#dcfce7', borderRadius: 4, padding: '1px 5px' }}>
                          {Math.round((1 - price / mrp) * 100)}% off
                        </span>
                      </>
                    )}
                  </div>

                  {/* Stepper + subtotal + delete */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {/* Stepper */}
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #e5e5e5', borderRadius: 7, overflow: 'hidden', height: 28 }}>
                      <button
                        onClick={() => qty <= 1 ? handleRemove(id) : handleUpdate(id, qty - 1)}
                        disabled={isBusy}
                        style={{ width: 26, height: '100%', border: 'none', background: '#f5f5f5', cursor: isBusy ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: isBusy ? 0.5 : 1 }}
                      >
                        <Minus size={10} strokeWidth={2.5} color="#444" />
                      </button>
                      <div style={{ minWidth: 28, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#111', background: '#fff', borderLeft: '1px solid #e5e5e5', borderRight: '1px solid #e5e5e5' }}>
                        {updatingId === id
                          ? <Loader2 size={10} color="#888" style={{ animation: 'spin 0.7s linear infinite' }} />
                          : qty}
                      </div>
                      <button
                        onClick={() => handleUpdate(id, qty + 1)}
                        disabled={isBusy}
                        style={{ width: 26, height: '100%', border: 'none', background: '#f5f5f5', cursor: isBusy ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: isBusy ? 0.5 : 1 }}
                      >
                        <Plus size={10} strokeWidth={2.5} color="#444" />
                      </button>
                    </div>

                    <span style={{ fontSize: 12, fontWeight: 600, color: '#555', flex: 1 }}>= {fp(price * qty)}</span>

                    <button
                      onClick={() => handleRemove(id)}
                      disabled={isBusy}
                      style={{ padding: 5, background: '#fff0f0', border: '1px solid #ffd6d6', borderRadius: 6, cursor: isBusy ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', opacity: isBusy ? 0.5 : 1 }}
                    >
                      {removingId === id
                        ? <Loader2 size={12} color="#ef4444" style={{ animation: 'spin 0.7s linear infinite' }} />
                        : <Trash2 size={12} color="#ef4444" />}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        {!loading && items.length > 0 && (
          <div style={{ padding: '14px 20px', borderTop: '1px solid #f0f0f0', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {/* Summary */}
            <div style={{ fontSize: 13, color: '#666' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span>{items.length} item{items.length !== 1 ? 's' : ''}</span>
                <span>{fp(total + savings)}</span>
              </div>
              {savings > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16a34a', marginBottom: 4 }}>
                  <span>Discount</span>
                  <span>− {fp(savings)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, fontWeight: 700, color: '#111', paddingTop: 8, borderTop: '1px solid #f0f0f0', marginTop: 4 }}>
                <span>Total</span>
                <span>{fp(total)}</span>
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={() => setCheckout(true)}
              style={{ width: '100%', padding: '12px 0', borderRadius: 10, border: 'none', background: '#111', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            >
              Proceed to Checkout <ArrowRight size={15} />
            </button>
            <button
              onClick={onClose}
              style={{ width: '100%', padding: '10px 0', borderRadius: 10, border: '1px solid #e5e5e5', background: '#fff', color: '#555', fontSize: 13, cursor: 'pointer' }}
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={checkout}
        onClose={() => setCheckout(false)}
        onSuccess={() => { setCheckout(false); setItems([]); onClose(); }}
        userId={userId}
        cartItems={items}
        cartTotal={total}
      />
    </>
  );
}