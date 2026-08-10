import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowLeft, Home as HomeIcon, ShoppingBag } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#FAF9F5] px-4 py-16 text-slate-800">
      <div className="max-w-xl w-full text-center space-y-8 bg-white border-2 border-gold/40 p-8 sm:p-12 rounded-3xl shadow-2xl relative overflow-hidden">
        
        {/* Top Glow Accent */}
        <div className="w-40 h-40 bg-gold/10 rounded-full blur-3xl absolute -top-10 left-1/2 -translate-x-1/2 pointer-events-none" />

        {/* Brand Logo & Name */}
        <div className="space-y-3 relative z-10">
          <Link to="/" className="inline-flex items-center gap-3 hover:opacity-90 transition-opacity">
            <img 
              src="/shoplogo.png" 
              alt="SWARNIKA Logo" 
              className="h-16 sm:h-20 w-auto object-contain mx-auto"
              onError={(e) => {
                e.target.onerror = null;
              }}
            />
          </Link>
          <div>
            <h2 className="font-brand-royal font-black text-2xl sm:text-3xl text-gold-royal tracking-widest uppercase">
              SWARNIKA
            </h2>
            <span className="text-[10px] sm:text-xs text-amber-900 font-extrabold tracking-[0.25em] uppercase block mt-0.5">
              LUXURY HERITAGE
            </span>
          </div>
        </div>

        {/* 404 Display Header */}
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 bg-amber-50 border border-gold/40 text-amber-900 text-xs px-4 py-1.5 rounded-full font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-gold" /> Error 404
          </div>
          <h1 className="font-luxury font-bold text-3xl sm:text-4xl text-gold-gradient">
            Royal Heirloom Not Found
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
            The page or jewellery collection you are searching for does not exist or has been moved to our private showroom vault.
          </p>
        </div>

        {/* Navigation Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 relative z-10">
          <Link
            to="/"
            className="w-full sm:w-auto bg-gold-gradient text-slate-900 font-luxury font-bold text-xs px-6 py-3.5 rounded-full shadow-gold-glow hover:scale-105 transition-transform flex items-center justify-center gap-2"
          >
            <HomeIcon className="w-4 h-4" /> Return to Home
          </Link>

          <Link
            to="/products"
            className="w-full sm:w-auto bg-slate-900 text-gold border border-gold/40 font-luxury font-bold text-xs px-6 py-3.5 rounded-full hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4 text-gold" /> Browse 1-Gram Range
          </Link>
        </div>

        <div className="text-[11px] text-gray-400 pt-4 border-t border-gray-100 relative z-10">
          Honnali Showroom • SWARNIKA 1-Gram Replica & Real 22K Gold Collections
        </div>

      </div>
    </div>
  );
}
