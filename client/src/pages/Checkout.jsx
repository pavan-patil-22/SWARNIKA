import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/api';
import { toast } from 'react-toastify';
import { ShieldCheck, Truck, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function Checkout() {
  const { cartItems, subtotal, totalDiscount, inclusiveTax, deliveryFee, grandTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.name || '',
    street: '',
    city: '',
    state: 'Karnataka',
    pincode: '',
    phone: user?.phone || ''
  });

  const [submitting, setSubmitting] = useState(false);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!shippingAddress.fullName || !shippingAddress.street || !shippingAddress.city || !shippingAddress.pincode || !shippingAddress.phone) {
      toast.error('Please complete all shipping address fields');
      return;
    }

    setSubmitting(true);
    try {
      const orderPayload = {
        userId: user?.id || user?.email || "usr-001",
        userName: shippingAddress.fullName,
        userEmail: user?.email || "user@gmail.com",
        phone: shippingAddress.phone,
        items: cartItems,
        shippingAddress,
        subtotal,
        discount: totalDiscount,
        tax: 0,
        deliveryFee,
        total: grandTotal,
        paymentMethod: "Cash on Delivery",
        paymentStatus: "Pending COD Collection"
      };

      const createdOrder = await orderService.createOrder(orderPayload);
      clearCart();
      toast.success(`Order #${createdOrder.id} placed successfully via Cash on Delivery!`, {
        style: { background: '#FFF', color: '#D4AF37', border: '1px solid #D4AF37' }
      });
      navigate('/orders');
    } catch (err) {
      console.error(err);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-[#FAF9F5] text-slate-800">
      
      <div className="border-b border-gray-200 pb-4">
        <h1 className="font-luxury font-bold text-3xl text-gold-gradient">Cash on Delivery Checkout</h1>
        <p className="text-xs text-gray-500">Provide shipping address details. Pay when your 1-gram jewellery parcel arrives.</p>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Shipping Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <h3 className="font-luxury font-bold text-lg text-slate-900 border-b border-gray-100 pb-3 flex items-center gap-2">
              <Truck className="w-5 h-5 text-gold" /> Shipping Address & Contact Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Full Receiver Name</label>
                <input
                  type="text"
                  required
                  value={shippingAddress.fullName}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-300 text-slate-900 p-3 rounded-xl focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Mobile Contact Phone</label>
                <input
                  type="text"
                  required
                  value={shippingAddress.phone}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                  placeholder="+91 9876543210"
                  className="w-full bg-gray-50 border border-gray-300 text-slate-900 p-3 rounded-xl focus:border-gold"
                />
              </div>
            </div>

            <div className="text-xs">
              <label className="block text-slate-700 font-bold mb-1">House / Building / Street Address</label>
              <input
                type="text"
                required
                value={shippingAddress.street}
                onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                placeholder="e.g. #42, 3rd Cross, Indiranagar"
                className="w-full bg-gray-50 border border-gray-300 text-slate-900 p-3 rounded-xl focus:border-gold"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">City / District</label>
                <input
                  type="text"
                  required
                  value={shippingAddress.city}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                  placeholder="e.g. Bengaluru"
                  className="w-full bg-gray-50 border border-gray-300 text-slate-900 p-3 rounded-xl focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">State</label>
                <input
                  type="text"
                  required
                  value={shippingAddress.state}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-300 text-slate-900 p-3 rounded-xl focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Pincode</label>
                <input
                  type="text"
                  required
                  value={shippingAddress.pincode}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, pincode: e.target.value })}
                  placeholder="e.g. 560038"
                  className="w-full bg-gray-50 border border-gray-300 text-slate-900 p-3 rounded-xl focus:border-gold"
                />
              </div>
            </div>
          </div>

          <div className="p-4 bg-amber-50 rounded-2xl border border-gold/40 text-xs text-amber-900 flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-gold shrink-0" />
            <div>
              <strong className="block text-amber-800 uppercase tracking-wider font-luxury">Payment Method: Cash on Delivery</strong>
              <span>Pay exact amount of ₹{grandTotal.toLocaleString()} to delivery executive when parcel arrives.</span>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gold/40 shadow-md space-y-6">
            <h3 className="font-luxury font-bold text-lg text-slate-900 border-b border-gray-100 pb-3">
              Items in Order ({cartItems.length})
            </h3>

            <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
              {cartItems.map(item => (
                <div key={item.id} className="flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <img src={item.image} alt="" className="w-10 h-10 object-cover rounded border border-gold/30" />
                    <div>
                      <h4 className="font-bold text-slate-900 line-clamp-1">{item.name}</h4>
                      <span className="text-gray-500">Qty: {item.quantity}</span>
                    </div>
                  </div>
                  <strong className="text-slate-900">₹{(item.price * item.quantity).toLocaleString()}</strong>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-xs border-t border-b border-gray-100 py-3">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <strong className="text-slate-900">₹{subtotal.toLocaleString()}</strong>
              </div>

              {totalDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Discount</span>
                  <span>- ₹{totalDiscount.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between text-gray-600">
                <span>Taxes (3% GST)</span>
                <span className="text-emerald-700 font-bold">Included in Prices (₹{inclusiveTax})</span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                {deliveryFee === 0 ? (
                  <strong className="text-emerald-700 uppercase">FREE COD</strong>
                ) : (
                  <strong className="text-slate-900">₹{deliveryFee}</strong>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center text-slate-900">
              <span className="font-luxury font-bold text-base">Amount Payable</span>
              <span className="font-luxury font-bold text-2xl text-gold-gradient">₹{grandTotal.toLocaleString()}</span>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gold-gradient text-slate-900 font-luxury font-bold text-sm py-4 rounded-full shadow-gold-glow hover:scale-102 transition-transform flex items-center justify-center gap-2"
            >
              {submitting ? 'Processing Order...' : 'Confirm & Place COD Order'} <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-[10px] text-gray-500 text-center space-y-1">
              <div className="flex items-center justify-center gap-1 font-bold text-amber-900">
                <ShieldCheck className="w-3.5 h-3.5 text-gold" /> 1 Gram Jewellery Quality Guarantee
              </div>
              <p>Packed in velvet box with authenticity certificate. You pay when courier arrives.</p>
            </div>
          </div>
        </div>

      </form>
    </div>
  );
}
