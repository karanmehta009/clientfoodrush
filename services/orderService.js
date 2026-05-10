// ─────────────────────────────────────────────
// services/orderService.js — Uses centralized API
// ─────────────────────────────────────────────
import API from "./api.js";

// User
export const placeOrder = (data) => API.post("/order/create-from-cart", data);
export const placeManualOrder = (data) => API.post("/order/create", data);
export const getMyOrders = (params) => API.get("/order/my-orders", { params });
export const cancelOrder = (id) => API.put(`/order/cancel/${id}`);

// Admin
export const getAllOrders = (params) => API.get("/order/all", { params });
export const updateOrderStatus = (id, status) =>
  API.put(`/order/status/${id}`, { status });