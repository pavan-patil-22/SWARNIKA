import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2, ArrowLeft } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/common/ProductCard';

export default function Wishlist() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="border-b border-gray-200 pb-4 flex items-center justify-between">
        <div>
          <h1 className="font-luxury font-bold text-3xl text-onyx">My Saved Wishlist</h1>
          <p className="text-xs text-gray-500">Your favourite 1 Gram micro-gold plated jewellery pieces</p>
        </div>
        <span className="text-xs font-bold text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-gold/30">
          {wishlist.length} Saved Items
        </span>
      </div>

      {wishlist.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 space-y-4">
          <Heart className="w-16 h-16 text-gray-300 mx-auto" />
          <h2 className="font-luxury font-bold text-xl text-onyx">Your Wishlist is Empty</h2>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Save royal necklaces, bangles, and earrings to view them anytime.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-gold text-onyx font-bold text-xs px-6 py-3 rounded-full hover:bg-amber-300 transition-colors shadow"
          >
            <ArrowLeft className="w-4 h-4" /> Discover Collections
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlist.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
