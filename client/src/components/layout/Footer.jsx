import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Gift, 
  Mail, 
  Phone, 
  MapPin, 
  Send
} from 'lucide-react';
import { FaInstagram } from 'react-icons/fa';
import { toast } from 'react-toastify';

export default function Footer() {
  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    toast.success('Thank you for subscribing to SWARNIKA LUXURY HERITAGE updates!', {
      style: { background: '#FFF', color: '#D4AF37', border: '1px solid #D4AF37' }
    });
  };

  const instagramImages = [
    "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=300&q=80",
    "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=300&q=80",
    "https://i.pinimg.com/1200x/b1/cd/b8/b1cdb8fe7410dcfa9659f938d11ceb4e.jpg",
    "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=300&q=80",
    "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=300&q=80",
    "https://i.pinimg.com/736x/96/a2/9c/96a29ceedc7dae76e4f039d167a723bc.jpg"
  ];

  return (
    <footer className="bg-white text-slate-700 border-t border-gold/30 pt-12 pb-8">
      {/* Trust Badges Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 rounded-2xl bg-amber-50/50 border border-gold/30 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-gold/10 text-amber-800 border border-gold/30">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-luxury font-bold text-slate-900 text-sm">Express Shipping</h4>
              <p className="text-[11px] text-gray-500">Cash on Delivery Across India</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-gold/10 text-amber-800 border border-gold/30">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-luxury font-bold text-slate-900 text-sm">7-Day Easy Returns</h4>
              <p className="text-[11px] text-gray-500">Hassle-free return policy</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-gold/10 text-amber-800 border border-gold/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-luxury font-bold text-slate-900 text-sm">1 Gram Polish Guarantee</h4>
              <p className="text-[11px] text-gray-500">High-durability micro gold plating</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-gold/10 text-amber-800 border border-gold/30">
              <Gift className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-luxury font-bold text-slate-900 text-sm">Luxury Velvet Box</h4>
              <p className="text-[11px] text-gray-500">Tamper-proof gift packaging</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-gray-200">
        
        {/* Brand Info */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-3.5">
            <img 
              src="/logoSHOP.png" 
              alt="SWARNIKA Logo" 
              className="h-16 sm:h-20 w-auto object-contain"
              onError={(e) => {
                e.target.onerror = null;
              }}
            />
            <div className="leading-tight">
              <span className="font-brand-royal font-black text-2xl sm:text-3xl text-gold-royal tracking-widest block uppercase">SWARNIKA</span>
              <span className="text-[10px] sm:text-xs text-amber-900 font-extrabold tracking-[0.25em] uppercase block mt-0.5 opacity-90">LUXURY HERITAGE</span>
            </div>
          </div>
          <p className="text-xs leading-relaxed text-gray-600">
            <strong>SWARNIKA LUXURY HERITAGE</strong> is India's premier destination for handcrafted <strong>1 Gram Micro-Gold Plated Replica Jewellery</strong> & 22K Solid Gold Showroom Heirlooms. Designed for regal celebration elegance.
          </p>
          <div className="p-3 rounded-lg bg-amber-50 border border-gold/30 text-[11px] text-amber-900 leading-snug">
            <strong className="block text-amber-800 uppercase tracking-wider mb-1">Important Product Notice:</strong>
            Online cart purchases are strictly reserved for 1 Gram micro-gold plated replica jewellery. Original 22K/24K solid gold pieces are for showroom inquiry & custom commission only.
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-luxury font-bold text-slate-900 text-sm mb-4 text-gold border-b border-gold/30 pb-1">
            Collections
          </h4>
          <ul className="space-y-2 text-xs font-medium">
            <li><Link to="/products?category=Necklace%20Sets" className="hover:text-gold transition-colors">1 Gram Choker Sets</Link></li>
            <li><Link to="/products?category=Royal%20Bangles" className="hover:text-gold transition-colors">Micro-Plated Bangles</Link></li>
            <li><Link to="/products?category=Bridal%20Harams" className="hover:text-gold transition-colors">Bridal Long Harams</Link></li>
            <li><Link to="/products?category=Temple%20Earrings" className="hover:text-gold transition-colors">Temple Jhumkas</Link></li>
            <li><Link to="/real-gold" className="hover:text-gold transition-colors font-bold text-amber-900">Real 22K Gold Showcase</Link></li>
          </ul>
        </div>

        {/* Customer Care */}
        <div>
          <h4 className="font-luxury font-bold text-slate-900 text-sm mb-4 text-gold border-b border-gold/30 pb-1">
            Customer Care
          </h4>
          <ul className="space-y-2 text-xs font-medium">
            <li><Link to="/orders" className="hover:text-gold transition-colors">Track Order & Timeline</Link></li>
            <li><Link to="/offers" className="hover:text-gold transition-colors">Active Offers & Coupons</Link></li>
            <li><Link to="/about" className="hover:text-gold transition-colors">Jewellery Care Guide</Link></li>
            <li><Link to="/contact" className="hover:text-gold transition-colors">Return Policy & Support</Link></li>
            <li><Link to="/login" className="hover:text-gold transition-colors">Account Login</Link></li>
          </ul>
        </div>

        {/* Newsletter & Contact */}
        <div>
          <h4 className="font-luxury font-bold text-slate-900 text-sm mb-4 text-gold border-b border-gold/30 pb-1">
            SWARNIKA Connect
          </h4>
          <form onSubmit={handleNewsletterSubmit} className="space-y-2 mb-4">
            <p className="text-[11px] text-gray-500">Subscribe for luxury drops & discounts:</p>
            <div className="flex">
              <input
                type="email"
                required
                placeholder="Enter email..."
                className="w-full bg-gray-50 border border-gold/40 text-xs text-slate-900 p-2 rounded-l focus:outline-none focus:border-gold"
              />
              <button type="submit" className="bg-gold-gradient text-slate-900 font-bold px-3 rounded-r hover:brightness-105 transition-all">
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          <div className="space-y-2 text-[11px] text-gray-600">
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-gold shrink-0" />
              <a href="mailto:swarnika.luxury@gmail.com" className="hover:text-gold transition-colors font-semibold">swarnika.luxury@gmail.com</a>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-gold shrink-0" />
              <a href="tel:9481304117" className="hover:text-gold transition-colors font-semibold">94813 04117</a>
            </div>
            <div className="flex items-center gap-2">
              <FaInstagram className="w-3.5 h-3.5 text-gold shrink-0" />
              <a href="https://www.instagram.com/swarnika.luxury" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors font-semibold">
                @swarnika.luxury
              </a>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-gold shrink-0" />
              <span>SWARNIKA Showroom, Davanagere, IN</span>
            </div>
          </div>
        </div>

      </div>

      {/* Instagram Link & Feed Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-2">
          <h4 className="font-luxury font-bold text-slate-900 text-sm flex items-center gap-2">
            <FaInstagram className="w-4 h-4 text-gold" /> Follow @swarnika.luxury on Instagram
          </h4>
          <a 
            href="https://www.instagram.com/swarnika.luxury" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs text-gold hover:underline font-bold"
          >
            Visit Instagram Profile →
          </a>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {instagramImages.map((imgUrl, i) => (
            <a key={i} href="https://www.instagram.com/swarnika.luxury" target="_blank" rel="noopener noreferrer" className="relative aspect-square overflow-hidden rounded-lg group cursor-pointer border border-gold/20">
              <img src={imgUrl} alt="SWARNIKA Instagram" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute inset-0 bg-white/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-amber-800">
                <FaInstagram className="w-5 h-5" />
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
        <p>© 2026 SWARNIKA LUXURY HERITAGE. All rights reserved.</p>
        <div className="flex items-center gap-4 text-gray-500 font-medium">
          <span>Cash on Delivery Available</span>
          <span>•</span>
          <span>Davangere Showroom</span>
        </div>
      </div>
    </footer>
  );
}
