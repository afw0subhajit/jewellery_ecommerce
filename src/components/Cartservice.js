import axios from "axios";
import useStore from "./Usestore";

const BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

// ─── Guest Cart Local Storage Helpers ─────────────────────────────────────────
export function getGuestCart() {
  try {
    const raw = localStorage.getItem("guest_cart");
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Failed to parse guest_cart from localStorage:", e);
    return [];
  }
}

export function saveGuestCart(cartItems) {
  try {
    localStorage.setItem("guest_cart", JSON.stringify(cartItems));
  } catch (e) {
    console.error("Failed to save guest_cart to localStorage:", e);
  }
}

export function clearGuestCart() {
  localStorage.removeItem("guest_cart");
}

// ─── Sync Guest Cart to Server on Login ────────────────────────────────────────
export async function syncGuestCartToServer() {
  const { customerId, userId, businessId, clientId, token } = useStore.getState();
  const activeId = customerId || userId;
  if (!token || !activeId) return;

  const guestItems = getGuestCart();
  if (guestItems.length === 0) return;

  try {
    for (const item of guestItems) {
      const itemId = item.item_id || item.id;
      const qty = item.qty || item.quantity || 1;
      if (itemId) {
        await axios.post(`${BASE}/cart/add`, {
          customer_id: activeId,
          user_id: activeId,
          business_id: businessId,
          client_id: clientId,
          item_id: itemId,
          qty,
        });
      }
    }
    clearGuestCart();
    useStore.getState().bumpCart?.();
  } catch (e) {
    console.error("[syncGuestCartToServer] Error syncing cart:", e);
  }
}

// ─── addToCart ────────────────────────────────────────────────────────────────
export async function addToCart({
  item_id,
  qty = 1,
  itemData = null,
  cart_token = null,
  cart_name = null,
}) {
  const { customerId, userId, businessId, clientId, token } = useStore.getState();
  const activeId = customerId || userId;
  const isLoggedIn = !!token && !!activeId;

  // Logged-in user: send to API
  if (isLoggedIn) {
    console.log("[addToCart API]", { customer_id: activeId, businessId, clientId, item_id, qty });
    try {
      const res = await axios.post(`${BASE}/cart/add`, {
        customer_id: activeId,
        user_id: activeId,
        business_id: businessId,
        client_id: clientId,
        item_id,
        qty,
        ...(cart_token && { cart_token }),
        ...(cart_name && { cart_name }),
      });

      useStore.getState().bumpCart?.();

      return {
        success: true,
        data: res?.data?.data ?? res?.data,
      };
    } catch (e) {
      return {
        success: false,
        error:
          e?.response?.data?.message ||
          e.message ||
          "Failed to add to cart",
      };
    }
  }

  // Guest user: store in localStorage
  console.log("[addToCart Guest LocalStorage]", { item_id, qty, itemData });
  const guestCart = getGuestCart();
  const existingIdx = guestCart.findIndex(
    (i) => String(i.item_id || i.id) === String(item_id)
  );

  const price = itemData?.mrp || itemData?.sell_rate || 0;
  const itemName = itemData?.item_name || itemData?.name || "Jewelry Item";
  const image = itemData?.image || null;

  if (existingIdx >= 0) {
    guestCart[existingIdx].qty = (guestCart[existingIdx].qty || 1) + qty;
  } else {
    guestCart.push({
      id: item_id,
      item_id,
      item_name: itemName,
      mrp: itemData?.mrp || price,
      sell_rate: itemData?.sell_rate || price,
      qty,
      image,
      item: itemData || { id: item_id, item_name: itemName, mrp: price, sell_rate: price },
    });
  }

  saveGuestCart(guestCart);
  useStore.getState().bumpCart?.();

  return {
    success: true,
    isGuest: true,
    data: guestCart,
  };
}

// ─── fetchCart ────────────────────────────────────────────────────────────────
export async function fetchCart(cart_token = null) {
  const { customerId, userId, token } = useStore.getState();
  const activeId = customerId || userId;
  const isLoggedIn = !!token && !!activeId;

  if (isLoggedIn) {
    try {
      const params = cart_token ? { cart_token } : {};
      const res = await axios.get(`${BASE}/cart/${activeId}`, { params });

      return {
        success: true,
        data: res?.data?.data ?? res?.data,
      };
    } catch (e) {
      return {
        success: false,
        error:
          e?.response?.data?.message ||
          e.message ||
          "Failed to load cart",
      };
    }
  }

  // Guest cart fetch
  const items = getGuestCart();
  const total = items.reduce(
    (sum, i) => sum + (parseFloat(i.sell_rate || i.mrp || 0) * parseFloat(i.qty || 1)),
    0
  );

  return {
    success: true,
    data: {
      items,
      total,
    },
  };
}

// ─── updateCartItem ───────────────────────────────────────────────────────────
export async function updateCartItem(cartItemId, qty) {
  const { customerId, userId, token } = useStore.getState();
  const activeId = customerId || userId;
  const isLoggedIn = !!token && !!activeId;

  if (isLoggedIn) {
    try {
      const res = await axios.put(`${BASE}/cart/item/${cartItemId}`, { qty });
      useStore.getState().bumpCart?.();
      return {
        success: true,
        data: res?.data?.data ?? res?.data,
      };
    } catch (e) {
      return {
        success: false,
        error:
          e?.response?.data?.message ||
          e.message ||
          "Failed to update item",
      };
    }
  }

  // Guest update
  const guestCart = getGuestCart();
  const updatedCart = guestCart
    .map((item) => {
      if (String(item.id) === String(cartItemId) || String(item.item_id) === String(cartItemId)) {
        return { ...item, qty };
      }
      return item;
    })
    .filter((item) => item.qty > 0);

  saveGuestCart(updatedCart);
  useStore.getState().bumpCart?.();

  return {
    success: true,
    data: updatedCart,
  };
}

// ─── removeCartItem ───────────────────────────────────────────────────────────
export async function removeCartItem(cartItemId) {
  const { customerId, userId, token } = useStore.getState();
  const activeId = customerId || userId;
  const isLoggedIn = !!token && !!activeId;

  if (isLoggedIn) {
    try {
      await axios.delete(`${BASE}/cart/item/${cartItemId}`);
      useStore.getState().bumpCart?.();
      return {
        success: true,
      };
    } catch (e) {
      return {
        success: false,
        error:
          e?.response?.data?.message ||
          e.message ||
          "Failed to remove item",
      };
    }
  }

  // Guest remove
  const guestCart = getGuestCart();
  const updatedCart = guestCart.filter(
    (item) => String(item.id) !== String(cartItemId) && String(item.item_id) !== String(cartItemId)
  );

  saveGuestCart(updatedCart);
  useStore.getState().bumpCart?.();

  return {
    success: true,
  };
}