import { useState, useEffect } from 'react';
import api from './../service/api';
import {
    X, MapPin, CreditCard, Banknote, Smartphone, Check,
    ChevronRight, Plus, Loader2, AlertCircle, Package,
    CheckCircle2, ShoppingBag, ArrowLeft, Pencil, Trash2, Star,
    MoreVertical, Phone, User,
} from 'lucide-react';
import useStore from "./Usestore";
import { getGuestCart, clearGuestCart, syncGuestCartToServer } from "./Cartservice";

const THEMES = {
    amber: {
        accent: '#d97706', accentLight: '#fef3c7', accentHover: '#b45309',
        bg: '#fffbf0', panelBg: '#ffffff', cardBg: '#fffbf0',
        cardBorder: '#e8d5a3', pageText: '#1c1008', subtleText: '#78716c',
        tagBg: '#fef3c7', stepDone: '#16a34a', isDark: false,
    },
    silver: {
        accent: '#64748b', accentLight: '#f1f5f9', accentHover: '#475569',
        bg: '#f8fafc', panelBg: '#ffffff', cardBg: '#f8fafc',
        cardBorder: '#e2e8f0', pageText: '#0f172a', subtleText: '#94a3b8',
        tagBg: '#f1f5f9', stepDone: '#16a34a', isDark: false,
    },
    royal: {
        accent: '#7c3aed', accentLight: '#ede9fe', accentHover: '#6d28d9',
        bg: '#0f0a1e', panelBg: '#1a1030', cardBg: '#231844',
        cardBorder: '#3d2d6e', pageText: '#f5f3ff', subtleText: '#a78bfa',
        tagBg: '#2d1f55', stepDone: '#4ade80', isDark: true,
    },
};

const fp = (p) => '₹' + Number(p || 0).toLocaleString('en-IN');

const PAYMENT_METHODS = [
    { id: 'cod', label: 'Cash on Delivery', desc: 'Pay when you receive', Icon: Banknote },
    { id: 'online', label: 'Online Payment', desc: 'UPI / Cards / Net Banking', Icon: Smartphone },
    { id: 'card', label: 'Card Payment', desc: 'Debit / Credit card', Icon: CreditCard },
];

const ADDRESS_FOR_OPTIONS = ['shipping', 'billing'];
const ADDRESS_TYPE_OPTIONS = ['home', 'office', 'others'];

// ─── Address Form ─────────────────────────────────────────────────────────────
function AddressForm({ t, onSave, onCancel, saving, initial }) {
    const { businessId, userId } = useStore();
    const [form, setForm] = useState({
        name: '', phone_no: '', address_line_1: '', address_line_2: '',
        landmark: '', pin: '712410', city: '', state: '',
        address_for: 'shipping', address_type: 'home',
        is_default: false, business_id: businessId,
        ...initial,
    });

    const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

    const inputStyle = {
        width: '100%', padding: '10px 12px', borderRadius: 8, fontSize: 13,
        border: `1.5px solid ${t.cardBorder}`, background: t.cardBg,
        color: t.pageText, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
    };
    const labelStyle = {
        fontSize: 11, fontWeight: 600, color: t.subtleText, marginBottom: 4,
        display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em',
    };

    const isValid = form.name && form.phone_no && form.address_line_1 && form.state;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                    <label style={labelStyle}>Full Name *</label>
                    <input style={inputStyle} placeholder="John Doe" value={form.name} onChange={set('name')} />
                </div>
                <div>
                    <label style={labelStyle}>Phone *</label>
                    <input style={inputStyle} placeholder="9876543210" value={form.phone_no} onChange={set('phone_no')} maxLength={10} />
                </div>
            </div>
            <div>
                <label style={labelStyle}>Address Line 1 *</label>
                <input style={inputStyle} placeholder="House / Flat / Street" value={form.address_line_1} onChange={set('address_line_1')} />
            </div>
            <div>
                <label style={labelStyle}>Address Line 2</label>
                <input style={inputStyle} placeholder="Area / Colony" value={form.address_line_2} onChange={set('address_line_2')} />
            </div>
            <div>
                <label style={labelStyle}>Landmark</label>
                <input style={inputStyle} placeholder="Near school, temple…" value={form.landmark} onChange={set('landmark')} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                    <label style={labelStyle}>State *</label>
                    <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.state || ''} onChange={(e) => setForm(f => ({ ...f, state: e.target.value }))}>
                        <option value="">Select State</option>
                        <option value="Andhra Pradesh">Andhra Pradesh</option>
                        <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                        <option value="Assam">Assam</option>
                        <option value="Bihar">Bihar</option>
                        <option value="Chhattisgarh">Chhattisgarh</option>
                        <option value="Goa">Goa</option>
                        <option value="Gujarat">Gujarat</option>
                        <option value="Haryana">Haryana</option>
                        <option value="Himachal Pradesh">Himachal Pradesh</option>
                        <option value="Jharkhand">Jharkhand</option>
                        <option value="Karnataka">Karnataka</option>
                        <option value="Kerala">Kerala</option>
                        <option value="Madhya Pradesh">Madhya Pradesh</option>
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Manipur">Manipur</option>
                        <option value="Meghalaya">Meghalaya</option>
                        <option value="Mizoram">Mizoram</option>
                        <option value="Nagaland">Nagaland</option>
                        <option value="Odisha">Odisha</option>
                        <option value="Punjab">Punjab</option>
                        <option value="Rajasthan">Rajasthan</option>
                        <option value="Sikkim">Sikkim</option>
                        <option value="Tamil Nadu">Tamil Nadu</option>
                        <option value="Telangana">Telangana</option>
                        <option value="Tripura">Tripura</option>
                        <option value="Uttar Pradesh">Uttar Pradesh</option>
                        <option value="Uttarakhand">Uttarakhand</option>
                        <option value="West Bengal">West Bengal</option>
                    </select>
                </div>
                <div>
                    <label style={labelStyle}>City</label>
                    <input style={inputStyle} placeholder="Enter city" value={form.city || ''} onChange={(e) => setForm(f => ({ ...f, city: e.target.value }))} />
                </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                    <label style={labelStyle}>PIN Code</label>
                    <input style={inputStyle} placeholder="700001" value={form.pin} onChange={set('pin')} maxLength={6} />
                </div>
                <div>
                    <label style={labelStyle}>Address For</label>
                    <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.address_for} onChange={set('address_for')}>
                        {ADDRESS_FOR_OPTIONS.map(o => <option key={o} value={o}>{o.charAt(0).toUpperCase() + o.slice(1)}</option>)}
                    </select>
                </div>
            </div>
            <div>
                <label style={labelStyle}>Address Type</label>
                <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.address_type} onChange={set('address_type')}>
                    {ADDRESS_TYPE_OPTIONS.map(o => <option key={o} value={o}>{o.charAt(0).toUpperCase() + o.slice(1)}</option>)}
                </select>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: t.pageText }}>
                <input type="checkbox" checked={form.is_default} onChange={e => setForm(f => ({ ...f, is_default: e.target.checked }))} style={{ accentColor: t.accent, width: 15, height: 15 }} />
                Set as default address
            </label>
            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                <button onClick={onCancel} style={{ flex: 1, padding: '10px 0', borderRadius: 8, border: `1.5px solid ${t.cardBorder}`, background: 'transparent', color: t.pageText, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                    Cancel
                </button>
                <button onClick={() => onSave(form)} disabled={saving || !isValid} style={{ flex: 2, padding: '10px 0', borderRadius: 8, border: 'none', background: t.accent, color: t.isDark ? '#000' : '#fff', fontSize: 13, fontWeight: 700, cursor: saving || !isValid ? 'not-allowed' : 'pointer', opacity: saving || !isValid ? 0.6 : 1 }}>
                    {saving ? 'Saving…' : initial ? 'Update Address' : 'Save Address'}
                </button>
            </div>
        </div>
    );
}

// ─── Guest Details Form ───────────────────────────────────────────────────────
function GuestDetailsForm({ t, form, setForm }) {
    const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

    const inputStyle = {
        width: '100%', padding: '10px 12px', borderRadius: 8, fontSize: 13,
        border: `1.5px solid ${t.cardBorder}`, background: t.cardBg,
        color: t.pageText, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
    };
    const labelStyle = {
        fontSize: 11, fontWeight: 600, color: t.subtleText, marginBottom: 4,
        display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em',
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ background: t.accentLight, padding: 12, borderRadius: 10, border: `1px solid ${t.cardBorder}`, fontSize: 12, color: t.pageText }}>
                💡 <strong>Guest Checkout:</strong> Please enter your phone number and delivery address to complete your order.
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                    <label style={labelStyle}>Phone Number *</label>
                    <input style={inputStyle} placeholder="10-digit mobile" value={form.phone_no} onChange={set('phone_no')} maxLength={10} type="tel" />
                </div>
                <div>
                    <label style={labelStyle}>Full Name *</label>
                    <input style={inputStyle} placeholder="Your name" value={form.name} onChange={set('name')} />
                </div>
            </div>
            <div>
                <label style={labelStyle}>Address Line 1 *</label>
                <input style={inputStyle} placeholder="House / Flat / Street address" value={form.address_line_1} onChange={set('address_line_1')} />
            </div>
            <div>
                <label style={labelStyle}>Address Line 2</label>
                <input style={inputStyle} placeholder="Area / Landmark" value={form.address_line_2} onChange={set('address_line_2')} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                    <label style={labelStyle}>State *</label>
                    <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.state || ''} onChange={(e) => setForm(f => ({ ...f, state: e.target.value }))}>
                        <option value="">Select State</option>
                        <option value="West Bengal">West Bengal</option>
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Karnataka">Karnataka</option>
                        <option value="Tamil Nadu">Tamil Nadu</option>
                        <option value="Gujarat">Gujarat</option>
                        <option value="Uttar Pradesh">Uttar Pradesh</option>
                        <option value="Telangana">Telangana</option>
                        <option value="Andhra Pradesh">Andhra Pradesh</option>
                        <option value="Bihar">Bihar</option>
                        <option value="Rajasthan">Rajasthan</option>
                        <option value="Odisha">Odisha</option>
                        <option value="Kerala">Kerala</option>
                        <option value="Assam">Assam</option>
                        <option value="Punjab">Punjab</option>
                        <option value="Haryana">Haryana</option>
                        <option value="Jharkhand">Jharkhand</option>
                        <option value="Chhattisgarh">Chhattisgarh</option>
                    </select>
                </div>
                <div>
                    <label style={labelStyle}>City *</label>
                    <input style={inputStyle} placeholder="City name" value={form.city} onChange={set('city')} />
                </div>
            </div>
            <div>
                <label style={labelStyle}>PIN Code *</label>
                <input style={inputStyle} placeholder="6-digit PIN code" value={form.pin} onChange={set('pin')} maxLength={6} />
            </div>
        </div>
    );
}

// ─── Address Card ─────────────────────────────────────────────────────────────
function AddressCard({ t, addr, selected, onSelect, onEdit, onDelete, onSetDefault, actionLoading }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const addrLabel = (a) => [a.address_line_1, a.address_line_2, a.landmark, a.city, a.state, a.pin].filter(Boolean).join(', ');
    const isSelected = selected?.id === addr.id;

    return (
        <div style={{ padding: '12px 14px', borderRadius: 10, border: `2px solid ${isSelected ? t.accent : t.cardBorder}`, background: isSelected ? t.accentLight : t.cardBg, transition: 'all 0.2s', position: 'relative' }}>
            <div onClick={() => onSelect(addr)} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, cursor: 'pointer' }}>
                <div style={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${isSelected ? t.accent : t.cardBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                    {isSelected && <div style={{ width: 8, height: 8, borderRadius: '50%', background: t.accent }} />}
                </div>
                <div style={{ flex: 1, minWidth: 0, paddingRight: 28 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                        {addr.name && <span style={{ fontSize: 13, fontWeight: 700, color: t.pageText }}>{addr.name}</span>}
                        {addr.phone_no && <span style={{ fontSize: 12, color: t.subtleText }}>· {addr.phone_no}</span>}
                        <span style={{ fontSize: 10, fontWeight: 700, color: t.accent, background: t.tagBg, borderRadius: 4, padding: '1px 6px', textTransform: 'uppercase' }}>{addr.address_type ?? 'home'}</span>
                        {addr.is_default && <span style={{ fontSize: 10, fontWeight: 700, color: '#16a34a', background: '#dcfce7', borderRadius: 4, padding: '1px 6px' }}>Default</span>}
                    </div>
                    <p style={{ fontSize: 12, color: t.subtleText, margin: '3px 0 0', lineHeight: 1.5 }}>{addrLabel(addr)}</p>
                </div>
            </div>
            <div style={{ position: 'absolute', top: 10, right: 10 }}>
                <button onClick={(e) => { e.stopPropagation(); setMenuOpen(o => !o); }} style={{ width: 28, height: 28, borderRadius: 6, border: `1px solid ${t.cardBorder}`, background: t.panelBg ?? t.cardBg, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: t.subtleText }}>
                    <MoreVertical size={14} />
                </button>
                {menuOpen && (
                    <>
                        <div onClick={() => setMenuOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 10 }} />
                        <div style={{ position: 'absolute', right: 0, top: 32, zIndex: 20, background: t.panelBg ?? '#fff', borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.15)', border: `1px solid ${t.cardBorder}`, minWidth: 160, overflow: 'hidden' }}>
                            <MenuAction icon={<Pencil size={13} />} label="Edit" color={t.pageText} onClick={() => { setMenuOpen(false); onEdit(addr); }} />
                            {!addr.is_default && <MenuAction icon={<Star size={13} />} label="Set as Default" color={t.accent} loading={actionLoading === `default-${addr.id}`} onClick={() => { setMenuOpen(false); onSetDefault(addr); }} />}
                            <MenuAction icon={<Trash2 size={13} />} label="Delete" color="#ef4444" loading={actionLoading === `delete-${addr.id}`} onClick={() => { setMenuOpen(false); onDelete(addr); }} />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

function MenuAction({ icon, label, color, onClick, loading }) {
    return (
        <button onClick={onClick} disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '10px 14px', border: 'none', background: 'transparent', cursor: loading ? 'not-allowed' : 'pointer', fontSize: 13, fontWeight: 600, color, textAlign: 'left', opacity: loading ? 0.6 : 1 }}>
            {loading ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> : icon}
            {label}
        </button>
    );
}

function Steps({ step, t }) {
    const steps = ['Details', 'Payment', 'Review'];
    return (
        <div style={{ display: 'flex', alignItems: 'center', padding: '0 4px' }}>
            {steps.map((s, i) => {
                const done = i < step, active = i === step;
                return (
                    <div key={s} style={{ display: 'flex', alignItems: 'center', flex: i < steps.length - 1 ? 1 : 'none' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                            <div style={{ width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, background: done ? t.stepDone : active ? t.accent : t.cardBorder, color: done || active ? (t.isDark ? '#000' : '#fff') : t.subtleText, transition: 'all 0.3s' }}>
                                {done ? <Check size={13} /> : i + 1}
                            </div>
                            <span style={{ fontSize: 10, fontWeight: 600, color: active ? t.accent : done ? t.stepDone : t.subtleText, whiteSpace: 'nowrap' }}>{s}</span>
                        </div>
                        {i < steps.length - 1 && <div style={{ flex: 1, height: 2, background: done ? t.stepDone : t.cardBorder, margin: '0 6px', marginBottom: 16, transition: 'background 0.3s' }} />}
                    </div>
                );
            })}
        </div>
    );
}

function DeleteConfirm({ t, addr, onConfirm, onCancel, loading }) {
    return (
        <div style={{ background: t.cardBg, borderRadius: 12, padding: 16, border: '1.5px solid #fecaca', marginTop: 4 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#991b1b', margin: '0 0 6px' }}>Delete this address?</p>
            <p style={{ fontSize: 12, color: t.subtleText, margin: '0 0 12px', lineHeight: 1.5 }}>{[addr.address_line_1, addr.city, addr.pin].filter(Boolean).join(', ')}</p>
            <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={onCancel} style={{ flex: 1, padding: '9px 0', borderRadius: 8, border: `1.5px solid ${t.cardBorder}`, background: 'transparent', color: t.pageText, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                <button onClick={onConfirm} disabled={loading} style={{ flex: 1, padding: '9px 0', borderRadius: 8, border: 'none', background: '#ef4444', color: '#fff', fontSize: 13, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                    {loading ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Trash2 size={14} />}
                    Delete
                </button>
            </div>
        </div>
    );
}

// ─── Main CheckoutModal ───────────────────────────────────────────────────────
export default function CheckoutModal({ isOpen, onClose, onSuccess, theme = 'amber' }) {
    const t = THEMES[theme];
    const { businessId, userId, customerId, clientId, token } = useStore();
    const setCustomer = useStore((s) => s.setCustomer);

    const activeCustomerId = customerId || userId;
    const isLoggedIn = !!token && !!activeCustomerId;

    const [step, setStep] = useState(0);
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [formMode, setFormMode] = useState(null);
    const [savingAddr, setSavingAddr] = useState(false);
    const [loadingAddr, setLoadingAddr] = useState(false);
    const [actionLoading, setActionLoading] = useState('');
    const [confirmDelete, setConfirmDelete] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [placing, setPlacing] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [orderId, setOrderId] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [cartTotal, setCartTotal] = useState(0);

    // Guest checkout details
    const [guestForm, setGuestForm] = useState({
        phone_no: '',
        name: '',
        address_line_1: '',
        address_line_2: '',
        city: '',
        state: 'West Bengal',
        pin: '700001',
    });

    useEffect(() => {
        if (!isOpen) { resetState(); return; }
        if (isLoggedIn) {
            loadAddresses();
        }
        loadCart();
    }, [isOpen, isLoggedIn]);

    const resetState = () => {
        setStep(0); setAddresses([]); setSelectedAddress(null);
        setFormMode(null); setPaymentMethod('cod');
        setPlacing(false); setError(''); setSuccess(false); setOrderId(null);
        setConfirmDelete(null); setActionLoading('');
        setGuestForm({ phone_no: '', name: '', address_line_1: '', address_line_2: '', city: '', state: 'West Bengal', pin: '700001' });
    };

    const loadAddresses = async () => {
        if (!activeCustomerId) return;
        setLoadingAddr(true);
        try {
            const res = await api.get(`/customer/${activeCustomerId}/address`);
            const list =
                res?.data?.data?.Address ??
                res?.data?.Address ??
                res?.data?.data ??
                res?.data ??
                [];
            const arr = Array.isArray(list) ? list : [];
            setAddresses(arr);
            const def = arr.find(a => a.is_default) ?? arr[0] ?? null;
            setSelectedAddress(def);
            if (arr.length === 0) setFormMode('add');
        } catch {
            setFormMode('add');
        } finally {
            setLoadingAddr(false);
        }
    };

    const loadCart = async () => {
        if (isLoggedIn) {
            try {
                const res = await api.get(`/cart/${activeCustomerId}`);
                const data = res?.data?.data || res?.data || {};
                const items = data?.items || data?.cart_items || [];
                setCartItems(Array.isArray(items) ? items : []);
                setCartTotal(data?.total || data?.cart_total || 0);
            } catch { /* non-blocking */ }
        } else {
            const guestItems = getGuestCart();
            setCartItems(guestItems);
            const total = guestItems.reduce((s, i) => s + (parseFloat(i.sell_rate || i.mrp || 0) * parseFloat(i.qty || 1)), 0);
            setCartTotal(total);
        }
    };

    const handleAddAddress = async (form) => {
        setSavingAddr(true); setError('');
        try {
            const res = await api.post(`/customer/${activeCustomerId}/address`, form);
            const payload = res?.data?.data || res?.data;
            const saved = payload?.Address ?? payload;

            const returnedCustomerId = saved?.customer_id ?? payload?.customer_id ?? null;
            if (returnedCustomerId && String(returnedCustomerId) !== String(activeCustomerId)) {
                setCustomer({ customer_id: returnedCustomerId });
            }

            setAddresses(prev => [...prev, saved]);
            setSelectedAddress(saved);
            setFormMode(null);
        } catch (e) {
            setError(e?.response?.data?.message || 'Failed to save address');
        } finally {
            setSavingAddr(false);
        }
    };

    const handleUpdateAddress = async (form) => {
        setSavingAddr(true); setError('');
        try {
            const res = await api.put(`/customer/${activeCustomerId}/address/${form.id}`, form);
            const updated = res?.data?.data || res?.data;
            setAddresses(prev => prev.map(a => a.id === updated.id ? updated : a));
            if (selectedAddress?.id === updated.id) setSelectedAddress(updated);
            setFormMode(null);
        } catch (e) {
            setError(e?.response?.data?.message || 'Failed to update address');
        } finally {
            setSavingAddr(false);
        }
    };

    const handleDeleteAddress = async (addr) => {
        setActionLoading(`delete-${addr.id}`); setError('');
        try {
            await api.delete(`/customer/${activeCustomerId}/address/${addr.id}`);
            const remaining = addresses.filter(a => a.id !== addr.id);
            setAddresses(remaining);
            if (selectedAddress?.id === addr.id) {
                setSelectedAddress(remaining.find(a => a.is_default) ?? remaining[0] ?? null);
            }
            setConfirmDelete(null);
            if (remaining.length === 0) setFormMode('add');
        } catch (e) {
            setError(e?.response?.data?.message || 'Failed to delete address');
        } finally {
            setActionLoading('');
        }
    };

    const handleSetDefault = async (addr) => {
        setActionLoading(`default-${addr.id}`); setError('');
        try {
            await api.put(`/customer/${activeCustomerId}/address/default/${addr.id}`);
            setAddresses(prev => prev.map(a => ({ ...a, is_default: a.id === addr.id })));
            setSelectedAddress({ ...addr, is_default: true });
        } catch (e) {
            setError(e?.response?.data?.message || 'Failed to set default');
        } finally {
            setActionLoading('');
        }
    };

    const handlePlaceOrder = async () => {
        setPlacing(true); setError('');
        try {
            if (isLoggedIn) {
                if (!selectedAddress) {
                    setError('Please select or add a delivery address.');
                    setPlacing(false);
                    return;
                }
                await syncGuestCartToServer();

                const res = await api.post('/order/checkout', {
                    customer_id: activeCustomerId,
                    customer_address_id: selectedAddress?.id,
                    payment_method: paymentMethod,
                });
                const data = res?.data?.data || res?.data;
                setOrderId(data?.id || data?.order_id || '—');
                setSuccess(true);
                onSuccess?.(data);
            } else {
                // Guest checkout flow
                let guestCustId = null;
                try {
                    const custRes = await api.post(`/client/${clientId}/business/${businessId}/customer`, {
                        name: guestForm.name,
                        phone_no: guestForm.phone_no,
                        address_line_1: guestForm.address_line_1,
                        city: guestForm.city || 'City',
                        state: guestForm.state || 'State',
                        pin: guestForm.pin || '700001',
                    });
                    guestCustId = custRes?.data?.data?.customer_id || custRes?.data?.customer_id;
                } catch (custErr) {
                    // Try looking up customer by phone if creation failed
                    try {
                        const searchRes = await api.get(`/client/${clientId}/business/${businessId}/customer?search=${guestForm.phone_no}`);
                        const found = searchRes?.data?.data?.allCustomers?.data || [];
                        if (found.length > 0) guestCustId = found[0].id;
                        else throw custErr;
                    } catch {
                        throw new Error(custErr?.response?.data?.message || custErr?.message || 'Failed to register guest details.');
                    }
                }

                if (!guestCustId) throw new Error('Customer creation failed.');

                // Add address for guest customer
                const addrRes = await api.post(`/customer/${guestCustId}/address`, {
                    name: guestForm.name,
                    phone_no: guestForm.phone_no,
                    address_line_1: guestForm.address_line_1,
                    address_line_2: guestForm.address_line_2 || '',
                    city: guestForm.city || '',
                    state: guestForm.state || '',
                    pin: guestForm.pin || '700001',
                    address_for: 'shipping',
                    address_type: 'home',
                    is_default: true,
                    business_id: businessId,
                });

                const guestAddrObj = addrRes?.data?.data?.Address ?? addrRes?.data?.data ?? addrRes?.data;
                const guestAddrId = guestAddrObj?.id;

                if (!guestAddrId) throw new Error('Address creation failed.');

                // Sync guest items to backend cart for guest customer
                const guestItems = getGuestCart();
                for (const item of guestItems) {
                    const itemId = item.item_id || item.id;
                    const qty = item.qty || item.quantity || 1;
                    await api.post('/cart/add', {
                        customer_id: guestCustId,
                        user_id: guestCustId,
                        business_id: businessId,
                        client_id: clientId,
                        item_id: itemId,
                        qty,
                    });
                }

                // Place order
                const checkoutRes = await api.post('/order/checkout', {
                    customer_id: guestCustId,
                    customer_address_id: guestAddrId,
                    payment_method: paymentMethod,
                });

                const data = checkoutRes?.data?.data || checkoutRes?.data;
                clearGuestCart();
                useStore.getState().bumpCart?.();

                setOrderId(data?.id || data?.order_id || '—');
                setSuccess(true);
                onSuccess?.(data);
            }
        } catch (e) {
            setError(e?.response?.data?.message || e?.message || 'Checkout failed. Please try again.');
        } finally {
            setPlacing(false);
        }
    };

    if (!isOpen) return null;

    const addrLabel = (a) => [a.address_line_1, a.address_line_2, a.landmark, a.city, a.state, a.pin].filter(Boolean).join(', ');

    if (success) return (
        <>
            <Backdrop onClick={onClose} />
            <Modal t={t}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32, textAlign: 'center', gap: 16 }}>
                    <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <CheckCircle2 size={36} style={{ color: '#16a34a' }} />
                    </div>
                    <div>
                        <h2 style={{ fontSize: 22, fontWeight: 800, color: t.pageText, margin: '0 0 6px' }}>Order Placed!</h2>
                        <p style={{ fontSize: 14, color: t.subtleText, margin: 0 }}>Your jewelry is on its way ✨</p>
                    </div>
                    {orderId && (
                        <div style={{ background: t.accentLight, borderRadius: 10, padding: '12px 20px', border: `1px solid ${t.cardBorder}` }}>
                            <p style={{ fontSize: 11, color: t.subtleText, margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Order ID</p>
                            <p style={{ fontSize: 16, fontWeight: 800, color: t.accent, margin: 0 }}>#{orderId}</p>
                        </div>
                    )}
                    <div style={{ background: t.cardBg, borderRadius: 10, padding: '12px 20px', border: `1px solid ${t.cardBorder}`, width: '100%', textAlign: 'left' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                            <span style={{ color: t.subtleText }}>Items</span>
                            <span style={{ color: t.pageText, fontWeight: 600 }}>{cartItems.length}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, fontWeight: 700, marginTop: 6 }}>
                            <span style={{ color: t.subtleText }}>Total Paid</span>
                            <span style={{ color: t.accent }}>{fp(cartTotal)}</span>
                        </div>
                    </div>
                    <button onClick={onClose} style={{ width: '100%', padding: '12px 0', borderRadius: 10, border: 'none', background: t.accent, color: t.isDark ? '#000' : '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                        Continue Shopping
                    </button>
                </div>
            </Modal>
        </>
    );

    const isEditMode = formMode && formMode !== 'add';

    return (
        <>
            <Backdrop onClick={onClose} />
            <Modal t={t}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 20px 14px', borderBottom: `1px solid ${t.cardBorder}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {(step > 0 || formMode) && (
                            <button onClick={() => { if (formMode) { setFormMode(null); setError(''); } else setStep(s => s - 1); }} style={{ padding: 4, background: 'none', border: 'none', cursor: 'pointer', color: t.subtleText, display: 'flex' }}>
                                <ArrowLeft size={18} />
                            </button>
                        )}
                        <ShoppingBag size={18} style={{ color: t.accent }} />
                        <span style={{ fontSize: 16, fontWeight: 700, color: t.pageText }}>
                            {formMode === 'add' ? 'New Address' : isEditMode ? 'Edit Address' : 'Checkout'}
                        </span>
                    </div>
                    <button onClick={onClose} style={{ padding: 6, borderRadius: '50%', background: t.tagBg, border: 'none', cursor: 'pointer', display: 'flex' }}>
                        <X size={16} style={{ color: t.subtleText }} />
                    </button>
                </div>

                {!formMode && <div style={{ padding: '14px 24px 10px' }}><Steps step={step} t={t} /></div>}

                {error && (
                    <div style={{ margin: '8px 16px 0', display: 'flex', alignItems: 'center', gap: 8, background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 12px', fontSize: 12, color: '#991b1b' }}>
                        <AlertCircle size={13} style={{ color: '#ef4444', flexShrink: 0 }} />
                        {error}
                        <button onClick={() => setError('')} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#991b1b' }}><X size={12} /></button>
                    </div>
                )}

                <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px' }}>
                    {formMode && (
                        <AddressForm t={t} initial={isEditMode ? formMode : undefined} onSave={isEditMode ? handleUpdateAddress : handleAddAddress} onCancel={() => { setFormMode(null); setError(''); }} saving={savingAddr} />
                    )}

                    {!formMode && step === 0 && (
                        isLoggedIn ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                <SectionTitle t={t} icon={<MapPin size={14} />} title="Delivery Address" />
                                {loadingAddr && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 16, color: t.subtleText, fontSize: 13 }}>
                                        <Loader2 size={16} style={{ animation: 'spin 1s linear infinite', color: t.accent }} /> Loading addresses…
                                    </div>
                                )}
                                {!loadingAddr && addresses.map(addr => (
                                    <div key={addr.id}>
                                        <AddressCard t={t} addr={addr} selected={selectedAddress} onSelect={setSelectedAddress} onEdit={(a) => { setFormMode(a); setError(''); setConfirmDelete(null); }} onDelete={(a) => setConfirmDelete(confirmDelete?.id === a.id ? null : a)} onSetDefault={handleSetDefault} actionLoading={actionLoading} />
                                        {confirmDelete?.id === addr.id && (
                                            <DeleteConfirm t={t} addr={addr} onConfirm={() => handleDeleteAddress(addr)} onCancel={() => setConfirmDelete(null)} loading={actionLoading === `delete-${addr.id}`} />
                                        )}
                                    </div>
                                ))}
                                {!loadingAddr && (
                                    <button onClick={() => { setFormMode('add'); setError(''); setConfirmDelete(null); }} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 14px', borderRadius: 10, border: `2px dashed ${t.cardBorder}`, background: 'transparent', color: t.accent, fontSize: 13, fontWeight: 600, cursor: 'pointer', width: '100%' }}>
                                        <Plus size={14} /> Add New Address
                                    </button>
                                )}
                            </div>
                        ) : (
                            <GuestDetailsForm t={t} form={guestForm} setForm={setGuestForm} />
                        )
                    )}

                    {!formMode && step === 1 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            <SectionTitle t={t} icon={<CreditCard size={14} />} title="Payment Method" />
                            {PAYMENT_METHODS.map(({ id, label, desc, Icon }) => (
                                <div key={id} onClick={() => setPaymentMethod(id)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderRadius: 10, cursor: 'pointer', border: `2px solid ${paymentMethod === id ? t.accent : t.cardBorder}`, background: paymentMethod === id ? t.accentLight : t.cardBg, transition: 'all 0.2s' }}>
                                    <div style={{ width: 38, height: 38, borderRadius: 10, background: paymentMethod === id ? t.accent : t.tagBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <Icon size={18} style={{ color: paymentMethod === id ? (t.isDark ? '#000' : '#fff') : t.subtleText }} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontSize: 13, fontWeight: 700, color: t.pageText, margin: 0 }}>{label}</p>
                                        <p style={{ fontSize: 11, color: t.subtleText, margin: 0 }}>{desc}</p>
                                    </div>
                                    <div style={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${paymentMethod === id ? t.accent : t.cardBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {paymentMethod === id && <div style={{ width: 8, height: 8, borderRadius: '50%', background: t.accent }} />}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {!formMode && step === 2 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            <SectionTitle t={t} icon={<Package size={14} />} title="Order Summary" />
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                {cartItems.map((item, idx) => {
                                    const name = item?.item?.item_name ?? item?.item_name ?? 'Product';
                                    const qty = parseFloat(item?.qty ?? 1);
                                    const price = parseFloat(item?.sell_rate ?? item?.mrp ?? 0);
                                    return (
                                        <div key={item.id ?? idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', borderRadius: 8, background: t.cardBg, border: `1px solid ${t.cardBorder}` }}>
                                            <div>
                                                <p style={{ fontSize: 13, fontWeight: 600, color: t.pageText, margin: 0 }}>{name}</p>
                                                <p style={{ fontSize: 11, color: t.subtleText, margin: 0 }}>Qty: {qty}</p>
                                            </div>
                                            <span style={{ fontSize: 13, fontWeight: 700, color: t.accent }}>{fp(price * qty)}</span>
                                        </div>
                                    );
                                })}
                                {cartItems.length === 0 && <p style={{ fontSize: 13, color: t.subtleText, textAlign: 'center', padding: 16 }}>No items in cart</p>}
                            </div>
                            {(selectedAddress || !isLoggedIn) && (
                                <div style={{ padding: '12px 14px', borderRadius: 10, background: t.cardBg, border: `1px solid ${t.cardBorder}` }}>
                                    <p style={{ fontSize: 11, fontWeight: 700, color: t.subtleText, margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Deliver to</p>
                                    {isLoggedIn ? (
                                        <>
                                            {selectedAddress?.name && (
                                                <p style={{ fontSize: 13, fontWeight: 700, color: t.pageText, margin: '0 0 2px' }}>
                                                    {selectedAddress.name}
                                                    {selectedAddress.phone_no && <span style={{ fontWeight: 400, color: t.subtleText }}> · {selectedAddress.phone_no}</span>}
                                                </p>
                                            )}
                                            <p style={{ fontSize: 12, color: t.subtleText, margin: 0 }}>{addrLabel(selectedAddress || {})}</p>
                                        </>
                                    ) : (
                                        <>
                                            <p style={{ fontSize: 13, fontWeight: 700, color: t.pageText, margin: '0 0 2px' }}>
                                                {guestForm.name} <span style={{ fontWeight: 400, color: t.subtleText }}> · {guestForm.phone_no}</span>
                                            </p>
                                            <p style={{ fontSize: 12, color: t.subtleText, margin: 0 }}>
                                                {[guestForm.address_line_1, guestForm.address_line_2, guestForm.city, guestForm.state, guestForm.pin].filter(Boolean).join(', ')}
                                            </p>
                                        </>
                                    )}
                                </div>
                            )}
                            <div style={{ padding: '12px 14px', borderRadius: 10, background: t.cardBg, border: `1px solid ${t.cardBorder}` }}>
                                <p style={{ fontSize: 11, fontWeight: 700, color: t.subtleText, margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Payment</p>
                                <p style={{ fontSize: 13, fontWeight: 700, color: t.pageText, margin: 0 }}>{PAYMENT_METHODS.find(m => m.id === paymentMethod)?.label}</p>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', borderRadius: 10, background: t.accentLight, border: `1.5px solid ${t.accent}` }}>
                                <span style={{ fontSize: 14, fontWeight: 700, color: t.pageText }}>Total Amount</span>
                                <span style={{ fontSize: 18, fontWeight: 800, color: t.accent }}>{fp(cartTotal)}</span>
                            </div>
                        </div>
                    )}
                </div>

                {!formMode && (
                    <div style={{ padding: '12px 16px', borderTop: `1px solid ${t.cardBorder}` }}>
                        {step < 2 ? (
                            <button
                                onClick={() => {
                                    if (step === 0) {
                                        if (isLoggedIn && !selectedAddress) {
                                            setError('Please select or add a delivery address.');
                                            return;
                                        }
                                        if (!isLoggedIn) {
                                            if (!guestForm.phone_no || guestForm.phone_no.length < 10) {
                                                setError('Please enter a valid 10-digit phone number.');
                                                return;
                                            }
                                            if (!guestForm.name.trim()) {
                                                setError('Please enter your full name.');
                                                return;
                                            }
                                            if (!guestForm.address_line_1.trim()) {
                                                setError('Please enter address line 1.');
                                                return;
                                            }
                                            if (!guestForm.state || !guestForm.pin) {
                                                setError('Please enter state and PIN code.');
                                                return;
                                            }
                                        }
                                    }
                                    setError('');
                                    setStep(s => s + 1);
                                }}
                                style={{ width: '100%', padding: '13px 0', borderRadius: 10, border: 'none', background: t.accent, color: t.isDark ? '#000' : '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                            >
                                Continue <ChevronRight size={16} />
                            </button>
                        ) : (
                            <button onClick={handlePlaceOrder} disabled={placing} style={{ width: '100%', padding: '13px 0', borderRadius: 10, border: 'none', background: placing ? t.cardBorder : t.accent, color: t.isDark ? '#000' : '#fff', fontSize: 14, fontWeight: 700, cursor: placing ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'background 0.2s' }}>
                                {placing ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Placing Order…</> : <>Place Order · {fp(cartTotal)}</>}
                            </button>
                        )}
                    </div>
                )}
            </Modal>

            <style>{`@keyframes spin{to{transform:rotate(360deg)}} @keyframes slideUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}`}</style>
        </>
    );
}

function Backdrop({ onClick }) {
    return <div onClick={onClick} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(5px)', zIndex: 60 }} />;
}

function Modal({ t, children }) {
    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 61, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', pointerEvents: 'none' }}>
            <div style={{ width: '100%', maxWidth: 480, maxHeight: '90vh', background: t.panelBg, borderRadius: 18, boxShadow: '0 24px 64px rgba(0,0,0,0.28)', display: 'flex', flexDirection: 'column', pointerEvents: 'all', animation: 'slideUp 0.3s cubic-bezier(0.32,0.72,0,1)', overflow: 'hidden' }}>
                {children}
            </div>
        </div>
    );
}

function SectionTitle({ t, icon, title }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
            <span style={{ color: t.accent }}>{icon}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: t.pageText, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{title}</span>
        </div>
    );
}