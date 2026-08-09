import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Tag, Calendar, CheckCircle2, ArrowRight } from 'lucide-react';
import { offerService } from '../services/api';
import { toast } from 'react-toastify';

export default function Offers() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOffers = async () => {
      setLoading(true);
      try {
        const offs = await offerService.getOffers();
        setOffers(offs.filter(o => o.active));
      } catch (e) {
        console.error("Offers error", e);
      } finally {
        setLoading(false);
      }
    };
    loadOffers();
  }, []);

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    toast.success(`Coupon code "${code}" copied! Automatically applied at checkout when criteria is met.`, {
      style: { background: '#111', color: '#D4AF37' }
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-xs text-gold font-bold uppercase tracking-widest flex items-center justify-center gap-1">
          <Sparkles className="w-4 h-4" /> Dynamic Savings Engine
        </span>
        <h1 className="font-luxury font-bold text-3xl md:text-4xl text-onyx">Exclusive 1-Gram Offers</h1>
        <p className="text-xs text-gray-500">
          Discounts are automatically calculated and applied in your cart during checkout!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {offers.map(offer => (
          <div key={offer.id} className="bg-onyx text-white p-8 rounded-2xl border border-gold/40 shadow-xl relative overflow-hidden space-y-6">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-gold/10 rounded-full blur-xl pointer-events-none" />
            
            <div className="flex items-center justify-between border-b border-gray-800 pb-4">
              <span className="bg-gold-gradient text-onyx font-luxury font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                Flat {offer.discountPercent}% OFF
              </span>
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-gold" /> Valid until {offer.endDate}
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="font-luxury font-bold text-2xl text-gold-gradient">{offer.title}</h3>
              <p className="text-xs text-gray-300 leading-relaxed">{offer.description}</p>
            </div>

            <div className="p-4 bg-onyx-light rounded-xl border border-gold/20 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-gray-400 block uppercase">Coupon Code</span>
                <span className="font-mono font-bold text-sm text-gold">{offer.code}</span>
              </div>
              <button
                onClick={() => copyCode(offer.code)}
                className="bg-gold/20 text-gold hover:bg-gold hover:text-onyx font-bold text-xs px-3.5 py-2 rounded-lg transition-colors border border-gold/40"
              >
                Copy Code
              </button>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs text-gray-300">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-gold" /> Min quantity: <strong>{offer.minQuantity} items</strong>
              </span>
              <Link to="/products" className="text-gold font-bold flex items-center gap-1 hover:underline">
                Shop Items <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
