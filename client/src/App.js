import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { OrderProvider } from './context/OrderContext';
import { AdminProvider } from './context/AdminContext';

// Layouts
import GuestLayout from './components/layout/GuestLayout';
import UserLayout from './components/layout/UserLayout';
import AdminLayout from './components/layout/AdminLayout';

// Lazy Loaded Pages
const Home = lazy(() => import('./pages/Home'));
const Products = lazy(() => import('./pages/Products'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Categories = lazy(() => import('./pages/Categories'));
const Offers = lazy(() => import('./pages/Offers'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Orders = lazy(() => import('./pages/Orders'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const Profile = lazy(() => import('./pages/Profile'));
const Addresses = lazy(() => import('./pages/Addresses'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const RealGoldCollection = lazy(() => import('./pages/RealGoldCollection'));

// Admin Dashboard Lazy Pages
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'));
const AdminCategories = lazy(() => import('./pages/admin/AdminCategories'));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'));
const AdminOffers = lazy(() => import('./pages/admin/AdminOffers'));
const AdminBanners = lazy(() => import('./pages/admin/AdminBanners'));
const AdminReports = lazy(() => import('./pages/admin/AdminReports'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'));
const AdminReturns = lazy(() => import('./pages/admin/AdminReturns'));
const AdminRealGold = lazy(() => import('./pages/admin/AdminRealGold'));
const AdminContact = lazy(() => import('./pages/admin/AdminContact'));

const LoadingFallback = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center bg-[#FAF9F5] text-gold space-y-3">
    <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin" />
    <span className="font-luxury font-bold text-sm tracking-wider">Loading Aureate Luxe 1-Gram Experience...</span>
  </div>
);

export default function App() {
  return (
    <AuthProvider>
      <AdminProvider>
        <OrderProvider>
          <CartProvider>
            <WishlistProvider>
              <Router>
                <Suspense fallback={<LoadingFallback />}>
                  <Routes>
                    
                    {/* Guest Routes Layout */}
                    <Route element={<GuestLayout />}>
                      <Route path="/" element={<Home />} />
                      <Route path="/products" element={<Products />} />
                      <Route path="/products/:id" element={<ProductDetail />} />
                      <Route path="/real-gold" element={<RealGoldCollection />} />
                      <Route path="/categories" element={<Categories />} />
                      <Route path="/offers" element={<Offers />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/wishlist" element={<Wishlist />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />
                    </Route>

                    {/* Authenticated Customer Routes Layout */}
                    <Route element={<UserLayout />}>
                      <Route path="/cart" element={<Cart />} />
                      <Route path="/checkout" element={<Checkout />} />
                      <Route path="/orders" element={<Orders />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/addresses" element={<Addresses />} />
                    </Route>

                    {/* Admin Dashboard Protected Routes Layout */}
                    <Route path="/admin" element={<AdminLayout />}>
                      <Route index element={<AdminDashboard />} />
                      <Route path="products" element={<AdminProducts />} />
                      <Route path="real-gold" element={<AdminRealGold />} />
                      <Route path="categories" element={<AdminCategories />} />
                      <Route path="orders" element={<AdminOrders />} />
                      <Route path="contact" element={<AdminContact />} />
                      <Route path="users" element={<AdminUsers />} />
                      <Route path="offers" element={<AdminOffers />} />
                      <Route path="banners" element={<AdminBanners />} />
                      <Route path="returns" element={<AdminReturns />} />
                      <Route path="reports" element={<AdminReports />} />
                      <Route path="settings" element={<AdminSettings />} />
                    </Route>

                    {/* Catch all fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />

                  </Routes>
                </Suspense>
              </Router>

              {/* Toast Notifications */}
              <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
              />
              

            </WishlistProvider>
          </CartProvider>
        </OrderProvider>
      </AdminProvider>
    </AuthProvider>
  );
}
