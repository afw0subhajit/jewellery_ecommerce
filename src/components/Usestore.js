import { create } from "zustand";

const getInitialCustomerId = () => localStorage.getItem("customerId") || localStorage.getItem("userId") || null;
const getInitialUserId = () => localStorage.getItem("userId") || localStorage.getItem("customerId") || null;

const useStore = create((set) => ({
  customerId: getInitialCustomerId(),
  userId: getInitialUserId(),
  customerName: localStorage.getItem("customerName") || null,
  token: localStorage.getItem("auth_token") || null,
  clientId: 13,
  businessId: 2,
  cartVersion: 0,

  bumpCart: () => set((s) => ({ cartVersion: (s.cartVersion || 0) + 1 })),

  setCustomer: ({ customer_id, user_id, name, token }) =>
    set((s) => {
      const tok = token ?? s.token;
      const effectiveCustomerId = customer_id ? String(customer_id) : (user_id ? String(user_id) : s.customerId);
      const effectiveUserId = user_id ? String(user_id) : (customer_id ? String(customer_id) : s.userId);

      if (tok) localStorage.setItem("auth_token", tok);
      if (effectiveCustomerId) localStorage.setItem("customerId", effectiveCustomerId);
      if (effectiveUserId) localStorage.setItem("userId", effectiveUserId);
      if (name) localStorage.setItem("customerName", name);

      return {
        customerId: effectiveCustomerId,
        userId: effectiveUserId,
        customerName: name ?? s.customerName,
        token: tok ?? s.token,
      };
    }),

  setToken: (token) => {
    if (token) localStorage.setItem("auth_token", token);
    set({ token });
  },

  clearAuth: () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("customerId");
    localStorage.removeItem("userId");
    localStorage.removeItem("customerName");
    set({ customerId: null, userId: null, customerName: null, token: null });
  },
}));

export default useStore;

