import { useState } from "react";
import { Route, Routes, useLocation } from "react-router";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SignupPage from "./pages/SignupPage";
import Homepage from "./pages/Homepage";
import SignInPage from "./pages/SigninPage";
import Dashboard from "./pages/Dashboard";
import ProductsPage from "./pages/product/ProductsPage";
import SearchResultsPage from "./pages/product/SearchResultsPage";
import CartPage from "./pages/product/cart/CartPage";
import { useEffect } from "react";
import { getCurrentUser, logout } from "./services/authService";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";
function App() {
  const location = useLocation();

  let showFooter = true;
  if (location.pathname === "/sign-in" || location.pathname === "/sign-up") {
    showFooter = false;
  }

  return (
    <div>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/sign-up" element={<SignupPage />} />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/products" element={<ProductsPage/>}/>
        <Route path="/search" element={<SearchResultsPage/>}/>
        <Route path="/cart" element={<ProtectedRoute><CartPage/></ProtectedRoute>}/>
      </Routes>
      {showFooter && <Footer />}
    </div>
  );
}

export default App;
