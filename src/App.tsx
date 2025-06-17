import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AdminRoute } from "@/components/AdminRoute";
import Homepage from "./pages/Homepage";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Policies from "./pages/Policies";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Claims from "./pages/Claims";
import Payments from "./pages/Payments";
import Checkout from "./pages/Checkout";
import Cart from "./pages/Cart";
import Admin from "./pages/Admin";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <CartProvider>
            <Toaster />
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/" element={<Homepage />} />
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/products" element={
                  <ProtectedRoute>
                    <Products />
                  </ProtectedRoute>
                } />
                <Route path="/products/:id" element={
                  <ProtectedRoute>
                    <ProductDetails />
                  </ProtectedRoute>
                } />
                <Route path="/cart" element={
                  <ProtectedRoute>
                    <Cart />
                  </ProtectedRoute>
                } />
                <Route path="/checkout" element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                } />
                <Route path="/policies" element={
                  <ProtectedRoute>
                    <Policies />
                  </ProtectedRoute>
                } />
                <Route path="/claims" element={
                  <ProtectedRoute>
                    <Claims />
                  </ProtectedRoute>
                } />
                <Route path="/payments" element={
                  <ProtectedRoute>
                    <Payments />
                  </ProtectedRoute>
                } />
                <Route path="/admin/*" element={
                  <AdminRoute>
                    <Admin />
                  </AdminRoute>
                } />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </CartProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
