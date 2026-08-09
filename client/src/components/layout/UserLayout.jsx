import React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import DisclaimerBanner from '../common/DisclaimerBanner';
import Navbar from './Navbar';
import Footer from './Footer';

export default function UserLayout() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ redirect: location.pathname }} replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA]">
      <DisclaimerBanner />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
