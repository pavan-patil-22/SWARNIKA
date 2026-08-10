import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Star, 
  ShoppingBag, 
  Heart, 
  Truck, 
  RotateCcw, 
  ShieldCheck, 
  Sparkles, 
  Crown,
  ChevronRight
} from 'lucide-react';
import { productService, settingService } from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import JewelleryCareGuide from '../components/common/JewelleryCareGuide';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [returnDays, setReturnDays] = useState(7);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const prod = await productService.getProductById(id);
        const sets = await settingService.getSettings();

        if (prod) {
          setProduct(prod);
          const initialImg = prod.images?.[0] || prod.image;
          setSelectedImage(initialImg);
        }
        if (sets && sets.returnPolicyDays) {
          setReturnDays(sets.returnPolicyDays);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-16 text-center text-gold font-bold">Loading Product Details...</div>;
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="font-luxury font-bold text-2xl text-slate-900">Product Not Found</h2>
        <Link to="/products" className="text-gold hover:underline text-xs font-bold">Back to Catalogue</Link>
      </div>
    );
  }

  const isFavorited = isInWishlist(product.id);
  const imagesList = product.images?.length > 0 ? product.images : [product.image];

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`Added ${quantity} item(s) to shopping bag!`, {
      icon: '✨'
    });
  };

  const handleQuickBuy = () => {
    if (!isAuthenticated) {
      toast.info('Please log in to proceed with direct checkout');
      navigate('/login', { state: { redirect: '/checkout' } });
      return;
    }
    addToCart(product, quantity);
    navigate('/checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 bg-[#FAF9F5] text-slate-800">
      
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-gray-500">
        <Link to="/" className="hover:text-gold">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to="/products" className="hover:text-gold">Catalogue</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-slate-900 font-bold truncate">{product.name}</span>
      </nav>

      {/* Product Hero Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* Left: Product Images Gallery */}
        <div className="space-y-4">
          <div className="aspect-square bg-white rounded-2xl border border-gold/30 p-4 shadow-sm relative overflow-hidden flex items-center justify-center">
            <img src={selectedImage} alt={product.name} className="w-full h-full object-contain hover:scale-105 transition-transform duration-300" />
            <span className="absolute top-4 left-4 bg-amber-100 text-amber-900 border border-gold/40 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow">
              1 Gram Gold Polish
            </span>
          </div>

          {imagesList.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {imagesList.map((imgUrl, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(imgUrl)}
                  className={`aspect-square rounded-xl overflow-hidden border-2 p-1 bg-white transition-all ${
                    selectedImage === imgUrl ? 'border-gold shadow-gold-glow scale-105' : 'border-gray-200'
                  }`}
                >
                  <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Specification & Actions */}
        <div className="space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full border border-gold/30">
              Category: {product.category}
            </span>
            <h1 className="font-luxury font-bold text-2xl sm:text-4xl text-slate-900 leading-tight">
              {product.name}
            </h1>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1 text-gold font-bold">
                <Star className="w-4 h-4 fill-gold text-gold" />
                <span>{product.rating}</span>
                <span className="text-gray-400 font-normal">({product.reviewCount || 0} reviews)</span>
              </div>
              <span className="text-gray-400">|</span>
              <span className="text-gray-500 font-mono">SKU: {product.sku}</span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="p-4 rounded-2xl bg-white border border-gold/30 shadow-xs space-y-1">
            <div className="flex items-baseline gap-3">
              <strong className="font-luxury font-bold text-3xl text-slate-900">₹{product.price.toLocaleString()}</strong>
              {product.originalPrice > product.price && (
                <span className="text-sm text-gray-400 line-through">₹{product.originalPrice.toLocaleString()}</span>
              )}
              {product.discountPercent > 0 && (
                <span className="bg-rose-100 text-rose-700 text-xs font-extrabold px-2.5 py-0.5 rounded-full">
                  Save {product.discountPercent}%
                </span>
              )}
            </div>
            <p className="text-[11px] text-amber-900 font-bold">
              * Non-real gold: 1 Gram micro-gold electroplated brass/copper alloy item.
            </p>
          </div>

          {/* Product Description */}
          <div className="space-y-2">
            <h3 className="font-luxury font-bold text-sm text-slate-900">Craftsmanship Details</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              {product.description || "Designed with intricate heritage patterns and finished with a durable 1 Gram micro-gold plating for long-lasting shine and elegance."}
            </p>
          </div>

          {/* Quantity & Action Buttons */}
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-slate-700">Quantity:</span>
              <div className="flex items-center border border-gold/40 rounded-xl bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1.5 text-slate-700 font-bold hover:bg-amber-50"
                >
                  -
                </button>
                <span className="px-4 py-1.5 text-xs font-bold text-slate-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1.5 text-slate-700 font-bold hover:bg-amber-50"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-slate-900 text-gold border border-gold/40 font-luxury font-bold text-xs py-3.5 rounded-full hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4 text-gold" /> Add to Cart
              </button>

              <button
                onClick={handleQuickBuy}
                className="flex-1 bg-gold-gradient text-slate-900 font-luxury font-bold text-xs py-3.5 rounded-full shadow-gold-glow hover:scale-102 transition-transform flex items-center justify-center gap-2"
              >
                Buy Now (Direct Checkout)
              </button>

              <button
                onClick={() => toggleWishlist(product)}
                className={`p-3.5 rounded-full border border-gold/40 flex items-center justify-center transition-colors ${
                  isFavorited ? 'bg-rose-50 text-rose-600 border-rose-300' : 'bg-white text-slate-700 hover:text-rose-600'
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorited ? 'fill-rose-600' : ''}`} />
              </button>
            </div>
          </div>

          {/* Delivery & Assurance Cards */}
          <div className="grid grid-cols-2 gap-3 pt-4 text-xs">
            <div className="p-3 bg-white rounded-xl border border-gray-200 flex items-center gap-2.5">
              <Truck className="w-5 h-5 text-gold shrink-0" />
              <div>
                <strong className="block text-slate-900 text-[11px]">Free COD Shipping</strong>
                <span className="text-[10px] text-gray-500">Across India</span>
              </div>
            </div>

            <div className="p-3 bg-white rounded-xl border border-gray-200 flex items-center gap-2.5">
              <RotateCcw className="w-5 h-5 text-gold shrink-0" />
              <div>
                <strong className="block text-slate-900 text-[11px]">{returnDays} Days Easy Returns</strong>
                <span className="text-[10px] text-gray-500">Hassle-free policy</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* JEWELLERY CARE GUIDE COMPONENT */}
      <JewelleryCareGuide />

      {/* CUSTOMER REVIEWS (SHOWN ONLY IF REVIEWS ARE AVAILABLE) */}
      {product.reviews && product.reviews.length > 0 && (
        <section className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
          <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
            <div>
              <h3 className="font-luxury font-bold text-xl text-slate-900">Verified Buyer Reviews</h3>
              <p className="text-xs text-gray-500">Feedback submitted by customers after order delivery</p>
            </div>
            <span className="text-xs font-bold text-gold bg-amber-50 px-3 py-1 rounded-full border border-gold/30">
              ★ {product.rating} / 5.0 Rating
            </span>
          </div>

          <div className="space-y-4">
            {product.reviews.map((rev, index) => (
              <div key={index} className="p-4 rounded-xl bg-amber-50/40 border border-gold/20 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <strong className="text-slate-900 text-xs">{rev.userName}</strong>
                    <span className="text-[9px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold uppercase">
                      Verified Buyer
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-400">{rev.date}</span>
                </div>

                <div className="flex items-center text-amber-400">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>

                <p className="text-xs text-slate-700 italic">"{rev.comment}"</p>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
