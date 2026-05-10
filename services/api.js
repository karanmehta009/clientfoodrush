import axios from "axios";

const API = axios.create({
  baseURL: "https://backendfoodrush.onrender.com/api", // ✅ Updated
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Auto-refresh token interceptor
API.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    // If access token expired → auto-refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await axios.post(
          "https://backendfoodrush.onrender.com/api/user/refresh-token",
          {},
          { withCredentials: true }
        );

        return API(originalRequest); // retry failed request
      } catch (err) {
        window.location.href = "/login"; // session expired
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default API;