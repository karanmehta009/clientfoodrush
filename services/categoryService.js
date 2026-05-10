// ─────────────────────────────────────────────
// services/categoryService.js — Uses centralized API
// ─────────────────────────────────────────────
import API from "./api.js";

export const getCategories = () => API.get("/categories/");
export const addCategory = (data) => API.post("/categories/add", data);
export const deleteCategory = (id) => API.delete(`/categories/${id}`);