import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, 
  CheckCircle, 
  RotateCcw, 
  Star, 
  Download, 
  X,
  Upload,
  Clock,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { orderService, productService, uploadService } from '../services/api';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { toast } from 'react-toastify';

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Return Request Modal State
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [selectedOrderForReturn, setSelectedOrderForReturn] = useState(null);
  const [returnReason, setReturnReason] = useState('');
  const [returnImage, setReturnImage] = useState('');
  const [uploadingReturnImg, setUploadingReturnImg] = useState(false);

  // Product Review Modal State
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedProductForReview, setSelectedProductForReview] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  const fetchOrders = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await orderService.getOrders(user.id || user.email);
      setOrders(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  // Upload return proof image from device via Cloudinary
  const handleReturnDeviceUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploadingReturnImg(true);

    try {
      const urls = await uploadService.uploadDeviceFiles(files);
      if (urls.length > 0) {
        setReturnImage(urls[0]);
        toast.success('Return proof image uploaded to Cloudinary!', {
          style: { background: '#FFF', color: '#D4AF37', border: '1px solid #D4AF37' }
        });
      }
    } catch (err) {
      toast.error('Image upload failed');
    } finally {
      setUploadingReturnImg(false);
    }
  };

  // Robust PDF Invoice Generator
  const downloadInvoicePDF = (order) => {
    try {
      const doc = new jsPDF();
      
      doc.setFontSize(20);
      doc.setTextColor(212, 175, 55);
      doc.text("AUREATE LUXE", 14, 20);
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text("1 Gram Micro-Gold Plated Replica Jewellery Store", 14, 26);
      doc.text("GSTIN: 29AAAAA0000A1Z5 | Support: support@aureateluxe.com", 14, 32);

      doc.setDrawColor(212, 175, 55);
      doc.line(14, 36, 196, 36);

      doc.setFontSize(12);
      doc.setTextColor(17, 17, 17);
      doc.text(`TAX INVOICE: #${order.id}`, 14, 46);
      doc.setFontSize(9);
      doc.text(`Date: ${new Date(order.createdAt).toLocaleString()}`, 14, 52);
      doc.text(`Payment Mode: ${order.paymentMethod} (${order.paymentStatus})`, 14, 58);

      doc.text(`Billed To: ${order.userName} (${order.userEmail})`, 120, 46);
      doc.text(`Address: ${order.shippingAddress?.street || 'N/A'}`, 120, 52);
      doc.text(`${order.shippingAddress?.city || ''}, ${order.shippingAddress?.state || ''} - ${order.shippingAddress?.pincode || ''}`, 120, 58);

      const headers = [["Item Description", "SKU", "Price", "Qty", "Subtotal"]];
      const rows = order.items.map(item => [
        item.name,
        item.sku || '1G-ITEM',
        `Rs. ${item.price}`,
        item.quantity,
        `Rs. ${item.price * item.quantity}`
      ]);

      doc.autoTable({
        head: headers,
        body: rows,
        startY: 66,
        headStyles: { fillColor: [212, 175, 55], textColor: [11, 11, 11], fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [250, 248, 245] }
      });

      const finalY = doc.lastAutoTable.finalY + 10;
      doc.setFontSize(10);
      doc.text(`Subtotal (Tax Included): Rs. ${order.subtotal || order.total}`, 130, finalY);
      doc.text(`Delivery Fee: Rs. ${order.deliveryFee || 0}`, 130, finalY + 6);
      doc.setFontSize(12);
      doc.setTextColor(212, 175, 55);
      doc.text(`Grand Total: Rs. ${order.total}`, 130, finalY + 16);

      doc.setFontSize(8);
      doc.setTextColor(120, 120, 120);
      doc.text("* Notice: Listed prices are inclusive of 3% GST tax. Products are 1 Gram micro-gold plated brass replica items (Non-gold).", 14, finalY + 28);

      doc.save(`Invoice_${order.id}.pdf`);
      toast.success(`Invoice PDF for ${order.id} downloaded!`, { style: { background: '#FFF', color: '#D4AF37', border: '1px solid #D4AF37' } });
    } catch (err) {
      console.error("PDF generation error:", err);
      toast.error("Could not generate PDF invoice");
    }
  };

  // Submit Return Request to Backend API
  const handleReturnSubmit = async (e) => {
    e.preventDefault();
    if (!returnReason.trim()) return;

    try {
      const targetId = selectedOrderForReturn.id || selectedOrderForReturn._id;
      await orderService.requestReturn(targetId, returnReason, returnImage);
      toast.success(`Return request for ${selectedOrderForReturn.id} submitted for Admin approval!`, {
        style: { background: '#FFF', color: '#D4AF37', border: '1px solid #D4AF37' }
      });
      setShowReturnModal(false);
      setReturnReason('');
      setReturnImage('');
      fetchOrders();
    } catch (err) {
      console.error("Return submit error:", err);
      toast.error(err.response?.data?.message || 'Failed to submit return request');
    }
  };

  // Submit Customer Rating & Review (ONLY for Delivered Orders)
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    try {
      await productService.addReview(selectedProductForReview.id, {
        userName: user?.name || "Verified Buyer",
        rating: Number(reviewRating),
        comment: reviewComment
      });
      toast.success(`Thank you for rating ${selectedProductForReview.name}!`, { style: { background: '#FFF', color: '#D4AF37', border: '1px solid #D4AF37' } });
      setShowReviewModal(false);
      setReviewComment('');
    } catch (err) {
      toast.error("Failed to post review");
    }
  };

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-16 text-center text-gold font-bold">Loading Your Orders...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4 bg-[#FAF9F5]">
        <Package className="w-16 h-16 text-gold mx-auto" />
        <h2 className="font-luxury font-bold text-2xl text-slate-900">No Orders Found</h2>
        <p className="text-xs text-gray-500">You haven't placed any 1-gram jewellery orders yet.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-[#FAF9F5] text-slate-800">
      
      <div className="border-b border-gray-200 pb-4">
        <h1 className="font-luxury font-bold text-3xl text-gold-gradient">My Orders & Invoices</h1>
        <p className="text-xs text-gray-500">Click items to view detail pages, track delivery vertical timeline, download PDF invoices, and submit return requests with proof image</p>
      </div>

      <div className="space-y-8">
        {orders.map((order) => {
          const isDelivered = order.orderStatus === 'Delivered';
          const isShipped = order.orderStatus === 'Shipped' || isDelivered;
          const isPacked = order.orderStatus === 'Packed' || isShipped;

          const steps = [
            { title: "Order Confirmed", desc: "COD Order Placed & Confirmed", active: true, time: new Date(order.createdAt).toLocaleDateString() },
            { title: "Packed & Sealed", desc: "Velvet Box Tamper-Proof Packaging", active: isPacked, time: isPacked ? "Completed" : "Pending" },
            { title: "Shipped & In Transit", desc: "Handed over to Express Courier", active: isShipped, time: isShipped ? "In Transit" : "Expected soon" },
            { title: "Delivered", desc: "Cash Collected at Doorstep", active: isDelivered, time: isDelivered ? "Delivered" : "Awaiting Courier" }
          ];

          return (
            <div key={order.id || order._id} className="bg-white rounded-2xl border border-gray-200 p-6 space-y-6 shadow-sm">
              
              {/* Order Header Bar */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-luxury font-bold text-xl text-gold-gradient">{order.id}</h3>
                    <span className={`text-[10px] font-bold px-3 py-0.5 rounded-full border ${
                      isDelivered ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                      order.orderStatus === 'Cancelled' ? 'bg-rose-100 text-rose-800 border-rose-300' :
                      'bg-amber-100 text-amber-900 border-gold/40'
                    }`}>
                      {order.orderStatus}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Placed on: {new Date(order.createdAt).toLocaleString()} • Payment Mode: <strong>{order.paymentMethod}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="font-luxury font-bold text-2xl text-slate-900 block">₹{order.total}</span>
                    <span className="text-[10px] text-gray-500">{order.items?.length} Items</span>
                  </div>

                  {/* PDF Download Button */}
                  <button
                    onClick={() => downloadInvoicePDF(order)}
                    className="p-2.5 bg-amber-50 hover:bg-gold hover:text-slate-900 text-amber-900 border border-gold/40 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <Download className="w-4 h-4 text-gold" /> Invoice PDF
                  </button>
                </div>
              </div>

              {/* FLIPKART-STYLE VERTICAL ORDER TIMELINE TRACKER */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
                
                {/* Left 2 Cols: Order Items */}
                <div className="lg:col-span-2 space-y-3">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">Ordered Items</span>
                  <div className="space-y-3">
                    {order.items?.map((item) => (
                      <div key={item.id} className="p-3 bg-amber-50/40 rounded-xl border border-gold/20 flex items-center justify-between gap-3 text-xs">
                        <Link to={`/products/${item.id}`} className="flex items-center gap-3 group cursor-pointer">
                          <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded-lg border border-gold/30 group-hover:scale-105 transition-transform" />
                          <div>
                            <h4 className="font-bold text-slate-900 group-hover:text-gold transition-colors">{item.name}</h4>
                            <span className="text-[10px] text-gray-500 font-mono block">SKU: {item.sku}</span>
                            <span className="text-xs font-bold text-gold">Qty: {item.quantity} x ₹{item.price}</span>
                          </div>
                        </Link>

                        {/* DELIVERED ONLY: Rate Product Button */}
                        {isDelivered && (
                          <button
                            onClick={() => {
                              setSelectedProductForReview(item);
                              setShowReviewModal(true);
                            }}
                            className="bg-amber-100 hover:bg-gold hover:text-slate-900 text-amber-900 text-[10px] font-bold px-3 py-1.5 rounded-lg border border-gold/40 flex items-center gap-1 shrink-0"
                          >
                            <Star className="w-3.5 h-3.5 text-gold" /> Rate Item
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right 1 Col: FLIPKART VERTICAL LINE TIMELINE */}
                <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-4">
                  <h4 className="font-luxury font-bold text-xs text-slate-900 uppercase tracking-wider border-b border-gray-200 pb-2">
                    Delivery Progress
                  </h4>

                  <div className="relative pl-6 space-y-6">
                    <div className="absolute top-2 bottom-2 left-2.5 w-0.5 bg-gray-200 -z-0" />

                    {steps.map((step, idx) => (
                      <div key={idx} className="relative flex items-start gap-3 text-xs">
                        <div className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center z-10 ${
                          step.active
                            ? 'bg-emerald-600 border-emerald-600 text-white shadow'
                            : 'bg-white border-gray-300 text-gray-400'
                        }`}>
                          {step.active ? <CheckCircle className="w-3.5 h-3.5" /> : <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />}
                        </div>

                        <div>
                          <h5 className={`font-bold ${step.active ? 'text-slate-900' : 'text-gray-400'}`}>
                            {step.title}
                          </h5>
                          <p className="text-[10px] text-gray-500">{step.desc}</p>
                          <span className="text-[9px] text-gold font-bold">{step.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* RETURN REQUEST STATUS & TRIGGER SECTION */}
              {isDelivered && (
                <div className="pt-3 border-t border-gray-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 bg-amber-50/50 p-4 rounded-xl border border-gold/30">
                  
                  {/* Status Indicator */}
                  {order.returnStatus === 'Requested' && (
                    <div className="text-xs text-amber-900 font-bold flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-600 animate-pulse" />
                      <span>Return Request Submitted (Pending Admin Approval)</span>
                    </div>
                  )}

                  {order.returnStatus === 'Accepted' && (
                    <div className="text-xs text-emerald-800 font-bold flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span>Return Accepted by Admin! ({order.adminReturnComment || 'Return approved'})</span>
                    </div>
                  )}

                  {order.returnStatus === 'Rejected' && (
                    <div className="text-xs text-rose-800 font-bold flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-600" />
                      <span>Return Request Rejected: {order.adminReturnComment || 'Did not meet return criteria'}</span>
                    </div>
                  )}

                  {(!order.returnStatus || order.returnStatus === 'None') && (
                    <div className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle className="w-4 h-4 text-emerald-600" /> Order Delivered Successfully
                    </div>
                  )}

                  {/* Return Request Button */}
                  {(!order.returnStatus || order.returnStatus === 'None') && (
                    <button
                      onClick={() => {
                        setSelectedOrderForReturn(order);
                        setShowReturnModal(true);
                      }}
                      className="bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white text-xs font-bold px-4 py-2 rounded-xl border border-rose-300 flex items-center gap-1.5 transition-colors"
                    >
                      <RotateCcw className="w-4 h-4" /> Request Return / Exchange
                    </button>
                  )}

                </div>
              )}

            </div>
          );
        })}
      </div>

      {/* Return Request Modal (Reason + Image Upload) */}
      {showReturnModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-gold/40 max-w-md w-full p-6 rounded-2xl space-y-4 text-slate-800 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-luxury font-bold text-lg text-gold-gradient">Return Request ({selectedOrderForReturn?.id})</h3>
              <button onClick={() => setShowReturnModal(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>

            <form onSubmit={handleReturnSubmit} className="space-y-3 text-xs">
              <p className="text-gray-600">
                Please state your reason for return and attach a proof image. Admin will review and approve your return request.
              </p>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Reason for Return</label>
                <textarea
                  rows={3}
                  required
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  placeholder="e.g. Size fitting issue, wrong polish item received..."
                  className="w-full bg-gray-50 border border-gray-300 text-slate-900 p-2.5 rounded-lg focus:border-gold"
                />
              </div>

              {/* CLOUDINARY DEVICE IMAGE PROOF UPLOAD */}
              <div className="p-3 bg-amber-50/50 rounded-xl border border-gold/30 space-y-2">
                <label className="block text-amber-900 font-bold flex items-center gap-1.5">
                  <Upload className="w-4 h-4 text-gold" /> Upload Return Proof Image (Device / Cloudinary)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleReturnDeviceUpload}
                  className="w-full text-xs text-gray-600 file:mr-4 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-gold file:text-slate-900 cursor-pointer"
                />
                {uploadingReturnImg && <p className="text-xs text-gold animate-pulse">Uploading proof to Cloudinary...</p>}

                {returnImage && (
                  <div className="aspect-video rounded-lg overflow-hidden border border-gold/30 mt-2">
                    <img src={returnImage} alt="Return proof" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 bg-gold-gradient text-slate-900 font-bold p-3 rounded-lg">
                  Submit to Admin
                </button>
                <button type="button" onClick={() => setShowReturnModal(false)} className="flex-1 bg-gray-100 text-slate-700 font-bold p-3 rounded-lg">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-gold/40 max-w-md w-full p-6 rounded-2xl space-y-4 text-slate-800 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-luxury font-bold text-lg text-gold-gradient">Rate Delivered Product</h3>
              <button onClick={() => setShowReviewModal(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
              <div>
                <strong className="text-slate-900 block text-sm mb-1">{selectedProductForReview?.name}</strong>
                <span className="text-gray-500">How was the 1-gram polish and quality?</span>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Star Rating (1 to 5 Stars)</label>
                <select
                  value={reviewRating}
                  onChange={(e) => setReviewRating(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 text-slate-900 p-2.5 rounded-lg font-bold"
                >
                  <option value={5}>★★★★★ (5/5 Excellent)</option>
                  <option value={4}>★★★★☆ (4/5 Very Good)</option>
                  <option value={3}>★★★☆☆ (3/5 Average)</option>
                  <option value={2}>★★☆☆☆ (2/5 Poor)</option>
                  <option value={1}>★☆☆☆☆ (1/5 Terribile)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Your Detailed Feedback</label>
                <textarea
                  rows={3}
                  required
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Tell other buyers about the shine, weight, and finish..."
                  className="w-full bg-gray-50 border border-gray-300 text-slate-900 p-2.5 rounded-lg focus:border-gold"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 bg-gold-gradient text-slate-900 font-bold p-3 rounded-lg">Post Feedback</button>
                <button type="button" onClick={() => setShowReviewModal(false)} className="flex-1 bg-gray-100 text-slate-700 font-bold p-3 rounded-lg">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
