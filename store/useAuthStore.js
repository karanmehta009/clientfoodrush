// ─────────────────────────────────────────────
// store/useAuthStore.js
// Zustand store for Authentication State
// ─────────────────────────────────────────────
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { loginUser, registerUser, logoutUser } from "../services/userService";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      hydrated: false, // track hydration

      setHydrated: () => set({ hydrated: true }),

      login: async (credentials) => {
        const res = await loginUser(credentials);
        if (res.data.success) {
          // Clear legacy keys to prevent conflicts
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          
          set({
            user: res.data.user,
            token: res.data.token,
            isAuthenticated: true,
          });
        }
        return res;
      },

      register: async (userData) => {
        const res = await registerUser(userData);
        return res; // Registration doesn't inherently login in this flow
      },

      logout: async () => {
        try {
          await logoutUser();
        } finally {
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          set({ user: null, token: null, isAuthenticated: false });
        }
      },

      updateUser: (updatedUser) => {
        set({ user: updatedUser });
      },
    }),
    {
      name: "auth-storage", // stores token and user in localStorage via zustand persist
    }
  )
);
