import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Star, Eye } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

export default function ProductCard({ product }) {
  const [hovered, setHovered] = useState(false);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const isWishlisted = isInWishlist(product.id);
  const isLowStock = product.stock <= 5;
  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(product, 1);
    toast.success(`Added "${product.name}" to bag!`, {
      icon: '✨',
      style: { background: '#FFF', color: '#D4AF37', border: '1px solid #D4AF37' }
    });
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
    if (!isWishlisted) {
      toast.info('Saved to Wishlist!', {
        icon: '💖',
        style: { background: '#FFF', color: '#D4AF37', border: '1px solid #D4AF37' }
      });
    }
  };

  const handleQuickBuy = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.info('Please log in to proceed with direct checkout', {
        style: { background: '#FFF', color: '#D4AF37', border: '1px solid #D4AF37' }
      });
      navigate('/login', { state: { redirect: '/checkout' } });
      return;
    }
    addToCart(product, 1);
    navigate('/checkout');
  };

  const primaryImage = product.images?.[0] || product.image;
  const secondaryImage = product.images?.[1] || primaryImage;

  return (
    <div 
      className="group relative bg-white rounded-2xl border border-amber-900/10 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden w-full"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Top Badges */}
      <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1 items-start">
        <span className="bg-slate-900/90 text-gold text-[9px] sm:text-[10px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-full border border-gold/40 shadow-xs">
          1 Gram Polish
        </span>
        {product.discountPercent > 0 && (
          <span className="bg-amber-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs">
            {product.discountPercent}% OFF
          </span>
        )}
        {isLowStock && !isOutOfStock && (
          <span className="bg-rose-600 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full shadow-xs animate-pulse">
            Only {product.stock} left!
          </span>
        )}
        {isOutOfStock && (
          <span className="bg-gray-800 text-gray-300 text-[9px] font-bold px-2 py-0.5 rounded">
            Out of Stock
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={handleWishlist}
        aria-label="Add to Wishlist"
        className="absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-gray-700 hover:text-rose-600 shadow border border-amber-900/10 transition-transform active:scale-95"
      >
        <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-600 text-rose-600' : ''}`} />
      </button>

      {/* Product Image Container */}
      <Link to={`/products/${product.id}`} className="block relative aspect-square overflow-hidden bg-amber-50/40">
        <img
          src={hovered ? secondaryImage : primaryImage}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* Hover Quick Overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
          <span className="bg-white/95 text-slate-900 hover:bg-gold font-bold text-[11px] py-1.5 px-3 rounded-full shadow flex items-center gap-1 transition-colors">
            <Eye className="w-3.5 h-3.5" /> Details
          </span>
        </div>
      </Link>

      {/* Card Content */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between space-y-2">
        <div>
          <div className="flex items-center justify-between text-[10px] sm:text-xs text-gray-500 mb-1">
            <span className="font-bold text-amber-800/80 line-clamp-1">{product.category}</span>
            <div className="flex items-center gap-1 text-amber-600 font-bold shrink-0">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
            </div>
          </div>

          <Link to={`/products/${product.id}`} className="block group-hover:text-amber-700 transition-colors">
            <h3 className="font-luxury font-bold text-xs sm:text-sm text-slate-900 line-clamp-2 leading-tight">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Pricing & Actions */}
        <div className="pt-2 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1">
              <strong className="font-bold text-sm sm:text-base text-slate-900">₹{product.price.toLocaleString()}</strong>
              {product.originalPrice > product.price && (
                <span className="text-[10px] sm:text-xs text-gray-400 line-through">₹{product.originalPrice.toLocaleString()}</span>
              )}
            </div>
            <span className="text-[9px] text-amber-800 block font-semibold leading-none">1 Gram Replica</span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleQuickBuy}
              disabled={isOutOfStock}
              className="text-[10px] sm:text-xs font-bold px-2 py-1.5 rounded-lg border border-gold/40 text-amber-900 hover:bg-gold/20 transition-colors disabled:opacity-50 flex-1 sm:flex-none text-center"
              title="Buy Now"
            >
              Buy
            </button>
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="bg-slate-900 hover:bg-gold text-gold hover:text-slate-900 font-bold p-1.5 rounded-lg transition-colors shadow-xs disabled:opacity-50"
              title="Add to Cart"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
