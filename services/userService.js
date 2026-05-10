// ─────────────────────────────────────────────
// services/userService.js — Uses centralized API
// ─────────────────────────────────────────────
import API from "./api.js";

// Auth
export const registerUser = (data) => API.post("/user/register", data);
export const loginUser = (data) => API.post("/user/login", data);
export const logoutUser = () => API.post("/user/logout");
export const refreshToken = () => API.post("/user/refresh-token");

// Profile
export const getProfile = () => API.get("/user/profile");
export const updateProfile = (data) => API.put("/user/profile", data);

// Admin
export const getAllUsers = () => API.get("/user/");
export const deleteUser = (id) => API.delete(`/user/${id}`);
export const updateUserRole = (id, role) =>
  API.put(`/user/${id}/role`, { role });