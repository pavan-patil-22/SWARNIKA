import React, { Suspense, lazy, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { OrderProvider } from './context/OrderContext';
import { AdminProvider } from './context/AdminContext';

// Common Components
import ScrollToTop from './components/common/ScrollToTop';

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
const NotFound = lazy(() => import('./pages/NotFound'));

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
    <span className="font-luxury font-bold text-sm tracking-wider">Loading SWARNIKA Experience...</span>
  </div>
);

// RENDER FREE TIER SERVER COLD-START BANNER COMPONENT (FULLY MOBILE RESPONSIVE)
function ServerColdStartBanner() {
  const [wakingState, setWakingState] = useState({ isWakingUp: false, isError: false });

  useEffect(() => {
    const handleEvent = (e) => {
      setWakingState(e.detail || { isWakingUp: false, isError: false });
    };
    window.addEventListener('server-cold-start', handleEvent);
    return () => window.removeEventListener('server-cold-start', handleEvent);
  }, []);

  if (!wakingState.isWakingUp) return null;

  return (
    <div className="fixed bottom-4 inset-x-3 sm:left-1/2 sm:-translate-x-1/2 sm:right-auto z-[99999] sm:max-w-md w-auto bg-slate-900/95 backdrop-blur-md text-white border-2 border-gold p-3.5 sm:p-5 rounded-2xl shadow-2xl animate-fadeIn flex items-start justify-between gap-3">
      <div className="flex items-start gap-2.5 sm:gap-3">
        <div className="p-1.5 sm:p-2 bg-gold/20 text-gold rounded-full shrink-0 mt-0.5">
          <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 border-2 border-gold border-t-transparent rounded-full animate-spin" />
        </div>
        <div className="text-[11px] sm:text-xs space-y-0.5 sm:space-y-1">
          <h4 className="font-luxury font-bold text-gold text-xs sm:text-sm">
            SWARNIKA Cloud Server Waking Up
          </h4>
          <p className="text-gray-300 leading-snug sm:leading-relaxed">
            Our cloud database server is currently spinning up (Render free tier). Please allow 30–40 seconds while we connect. Thank you for your patience or visit again shortly!
          </p>
        </div>
      </div>
      <button 
        onClick={() => setWakingState({ isWakingUp: false, isError: false })}
        className="text-gray-400 hover:text-white shrink-0 p-1 font-bold text-xs bg-white/10 rounded-full w-6 h-6 flex items-center justify-center"
        aria-label="Dismiss banner"
      >
        ✕
      </button>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AdminProvider>
        <OrderProvider>
          <CartProvider>
            <WishlistProvider>
              <Router>
                <ScrollToTop />
                <ServerColdStartBanner />
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

                    {/* Custom 404 Page Route */}
                    <Route path="*" element={<NotFound />} />

                  </Routes>
                </Suspense>
              </Router>

              {/* Compact Bottom Toast Notifications */}
              <ToastContainer
                position="bottom-center"
                autoClose={2200}
                hideProgressBar
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
                toastClassName="!bg-slate-900 !text-gold !border !border-gold/40 !rounded-2xl !shadow-2xl !text-xs !py-2 !px-4 !mb-4"
              />

            </WishlistProvider>
          </CartProvider>
        </OrderProvider>
      </AdminProvider>
    </AuthProvider>
  );
}
