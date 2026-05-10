// ─────────────────────────────────────────────
// store/useCartStore.js
// Zustand store for Cart State
// ─────────────────────────────────────────────
import { create } from "zustand";
import {
  getCart,
  addToCart,
  removeFromCart,
  updateCartItem,
  clearCart,
} from "../services/cartService";

export const useCartStore = create((set, get) => ({
  cart: null,
  loading: false,

  fetchCart: async () => {
    set({ loading: true });
    try {
      const res = await getCart();
      set({ cart: res.data.cart });
    } catch (error) {
      console.error("Failed to fetch cart", error);
    } finally {
      set({ loading: false });
    }
  },

  addItem: async (foodId, quantity) => {
    try {
      const res = await addToCart({ foodId, quantity });
      // addToCart response may or may not be populated, so re-fetch to be safe
      if (res.data.cart) {
        set({ cart: res.data.cart });
      }
      await get().fetchCart();
    } catch (error) {
      console.error("Failed to add to cart", error);
      throw error;
    }
  },

  removeItem: async (foodId) => {
    // 1. Snapshot current cart for rollback
    const previous = get().cart;

    // 2. Optimistically remove from UI instantly
    set((state) => ({
      cart: {
        ...state.cart,
        items: state.cart.items.filter(
          (item) => item.food?._id !== foodId && item.food !== foodId
        ),
      },
    }));

    try {
      await removeFromCart({ foodId });
      // 3. Sync with server to get accurate populated data
      await get().fetchCart();
    } catch (error) {
      // 4. Rollback on failure
      console.error("Failed to remove item", error);
      set({ cart: previous });
      throw error;
    }
  },

  updateItem: async (foodId, quantity) => {
    // 1. Snapshot for rollback
    const previous = get().cart;

    // 2. Optimistically update quantity in UI instantly
    set((state) => ({
      cart: {
        ...state.cart,
        items: state.cart.items.map((item) =>
          item.food?._id === foodId || item.food === foodId
            ? { ...item, quantity }
            : item
        ),
      },
    }));

    try {
      await updateCartItem({ foodId, quantity });
      // 3. Sync with server
      await get().fetchCart();
    } catch (error) {
      // 4. Rollback on failure
      console.error("Failed to update cart", error);
      set({ cart: previous });
      throw error;
    }
  },

  clear: async () => {
    const previous = get().cart;
    set({ cart: null });
    try {
      await clearCart();
    } catch (error) {
      console.error("Failed to clear cart", error);
      set({ cart: previous });
      throw error;
    }
  },

  // Derived state helper
  get itemCount() {
    const { cart } = get();
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  },
}));