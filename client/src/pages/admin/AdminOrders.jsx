import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, 
  User, 
  Phone, 
  MapPin, 
  RotateCcw,
  ArrowRight
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { orderService } from '../../services/api';
import { toast } from 'react-toastify';

export default function AdminOrders() {
  const { allOrders = [], pendingReturnsCount, loadAllAdminData: reloadAdminData } = useAdmin();
  const orders = Array.isArray(allOrders) ? allOrders : [];
  const [filter, setFilter] = useState('ALL');

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const noteMap = {
        'Confirmed': 'COD Order Confirmed & Verified by Admin',
        'Packed': 'Order Packed in Velvet Gift Box & Tamper-Proof Sealed',
        'Shipped': 'Dispatched via Express Courier. Tracking ID: EXP-' + Math.floor(100000 + Math.random() * 900000),
        'Delivered': 'Cash Collected at Doorstep. Order Delivered Successfully',
        'Cancelled': 'Order Cancelled by Store Manager'
      };

      await orderService.updateOrderStatus(orderId, newStatus, noteMap[newStatus] || `Status updated to ${newStatus}`);
      toast.success(`Order ${orderId} updated to ${newStatus}`, { style: { background: '#FFF', color: '#D4AF37', border: '1px solid #D4AF37' } });
      reloadAdminData();
    } catch (e) {
      toast.error('Failed to update status');
    }
  };

  // Filter Counts
  const newOrdersCount = orders.filter(o => o.orderStatus === 'Confirmed').length;
  const pendingCount = orders.filter(o => o.orderStatus === 'Confirmed' || o.orderStatus === 'Packed').length;

  const filteredOrders = orders.filter(order => {
    if (filter === 'NEW') return order.orderStatus === 'Confirmed';
    if (filter === 'PENDING') return order.orderStatus === 'Confirmed' || order.orderStatus === 'Packed';
    if (filter === 'SHIPPED') return order.orderStatus === 'Shipped';
    if (filter === 'DELIVERED') return order.orderStatus === 'Delivered';
    return true;
  });

  return (
    <div className="space-y-6 text-slate-800">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <h2 className="font-luxury font-bold text-2xl text-gold-gradient flex items-center gap-2">
            <Package className="w-6 h-6 text-gold" /> Orders & Fulfilment Manager
          </h2>
          <p className="text-xs text-gray-500">Fast 1-click order fulfillment (Confirm, Pack, Ship, Deliver) for Cash on Delivery orders</p>
        </div>

        {/* Dedicated Link to Returns Manager */}
        {pendingReturnsCount > 0 && (
          <Link
            to="/admin/returns"
            className="bg-amber-50 hover:bg-gold hover:text-slate-900 text-amber-900 border border-gold/40 text-xs font-bold px-4 py-2.5 rounded-xl shadow flex items-center gap-2 transition-all animate-pulse"
          >
            <RotateCcw className="w-4 h-4 text-rose-600" />
            <span>Manage {pendingReturnsCount} Pending Return Request(s)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>

      {/* QUICK FILTER BAR TABS */}
      <div className="flex flex-wrap gap-2 text-xs bg-white p-2.5 rounded-2xl border border-gray-200 shadow-sm">
        
        <button
          onClick={() => setFilter('NEW')}
          className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
            filter === 'NEW'
              ? 'bg-gold-gradient text-slate-900 shadow-gold-glow'
              : 'bg-amber-50 text-amber-900 border border-gold/30 hover:bg-gold/20'
          }`}
        >
          🔥 NEW ORDERS <span className="bg-slate-900 text-gold text-[10px] px-2 py-0.5 rounded-full">{newOrdersCount}</span>
        </button>

        <button
          onClick={() => setFilter('PENDING')}
          className={`px-4 py-2 rounded-xl font-bold transition-all ${
            filter === 'PENDING'
              ? 'bg-gold-gradient text-slate-900 shadow-gold-glow'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          ⏳ PENDING FULFILMENT ({pendingCount})
        </button>

        <button
          onClick={() => setFilter('SHIPPED')}
          className={`px-4 py-2 rounded-xl font-bold transition-all ${
            filter === 'SHIPPED'
              ? 'bg-gold-gradient text-slate-900 shadow-gold-glow'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          🚚 SHIPPED
        </button>

        <button
          onClick={() => setFilter('DELIVERED')}
          className={`px-4 py-2 rounded-xl font-bold transition-all ${
            filter === 'DELIVERED'
              ? 'bg-gold-gradient text-slate-900 shadow-gold-glow'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          ✅ DELIVERED
        </button>

        <button
          onClick={() => setFilter('ALL')}
          className={`px-4 py-2 rounded-xl font-bold transition-all ${
            filter === 'ALL'
              ? 'bg-slate-900 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          ALL ORDERS ({orders.length})
        </button>

      </div>

      {/* ORDERS LIST */}
      <div className="space-y-6">
        {filteredOrders.map((order) => {
          const isNew = order.orderStatus === 'Confirmed';
          const hasReturnReq = order.returnStatus && order.returnStatus !== 'None';

          return (
            <div 
              key={order.id || order._id} 
              className={`bg-white rounded-2xl border p-6 space-y-6 shadow-sm transition-all ${
                isNew ? 'border-2 border-gold shadow-gold-glow' : 'border-gray-200'
              }`}
            >
              
              {/* Order Card Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-luxury font-bold text-xl text-gold-gradient">{order.id}</h3>
                    {isNew && (
                      <span className="bg-amber-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full animate-bounce">
                        NEW COD ORDER
                      </span>
                    )}
                    <span className="text-[10px] bg-amber-100 text-amber-900 px-3 py-0.5 rounded-full font-bold border border-gold/30">
                      {order.orderStatus}
                    </span>
                    {hasReturnReq && (
                      <Link to="/admin/returns" className="text-[10px] bg-rose-100 text-rose-800 px-2.5 py-0.5 rounded-full font-bold border border-rose-300 flex items-center gap-1 hover:underline">
                        <RotateCcw className="w-3 h-3 text-rose-600" /> Return Claim ({order.returnStatus})
                      </Link>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Placed: {new Date(order.createdAt).toLocaleString()} • Payment: <strong>{order.paymentMethod}</strong>
                  </p>
                </div>

                <div className="text-right">
                  <span className="font-luxury font-bold text-2xl text-slate-900 block">₹{order.total}</span>
                  <span className="text-[10px] text-gray-500">{order.items?.length} Items</span>
                </div>
              </div>

              {/* Customer Contact & Address Banner */}
              <div className="p-4 bg-amber-50/50 rounded-xl border border-gold/30 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="space-y-1">
                  <span className="font-bold text-amber-900 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-gold" /> Customer Name: {order.userName}
                  </span>
                  <span className="text-gray-600 block flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-gold" /> Mobile Phone: <strong>{order.phone || order.shippingAddress?.phone}</strong>
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="font-bold text-amber-900 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-gold" /> Delivery Address:
                  </span>
                  <p className="text-gray-600">
                    {order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.state} - <strong>{order.shippingAddress?.pincode}</strong>
                  </p>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Items in Parcel</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {order.items?.map(item => (
                    <div key={item.id} className="p-2.5 bg-gray-50 rounded-lg border border-gray-200 flex items-center gap-3 text-xs">
                      <img src={item.image} alt="" className="w-12 h-12 object-cover rounded border border-gold/30" />
                      <div>
                        <h4 className="font-bold text-slate-900 line-clamp-1">{item.name}</h4>
                        <span className="text-[10px] text-gray-500 font-mono">SKU: {item.sku}</span>
                        <span className="text-gold font-bold block">Qty: {item.quantity} x ₹{item.price}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 1-CLICK STATUS MODIFICATION ACTION BUTTONS */}
              <div className="pt-3 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <span className="font-bold text-slate-700">Quick Update Order Status:</span>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => handleStatusChange(order.id || order._id, 'Confirmed')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                      order.orderStatus === 'Confirmed' ? 'bg-amber-100 text-amber-900 border border-gold' : 'bg-gray-100 text-gray-600 hover:bg-amber-50'
                    }`}
                  >
                    Confirm
                  </button>

                  <button
                    onClick={() => handleStatusChange(order.id || order._id, 'Packed')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                      order.orderStatus === 'Packed' ? 'bg-amber-100 text-amber-900 border border-gold' : 'bg-gray-100 text-gray-600 hover:bg-amber-50'
                    }`}
                  >
                    Pack Parcel
                  </button>

                  <button
                    onClick={() => handleStatusChange(order.id || order._id, 'Shipped')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                      order.orderStatus === 'Shipped' ? 'bg-amber-100 text-amber-900 border border-gold' : 'bg-gray-100 text-gray-600 hover:bg-amber-50'
                    }`}
                  >
                    Ship Parcel
                  </button>

                  <button
                    onClick={() => handleStatusChange(order.id || order._id, 'Delivered')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                      order.orderStatus === 'Delivered' ? 'bg-emerald-600 text-white shadow' : 'bg-gray-100 text-gray-600 hover:bg-emerald-50'
                    }`}
                  >
                    Mark Delivered
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
