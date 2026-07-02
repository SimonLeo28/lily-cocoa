import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Layouts
import MainLayout from "./layouts/MainLayout.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";

// Guards
import ProtectedRoute from "./components/common/ProtectedRoute.jsx";

// Public pages
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx";

// User pages
import HomePage from "./pages/HomePage.jsx";
import CatalogPage from "./pages/CatalogPage.jsx";
import CakeDetailPage from "./pages/CakeDetailPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import OrderSuccessPage from "./pages/OrderSuccessPage.jsx";
import OrdersPage from "./pages/OrdersPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import WishlistPage from "./pages/WishlistPage.jsx";
import SupportPage from "./pages/SupportPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

// Admin pages
import AdminLoginPage from "./pages/admin/AdminLoginPage.jsx";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage.jsx";
import AdminOrdersPage from "./pages/admin/AdminOrdersPage.jsx";
import AdminProductsPage from "./pages/admin/AdminProductsPage.jsx";
import AdminCategoriesPage from "./pages/admin/AdminCategoriesPage.jsx";
import AdminUsersPage from "./pages/admin/AdminUsersPage.jsx";
import AdminCouponsPage from "./pages/admin/AdminCouponsPage.jsx";
import AdminReviewsPage from "./pages/admin/AdminReviewsPage.jsx";
import AdminSettingsPage from "./pages/admin/AdminSettingsPage.jsx";

// Cart context refresh on auth
import { useCart } from "./context/CartContext.jsx";
import { useAuth } from "./context/AuthContext.jsx";

const CartRefresher = () => {
  const { refreshCart } = useCart();
  const { isAuthenticated } = useAuth();
  useEffect(() => { if (isAuthenticated) refreshCart(); }, [isAuthenticated]);
  return null;
};

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            borderRadius: "16px",
            background: "#fff",
            color: "#6B3F2A",
            fontFamily: "Poppins, sans-serif",
            fontSize: "14px",
            boxShadow: "0 8px 30px rgba(107,63,42,0.12)",
          },
          success: { iconTheme: { primary: "#E89AAE", secondary: "#fff" } },
          error: { iconTheme: { primary: "#ef4444", secondary: "#fff" } },
          duration: 3000,
        }}
      />
      <CartRefresher />

      <Routes>
        {/* ── Auth (no layout) ── */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* ── Main site ── */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/cakes" element={<CatalogPage />} />
          <Route path="/cakes/:id" element={<CakeDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/support" element={<SupportPage />} />

          {/* Protected user routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-success/:id" element={<OrderSuccessPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
          </Route>
        </Route>

        {/* ── Admin panel ── */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route element={<ProtectedRoute adminOnly={true} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="/admin/orders" element={<AdminOrdersPage />} />
            <Route path="/admin/products" element={<AdminProductsPage />} />
            <Route path="/admin/categories" element={<AdminCategoriesPage />} />
            <Route path="/admin/users" element={<AdminUsersPage />} />
            <Route path="/admin/coupons" element={<AdminCouponsPage />} />
            <Route path="/admin/reviews" element={<AdminReviewsPage />} />
            <Route path="/admin/settings" element={<AdminSettingsPage />} />
            {/* Redirect /admin → /admin/dashboard */}
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          </Route>
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
