// ─────────────────────────────────────────────
// routes/AppRoutes.jsx
// Lazy-loaded routes for performance (Phase 3 + 5)
// ─────────────────────────────────────────────
import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import UserRoute from "./UserRoute";
import AdminRoute from "./AdminRoute";

// Loader for Suspense fallback
const PageLoader = () => (
  <div className="flex h-screen w-full items-center justify-center bg-gray-50">
    <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
  </div>
);

// ── Lazy Imports ──
const RegisterPage = lazy(() => import("../pages/RegisterPage"));
const LoginPage = lazy(() => import("../pages/LoginPage"));
const HomePage = lazy(() => import("../pages/HomePage"));
const CartPage = lazy(() => import("../pages/CartPage"));
const OrderHistoryPage = lazy(() => import("../pages/OrderHistoryPage"));
const ProfilePage = lazy(() => import("../pages/ProfilePage"));
const MenuPage = lazy(() => import("../pages/MenuPage"));
const FoodDetailPage = lazy(() => import("../pages/FoodDetailPage"));
const CheckoutPage = lazy(() => import("../pages/CheckoutPage"));
const AboutPage = lazy(() => import("../pages/AboutPage"));
const ContactPage = lazy(() => import("../pages/ContactPage"));

// Admin Lazy
const ManageOrders = lazy(() => import("../admin/ManageOrders"));
const ManageFoods = lazy(() => import("../admin/ManageFoods"));
const Dashboard = lazy(() => import("../admin/Dashboard"));
const ManageUsers = lazy(() => import("../admin/ManageUsers"));
const ManageCategories = lazy(() => import("../admin/ManageCategories"));
const AdminLogin = lazy(() => import("../admin/AdminLogin"));

const RootRedirect = () => {
  const { user, isAuthenticated } = useAuthStore();
  console.log("RootRedirect:", { isAuthenticated, role: user?.role });
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return user?.role === "admin" ? <Navigate to="/admin/dashboard" replace /> : <Navigate to="/home" replace />;
};

const AppRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<RootRedirect />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* PROTECTED USER ROUTES */}
        <Route path="/home" element={<UserRoute><HomePage /></UserRoute>} />
        <Route path="/cart" element={<UserRoute><CartPage /></UserRoute>} />
        <Route path="/orders" element={<UserRoute><OrderHistoryPage /></UserRoute>} />
        <Route path="/profile" element={<UserRoute><ProfilePage /></UserRoute>} />
        <Route path="/menu" element={<UserRoute><MenuPage /></UserRoute>} />
        <Route path="/food/:id" element={<UserRoute><FoodDetailPage /></UserRoute>} />
        <Route path="/checkout" element={<UserRoute><CheckoutPage /></UserRoute>} />
        <Route path="/about" element={<UserRoute><AboutPage /></UserRoute>} />
        <Route path="/contact" element={<UserRoute><ContactPage /></UserRoute>} />

        {/* ADMIN ROUTES */}
        <Route path="/admin/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
        <Route path="/admin/orders" element={<AdminRoute><ManageOrders /></AdminRoute>} />
        <Route path="/admin/foods" element={<AdminRoute><ManageFoods /></AdminRoute>} />
        <Route path="/admin/users" element={<AdminRoute><ManageUsers /></AdminRoute>} />
        <Route path="/admin/categories" element={<AdminRoute><ManageCategories /></AdminRoute>} />
        
        {/* FALLBACK 404 */}
        <Route
          path="*"
          element={
            <div className="flex h-screen flex-col items-center justify-center">
              <h1 className="text-4xl font-bold text-gray-800">404</h1>
              <p className="mt-2 text-gray-500">Page not found</p>
            </div>
          }
        />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;