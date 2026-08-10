import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  Crown,
  Scale,
  X,
  AlertTriangle,
  PhoneCall,
  BadgePercent,
  MessageSquarePlus,
  CheckCircle,
  Star
} from 'lucide-react';
import { productService, bannerService, offerService, realGoldService, settingService, reviewService, categoryService } from '../services/api';
import ProductCard from '../components/common/ProductCard';
import SkeletonCard from '../components/common/SkeletonCard';
import JewelleryCareGuide from '../components/common/JewelleryCareGuide';
import GuestGoldRateChart from '../components/common/GuestGoldRateChart';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [banners, setBanners] = useState([]);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [realGoldItems, setRealGoldItems] = useState([]);
  const [offers, setOffers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  // Real Gold Lightbox Modal State
  const [activeRealGoldItem, setActiveRealGoldItem] = useState(null);
  const [showDisclaimerAlert, setShowDisclaimerAlert] = useState(false);

  // Write Review Modal State
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [reviewCity, setReviewCity] = useState('');
  const [reviewProduct, setReviewProduct] = useState('1-Gram Micro Gold Jewellery');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const loadHomeData = async () => {
      setLoading(true);
      try {
        const [bans, prods, cats, realGold, offs, revs, sets] = await Promise.all([
          bannerService.getBanners(),
          productService.getProducts(),
          categoryService.getCategories(),
          realGoldService.getRealGoldItems(),
          offerService.getOffers(),
          reviewService.getReviews(),
          settingService.getSettings()
        ]);
        const safeBanners = Array.isArray(bans) ? bans : [];
        const safeProducts = Array.isArray(prods) ? prods : [];
        const safeCategories = Array.isArray(cats) ? cats : [];
        const safeRealGold = Array.isArray(realGold) ? realGold : [];
        const safeOffers = Array.isArray(offs) ? offs : [];
        const safeReviews = Array.isArray(revs) ? revs : [];

        setBanners(safeBanners.filter(b => b.active));
        setProducts(safeProducts);
        setCategories(safeCategories);
        setRealGoldItems(safeRealGold);
        setOffers(safeOffers.filter(o => o.active));
        setReviews(safeReviews);
        setSettings(sets || {});
      } catch (e) {
        console.error("Home data error", e);
      } finally {
        setLoading(false);
      }
    };
    loadHomeData();
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentBanner(prev => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners]);

  const safeProducts = Array.isArray(products) ? products : [];
  const featuredProducts = safeProducts.filter(p => p.featured).slice(0, 4);
  const bestSellers = safeProducts.filter(p => p.bestSeller).slice(0, 4);

  const rate22K = settings?.goldRate22K || 6850;
  const rate24K = settings?.goldRate24K || 7470;
  const rate18K = settings?.goldRate18K || 5600;

  // Calculate estimated gold price based on gram weight string
  const calculateEstimatedGoldPrice = (weightStr, purityStr) => {
    if (!weightStr) return null;
    const numericWeight = parseFloat(weightStr.replace(/[^0-9.]/g, ''));
    if (isNaN(numericWeight)) return null;

    let rate = rate22K;
    if (purityStr && purityStr.includes('24K')) rate = rate24K;
    if (purityStr && purityStr.includes('18K')) rate = rate18K;

    return Math.round(numericWeight * rate);
  };

  const handleOpenWriteReview = () => {
    if (!isAuthenticated) {
      toast.info("Please sign in to write a review & share feedback!");
      navigate('/login', { state: { redirect: '/' } });
      return;
    }
    setShowReviewModal(true);
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!reviewTitle.trim() || !reviewText.trim()) {
      toast.error("Please provide review headline and feedback details.");
      return;
    }

    setSubmittingReview(true);
    try {
      const newRev = await reviewService.submitReview({
        name: user.name || 'Valued Shopper',
        city: reviewCity.trim() || 'Verified Shopper',
        rating: reviewRating,
        title: reviewTitle.trim(),
        text: reviewText.trim(),
        product: reviewProduct
      });

      setReviews(prev => [newRev, ...prev]);
      setShowReviewModal(false);
      setReviewTitle('');
      setReviewText('');
      setReviewCity('');

      toast.success("Thank you! Your review has been published live in Loved Across India.");
    } catch (err) {
      toast.error("Failed to submit feedback. Please try again.");
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="space-y-8 sm:space-y-12 bg-[#FAF9F5] text-slate-800 pb-16">

      {/* 1. DAILY MARKET GOLD RATE TICKER BAR */}
      <section className="bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 text-gold border-b border-gold/40 py-2.5 px-4 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-4 text-xs font-semibold">
          
          <div className="flex items-center gap-2 shrink-0">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-amber-100 font-luxury font-bold uppercase tracking-wider text-[11px] sm:text-xs">Live Showroom Rates:</span>
          </div>

          <div className="flex items-center gap-4 sm:gap-6 text-[11px] font-mono whitespace-nowrap overflow-x-auto max-w-full no-scrollbar">
            <span className="flex items-center gap-1 shrink-0">
              <span className="text-gold font-sans font-bold">22K Gold:</span>
              <span className="text-white">₹{rate22K.toLocaleString()} /g</span>
            </span>

            <span className="flex items-center gap-1 shrink-0">
              <span className="text-amber-300 font-sans font-bold">24K Pure:</span>
              <span className="text-amber-100">₹{rate24K.toLocaleString()} /g</span>
            </span>

            <span className="flex items-center gap-1 shrink-0 hidden md:flex">
              <span className="text-amber-300 font-sans font-bold">18K Gold:</span>
              <span className="text-gold">₹{rate18K.toLocaleString()} /g</span>
            </span>
          </div>

          <Link to="/real-gold" className="text-[11px] text-amber-300 hover:text-gold font-bold underline flex items-center gap-1 shrink-0">
            View Real Gold Gallery <ArrowRight className="w-3 h-3" />
          </Link>

        </div>
      </section>

      {/* 2. HERO CAROUSEL BANNER */}
      <section className="relative bg-white border-b border-gold/30 shadow-xs overflow-hidden">
        {banners.length > 0 ? (
          <div className="relative min-h-[460px] sm:min-h-[500px] lg:min-h-[560px] w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center py-6 lg:py-8">
            
            {banners.map((banner, index) => (
              <div
                key={banner.id}
                className={`w-full grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center transition-opacity duration-1000 ${
                  index === currentBanner ? 'opacity-100 z-10 relative' : 'opacity-0 z-0 absolute inset-0 pointer-events-none'
                }`}
              >
                
                {/* Left Content Side */}
                <div className="lg:col-span-7 space-y-4 lg:space-y-5 bg-white z-20">
                  <span className="inline-flex items-center gap-2 bg-amber-50 text-amber-900 border border-gold/40 px-3.5 py-1 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-widest shadow-xs">
                    <Sparkles className="w-3.5 h-3.5 text-gold shrink-0" /> {banner.tag || "PREMIUM JEWELLERY COLLECTION"}
                  </span>
                  
                  <h1 className="font-luxury font-extrabold text-2xl sm:text-4xl lg:text-5xl xl:text-6xl text-slate-900 leading-[1.15] tracking-tight">
                    {banner.title}
                  </h1>

                  <p className="text-xs sm:text-sm lg:text-base text-slate-600 font-medium leading-relaxed max-w-xl">
                    {banner.subtitle}
                  </p>
                  
                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <Link
                      to={banner.buttonLink || "/products"}
                      className="bg-gold-gradient text-slate-900 font-luxury font-bold text-xs sm:text-sm px-6 py-3 rounded-full shadow-gold-glow hover:scale-105 transition-transform flex items-center gap-2"
                    >
                      {banner.buttonText || "EXPLORE COLLECTION"} <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                      to="/real-gold"
                      className="bg-slate-900 text-gold border border-gold/40 font-luxury font-bold text-xs sm:text-sm px-5 py-3 rounded-full hover:bg-slate-800 transition-colors flex items-center gap-2"
                    >
                      <Crown className="w-4 h-4 text-gold" /> REAL 22K SHOWCASE
                    </Link>
                  </div>

                  <div className="pt-2 text-[10px] sm:text-[11px] text-amber-900 font-bold">
                    * Note: Products in shopping cart are 1 Gram micro-gold plated replica pieces (Non-gold).
                  </div>
                </div>

                {/* Right Side: Responsive Full Image Container */}
                <div className="lg:col-span-5 relative w-full flex items-center justify-center">
                  <div className="relative w-full h-[260px] sm:h-[380px] lg:h-[480px] flex items-center justify-center">
                    <img
                      src={banner.imageUrl}
                      alt={banner.title}
                      className="w-full h-full object-contain max-h-full transition-transform duration-700"
                    />
                  </div>
                </div>

              </div>
            ))}

            {/* LIGHTWEIGHT SUBTLE CAROUSEL NAVIGATION BUTTONS */}
            {banners.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentBanner((currentBanner - 1 + banners.length) % banners.length)}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 p-2 bg-white/70 hover:bg-white text-slate-600 hover:text-gold border border-gold/30 rounded-full opacity-70 hover:opacity-100 backdrop-blur-xs transition-all shadow-xs"
                  aria-label="Previous Banner"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button
                  onClick={() => setCurrentBanner((currentBanner + 1) % banners.length)}
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 p-2 bg-white/70 hover:bg-white text-slate-600 hover:text-gold border border-gold/30 rounded-full opacity-70 hover:opacity-100 backdrop-blur-xs transition-all shadow-xs"
                  aria-label="Next Banner"
                >
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </>
            )}

          </div>
        ) : (
          <div className="h-96 flex items-center justify-center text-gold font-bold">Loading Banners...</div>
        )}
      </section>

      {/* 3. DYNAMIC CATEGORIES FROM BACKEND */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 sm:space-y-6">
        <div className="text-center space-y-1">
          <span className="text-[11px] text-amber-800 font-bold uppercase tracking-widest">Shop By Category</span>
          <h2 className="font-luxury font-bold text-xl sm:text-2xl text-slate-900">Popular Jewellery Categories</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {categories.map((cat) => (
            <Link 
              key={cat.id || cat._id}
              to={`/products?category=${encodeURIComponent(cat.name)}`} 
              className="group bg-white p-3 sm:p-4 rounded-2xl border border-gold/30 shadow-xs hover:border-gold hover:shadow-md transition-all text-center flex flex-col items-center"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-gold/40 mb-2 sm:mb-3 group-hover:scale-105 transition-transform bg-amber-50">
                <img 
                  src={cat.image || "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=400&q=80"} 
                  alt={cat.name} 
                  className="w-full h-full object-cover" 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=400&q=80";
                  }}
                />
              </div>
              <h3 className="font-luxury font-bold text-slate-900 text-xs sm:text-sm group-hover:text-gold transition-colors line-clamp-1">
                {cat.name}
              </h3>
              <span className="text-[10px] text-gray-500 font-medium line-clamp-1">
                {cat.description || "1 Gram Micro Gold"}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. REAL 22K GOLD SHOWCASE ROW WITH LIVE ESTIMATED VALUATION */}
      {realGoldItems.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          
          <div className="p-5 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 text-white shadow-xl border border-gold/40 relative overflow-hidden">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gold/30 pb-6">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/40 text-gold text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                  <Crown className="w-4 h-4 text-gold" /> Exclusive Showroom Collection
                </div>
                <h2 className="font-luxury font-bold text-xl sm:text-3xl text-gold-gradient">
                  Original 22K Solid Gold Collection
                </h2>
                <p className="text-xs text-gray-300 max-w-xl">
                  Original hallmarked real gold pieces. Live estimated value calculated from today's rate (₹{rate22K}/g for 22K).
                </p>
              </div>

              <Link
                to="/real-gold"
                className="bg-gold-gradient text-slate-900 font-luxury font-bold text-xs px-5 py-2.5 rounded-full shadow-gold-glow hover:scale-105 transition-transform self-start md:self-auto flex items-center gap-2"
              >
                View Full Real Gold Gallery <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Real Gold Showcase Row Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 pt-6">
              {realGoldItems.slice(0, 3).map((item) => {
                const estValue = calculateEstimatedGoldPrice(item.weight, item.purity);
                return (
                  <div
                    key={item.id || item._id}
                    onClick={() => setActiveRealGoldItem(item)}
                    className="bg-slate-900/90 border border-gold/30 hover:border-gold rounded-2xl p-4 space-y-3 cursor-pointer group transition-all duration-300 hover:-translate-y-1 shadow-lg"
                  >
                    <div className="relative aspect-4/3 overflow-hidden rounded-xl bg-slate-950 border border-gold/20">
                      <img
                        src={item.images?.[0] || item.image || "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80"}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-2 right-2 bg-amber-900/90 text-gold text-[10px] font-bold px-2.5 py-1 rounded-full border border-gold/40">
                        {item.purity || '22K Gold'}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h3 className="font-luxury font-bold text-gold text-base group-hover:text-amber-300 transition-colors line-clamp-1">
                        {item.name}
                      </h3>
                      <div className="flex items-center justify-between text-xs text-gray-300 pt-1">
                        <span className="flex items-center gap-1 font-bold text-amber-200">
                          <Scale className="w-3.5 h-3.5 text-gold" /> {item.weight || 'N/A'}
                        </span>
                        <span className="text-[10px] bg-gold/10 text-gold px-2 py-0.5 rounded border border-gold/30 font-semibold">
                          {item.category}
                        </span>
                      </div>

                      {estValue && (
                        <div className="pt-2 border-t border-gold/20 flex items-center justify-between">
                          <span className="text-[10px] text-gray-400">Today's Est. Market Value:</span>
                          <strong className="font-luxury font-bold text-sm text-gold-gradient">
                            ₹{estValue.toLocaleString()}*
                          </strong>
                        </div>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>

          </div>

        </section>
      )}

      {/* 4.5 REAL GOLD 30-DAY PRICE HISTORY CHART FOR GUESTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <GuestGoldRateChart settings={settings} />
      </section>

      {/* 5. FEATURED 1-GRAM IMITATION PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 sm:space-y-6">
        <div className="flex items-center justify-between border-b border-gold/30 pb-3">
          <div>
            <span className="text-[11px] text-gold font-bold uppercase tracking-wider">Curated Micro-Plated Pieces</span>
            <h2 className="font-luxury font-bold text-xl sm:text-2xl text-slate-900">Featured 1-Gram Collections</h2>
          </div>
          <Link to="/products" className="text-xs font-bold text-amber-800 hover:text-gold flex items-center gap-1">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6">
            {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* 6. ACTIVE OFFERS PROMO BANNER */}
      {offers.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-amber-950 p-6 sm:p-8 rounded-3xl text-white shadow-xl border border-gold/40 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <span className="bg-gold text-slate-900 font-extrabold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1">
                <BadgePercent className="w-3.5 h-3.5" /> Festive Offer Active
              </span>
              <h3 className="font-luxury font-bold text-2xl sm:text-3xl text-gold-gradient">
                {offers[0].title || "Flat 10% Off on Orders Above ₹1,999"}
              </h3>
              <p className="text-xs text-amber-100 max-w-xl">
                {offers[0].description || "Use coupon code at checkout to claim instant festival savings on all 1 Gram micro gold plated jewellery."}
              </p>
            </div>

            <div className="flex flex-col items-center md:items-end gap-2 shrink-0">
              <div className="bg-white/10 backdrop-blur-md border border-gold/40 px-5 py-2.5 rounded-2xl font-mono text-gold font-extrabold text-lg tracking-widest">
                CODE: {offers[0].code || "AUREATE10"}
              </div>
              <Link to="/products" className="bg-gold-gradient text-slate-900 font-luxury font-bold text-xs px-6 py-2.5 rounded-full shadow-gold-glow hover:scale-105 transition-transform">
                Shop Now
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 7. BEST SELLERS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 sm:space-y-6">
        <div className="flex items-center justify-between border-b border-gold/30 pb-3">
          <div>
            <span className="text-[11px] text-gold font-bold uppercase tracking-wider">Top Rated By Customers</span>
            <h2 className="font-luxury font-bold text-xl sm:text-2xl text-slate-900">Bestselling 1-Gram Designs</h2>
          </div>
          <Link to="/products" className="text-xs font-bold text-amber-800 hover:text-gold flex items-center gap-1">
            Browse All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6">
            {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6">
            {bestSellers.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* JEWELLERY CARE GUIDE */}
      <JewelleryCareGuide />

      {/* 8. LOVED ACROSS INDIA CUSTOMER REVIEWS GRID WITH SHARE REVIEW BUTTON */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gold/30 pb-4">
          <div>
            <span className="text-[11px] text-amber-800 font-bold uppercase tracking-widest block">Customer Testimonials</span>
            <h2 className="font-luxury font-bold text-xl sm:text-2xl text-slate-900">Loved Across India</h2>
          </div>

          <button
            onClick={handleOpenWriteReview}
            className="bg-gold-gradient text-slate-900 font-luxury font-bold text-xs px-5 py-2.5 rounded-full shadow-gold-glow hover:scale-105 transition-transform flex items-center gap-2 self-start sm:self-auto"
          >
            <MessageSquarePlus className="w-4 h-4" /> Share Your Review & Feedback
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {reviews.slice(0, 3).map((review) => (
            <div key={review.id || review._id} className="bg-white p-5 sm:p-6 rounded-2xl border border-gold/30 shadow-xs space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-1 text-gold">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < review.rating ? 'fill-gold text-gold' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <h4 className="font-luxury font-bold text-slate-900 text-base">"{review.title}"</h4>
                <p className="text-xs text-gray-600 leading-relaxed font-normal">
                  {review.text}
                </p>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-[11px]">
                <div>
                  <strong className="text-slate-900 block">{review.name}</strong>
                  <span className="text-gray-500">{review.city}</span>
                </div>
                <span className="text-[10px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-gold/30 font-medium">
                  Verified Purchase
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* LIGHTBOX MODAL FOR REAL GOLD ITEM DETAIL & INQUIRY DISCLAIMER WITH OUTSIDE BACKDROP CLICK CLOSE */}
      {activeRealGoldItem && (
        <div 
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setActiveRealGoldItem(null);
              setShowDisclaimerAlert(false);
            }
          }}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="bg-white border-2 border-gold max-w-2xl w-full rounded-3xl overflow-hidden shadow-2xl space-y-4 p-6 relative">
            <button
              onClick={() => {
                setActiveRealGoldItem(null);
                setShowDisclaimerAlert(false);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-slate-900 p-2"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              <div className="aspect-square rounded-2xl overflow-hidden border border-gold/30 bg-slate-950">
                <img
                  src={activeRealGoldItem.images?.[0] || activeRealGoldItem.image}
                  alt={activeRealGoldItem.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-3">
                <span className="bg-amber-100 text-amber-900 text-[10px] font-extrabold px-3 py-1 rounded-full border border-gold/40 uppercase">
                  {activeRealGoldItem.purity || '22K (916) BIS Hallmarked Gold'}
                </span>
                <h3 className="font-luxury font-bold text-2xl text-slate-900">
                  {activeRealGoldItem.name}
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {activeRealGoldItem.description || "Original handcrafted solid gold heirloom piece from SWARNIKA Davangere showroom."}
                </p>

                <div className="space-y-1 text-xs text-slate-800 bg-amber-50/70 p-3 rounded-xl border border-gold/30">
                  <div className="flex justify-between">
                    <span>Gold Weight:</span>
                    <strong className="text-gold font-bold">{activeRealGoldItem.weight}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Gold Purity:</span>
                    <strong className="text-slate-900">{activeRealGoldItem.purity || '22K (916) BIS Hallmarked Gold'}</strong>
                  </div>
                  {calculateEstimatedGoldPrice(activeRealGoldItem.weight, activeRealGoldItem.purity) && (
                    <div className="flex justify-between pt-1 border-t border-gold/20 text-sm">
                      <span>Est. Market Rate:</span>
                      <strong className="text-gold-gradient font-bold">
                        ₹{calculateEstimatedGoldPrice(activeRealGoldItem.weight, activeRealGoldItem.purity).toLocaleString()}
                      </strong>
                    </div>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setShowDisclaimerAlert(true)}
                    className="w-full bg-gold-gradient text-slate-900 font-luxury font-bold text-xs py-3 rounded-full shadow-gold-glow hover:scale-102 transition-transform flex items-center justify-center gap-2"
                  >
                    Buy / Reserve Showroom Item <PhoneCall className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* MANDATORY DISCLAIMER ALERT MODAL OVERLAY WITH OUTSIDE CLICK CLOSE */}
            {showDisclaimerAlert && (
              <div 
                onClick={(e) => {
                  if (e.target === e.currentTarget) setShowDisclaimerAlert(false);
                }}
                className="fixed inset-0 z-60 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
              >
                <div className="bg-white border-2 border-rose-500 max-w-md w-full p-6 rounded-3xl space-y-4 text-center shadow-2xl animate-fadeIn">
                  <div className="w-14 h-14 bg-rose-100 rounded-full border-2 border-rose-400 flex items-center justify-center mx-auto text-rose-600 shadow-md">
                    <AlertTriangle className="w-7 h-7" />
                  </div>

                  <h3 className="font-luxury font-bold text-xl text-slate-900">
                    Showroom Consultation Notice
                  </h3>

                  <p className="text-xs text-gray-600 leading-relaxed font-medium">
                    We do <strong>NOT</strong> sell original 22K/24K gold items directly online through this cart platform.
                  </p>

                  <div className="p-3 bg-amber-50 rounded-xl border border-gold/40 text-[11px] text-amber-900 text-left space-y-1">
                    <strong className="block font-bold text-amber-950 uppercase">How to Purchase Real Gold:</strong>
                    <span>1. Click below to navigate to our Contact Us & Consultation Page.</span><br/>
                    <span>2. Connect with our Davanagere showroom team via WhatsApp or Helpline.</span>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => setShowDisclaimerAlert(false)}
                      className="w-1/2 bg-gray-100 text-slate-700 text-xs font-bold py-2.5 rounded-full hover:bg-gray-200"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => {
                        setActiveRealGoldItem(null);
                        setShowDisclaimerAlert(false);
                        navigate('/contact');
                      }}
                      className="w-1/2 bg-gold-gradient text-slate-900 text-xs font-bold py-2.5 rounded-full shadow hover:scale-105 transition-transform"
                    >
                      Proceed to Contact Us
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* WRITE USER REVIEW MODAL WITH OUTSIDE BACKDROP CLICK CLOSE */}
      {showReviewModal && (
        <div 
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowReviewModal(false);
          }}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div className="bg-white border-2 border-gold max-w-lg w-full p-6 sm:p-8 rounded-3xl space-y-5 text-slate-800 shadow-2xl relative">
            <button
              onClick={() => setShowReviewModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-slate-900"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-1">
              <span className="bg-amber-100 text-amber-900 text-[10px] font-extrabold px-3 py-1 rounded-full border border-gold/40 uppercase tracking-wider">
                SWARNIKA Feedback Form
              </span>
              <h3 className="font-luxury font-bold text-2xl text-slate-900">
                Share Your Product Review
              </h3>
              <p className="text-xs text-gray-500">
                Your feedback will be published live under Loved Across India for shoppers.
              </p>
            </div>

            <form onSubmit={handleFeedbackSubmit} className="space-y-4 text-xs">
              
              {/* Star Rating Input */}
              <div className="text-center space-y-1">
                <label className="block text-gray-700 font-bold">Your Rating</label>
                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setReviewRating(star)}
                      className="p-1 focus:outline-none transition-transform hover:scale-125"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= (hoverRating || reviewRating)
                            ? 'fill-gold text-gold'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Review Headline / Summary *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Stunning 1 Gram Polish & Royal Finish!"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  className="w-full bg-amber-50/50 border border-gold/30 text-slate-900 p-3 rounded-xl font-medium focus:border-gold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Detailed Feedback *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Tell us about the shine, packaging, delivery speed, and elegance of your jewellery..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="w-full bg-amber-50/50 border border-gold/30 text-slate-900 p-3 rounded-xl font-medium focus:border-gold focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Your City / Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Hyderabad, TS"
                    value={reviewCity}
                    onChange={(e) => setReviewCity(e.target.value)}
                    className="w-full bg-amber-50/50 border border-gold/30 text-slate-900 p-2.5 rounded-xl font-medium focus:border-gold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Purchased Product</label>
                  <select
                    value={reviewProduct}
                    onChange={(e) => setReviewProduct(e.target.value)}
                    className="w-full bg-amber-50/50 border border-gold/30 text-slate-900 p-2.5 rounded-xl font-medium focus:border-gold focus:outline-none"
                  >
                    <option value="1-Gram Micro Gold Jewellery">1-Gram Micro Gold Jewellery</option>
                    <option value="Temple Choker Set">Temple Choker Set</option>
                    <option value="Bridal Long Haram">Bridal Long Haram</option>
                    <option value="Royal Bangles">Royal Bangles</option>
                    <option value="Temple Jhumkas">Temple Jhumkas</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={submittingReview}
                className="w-full bg-gold-gradient text-slate-900 font-luxury font-bold text-xs py-3.5 rounded-full shadow-gold-glow hover:scale-102 transition-transform flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-4 h-4" /> {submittingReview ? 'Publishing Review...' : 'Submit & Publish Live Review'}
              </button>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
