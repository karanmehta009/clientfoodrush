import axios from "axios";

const API = axios.create({
  baseURL: "https://backendfoodrush-cjba.onrender.com/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// refresh token interceptor
API.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await axios.post(
          "https://backendfoodrush-cjba.onrender.com/api/user/refresh-token",
          {},
          { withCredentials: true }
        );

        return API(originalRequest);
      } catch (err) {
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default API;