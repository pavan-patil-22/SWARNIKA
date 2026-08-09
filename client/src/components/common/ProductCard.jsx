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
      style: { background: '#111', color: '#D4AF37', border: '1px solid #D4AF37' }
    });
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
    if (!isWishlisted) {
      toast.info('Saved to Wishlist!', {
        icon: '💖',
        style: { background: '#111', color: '#FFF', border: '1px solid #D4AF37' }
      });
    }
  };

  const handleQuickBuy = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.info('Please log in to proceed with direct checkout', {
        style: { background: '#111', color: '#D4AF37' }
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
      className="group relative bg-white rounded-xl border border-amber-900/10 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Top Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start">
        <span className="bg-onyx/90 backdrop-blur-md text-gold text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full border border-gold/40 shadow-md">
          1 Gram Polish
        </span>
        {product.discountPercent > 0 && (
          <span className="bg-amber-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
            {product.discountPercent}% OFF
          </span>
        )}
        {isLowStock && !isOutOfStock && (
          <span className="bg-rose-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow animate-pulse">
            Only {product.stock} left!
          </span>
        )}
        {isOutOfStock && (
          <span className="bg-gray-800 text-gray-300 text-[10px] font-bold px-2 py-0.5 rounded">
            Out of Stock
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={handleWishlist}
        aria-label="Add to Wishlist"
        className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-gray-700 hover:text-rose-600 shadow border border-amber-900/10 transition-transform active:scale-95"
      >
        <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-600 text-rose-600' : ''}`} />
      </button>

      {/* Product Image Container */}
      <Link to={`/products/${product.id}`} className="block relative aspect-square overflow-hidden bg-gray-50">
        <img
          src={hovered ? secondaryImage : primaryImage}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500"
          loading="lazy"
        />
        {/* Hover Quick Overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
          <span className="bg-white/90 text-onyx hover:bg-gold hover:text-onyx font-semibold text-xs py-2 px-3.5 rounded-full shadow flex items-center gap-1.5 transition-colors">
            <Eye className="w-3.5 h-3.5" /> View Details
          </span>
        </div>
      </Link>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span className="font-medium text-amber-800/70">{product.category}</span>
            <div className="flex items-center gap-1 text-amber-600 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
              <span className="text-gray-400 font-normal">({product.reviewCount || 0})</span>
            </div>
          </div>

          <Link to={`/products/${product.id}`} className="block group-hover:text-amber-700 transition-colors">
            <h3 className="font-luxury font-semibold text-base text-gray-900 line-clamp-1">
              {product.name}
            </h3>
          </Link>

          <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5 italic">
            Imitation 1-Gram micro-gold plated set
          </p>
        </div>

        {/* Pricing & CTA */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-bold text-lg text-onyx">₹{product.price.toLocaleString()}</span>
              {product.originalPrice > product.price && (
                <span className="text-xs text-gray-400 line-through">₹{product.originalPrice.toLocaleString()}</span>
              )}
            </div>
            <span className="text-[9px] text-amber-700 block font-medium">1 Gram Replica • Non-gold</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleQuickBuy}
              disabled={isOutOfStock}
              className="text-[11px] font-bold px-2.5 py-1.5 rounded-lg border border-gold text-onyx hover:bg-gold/20 transition-colors disabled:opacity-50"
              title="Buy Now"
            >
              Buy Now
            </button>
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="bg-onyx hover:bg-gold text-gold hover:text-onyx font-semibold p-2 rounded-lg transition-colors shadow-sm disabled:opacity-50"
              title="Add to Cart"
            >
              <ShoppingBag className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
