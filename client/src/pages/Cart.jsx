import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  Tag, 
  X 
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Cart() {
  const { 
    cartItems, 
    totalItemCount, 
    subtotal, 
    totalDiscount, 
    autoOfferDiscount, 
    appliedCoupon, 
    inclusiveTax, 
    deliveryFee, 
    deliveryChargeSetting,
    freeThreshold,
    grandTotal, 
    updateQuantity, 
    removeFromCart, 
    applyCouponCode, 
    removeCoupon 
  } = useCart();

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [couponInput, setCouponInput] = useState('');

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const success = await applyCouponCode(couponInput);
    if (success) setCouponInput('');
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-6 bg-[#FAF9F5]">
        <div className="w-20 h-20 bg-amber-50 rounded-full border border-gold/40 flex items-center justify-center mx-auto text-gold">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="font-luxury font-bold text-2xl text-slate-900">Your Shopping Cart is Empty</h2>
        <p className="text-xs text-gray-500 max-w-sm mx-auto">
          Explore our exclusive 1 Gram Micro-Gold Plated heirlooms and add festive radiance to your wardrobe.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 bg-gold-gradient text-slate-900 font-luxury font-bold text-xs px-8 py-3.5 rounded-full shadow-gold-glow hover:scale-105 transition-transform"
        >
          Explore 1-Gram Catalogue <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-[#FAF9F5] text-slate-800">
      
      {/* Title */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="font-luxury font-bold text-3xl text-gold-gradient">Shopping Cart</h1>
        <p className="text-xs text-gray-500">Click on any item to view its product detail page or adjust quantity below</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Free Shipping Alert Banner */}
          <div className="p-4 rounded-xl bg-white border border-gold/30 shadow-sm flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-gold shrink-0" />
              <span>
                {subtotal >= freeThreshold ? (
                  <strong className="text-emerald-700">Congratulations! You have unlocked FREE Express Delivery!</strong>
                ) : (
                  <span>
                    Add <strong>₹{(freeThreshold - subtotal).toLocaleString()}</strong> more to get <strong>FREE Express Shipping!</strong> (Standard Admin Fee: ₹{deliveryChargeSetting})
                  </span>
                )}
              </span>
            </div>
          </div>

          {/* Cart Table List */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden divide-y divide-gray-100">
            {cartItems.map((item) => (
              <div key={item.id} className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                
                {/* Clickable Item Link -> Navigates to Product Page */}
                <Link to={`/products/${item.id}`} className="flex items-center gap-4 group cursor-pointer">
                  <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-xl border border-gold/30 shrink-0 group-hover:scale-105 transition-transform" />
                  <div>
                    <span className="text-[10px] text-amber-800 font-bold uppercase tracking-wider block">1 Gram Micro Polish</span>
                    <h3 className="font-luxury font-bold text-slate-900 text-sm line-clamp-1 group-hover:text-gold transition-colors">{item.name}</h3>
                    <span className="text-[10px] text-gray-500 font-mono">SKU: {item.sku}</span>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="font-luxury font-bold text-gold text-sm">₹{item.price.toLocaleString()}</span>
                      {item.originalPrice > item.price && (
                        <span className="text-[11px] text-gray-400 line-through">₹{item.originalPrice.toLocaleString()}</span>
                      )}
                    </div>
                  </div>
                </Link>

                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-0 border-gray-100">
                  
                  {/* Quantity Controls */}
                  <div className="flex items-center border border-gold/40 rounded-lg bg-amber-50">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1.5 text-slate-700 hover:text-gold"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-bold text-slate-900">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1.5 text-slate-700 hover:text-gold"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Subtotal Item Price */}
                  <div className="text-right">
                    <span className="font-luxury font-bold text-slate-900 text-sm block">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </span>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-[10px] text-rose-600 hover:underline flex items-center gap-0.5 justify-end mt-1"
                    >
                      <Trash2 className="w-3 h-3" /> Remove
                    </button>
                  </div>

                </div>

              </div>
            ))}
          </div>

        </div>

        {/* Right Column: Order Summary Card */}
        <div className="space-y-6">
          
          <div className="bg-white p-6 rounded-2xl border border-gold/40 shadow-md space-y-6">
            <h3 className="font-luxury font-bold text-lg text-slate-900 border-b border-gray-100 pb-3">
              Order Total Calculation
            </h3>

            {/* Coupon Code Section */}
            <form onSubmit={handleApplyCoupon} className="space-y-2">
              <label className="block text-xs font-bold text-gray-700">Have a Promo Coupon?</label>
              {appliedCoupon ? (
                <div className="p-2.5 bg-amber-50 border border-gold/40 rounded-xl flex items-center justify-between text-xs">
                  <span className="font-bold text-amber-900 flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5 text-gold" /> {appliedCoupon}
                  </span>
                  <button type="button" onClick={removeCoupon} className="text-rose-600 hover:text-rose-800">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Enter coupon code (e.g. BUY2GOLD10)"
                    className="w-full bg-gray-50 text-xs border border-gray-300 text-slate-900 p-2.5 rounded-xl uppercase font-mono focus:border-gold"
                  />
                  <button
                    type="submit"
                    className="bg-amber-100 hover:bg-gold hover:text-slate-900 text-amber-900 text-xs font-bold px-4 rounded-xl transition-colors border border-gold/40"
                  >
                    Apply
                  </button>
                </div>
              )}
            </form>

            {/* Breakdown Price List */}
            <div className="space-y-3 text-xs border-t border-b border-gray-100 py-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({totalItemCount} items)</span>
                <strong className="text-slate-900">₹{subtotal.toLocaleString()}</strong>
              </div>

              {autoOfferDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span className="flex items-center gap-1"><Sparkles className="w-3 h-3 text-gold" /> Buy 2+ Offer (10% Off)</span>
                  <span>- ₹{autoOfferDiscount.toLocaleString()}</span>
                </div>
              )}

              {totalDiscount > 0 && autoOfferDiscount === 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Coupon Discount</span>
                  <span>- ₹{totalDiscount.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between text-gray-600">
                <span>GST Tax (3%)</span>
                <span className="text-emerald-700 font-bold">Included in Prices (₹{inclusiveTax})</span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Shipping Fee (Admin Set)</span>
                {deliveryFee === 0 ? (
                  <strong className="text-emerald-700 uppercase">FREE COD</strong>
                ) : (
                  <strong className="text-slate-900">₹{deliveryFee}</strong>
                )}
              </div>
            </div>

            {/* Grand Total */}
            <div className="flex justify-between items-center text-slate-900">
              <span className="font-luxury font-bold text-base">Grand Total</span>
              <span className="font-luxury font-bold text-2xl text-gold-gradient">₹{grandTotal.toLocaleString()}</span>
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => {
                if (!isAuthenticated) {
                  navigate('/login', { state: { redirect: '/checkout' } });
                } else {
                  navigate('/checkout');
                }
              }}
              className="w-full bg-gold-gradient text-slate-900 font-luxury font-bold text-sm py-4 rounded-full shadow-gold-glow hover:scale-102 transition-transform flex items-center justify-center gap-2"
            >
              Proceed to Checkout <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-[10px] text-gray-500 text-center space-y-1 pt-2">
              <div className="flex items-center justify-center gap-1 font-bold text-amber-900">
                <ShieldCheck className="w-3.5 h-3.5 text-gold" /> Cash on Delivery Available
              </div>
              <p>* All items are 1 Gram micro-gold electroplated brass replica pieces.</p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
