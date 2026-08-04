import { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff, X, Check, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import useStore from './Usestore';

const THEMES = {
  amber: {
    primary: '#b45309', btnText: '#ffffff', accent: '#f59e0b',
    pageText: '#1c1917', subtleText: '#78350f',
    cardBg: '#ffffff', cardBorder: '#fde68a', tagBg: '#fef3c7',
    detailPanelBg: '#fffbeb', detailSpecBg: '#fef3c7', isDark: false,
  },
  silver: {
    primary: '#e2e8f0', btnText: '#0f172a', accent: '#94a3b8',
    pageText: '#f1f5f9', subtleText: '#94a3b8',
    cardBg: '#1e293b', cardBorder: '#334155', tagBg: '#334155',
    detailPanelBg: '#111827', detailSpecBg: '#1e293b', isDark: true,
  },
  royal: {
    primary: '#ca8a04', btnText: '#0d0500', accent: '#fbbf24',
    pageText: '#fef3c7', subtleText: '#ca8a04',
    cardBg: '#1c0a00', cardBorder: '#3b1407', tagBg: '#3b1407',
    detailPanelBg: '#0d0500', detailSpecBg: '#1c0a00', isDark: true,
  },
};

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

function authHeaders(clientId, businessId, token) {
  return {
    'Content-Type': 'application/json',
    'X-Client-ID': String(clientId),
    'X-Business-ID': String(businessId),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

import { syncGuestCartToServer } from './Cartservice';

async function apiRegister({ name, email, password, clientId, businessId }) {
  try {
    const res = await fetch(`${API_BASE}/register`, {
      method: 'POST',
      headers: authHeaders(clientId, businessId, null),
      body: JSON.stringify({
        name, email, password,
        password_confirmation: password,
        role: 'customer',
      }),
    });
    const data = await res.json();
    if (!res.ok) return { success: false, error: data.message || data.errors?.email?.[0] || 'Registration failed' };
    return { success: true, data };
  } catch {
    return { success: false, error: 'Network error. Please try again.' };
  }
}

async function apiLogin({ email, password, clientId, businessId }) {
  try {
    const res = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: authHeaders(clientId, businessId, null),
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) return { success: false, error: data.message || 'Invalid credentials' };
    return { success: true, data };
  } catch {
    return { success: false, error: 'Network error. Please try again.' };
  }
}

// ── Handles all common API response shapes ────────────────────────────────────
// Login may return:  { token, user: { id } }  or  { data: { token, user: { id } } }
// Register may return the same, or with customer_id instead of id
// AFTER — never use userObj.id (that's the auth user ID, not customer ID)
function extractAuth(responseData) {
  const root = responseData?.data ?? responseData;
  const token = root?.token ?? root?.access_token ?? '';
  const userObj = root?.user ?? root?.customer ?? root;
  // Only accept an explicit customer_id field — never fall back to .id
  const id = userObj?.customer_id ?? root?.customer_id ?? null;
  const name = userObj?.name ?? userObj?.customer_name ?? '';
  return { token, id, name };
}

export default function AuthModal({
  theme = 'amber',
  isOpen,
  onClose,
  onBack,
  defaultMode = 'login',
}) {
  const t = THEMES[theme] || THEMES.amber;

  const clientId = useStore((s) => s.clientId);
  const businessId = useStore((s) => s.businessId);
  const setCustomer = useStore((s) => s.setCustomer);
  const setToken = useStore((s) => s.setToken);

  const [mode, setMode] = useState(defaultMode);
  const [status, setStatus] = useState('idle');
  const [apiError, setApiError] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState({});

  const EMPTY_REGISTER = { name: '', email: '', password: '' };
  const EMPTY_LOGIN = { email: '', password: '' };
  const [form, setForm] = useState(mode === 'register' ? EMPTY_REGISTER : EMPTY_LOGIN);

  const switchMode = (m) => {
    setMode(m);
    setForm(m === 'register' ? EMPTY_REGISTER : EMPTY_LOGIN);
    setErrors({});
    setStatus('idle');
    setApiError('');
  };

  const handle = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (errors[name]) setErrors(er => ({ ...er, [name]: '' }));
  };

  const validate = () => {
    const e = {};
    if (mode === 'register' && !form.name.trim()) e.name = 'Full name is required';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email is required';
    if (!form.password || form.password.length < 8) e.password = 'Password must be at least 8 characters';
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setStatus('loading');
    setApiError('');

    const result = mode === 'register'
      ? await apiRegister({ ...form, clientId, businessId })
      : await apiLogin({ ...form, clientId, businessId });

    if (result.success) {
      const { token, id, name } = extractAuth(result.data);
      const root = result.data?.data ?? result.data;
      const userObj = root?.user ?? root?.customer ?? root;
      const userId = userObj?.id ?? null; 

      setToken(token);
      setCustomer({ customer_id: id, user_id: userId, name });
      syncGuestCartToServer();
      setStatus('success');
      if (mode === 'login') {
        setTimeout(() => { setStatus('idle'); onClose?.(); }, 900);
      }
    } else {
      setStatus('error');
      setApiError(result.error);
    }
  };

  const inputStyle = (name) => ({
    background: t.detailSpecBg,
    border: `1.5px solid ${errors[name] ? '#f87171' : t.cardBorder}`,
    color: t.pageText,
    borderRadius: 8,
    padding: '10px 14px',
    width: '100%',
    fontSize: 14,
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  });

  if (!isOpen) return null;

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 60 }} />
      <div style={{ position: 'fixed', inset: 0, zIndex: 61, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
        <div style={{
          width: '100%', maxWidth: 440,
          background: t.detailPanelBg, border: `1px solid ${t.cardBorder}`,
          borderRadius: 20, boxShadow: '0 24px 80px rgba(0,0,0,0.4)',
          overflow: 'hidden', display: 'flex', flexDirection: 'column',
        }}>
          {/* Header */}
          <div style={{ background: t.detailPanelBg, padding: '18px 22px', borderBottom: `1px solid ${t.cardBorder}`, display: 'flex', alignItems: 'center', gap: 12 }}>
            {onBack && (
              <button onClick={onBack} style={{ background: t.tagBg, border: 'none', borderRadius: 8, padding: 6, cursor: 'pointer', display: 'flex' }}>
                <ArrowLeft size={18} style={{ color: t.pageText }} />
              </button>
            )}
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: t.pageText, margin: 0 }}>
                {mode === 'register' ? 'Create Account' : 'Welcome Back'}
              </h2>
              <p style={{ fontSize: 12, color: t.subtleText, margin: 0 }}>
                {mode === 'register' ? 'Sign up to start shopping' : 'Log in to your account'}
              </p>
            </div>
            <button onClick={onClose} style={{ background: t.tagBg, border: 'none', borderRadius: '50%', padding: 6, cursor: 'pointer', display: 'flex' }}>
              <X size={18} style={{ color: t.pageText }} />
            </button>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: `1px solid ${t.cardBorder}` }}>
            {['login', 'register'].map(m => (
              <button key={m} onClick={() => switchMode(m)} style={{
                flex: 1, padding: '12px 0', border: 'none', cursor: 'pointer',
                background: mode === m ? t.tagBg : 'transparent',
                color: mode === m ? t.accent : t.subtleText,
                fontWeight: mode === m ? 700 : 500,
                fontSize: 13, borderBottom: mode === m ? `2px solid ${t.accent}` : '2px solid transparent',
                transition: 'all 0.2s', textTransform: 'capitalize',
              }}>
                {m === 'login' ? 'Log In' : 'Register'}
              </button>
            ))}
          </div>

          {status === 'success' ? (
            <div style={{ padding: 32, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Check size={32} style={{ color: '#16a34a' }} />
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: t.pageText, margin: '0 0 4px' }}>
                {mode === 'register' ? 'Account Created!' : 'Logged In!'}
              </h3>
              <button onClick={onClose} style={{ width: '100%', padding: '11px 0', borderRadius: 10, border: 'none', background: t.primary, color: t.btnText, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                Continue
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {status === 'error' && apiError && (
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: 12 }}>
                  <AlertCircle size={16} style={{ color: '#ef4444', flexShrink: 0, marginTop: 1 }} />
                  <p style={{ margin: 0, fontSize: 13, color: '#b91c1c', flex: 1 }}>{apiError}</p>
                  <button type="button" onClick={() => { setStatus('idle'); setApiError(''); }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                    <X size={13} style={{ color: '#b91c1c' }} />
                  </button>
                </div>
              )}
              {mode === 'register' && (
                <Field label="Full Name *" error={errors.name} icon={User} t={t}>
                  <input name="name" value={form.name} onChange={handle} placeholder="e.g. Priya Sharma" style={inputStyle('name')} autoComplete="name" />
                </Field>
              )}
              <Field label="Email *" error={errors.email} icon={Mail} t={t}>
                <input name="email" type="email" value={form.email} onChange={handle} placeholder="you@example.com" style={inputStyle('email')} autoComplete="email" />
              </Field>
              <Field label="Password *" error={errors.password} icon={Lock} t={t}>
                <div style={{ position: 'relative' }}>
                  <input
                    name="password" type={showPw ? 'text' : 'password'}
                    value={form.password} onChange={handle}
                    placeholder={mode === 'register' ? 'Min. 8 characters' : '••••••••'}
                    style={{ ...inputStyle('password'), paddingRight: 40 }}
                    autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
                  />
                  <button type="button" onClick={() => setShowPw(v => !v)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 0 }}>
                    {showPw ? <EyeOff size={15} style={{ color: t.subtleText }} /> : <Eye size={15} style={{ color: t.subtleText }} />}
                  </button>
                </div>
              </Field>
              <div style={{ display: 'flex', gap: 10, paddingTop: 4, borderTop: `1px solid ${t.cardBorder}` }}>
                <button type="button" onClick={onClose} style={{ flex: 1, padding: '11px 0', borderRadius: 10, background: 'transparent', border: `2px solid ${t.cardBorder}`, color: t.pageText, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                  Cancel
                </button>
                <button type="submit" disabled={status === 'loading'} style={{
                  flex: 2, padding: '11px 0', borderRadius: 10, border: 'none',
                  background: status === 'loading' ? (t.isDark ? '#374151' : '#e5e7eb') : t.primary,
                  color: status === 'loading' ? (t.isDark ? '#6b7280' : '#9ca3af') : t.btnText,
                  fontSize: 14, fontWeight: 700, cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.2s',
                }}>
                  {status === 'loading'
                    ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />{mode === 'register' ? 'Creating...' : 'Signing in...'}</>
                    : mode === 'register' ? 'Create Account' : 'Log In'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}

function Field({ label, error, icon: Icon, t, children }) {
  return (
    <div>
      <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: t.subtleText, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {Icon && <Icon size={12} style={{ color: t.accent }} />} {label}
      </label>
      {children}
      {error && <p style={{ margin: '4px 0 0', fontSize: 11, color: '#f87171' }}>{error}</p>}
    </div>
  );
}