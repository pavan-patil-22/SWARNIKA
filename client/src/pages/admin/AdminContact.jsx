import React, { useState } from 'react';
import { 
  MessageSquare, 
  Mail, 
  Phone, 
  Send, 
  Clock, 
  CheckCircle, 
  X, 
  ExternalLink,
  MessageCircle
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { contactService } from '../../services/api';
import { toast } from 'react-toastify';

export default function AdminContact() {
  const { inquiries, loadAllAdminData } = useAdmin();
  const [filter, setFilter] = useState('PENDING');

  const [replyingInquiry, setReplyingInquiry] = useState(null);
  const [replyMethod, setReplyMethod] = useState('EMAIL'); // 'EMAIL' or 'WHATSAPP'
  const [replyMessage, setReplyMessage] = useState('');
  const [sending, setSending] = useState(false);

  const pendingInquiries = inquiries.filter(i => i.status === 'Pending');
  const emailInquiries = inquiries.filter(i => i.status === 'Replied_Email');
  const whatsappInquiries = inquiries.filter(i => i.status === 'Replied_WhatsApp');

  const filteredInquiries = inquiries.filter(item => {
    if (filter === 'PENDING') return item.status === 'Pending';
    if (filter === 'EMAIL') return item.status === 'Replied_Email';
    if (filter === 'WHATSAPP') return item.status === 'Replied_WhatsApp';
    return true;
  });

  const openReplyModal = (item) => {
    setReplyingInquiry(item);
    setReplyMethod(item.phone ? 'WHATSAPP' : 'EMAIL');
    setReplyMessage(
      `Hello ${item.name},\n\nThank you for reaching out to SWARNIKA Regarding your inquiry on "${item.subject}":\n\n`
    );
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyMessage.trim()) return;
    setSending(true);

    try {
      const targetId = replyingInquiry.id || replyingInquiry._id;
      const res = await contactService.replyInquiry(targetId, {
        replyMethod,
        adminReply: replyMessage
      });

      if (res.success) {
        if (replyMethod === 'WHATSAPP' && res.whatsappUrl) {
          toast.success('Reply saved to database! Opening WhatsApp chat...', {
            style: { background: '#FFF', color: '#D4AF37', border: '1px solid #D4AF37' }
          });
          window.open(res.whatsappUrl, '_blank');
        } else {
          toast.success(`Email reply dispatched to ${replyingInquiry.email}!`, {
            style: { background: '#FFF', color: '#D4AF37', border: '1px solid #D4AF37' }
          });
        }

        setReplyingInquiry(null);
        setReplyMessage('');
        loadAllAdminData();
      }
    } catch (err) {
      console.error("Admin inquiry reply error:", err);
      toast.error(err.response?.data?.message || 'Failed to send reply. Please check details.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6 text-slate-800">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <h2 className="font-luxury font-bold text-2xl text-gold-gradient flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-gold" /> Contact Inquiries & Reply Manager
          </h2>
          <p className="text-xs text-gray-500">View customer messages submitted via Contact Us form and reply directly via Email or WhatsApp</p>
        </div>
      </div>

      {/* KPI METRIC CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <div className="bg-amber-50 p-4 rounded-2xl border border-gold/40 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] text-amber-900 font-bold uppercase tracking-wider block">Pending Reply</span>
            <span className="font-luxury font-bold text-2xl text-amber-900">{pendingInquiries.length}</span>
          </div>
          <Clock className="w-8 h-8 text-gold p-1.5 bg-white rounded-xl shadow animate-pulse" />
        </div>

        <div className="bg-sky-50 p-4 rounded-2xl border border-sky-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] text-sky-900 font-bold uppercase tracking-wider block">Replied via Email</span>
            <span className="font-luxury font-bold text-2xl text-sky-800">{emailInquiries.length}</span>
          </div>
          <Mail className="w-8 h-8 text-sky-600 p-1.5 bg-white rounded-xl shadow" />
        </div>

        <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-300 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] text-emerald-900 font-bold uppercase tracking-wider block">Replied via WhatsApp</span>
            <span className="font-luxury font-bold text-2xl text-emerald-800">{whatsappInquiries.length}</span>
          </div>
          <MessageCircle className="w-8 h-8 text-emerald-600 p-1.5 bg-white rounded-xl shadow" />
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Total Inquiries</span>
            <span className="font-luxury font-bold text-2xl text-slate-900">{inquiries.length}</span>
          </div>
          <MessageSquare className="w-8 h-8 text-gold p-1.5 bg-amber-50 rounded-xl" />
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
          🟡 PENDING REPLY <span className="bg-slate-900 text-gold text-[10px] px-2 py-0.5 rounded-full">{pendingInquiries.length}</span>
        </button>

        <button
          onClick={() => setFilter('EMAIL')}
          className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
            filter === 'EMAIL'
              ? 'bg-sky-600 text-white shadow'
              : 'bg-sky-50 text-sky-800 border border-sky-200 hover:bg-sky-100'
          }`}
        >
          📧 REPLIED VIA EMAIL ({emailInquiries.length})
        </button>

        <button
          onClick={() => setFilter('WHATSAPP')}
          className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
            filter === 'WHATSAPP'
              ? 'bg-emerald-600 text-white shadow'
              : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
          }`}
        >
          📱 REPLIED VIA WHATSAPP ({whatsappInquiries.length})
        </button>

        <button
          onClick={() => setFilter('ALL')}
          className={`px-4 py-2 rounded-xl font-bold transition-all ${
            filter === 'ALL'
              ? 'bg-slate-900 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          ALL INQUIRIES ({inquiries.length})
        </button>

      </div>

      {/* INQUIRIES CARDS LIST */}
      {filteredInquiries.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-gray-200 text-gray-400 space-y-2">
          <MessageSquare className="w-12 h-12 text-gold mx-auto" />
          <h3 className="font-luxury font-bold text-lg text-slate-900">No Contact Inquiries Found</h3>
          <p className="text-xs text-gray-500">There are no customer messages matching this filter tab.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredInquiries.map(item => {
            const isPending = item.status === 'Pending';
            const isEmailReplied = item.status === 'Replied_Email';
            const isWhatsAppReplied = item.status === 'Replied_WhatsApp';

            return (
              <div 
                key={item.id}
                className={`bg-white rounded-2xl border p-6 space-y-4 shadow-sm ${
                  isPending ? 'border-2 border-gold shadow-gold-glow' :
                  isEmailReplied ? 'border-sky-300' :
                  'border-emerald-300'
                }`}
              >
                
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-gray-100 pb-3">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-luxury font-bold text-lg text-slate-900">{item.name}</h3>
                      <span className={`text-[10px] font-bold px-3 py-0.5 rounded-full border ${
                        isPending ? 'bg-amber-100 text-amber-900 border-gold animate-pulse' :
                        isEmailReplied ? 'bg-sky-100 text-sky-900 border-sky-300' :
                        'bg-emerald-100 text-emerald-900 border-emerald-300'
                      }`}>
                        {isPending ? '🟡 Pending Reply' : isEmailReplied ? '📧 Replied via Email' : '📱 Replied via WhatsApp'}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 block mt-0.5">
                      Submitted: <strong>{new Date(item.createdAt).toLocaleString()}</strong>
                    </span>
                  </div>

                  {/* Customer Contact Details */}
                  <div className="flex flex-wrap items-center gap-3 text-xs bg-amber-50/60 p-2.5 rounded-xl border border-gold/30">
                    <span className="font-bold text-slate-700 flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-gold" /> {item.email}
                    </span>
                    {item.phone && (
                      <span className="font-bold text-slate-700 flex items-center gap-1 border-l border-gold/30 pl-3">
                        <Phone className="w-3.5 h-3.5 text-gold" /> WhatsApp: {item.phone}
                      </span>
                    )}
                  </div>
                </div>

                {/* Subject & Original Customer Message */}
                <div className="space-y-1 text-xs">
                  <strong className="text-amber-900 font-luxury font-bold block text-sm">
                    Subject: {item.subject}
                  </strong>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-200 leading-relaxed italic">
                    "{item.message}"
                  </p>
                </div>

                {/* Logged Admin Reply History */}
                {item.adminReply && (
                  <div className="p-3.5 bg-emerald-50/70 rounded-xl border border-emerald-200 text-xs space-y-1">
                    <div className="flex items-center justify-between font-bold text-emerald-900">
                      <span className="flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> 
                        Admin Reply via {item.replyMethod || 'Email/WhatsApp'}
                      </span>
                      <span className="text-[10px] text-gray-500">
                        {item.repliedAt ? new Date(item.repliedAt).toLocaleString() : ''}
                      </span>
                    </div>
                    <p className="text-gray-700 whitespace-pre-wrap pl-4 font-mono text-[11px]">
                      {item.adminReply}
                    </p>
                  </div>
                )}

                {/* REPLY ACTION BUTTON */}
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => openReplyModal(item)}
                    className="bg-gold-gradient text-slate-900 font-luxury font-bold text-xs px-5 py-2.5 rounded-xl shadow-gold-glow flex items-center gap-2 hover:scale-102 transition-transform"
                  >
                    <Send className="w-4 h-4" /> {item.adminReply ? 'Send Additional Reply' : 'Reply to Customer'}
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* INTERACTIVE REPLY MODAL (EMAIL OR WHATSAPP) */}
      {replyingInquiry && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-gold/40 max-w-lg w-full p-6 rounded-3xl space-y-4 text-slate-800 shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="font-luxury font-bold text-lg text-gold-gradient">
                  Reply to Inquiry ({replyingInquiry.name})
                </h3>
                <span className="text-[10px] text-gray-500">Choose response method (Email via SMTP or WhatsApp direct chat)</span>
              </div>
              <button onClick={() => setReplyingInquiry(null)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>

            <form onSubmit={handleSendReply} className="space-y-4 text-xs">
              
              {/* REPLY METHOD SELECTOR */}
              <div className="space-y-1.5">
                <label className="block text-slate-700 font-bold">Select Reply Channel:</label>
                <div className="grid grid-cols-2 gap-3">
                  
                  <button
                    type="button"
                    onClick={() => setReplyMethod('EMAIL')}
                    className={`p-3 rounded-xl border font-bold flex items-center justify-center gap-2 transition-all ${
                      replyMethod === 'EMAIL'
                        ? 'bg-sky-600 text-white border-sky-600 shadow'
                        : 'bg-sky-50 text-sky-900 border-sky-200 hover:bg-sky-100'
                    }`}
                  >
                    <Mail className="w-4 h-4" /> 📧 Send Email
                  </button>

                  <button
                    type="button"
                    onClick={() => setReplyMethod('WHATSAPP')}
                    className={`p-3 rounded-xl border font-bold flex items-center justify-center gap-2 transition-all ${
                      replyMethod === 'WHATSAPP'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow'
                        : 'bg-emerald-50 text-emerald-900 border-emerald-200 hover:bg-emerald-100'
                    }`}
                  >
                    <MessageCircle className="w-4 h-4" /> 📱 Send WhatsApp
                  </button>

                </div>
              </div>

              {/* Target info preview */}
              <div className="p-3 bg-amber-50 rounded-xl border border-gold/30 space-y-1">
                <span className="font-bold text-amber-900 block">
                  {replyMethod === 'WHATSAPP' ? 'Target WhatsApp Phone:' : 'Target Email Address:'}
                </span>
                <p className="text-gray-700 font-mono">
                  {replyMethod === 'WHATSAPP' ? (replyingInquiry.phone || 'No phone number provided') : replyingInquiry.email}
                </p>
              </div>

              {/* Reply Message Text */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">Reply Message Content</label>
                <textarea
                  rows={5}
                  required
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 text-slate-900 p-3 rounded-xl focus:border-gold"
                  placeholder="Type your official reply here..."
                />
              </div>

              {/* Action Submit */}
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={sending}
                  className={`flex-1 font-bold p-3.5 rounded-xl text-white shadow transition-all flex items-center justify-center gap-2 ${
                    replyMethod === 'WHATSAPP' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-sky-600 hover:bg-sky-700'
                  }`}
                >
                  <Send className="w-4 h-4" /> {sending ? 'Dispatching...' : replyMethod === 'WHATSAPP' ? 'Send & Open WhatsApp' : 'Dispatch Email Reply'}
                </button>
                
                <button
                  type="button"
                  onClick={() => setReplyingInquiry(null)}
                  className="bg-gray-100 text-slate-700 font-bold px-4 rounded-xl"
                >
                  Cancel
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
