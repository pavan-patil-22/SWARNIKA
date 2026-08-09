import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Crown, 
  ShieldCheck, 
  Scale, 
  Maximize2, 
  X, 
  AlertTriangle, 
  ArrowRight, 
  PhoneCall, 
  Sparkles,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Clock
} from 'lucide-react';
import { realGoldService, settingService } from '../services/api';

export default function RealGoldCollection() {
  const [items, setItems] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  // Full Screen Lightbox Modal State
  const [activeLightboxItem, setActiveLightboxItem] = useState(null);
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  // Disclaimer Alert Modal State
  const [showDisclaimerAlert, setShowDisclaimerAlert] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchGoldData = async () => {
      setLoading(true);
      try {
        const [goldItems, sets] = await Promise.all([
          realGoldService.getRealGoldItems(),
          settingService.getSettings()
        ]);
        setItems(goldItems);
        setSettings(sets);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchGoldData();
  }, []);

  const openLightbox = (item) => {
    setActiveLightboxItem(item);
    setActiveImgIndex(0);
  };

  const handleBuyClick = () => {
    setShowDisclaimerAlert(true);
  };

  const handleProceedToContact = () => {
    setShowDisclaimerAlert(false);
    setActiveLightboxItem(null);
    navigate('/contact');
  };

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-16 text-center text-gold font-bold">Loading Real Gold Showcase...</div>;
  }

  const rate22K = settings?.goldRate22K || 6850;
  const rate24K = settings?.goldRate24K || 7470;
  const rate18K = settings?.goldRate18K || 5600;
  const lastUpdated = settings?.goldRateLastUpdated ? new Date(settings.goldRateLastUpdated).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Today';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-[#FAF9F5] text-slate-800">
      
      {/* Page Title & Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 p-8 rounded-3xl text-center space-y-4 shadow-xl border border-gold/40 relative overflow-hidden">
        <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/40 text-gold text-xs px-4 py-1.5 rounded-full font-bold uppercase tracking-wider">
          <Crown className="w-4 h-4 text-gold" /> Master Craftsmen Gallery
        </div>

        <h1 className="font-luxury font-bold text-3xl sm:text-4xl text-gold-gradient">
          Real 22K/24K Gold Heirloom Showcase
        </h1>

        <p className="text-xs sm:text-sm text-gray-300 max-w-2xl mx-auto leading-relaxed">
          Exquisite solid gold masterpieces handcrafted by ancestral goldsmiths with certified 916 BIS Hallmark stamping. 
          <span className="block text-gold font-bold mt-1">* Note: Original gold items are for showroom inquiry and custom commission only.</span>
        </p>

        {/* TODAY'S OFFICIAL GOLD RATE TICKER BANNER */}
        <div className="pt-4 border-t border-gold/30 max-w-3xl mx-auto">
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-gold/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-white">
            
            <div className="flex items-center gap-2 text-gold">
              <TrendingUp className="w-5 h-5 text-gold" />
              <div className="text-left">
                <span className="text-[10px] uppercase font-bold text-amber-200 block">Today's Official Bullion Rates</span>
                <span className="text-xs text-gray-300 font-semibold flex items-center gap-1">
                  <Clock className="w-3 h-3 text-gold" /> Verified: {lastUpdated}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 sm:gap-6 text-center w-full sm:w-auto">
              <div className="bg-slate-900/80 px-3 py-1.5 rounded-xl border border-gold/30">
                <span className="text-[9px] text-amber-300 block font-bold uppercase">22K (916) Gold</span>
                <strong className="font-luxury font-bold text-sm text-gold">₹{rate22K.toLocaleString()} /g</strong>
              </div>

              <div className="bg-slate-900/80 px-3 py-1.5 rounded-xl border border-gold/30">
                <span className="text-[9px] text-amber-300 block font-bold uppercase">24K Pure Gold</span>
                <strong className="font-luxury font-bold text-sm text-amber-100">₹{rate24K.toLocaleString()} /g</strong>
              </div>

              <div className="bg-slate-900/80 px-3 py-1.5 rounded-xl border border-gold/30">
                <span className="text-[9px] text-amber-300 block font-bold uppercase">18K Gold</span>
                <strong className="font-luxury font-bold text-sm text-gold">₹{rate18K.toLocaleString()} /g</strong>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Real Gold Showcase Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((item) => (
          <div 
            key={item.id}
            onClick={() => openLightbox(item)}
            className="bg-white rounded-2xl border border-gold/30 overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-4 p-5">
              
              {/* Image Container */}
              <div className="aspect-square rounded-xl overflow-hidden relative border border-gold/20 bg-amber-50">
                <img 
                  src={item.images?.[0]} 
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />

                <span className="absolute top-3 left-3 bg-slate-900/90 text-gold text-[11px] font-bold px-3 py-1 rounded-full shadow border border-gold/40 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-gold" /> {item.purity || "22K (916) Gold"}
                </span>

                <span className="absolute bottom-3 right-3 bg-white/95 text-slate-900 text-[11px] font-bold px-3 py-1 rounded-full shadow border border-gold/40 flex items-center gap-1">
                  <Scale className="w-3.5 h-3.5 text-gold" /> {item.weightInGrams}
                </span>

                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="bg-slate-900 text-gold font-bold text-xs px-4 py-2 rounded-full shadow-gold-glow flex items-center gap-1.5">
                    <Maximize2 className="w-4 h-4" /> Inspect Full Screen
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[10px] bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider border border-gold/30">
                  {item.category}
                </span>
                <h3 className="font-luxury font-bold text-slate-900 text-lg mt-1 line-clamp-1 group-hover:text-gold transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-500 line-clamp-2 mt-1">{item.description}</p>
              </div>

            </div>

            {/* Card Footer */}
            <div className="p-4 bg-amber-50/50 border-t border-gold/20 flex items-center justify-between text-xs">
              <span className="font-bold text-amber-900 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-gold" /> Showroom Commission
              </span>
              <span className="font-luxury font-bold text-gold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                View Gold Details <ArrowRight className="w-4 h-4" />
              </span>
            </div>

          </div>
        ))}
      </div>

      {/* FULL SCREEN LIGHTBOX MODAL */}
      {activeLightboxItem && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-gold/50 max-w-4xl w-full overflow-hidden shadow-2xl relative max-h-[95vh] flex flex-col md:flex-row text-slate-800">
            
            {/* Close Button */}
            <button 
              onClick={() => setActiveLightboxItem(null)}
              className="absolute top-4 right-4 z-20 p-2 bg-slate-900/80 text-white hover:text-gold rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Left Column: Full Screen Image Carousel */}
            <div className="md:w-1/2 bg-slate-950 relative flex items-center justify-center p-6 min-h-[320px] md:min-h-[480px]">
              <img 
                src={activeLightboxItem.images?.[activeImgIndex] || activeLightboxItem.images?.[0]} 
                alt="" 
                className="max-h-[420px] w-full object-contain rounded-2xl"
              />

              {activeLightboxItem.images?.length > 1 && (
                <>
                  <button 
                    onClick={() => setActiveImgIndex((prev) => (prev > 0 ? prev - 1 : activeLightboxItem.images.length - 1))}
                    className="absolute left-3 p-2 bg-slate-900/70 text-white rounded-full hover:bg-gold hover:text-slate-900"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => setActiveImgIndex((prev) => (prev < activeLightboxItem.images.length - 1 ? prev + 1 : 0))}
                    className="absolute right-3 p-2 bg-slate-900/70 text-white rounded-full hover:bg-gold hover:text-slate-900"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Right Column: Item Information & Inquire/Buy Button */}
            <div className="md:w-1/2 p-6 sm:p-8 space-y-6 flex flex-col justify-between overflow-y-auto">
              
              <div className="space-y-4">
                
                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-slate-900 text-gold px-3 py-1 rounded-full font-bold uppercase tracking-wider border border-gold/40 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-gold" /> {activeLightboxItem.purity || "22K (916) Gold"}
                  </span>
                  <span className="text-[10px] bg-amber-100 text-amber-900 px-3 py-1 rounded-full font-bold uppercase tracking-wider border border-gold/40 flex items-center gap-1">
                    <Scale className="w-3.5 h-3.5 text-gold" /> {activeLightboxItem.weightInGrams}
                  </span>
                </div>

                <h2 className="font-luxury font-bold text-2xl text-slate-900">
                  {activeLightboxItem.title}
                </h2>

                <p className="text-xs text-gray-600 leading-relaxed border-t border-b border-gray-100 py-3">
                  {activeLightboxItem.description}
                </p>

                <div className="space-y-2 text-xs bg-amber-50/70 p-4 rounded-2xl border border-gold/30">
                  <div className="flex justify-between text-slate-900 font-bold">
                    <span>Gold Purity:</span>
                    <span className="text-gold">{activeLightboxItem.purity}</span>
                  </div>
                  <div className="flex justify-between text-slate-900 font-bold">
                    <span>Gram Weight:</span>
                    <span>{activeLightboxItem.weightInGrams}</span>
                  </div>
                  <div className="flex justify-between text-slate-900 font-bold">
                    <span>Category:</span>
                    <span>{activeLightboxItem.category}</span>
                  </div>
                </div>

              </div>

              {/* BUY / INQUIRE BUTTON -> TRIGGERS DISCLAIMER ALERT */}
              <button
                onClick={handleBuyClick}
                className="w-full bg-gold-gradient text-slate-900 font-luxury font-bold text-sm py-4 rounded-full shadow-gold-glow hover:scale-102 transition-transform flex items-center justify-center gap-2"
              >
                Inquire / Buy Real Gold <ArrowRight className="w-4 h-4" />
              </button>

            </div>

          </div>
        </div>
      )}

      {/* DISCLAIMER ALERT MODAL (WHEN BUY IS CLICKED) */}
      {showDisclaimerAlert && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white border-2 border-amber-500 max-w-md w-full p-6 sm:p-8 rounded-3xl space-y-6 text-slate-800 shadow-2xl relative text-center">
            
            <button 
              onClick={() => setShowDisclaimerAlert(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-slate-900"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 bg-amber-100 rounded-full border-2 border-amber-500 flex items-center justify-center mx-auto text-amber-600 animate-bounce">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="font-luxury font-bold text-xl text-amber-900">
                Important Notice: Real Gold Disclaimer
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed bg-amber-50 p-4 rounded-2xl border border-amber-200">
                We <strong>do NOT sell original 22K/24K gold items directly</strong> on this online website. Online checkout on Aureate Luxe is strictly reserved for <strong>1 Gram Micro-Gold Plated Replica Jewellery</strong>.
              </p>
            </div>

            <p className="text-xs text-gray-500">
              To purchase, inspect, or commission custom 22K/24K solid gold heirlooms, please contact our showroom master goldsmiths directly.
            </p>

            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={handleProceedToContact}
                className="w-full bg-gold-gradient text-slate-900 font-luxury font-bold text-xs py-3.5 rounded-full shadow-gold-glow hover:scale-102 transition-transform flex items-center justify-center gap-2"
              >
                <PhoneCall className="w-4 h-4" /> Proceed to Contact Us
              </button>

              <button
                onClick={() => setShowDisclaimerAlert(false)}
                className="w-full bg-gray-100 text-slate-700 font-bold text-xs py-3 rounded-full hover:bg-gray-200 transition-colors"
              >
                Close Disclaimer
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
