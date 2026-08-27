import { useState } from "react";
import { Route, Routes } from "react-router";
import Navbar from "./components/Navbar";
import SignupPage from "./pages/SignupPage";
import Homepage from "./pages/Homepage";
import SignInPage from "./pages/SigninPage";
import Dashboard from "./pages/Dashboard";
import { useEffect } from "react";
import { getCurrentUser, logout } from "./services/authService";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import { useAuth } from "./context/AuthContext";
import AdminDiscountsPage from "./pages/discount/AdminDiscountsPage";
import CreateDiscountPage from "./pages/discount/CreateDiscountPage";
import AdminOrdersPage from "./pages/order/AdminOrdersPage";
import EditOrderPage from "./pages/order/EditOrderPage";
function App() {
  return (
    <div>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/sign-up" element={<SignupPage />} />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/admin/discounts" element={<AdminRoute><AdminDiscountsPage /></AdminRoute>} />
        <Route path="/admin/discounts/new" element={<AdminRoute><CreateDiscountPage /></AdminRoute>} />
        <Route path="/admin/orders" element={<AdminRoute><AdminOrdersPage /></AdminRoute>} />
        <Route path="/admin/orders/:id" element={<AdminRoute><EditOrderPage /></AdminRoute>} />
      </Routes>
    </div>
  );
}

export default App;
