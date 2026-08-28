import { useState } from "react";
import { Route, Routes, useLocation } from "react-router";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SignupPage from "./pages/SignupPage";
import Homepage from "./pages/Homepage";
import SignInPage from "./pages/SigninPage";
import Dashboard from "./pages/Dashboard";
import ProductsPage from "./pages/product/ProductsPage";
import ProductDetailPage from "./pages/product/ProductDetailPage";
import SearchResultsPage from "./pages/product/SearchResultsPage";
import CartPage from "./pages/product/cart/CartPage";
import { useEffect } from "react";
import { getCurrentUser, logout } from "./services/authService";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import { useAuth } from "./context/AuthContext";
import AdminDiscountsPage from "./pages/discount/AdminDiscountsPage";
import CreateDiscountPage from "./pages/discount/CreateDiscountPage";
import AdminOrdersPage from "./pages/order/AdminOrdersPage";
import EditOrderPage from "./pages/order/EditOrderPage";
import CheckoutPage from "./pages/checkout/CheckoutPage";
import OrderConfirmationPage from "./pages/checkout/OrderConfirmationPage";
function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  let showFooter = true;
  if (location.pathname === "/sign-in" || location.pathname === "/sign-up" || isAdminRoute) {
    showFooter = false;
  }

  return (
    <div>
      {!isAdminRoute && <Navbar/>}
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/sign-up" element={<SignupPage />} />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/products" element={<ProductsPage/>}/>
        <Route path="/products/:id" element= {<ProductDetailPage/>}/>
        <Route path="/search" element={<SearchResultsPage/>}/>
        <Route path="/admin/discounts" element={<AdminRoute><AdminDiscountsPage /></AdminRoute>} />
        <Route path="/admin/discounts/new" element={<AdminRoute><CreateDiscountPage /></AdminRoute>} />
        <Route path="/admin/orders" element={<AdminRoute><AdminOrdersPage /></AdminRoute>} />
        <Route path="/admin/orders/:id" element={<AdminRoute><EditOrderPage /></AdminRoute>} />
        <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
        <Route path="/checkout/confirmation/:id" element={<ProtectedRoute><OrderConfirmationPage /></ProtectedRoute>} />
        <Route path="/cart" element={<ProtectedRoute><CartPage/></ProtectedRoute>}/>
      </Routes>
      {showFooter && <Footer />}
    </div>
  );
}

export default App;
