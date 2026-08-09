import React, { useState } from 'react';
import { 
  RotateCcw, 
  Check, 
  X, 
  User, 
  Phone, 
  MapPin, 
  Clock, 
  AlertCircle, 
  CheckCircle,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { orderService } from '../../services/api';
import { toast } from 'react-toastify';

export default function AdminReturns() {
  const { allOrders, reloadAdminData } = useAdmin();
  const [filter, setFilter] = useState('PENDING');
  const [rejectingOrder, setRejectingOrder] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  // Return Requests List
  const returnOrders = allOrders.filter(o => o.returnStatus && o.returnStatus !== 'None');

  const pendingCount = returnOrders.filter(o => o.returnStatus === 'Requested').length;
  const acceptedCount = returnOrders.filter(o => o.returnStatus === 'Accepted').length;
  const rejectedCount = returnOrders.filter(o => o.returnStatus === 'Rejected').length;

  const filteredReturns = returnOrders.filter(o => {
    if (filter === 'PENDING') return o.returnStatus === 'Requested';
    if (filter === 'ACCEPTED') return o.returnStatus === 'Accepted';
    if (filter === 'REJECTED') return o.returnStatus === 'Rejected';
    return true;
  });

  const handleAccept = async (orderId) => {
    try {
      const targetId = orderId;
      await orderService.respondReturn(targetId, 'ACCEPT', 'Return approved by Store Manager.');
      toast.success(`Return request for ${orderId} ACCEPTED!`, {
        style: { background: '#FFF', color: '#D4AF37', border: '1px solid #D4AF37' }
      });
      reloadAdminData();
    } catch (e) {
      toast.error('Failed to accept return request');
    }
  };

  const handleRejectSubmit = async (e) => {
    e.preventDefault();
    if (!rejectReason.trim()) return;

    try {
      const targetId = rejectingOrder.id || rejectingOrder._id;
      await orderService.respondReturn(targetId, 'REJECT', rejectReason);
      toast.info(`Return request for ${rejectingOrder.id} REJECTED.`);
      setRejectingOrder(null);
      setRejectReason('');
      reloadAdminData();
    } catch (e) {
      toast.error('Failed to reject return request');
    }
  };

  return (
    <div className="space-y-6 text-slate-800">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <h2 className="font-luxury font-bold text-2xl text-gold-gradient flex items-center gap-2">
            <RotateCcw className="w-6 h-6 text-gold" /> Returns & Exchanges Manager
          </h2>
          <p className="text-xs text-gray-500">Review customer return requests, inspect proof images uploaded to Cloudinary, and approve or decline requests</p>
        </div>
      </div>

      {/* KPI METRIC CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <div className="bg-amber-50 p-4 rounded-2xl border border-gold/40 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] text-amber-900 font-bold uppercase tracking-wider block">Pending Approval</span>
            <span className="font-luxury font-bold text-2xl text-amber-900">{pendingCount}</span>
          </div>
          <Clock className="w-8 h-8 text-gold p-1.5 bg-white rounded-xl shadow" />
        </div>

        <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-300 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] text-emerald-900 font-bold uppercase tracking-wider block">Accepted Returns</span>
            <span className="font-luxury font-bold text-2xl text-emerald-800">{acceptedCount}</span>
          </div>
          <CheckCircle className="w-8 h-8 text-emerald-600 p-1.5 bg-white rounded-xl shadow" />
        </div>

        <div className="bg-rose-50 p-4 rounded-2xl border border-rose-300 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] text-rose-900 font-bold uppercase tracking-wider block">Rejected Claims</span>
            <span className="font-luxury font-bold text-2xl text-rose-700">{rejectedCount}</span>
          </div>
          <ShieldAlert className="w-8 h-8 text-rose-600 p-1.5 bg-white rounded-xl shadow" />
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Total Return Claims</span>
            <span className="font-luxury font-bold text-2xl text-slate-900">{returnOrders.length}</span>
          </div>
          <RotateCcw className="w-8 h-8 text-gold p-1.5 bg-amber-50 rounded-xl" />
        </div>

      </div>

      {/* FILTER TABS */}
      <div className="flex flex-wrap gap-2 text-xs bg-white p-2.5 rounded-2xl border border-gray-200 shadow-sm">
        
        <button
          onClick={() => setFilter('PENDING')}
          className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
            filter === 'PENDING'
              ? 'bg-gold-gradient text-slate-900 shadow-gold-glow'
              : 'bg-amber-50 text-amber-900 border border-gold/30 hover:bg-gold/20'
          }`}
        >
          🟡 PENDING APPROVAL <span className="bg-slate-900 text-gold text-[10px] px-2 py-0.5 rounded-full">{pendingCount}</span>
        </button>

        <button
          onClick={() => setFilter('ACCEPTED')}
          className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
            filter === 'ACCEPTED'
              ? 'bg-emerald-600 text-white shadow'
              : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
          }`}
        >
          🟢 ACCEPTED RETURNS ({acceptedCount})
        </button>

        <button
          onClick={() => setFilter('REJECTED')}
          className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
            filter === 'REJECTED'
              ? 'bg-rose-600 text-white shadow'
              : 'bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100'
          }`}
        >
          🔴 REJECTED RETURNS ({rejectedCount})
        </button>

        <button
          onClick={() => setFilter('ALL')}
          className={`px-4 py-2 rounded-xl font-bold transition-all ${
            filter === 'ALL'
              ? 'bg-slate-900 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          ALL RETURN REQUESTS ({returnOrders.length})
        </button>

      </div>

      {/* RETURN CARDS LIST */}
      {filteredReturns.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-gray-200 text-gray-400 space-y-2">
          <RotateCcw className="w-12 h-12 text-gold mx-auto" />
          <h3 className="font-luxury font-bold text-lg text-slate-900">No Return Requests Found</h3>
          <p className="text-xs text-gray-500">There are no customer return claims matching this filter category.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredReturns.map(order => {
            const isPending = order.returnStatus === 'Requested';
            const isAccepted = order.returnStatus === 'Accepted';
            const isRejected = order.returnStatus === 'Rejected';

            return (
              <div 
                key={order.id || order._id}
                className={`bg-white rounded-2xl border p-6 space-y-5 shadow-sm ${
                  isPending ? 'border-2 border-gold shadow-gold-glow' :
                  isAccepted ? 'border-2 border-emerald-400 bg-emerald-50/10' :
                  'border-2 border-rose-300 bg-rose-50/10'
                }`}
              >
                
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-3">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-luxury font-bold text-xl text-gold-gradient">{order.id}</h3>
                      <span className={`text-[10px] font-bold px-3 py-0.5 rounded-full border ${
                        isPending ? 'bg-amber-100 text-amber-900 border-gold animate-pulse' :
                        isAccepted ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                        'bg-rose-100 text-rose-800 border-rose-300'
                      }`}>
                        {isPending ? '🟡 Return Requested (Pending Approval)' : isAccepted ? '🟢 Return Approved & Accepted' : '🔴 Return Rejected'}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 mt-1 block">
                      Requested Date: <strong>{order.returnRequestedAt ? new Date(order.returnRequestedAt).toLocaleString() : 'Recently'}</strong>
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="font-luxury font-bold text-2xl text-slate-900 block">₹{order.total}</span>
                    <span className="text-[10px] text-gray-500">{order.items?.length} Items</span>
                  </div>
                </div>

                {/* Customer Contact & Shipping Info */}
                <div className="p-3.5 bg-amber-50/50 rounded-xl border border-gold/30 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1">
                    <span className="font-bold text-amber-900 flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-gold" /> Customer: {order.userName} ({order.userEmail})
                    </span>
                    <span className="text-gray-600 block flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-gold" /> Mobile Contact: <strong>{order.phone || order.shippingAddress?.phone}</strong>
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="font-bold text-amber-900 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-gold" /> Address:
                    </span>
                    <p className="text-gray-600">
                      {order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.state} - <strong>{order.shippingAddress?.pincode}</strong>
                    </p>
                  </div>
                </div>

                {/* Customer Statement Reason & Proof Image */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200 text-xs">
                  
                  {/* Left 2 Cols: Reason Text */}
                  <div className="md:col-span-2 space-y-1">
                    <strong className="text-slate-900 font-luxury font-bold block text-sm">Customer Return Statement:</strong>
                    <p className="text-gray-700 bg-white p-3 rounded-lg border border-gray-200 italic leading-relaxed">
                      "{order.returnReason || 'No reason text provided'}"
                    </p>
                    {order.adminReturnComment && (
                      <p className="text-xs font-bold text-amber-900 mt-2">
                        Admin Response Note: <span className="font-normal text-gray-700">{order.adminReturnComment}</span>
                      </p>
                    )}
                  </div>

                  {/* Right 1 Col: Cloudinary Proof Image */}
                  <div className="space-y-1">
                    <strong className="text-slate-900 font-luxury font-bold block text-xs">Return Proof Image:</strong>
                    {order.returnImage ? (
                      <a href={order.returnImage} target="_blank" rel="noopener noreferrer" className="block relative group">
                        <img src={order.returnImage} alt="Return Proof" className="w-full h-32 object-cover rounded-lg border border-gold/40 group-hover:opacity-90 transition-opacity" />
                        <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[9px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                          <ExternalLink className="w-3 h-3" /> Zoom
                        </span>
                      </a>
                    ) : (
                      <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-xs italic">
                        No image uploaded
                      </div>
                    )}
                  </div>

                </div>

                {/* Ordered Items */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Returned Parcel Items</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {order.items?.map(item => (
                      <div key={item.id} className="p-2.5 bg-white rounded-lg border border-gray-200 flex items-center gap-3 text-xs">
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

                {/* ACTION BUTTONS (FOR PENDING REQUESTS) */}
                {isPending && (
                  <div className="pt-3 border-t border-gray-200 flex items-center justify-end gap-3">
                    <button
                      onClick={() => handleAccept(order.id || order._id)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl flex items-center gap-1.5 shadow-md"
                    >
                      <Check className="w-4 h-4" /> Accept Return Request
                    </button>
                    <button
                      onClick={() => setRejectingOrder(order)}
                      className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl flex items-center gap-1.5 shadow-md"
                    >
                      <X className="w-4 h-4" /> Reject Return Request
                    </button>
                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}

      {/* REJECT MODAL */}
      {rejectingOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-gold/40 max-w-md w-full p-6 rounded-2xl space-y-4 text-slate-800 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-luxury font-bold text-lg text-rose-700">Reject Return Claim ({rejectingOrder.id})</h3>
              <button onClick={() => setRejectingOrder(null)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>

            <form onSubmit={handleRejectSubmit} className="space-y-3 text-xs">
              <p className="text-gray-600">Please provide a valid rejection reason for the customer:</p>

              <textarea
                rows={3}
                required
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="e.g. Returned item seal broken, or requested past 7 days return policy window..."
                className="w-full bg-gray-50 border border-gray-300 text-slate-900 p-2.5 rounded-lg focus:border-gold"
              />

              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 bg-rose-600 text-white font-bold p-3 rounded-lg">Confirm Rejection</button>
                <button type="button" onClick={() => setRejectingOrder(null)} className="flex-1 bg-gray-100 text-slate-700 font-bold p-3 rounded-lg">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
