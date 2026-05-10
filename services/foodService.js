// ─────────────────────────────────────────────
// services/foodService.js — Uses centralized API
// ─────────────────────────────────────────────
import API from "./api.js";

export const getFoods = (params) => API.get("/food/", { params });
export const getFoodById = (id) => API.get(`/food/${id}`);
export const addFood = (foodData, config = {}) => API.post("/food/add", foodData, config);
export const updateFood = (id, foodData, config = {}) => API.put(`/food/${id}`, foodData, config);
export const deleteFood = (id) => API.delete(`/food/${id}`);