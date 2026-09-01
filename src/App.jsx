import { useState } from "react";
import { Route, Routes, useLocation } from "react-router";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SignupPage from "./pages/SignupPage";
import Homepage from "./pages/Homepage";
import SignInPage from "./pages/SigninPage";
import AdminDashboard from "./pages/AdminDashboard";
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
import AdminProductsPage from "./pages/product/admin/AdminProductsPage";
import CreateProductPage from "./pages/product/admin/CreateProductPage";
import EditProductPage from "./pages/product/admin/EditProductPage";
import AdminCategoriesPage from "./pages/category/admin/AdminCategoriesPage";
import CreateCategoryPage from "./pages/category/admin/CreateCategoryPage";
import EditCategoryPage from "./pages/category/admin/EditCategoryPage";
import SettingsPage from "./pages/settings/SettingsPage";
import CheckoutPage from "./pages/checkout/CheckoutPage";
import OrderConfirmationPage from "./pages/checkout/OrderConfirmationPage";
import ProfilePage from "./pages/account/ProfilePage";
import OrderHistoryPage from "./pages/account/OrderHistoryPage";
import OrderDetailPage from "./pages/account/OrderDetailPage";
import About from "./pages/about/About";
function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  let showFooter = true;
  if (location.pathname === "/sign-in" || location.pathname === "/sign-up" || location.pathname === "/about" || isAdminRoute) {
    showFooter = false;
  }

  return (
    <div>
      {!isAdminRoute && <Navbar/>}
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/sign-up" element={<SignupPage />} />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/account/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/account/orders" element={<ProtectedRoute><OrderHistoryPage /></ProtectedRoute>} />
        <Route path="/account/orders/:id" element={<ProtectedRoute><OrderDetailPage /></ProtectedRoute>} />
        <Route path="/products" element={<ProductsPage/>}/>
        <Route path="/products/:id" element= {<ProductDetailPage/>}/>
        <Route path="/search" element={<SearchResultsPage/>}/>
        <Route path="/admin/discounts" element={<AdminRoute><AdminDiscountsPage /></AdminRoute>} />
        <Route path="/admin/discounts/new" element={<AdminRoute><CreateDiscountPage /></AdminRoute>} />
        <Route path="/admin/orders" element={<AdminRoute><AdminOrdersPage /></AdminRoute>} />
        <Route path="/admin/orders/:id" element={<AdminRoute><EditOrderPage /></AdminRoute>} />
        <Route path="/admin/products" element={<AdminRoute><AdminProductsPage /></AdminRoute>} />
        <Route path="/admin/products/new" element={<AdminRoute><CreateProductPage /></AdminRoute>} />
        <Route path="/admin/products/:id" element={<AdminRoute><EditProductPage /></AdminRoute>} />
        <Route path="/admin/categories" element={<AdminRoute><AdminCategoriesPage /></AdminRoute>} />
        <Route path="/admin/categories/new" element={<AdminRoute><CreateCategoryPage /></AdminRoute>} />
        <Route path="/admin/categories/:id" element={<AdminRoute><EditCategoryPage /></AdminRoute>} />
        <Route path="/admin/settings" element={<AdminRoute><SettingsPage /></AdminRoute>} />
        <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
        <Route path="/checkout/confirmation/:id" element={<ProtectedRoute><OrderConfirmationPage /></ProtectedRoute>} />
        <Route path="/cart" element={<ProtectedRoute><CartPage/></ProtectedRoute>}/>
        <Route path="/about" element={<About/>}/>

      </Routes>
      {showFooter && <Footer />}
    </div>
  );
}

export default App;
