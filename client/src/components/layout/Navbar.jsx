import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Search, 
  ShoppingBag, 
  Heart, 
  User, 
  UserPlus,
  Crown, 
  LogOut, 
  Package, 
  MapPin, 
  Sparkles, 
  Menu, 
  X,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { productService } from '../../services/api';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { totalItemCount } = useCart();
  const { count: wishlistCount } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.trim().length > 1) {
        const all = await productService.getProducts();
        const filtered = all.filter(p => 
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.sku.toLowerCase().includes(searchQuery.toLowerCase())
        ).slice(0, 5);
        setSuggestions(filtered);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };
    const timer = setTimeout(fetchSuggestions, 250);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside search listener
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowSuggestions(false);
    }
  };

  const selectSuggestion = (item) => {
    setSearchQuery('');
    setShowSuggestions(false);
    navigate(`/products/${item.id}`);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gold/30 shadow-sm">
      
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 sm:h-24 lg:h-28 gap-2 lg:gap-4 xl:gap-6 py-2">
          
          {/* Left: Prominent Logo & Royal Brand Typography (Proportional Desktop Sizing) */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 shrink-0 group">
            {/* Shop Logo */}
            <img 
              src="/shoplogo.png" 
              alt="SWARNIKA Logo" 
              className="h-10 sm:h-14 lg:h-16 xl:h-18 w-auto object-contain transition-transform duration-300 group-hover:scale-105 shrink-0"
              onError={(e) => {
                e.target.onerror = null;
              }}
            />

            <div className="shrink-0 leading-tight">
              <span className="font-brand-royal font-black text-lg sm:text-2xl lg:text-3xl xl:text-4xl text-gold-royal tracking-[0.05em] sm:tracking-[0.1em] block uppercase whitespace-nowrap drop-shadow-xs">
                SWARNIKA
              </span>
              <span className="text-[8px] sm:text-[10px] lg:text-xs text-amber-900 font-extrabold tracking-[0.18em] sm:tracking-[0.25em] uppercase block mt-0.5 whitespace-nowrap opacity-90">
                LUXURY HERITAGE
              </span>
            </div>
          </Link>

          {/* Middle: Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-2.5 xl:gap-5 text-xs xl:text-sm font-bold text-slate-700 shrink-0">
            <Link 
              to="/" 
              className={`hover:text-gold transition-colors whitespace-nowrap ${location.pathname === '/' ? 'text-gold' : ''}`}
            >
              Home
            </Link>

            <Link 
              to="/products" 
              className={`hover:text-gold transition-colors whitespace-nowrap ${location.pathname === '/products' ? 'text-gold' : ''}`}
            >
              1-Gram Jewellery
            </Link>

            {/* Real 22K Gold Showcase Badge Link */}
            <Link 
              to="/real-gold" 
              className="bg-amber-50 hover:bg-gold hover:text-slate-900 text-amber-900 border border-gold/40 text-xs px-3 py-1.5 xl:px-3.5 xl:py-2 rounded-full font-luxury font-bold flex items-center gap-1.5 transition-all shadow-xs whitespace-nowrap shrink-0"
            >
              <Crown className="w-3.5 h-3.5 text-gold shrink-0" />
              <span className="whitespace-nowrap">Real 22K Gold</span>
            </Link>

            <Link 
              to="/categories" 
              className={`hover:text-gold transition-colors whitespace-nowrap ${location.pathname === '/categories' ? 'text-gold' : ''}`}
            >
              Categories
            </Link>

            <Link 
              to="/offers" 
              className="hover:text-gold transition-colors flex items-center gap-1 whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5 text-gold shrink-0" />
              <span className="whitespace-nowrap">Offers</span>
            </Link>

            <Link 
              to="/about" 
              className={`hover:text-gold transition-colors whitespace-nowrap ${location.pathname === '/about' ? 'text-gold' : ''}`}
            >
              About Us
            </Link>

            <Link 
              to="/contact" 
              className={`hover:text-gold transition-colors whitespace-nowrap ${location.pathname === '/contact' ? 'text-gold' : ''}`}
            >
              Contact
            </Link>
          </nav>

          {/* Live Search Bar */}
          <div ref={searchRef} className="relative hidden xl:block flex-1 max-w-[180px] xl:max-w-[240px]">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.trim().length > 1 && setShowSuggestions(true)}
                placeholder="Search SWARNIKA gold..."
                className="w-full bg-amber-50/50 text-slate-900 placeholder-gray-400 text-xs rounded-full py-2 pl-8 pr-3 border border-gold/30 focus:outline-none focus:border-gold transition-colors"
              />
              <Search className="w-3.5 h-3.5 text-gold absolute left-2.5 top-1/2 -translate-y-1/2" />
            </form>

            {/* Dropdown Live Suggestions */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gold/40 rounded-xl shadow-2xl overflow-hidden z-50">
                <div className="p-2 border-b border-gray-100 text-[10px] text-amber-800 uppercase tracking-wider font-bold">
                  Suggested SWARNIKA Pieces
                </div>
                {suggestions.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => selectSuggestion(item)}
                    className="w-full text-left p-2.5 hover:bg-amber-50 flex items-center gap-3 border-b border-gray-100 last:border-none transition-colors"
                  >
                    <img src={item.images?.[0] || item.image} alt={item.name} className="w-9 h-9 object-cover rounded border border-gold/30" />
                    <div>
                      <h4 className="text-xs text-slate-900 font-bold line-clamp-1">{item.name}</h4>
                      <span className="text-[10px] text-gold font-bold">₹{item.price.toLocaleString()}</span>
                      <span className="text-[9px] text-gray-500 ml-2">1 Gram Polish</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">

            {/* Wishlist */}
            <Link to="/wishlist" className="relative p-1.5 text-slate-700 hover:text-gold transition-colors shrink-0">
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold text-slate-900 font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Drawer Button */}
            <Link to="/cart" className="relative p-1.5 text-slate-700 hover:text-gold transition-colors shrink-0">
              <ShoppingBag className="w-5 h-5" />
              {totalItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold text-slate-900 font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                  {totalItemCount}
                </span>
              )}
            </Link>

            {/* Auth Menu / Profile / Sign In Buttons */}
            {isAuthenticated ? (
              <div className="relative shrink-0">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-1 p-1 rounded-full hover:bg-amber-50 transition-colors border border-gold/30"
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gold-gradient text-slate-900 font-bold text-xs flex items-center justify-center shadow-xs">
                    {user.name?.charAt(0) || 'U'}
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-500 hidden sm:block" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-gold/30 rounded-2xl shadow-xl py-2 z-50 text-xs text-slate-800">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="font-bold text-slate-900">{user.name}</p>
                      <p className="text-[10px] text-gray-500 line-clamp-1">{user.email}</p>
                    </div>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 hover:bg-amber-50 text-amber-900 font-bold"
                      >
                        <Crown className="w-4 h-4 text-gold" /> Admin Dashboard
                      </Link>
                    )}

                    <Link
                      to="/orders"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 hover:bg-amber-50"
                    >
                      <Package className="w-4 h-4 text-gold" /> My Orders & Tracking
                    </Link>

                    <Link
                      to="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 hover:bg-amber-50"
                    >
                      <User className="w-4 h-4 text-gold" /> Account Profile
                    </Link>

                    <Link
                      to="/addresses"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 hover:bg-amber-50"
                    >
                      <MapPin className="w-4 h-4 text-gold" /> Saved Addresses
                    </Link>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                      }}
                      className="w-full text-left flex items-center gap-2 px-4 py-2.5 hover:bg-rose-50 text-rose-600 font-bold border-t border-gray-100"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden lg:flex items-center gap-1.5 shrink-0">
                <Link
                  to="/login"
                  className="bg-gold-gradient text-slate-900 font-luxury font-bold text-[11px] sm:text-xs px-3 sm:px-4 py-1.5 sm:py-2.5 rounded-full shadow-gold-glow hover:scale-105 transition-transform flex items-center gap-1 whitespace-nowrap shrink-0"
                >
                  <User className="w-3.5 h-3.5 shrink-0" />
                  <span className="whitespace-nowrap">Sign In</span>
                </Link>

                <Link
                  to="/register"
                  className="bg-slate-900 text-gold border border-gold/40 font-luxury font-bold text-[11px] sm:text-xs px-3 sm:px-4 py-1.5 sm:py-2.5 rounded-full hover:bg-slate-800 transition-all hidden xs:flex items-center gap-1 whitespace-nowrap shrink-0"
                >
                  <UserPlus className="w-3.5 h-3.5 text-gold shrink-0" />
                  <span className="whitespace-nowrap">Register</span>
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 text-slate-700 hover:text-gold shrink-0"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-gold/30 px-4 py-4 space-y-3 text-sm font-semibold text-slate-800 shadow-2xl animate-fadeIn">
          
          {!isAuthenticated && (
            <div className="pb-3 border-b border-gray-100 flex items-center gap-2">
              <Link 
                to="/login" 
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 bg-gold-gradient text-slate-900 font-luxury font-bold text-xs py-2.5 rounded-full text-center shadow-gold-glow flex items-center justify-center gap-1.5"
              >
                <User className="w-3.5 h-3.5" /> Sign In
              </Link>

              <Link 
                to="/register" 
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 bg-slate-900 text-gold border border-gold/40 font-luxury font-bold text-xs py-2.5 rounded-full text-center flex items-center justify-center gap-1.5"
              >
                <UserPlus className="w-3.5 h-3.5 text-gold" /> Register
              </Link>
            </div>
          )}

          <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block py-2 hover:text-gold transition-colors">Home</Link>
          <Link to="/products" onClick={() => setMobileMenuOpen(false)} className="block py-2 hover:text-gold transition-colors">1-Gram Jewellery</Link>
          <Link to="/real-gold" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-amber-900 font-bold flex items-center gap-1.5">
            <Crown className="w-4 h-4 text-gold" /> Real 22K Gold Showcase
          </Link>
          <Link to="/categories" onClick={() => setMobileMenuOpen(false)} className="block py-2 hover:text-gold transition-colors">Categories</Link>
          <Link to="/offers" onClick={() => setMobileMenuOpen(false)} className="block py-2 flex items-center gap-1.5 hover:text-gold transition-colors">
            <Sparkles className="w-4 h-4 text-gold" /> Offers & Discounts
          </Link>
          <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="block py-2 hover:text-gold transition-colors">About Us</Link>
          <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="block py-2 hover:text-gold transition-colors">Contact</Link>
        </div>
      )}

    </header>
  );
}
