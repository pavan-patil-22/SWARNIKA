import React from 'react';
import { Outlet } from 'react-router-dom';
import DisclaimerBanner from '../common/DisclaimerBanner';
import Navbar from './Navbar';
import Footer from './Footer';

export default function GuestLayout() {
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
