// ─────────────────────────────────────────────
// services/cartService.js — Uses centralized API
// ─────────────────────────────────────────────
import API from "./api.js";

export const addToCart = (data) => API.post("/cart/add", data);
export const getCart = () => API.get("/cart/");
export const removeFromCart = (data) => API.delete("/cart/remove", { data });
export const updateCartItem = (data) => API.patch("/cart/update", data);
export const clearCart = () => API.delete("/cart/clear");