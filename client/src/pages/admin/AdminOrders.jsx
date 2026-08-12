import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, 
  User, 
  Phone, 
  MapPin, 
  RotateCcw,
  AlertTriangle,
  X,
  CheckCircle
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { orderService } from '../../services/api';
import { toast } from 'react-toastify';

export default function AdminOrders() {
  const { allOrders = [], pendingReturnsCount, loadAllAdminData: reloadAdminData } = useAdmin();
  const orders = Array.isArray(allOrders) ? allOrders : [];
  const [filter, setFilter] = useState('ALL');

  // Order Status Re-confirmation Modal State
  const [statusConfirmModal, setStatusConfirmModal] = useState({
    isOpen: false,
    orderId: null,
    newStatus: ''
  });

  const promptStatusConfirm = (orderId, newStatus) => {
    setStatusConfirmModal({
      isOpen: true,
      orderId,
      newStatus
    });
  };

  const executeStatusChange = async () => {
    const { orderId, newStatus } = statusConfirmModal;
    if (!orderId || !newStatus) return;

    try {
      const noteMap = {
        'Confirmed': 'COD Order Confirmed & Verified by Admin',
        'Packed': 'Order Packed in Velvet Gift Box & Tamper-Proof Sealed',
        'Shipped': 'Dispatched via Express Courier. Tracking ID: EXP-' + Math.floor(100000 + Math.random() * 900000),
        'Delivered': 'Cash Collected at Doorstep. Order Delivered Successfully',
        'Cancelled': 'Order Cancelled by Store Manager'
      };

      await orderService.updateOrderStatus(orderId, newStatus, noteMap[newStatus] || `Status updated to ${newStatus}`);
      toast.success(`Order ${orderId} updated to ${newStatus}`);
      setStatusConfirmModal({ isOpen: false, orderId: null, newStatus: '' });
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
          <p className="text-xs text-gray-500">Fast order fulfillment with explicit re-confirmation modal for Cash on Delivery orders</p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              filter === 'ALL' ? 'bg-slate-900 text-gold shadow' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All Orders ({orders.length})
          </button>

          <button
            onClick={() => setFilter('NEW')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${
              filter === 'NEW' ? 'bg-amber-500 text-white shadow' : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-gold/30'
            }`}
          >
            <span>NEW ({newOrdersCount})</span>
          </button>

          <button
            onClick={() => setFilter('PENDING')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              filter === 'PENDING' ? 'bg-gold text-slate-900 shadow' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Pending ({pendingCount})
          </button>

          <button
            onClick={() => setFilter('SHIPPED')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              filter === 'SHIPPED' ? 'bg-blue-600 text-white shadow' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Shipped
          </button>

          <button
            onClick={() => setFilter('DELIVERED')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              filter === 'DELIVERED' ? 'bg-emerald-600 text-white shadow' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Delivered
          </button>
        </div>
      </div>

      {/* Return Claim Warning Banner if any */}
      {pendingReturnsCount > 0 && (
        <div className="bg-rose-50 border border-rose-300 p-4 rounded-2xl flex items-center justify-between gap-4 text-xs text-rose-900 shadow-sm">
          <div className="flex items-center gap-3">
            <RotateCcw className="w-5 h-5 text-rose-600 shrink-0 animate-bounce" />
            <div>
              <strong className="font-bold block">Action Required for Return Requests:</strong>
              <span>You have {pendingReturnsCount} pending return claim(s) awaiting review.</span>
            </div>
          </div>
          <Link
            to="/admin/returns"
            className="bg-rose-600 text-white font-bold text-xs px-4 py-2 rounded-xl hover:bg-rose-700 transition-colors shrink-0"
          >
            Open Returns Manager
          </Link>
        </div>
      )}

      {/* Orders List Cards */}
      <div className="space-y-6">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="font-luxury font-bold text-lg text-slate-900">No Orders Found</h3>
            <p className="text-xs text-gray-500">There are no orders under the selected filter criteria.</p>
          </div>
        ) : (
          filteredOrders.map(order => {
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
                    <span className="text-amber-900 font-bold flex items-center gap-1.5">
                      <User className="w-4 h-4 text-gold" /> Customer Name: <strong>{order.userName}</strong>
                    </span>
                    <span className="text-slate-700 flex items-center gap-1.5 font-mono">
                      <Phone className="w-3.5 h-3.5 text-gold" /> Phone: {order.phone}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-amber-900 font-bold flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-gold" /> Delivery Address:
                    </span>
                    <p className="text-slate-700 line-clamp-2">
                      {typeof order.shippingAddress === 'object' && order.shippingAddress !== null
                        ? `${order.shippingAddress.street || ''}, ${order.shippingAddress.city || ''} ${order.shippingAddress.state || ''} - ${order.shippingAddress.pincode || ''}`
                        : (order.shippingAddress || 'N/A')}
                    </p>
                  </div>
                </div>

                {/* Ordered 1-Gram Items List */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Ordered Items</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 bg-gray-50 p-2.5 rounded-xl border border-gray-200">
                        <img src={item.image} alt="" className="w-12 h-12 object-cover rounded-lg border border-gold/30" />
                        <div className="text-xs">
                          <h5 className="font-bold text-slate-900 line-clamp-1">{item.name}</h5>
                          <span className="text-gray-500">Qty: {item.quantity} × ₹{item.price}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* STATUS CHANGE ACTION BUTTONS WITH RE-CONFIRMATION PROMPT */}
                <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <span className="text-gray-500 font-medium">Update Status:</span>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => promptStatusConfirm(order.id || order._id, 'Confirmed')}
                      className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                        order.orderStatus === 'Confirmed' ? 'bg-amber-100 text-amber-900 border border-gold' : 'bg-gray-100 text-gray-600 hover:bg-amber-50'
                      }`}
                    >
                      Confirm
                    </button>

                    <button
                      onClick={() => promptStatusConfirm(order.id || order._id, 'Packed')}
                      className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                        order.orderStatus === 'Packed' ? 'bg-amber-100 text-amber-900 border border-gold' : 'bg-gray-100 text-gray-600 hover:bg-amber-50'
                      }`}
                    >
                      Pack Parcel
                    </button>

                    <button
                      onClick={() => promptStatusConfirm(order.id || order._id, 'Shipped')}
                      className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                        order.orderStatus === 'Shipped' ? 'bg-amber-100 text-amber-900 border border-gold' : 'bg-gray-100 text-gray-600 hover:bg-amber-50'
                      }`}
                    >
                      Ship Parcel
                    </button>

                    <button
                      onClick={() => promptStatusConfirm(order.id || order._id, 'Delivered')}
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
          })
        )}
      </div>

      {/* ORDER STATUS RE-CONFIRMATION MODAL WITH OUTSIDE BACKDROP CLICK CLOSE */}
      {statusConfirmModal.isOpen && (
        <div 
          onClick={(e) => {
            if (e.target === e.currentTarget) setStatusConfirmModal({ isOpen: false, orderId: null, newStatus: '' });
          }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-white border-2 border-gold max-w-md w-full p-6 sm:p-8 rounded-3xl space-y-5 text-slate-800 shadow-2xl text-center relative">
            <button
              onClick={() => setStatusConfirmModal({ isOpen: false, orderId: null, newStatus: '' })}
              className="absolute top-4 right-4 text-gray-400 hover:text-slate-900"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 bg-amber-100 rounded-full border-2 border-gold flex items-center justify-center mx-auto text-amber-800 shadow-gold-glow">
              <AlertTriangle className="w-7 h-7 text-gold" />
            </div>

            <div className="space-y-2">
              <h3 className="font-luxury font-bold text-xl text-slate-900">
                Confirm Order Status Update
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed max-w-xs mx-auto font-medium">
                Are you sure you want to update <strong>Order #{statusConfirmModal.orderId}</strong> status to <strong className="text-gold uppercase font-bold">"{statusConfirmModal.newStatus}"</strong>?
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStatusConfirmModal({ isOpen: false, orderId: null, newStatus: '' })}
                className="w-1/2 bg-gray-100 text-slate-700 font-bold text-xs py-3 rounded-full hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={executeStatusChange}
                className="w-1/2 bg-gold-gradient text-slate-900 font-luxury font-bold text-xs py-3 rounded-full shadow-gold-glow hover:scale-105 transition-transform flex items-center justify-center gap-1.5"
              >
                <CheckCircle className="w-4 h-4" /> Yes, Confirm Status
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
