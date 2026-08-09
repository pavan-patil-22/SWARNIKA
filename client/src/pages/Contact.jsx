import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { FaInstagram } from 'react-icons/fa';
import { contactService } from '../services/api';
import { toast } from 'react-toastify';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: 'General Inquiry', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setSubmitting(true);

    try {
      await contactService.submitInquiry(formData);
      toast.success('Inquiry submitted successfully! Our SWARNIKA support team will reply shortly via Email or WhatsApp.', {
        style: { background: '#FFF', color: '#D4AF37', border: '1px solid #D4AF37' }
      });
      setFormData({ name: '', email: '', phone: '', subject: 'General Inquiry', message: '' });
    } catch (err) {
      toast.error('Failed to submit inquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 bg-[#FAF9F5] text-slate-800">
      
      {/* Title & Slogan Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-xs text-amber-900 font-extrabold uppercase tracking-widest bg-amber-100 px-3.5 py-1 rounded-full border border-gold/40">
          LUXURY HERITAGE
        </span>
        <h1 className="font-luxury font-extrabold text-3xl md:text-5xl text-gold-gradient mt-2">
          Contact SWARNIKA
        </h1>
        <p className="text-xs sm:text-sm text-gray-600">
          Inquiries regarding 1-gram jewellery orders, showroom consultations, or custom 22K/24K solid gold heirlooms.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Contact Info Cards */}
        <div className="space-y-4">
          
          <div className="p-6 bg-white rounded-2xl border border-gold/30 shadow-sm flex items-start gap-4">
            <div className="p-3 rounded-full bg-gold/10 text-gold border border-gold/30 shrink-0">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-luxury font-bold text-slate-900 text-sm">Official Email</h4>
              <a href="mailto:swarnika.luxury@gmail.com" className="text-xs text-gold font-bold hover:underline block mt-0.5">
                swarnika.luxury@gmail.com
              </a>
              <span className="text-[10px] text-amber-800 font-bold block mt-1">Response time: &lt; 24 hours</span>
            </div>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-gold/30 shadow-sm flex items-start gap-4">
            <div className="p-3 rounded-full bg-gold/10 text-gold border border-gold/30 shrink-0">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-luxury font-bold text-slate-900 text-sm">Helpline & WhatsApp</h4>
              <a href="tel:9481304117" className="text-xs text-gold font-bold hover:underline block mt-0.5">
                94813 04117
              </a>
              <span className="text-[10px] text-amber-800 font-bold block mt-1">Mon - Sat: 9:30 AM - 7:30 PM</span>
            </div>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-gold/30 shadow-sm flex items-start gap-4">
            <div className="p-3 rounded-full bg-gold/10 text-gold border border-gold/30 shrink-0">
              <FaInstagram className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-luxury font-bold text-slate-900 text-sm">Instagram Page</h4>
              <a 
                href="https://www.instagram.com/swarnika.luxury" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-xs text-gold font-bold hover:underline block mt-0.5"
              >
                @swarnika.luxury
              </a>
              <span className="text-[10px] text-gray-500 block mt-1">Follow for new drops & videos</span>
            </div>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-gold/30 shadow-sm flex items-start gap-4">
            <div className="p-3 rounded-full bg-gold/10 text-gold border border-gold/30 shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-luxury font-bold text-slate-900 text-sm">SWARNIKA Showroom</h4>
              <p className="text-xs text-gray-600 mt-0.5">
                SWARNIKA Jewellery , Honnali, Karnataka 577217
              </p>
            </div>
          </div>

        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-gold/40 shadow-md">
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="font-luxury font-bold text-xl text-slate-900">Send SWARNIKA an Inquiry</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Ananya Sharma"
                  className="w-full bg-gray-50 border border-gray-300 text-xs rounded-xl p-3 focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. swarnika.luxury@gmail.com"
                  className="w-full bg-gray-50 border border-gray-300 text-xs rounded-xl p-3 focus:outline-none focus:border-gold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">WhatsApp / Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="94813 04117"
                  className="w-full bg-gray-50 border border-gray-300 text-xs rounded-xl p-3 focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Subject</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g. Real Gold Haram Consultation"
                  className="w-full bg-gray-50 border border-gray-300 text-xs rounded-xl p-3 focus:outline-none focus:border-gold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Message / Inquiry Details *</label>
              <textarea
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Ask us anything about 1-gram jewellery care, delivery timelines, or custom real gold commissions..."
                className="w-full bg-gray-50 border border-gray-300 text-xs rounded-xl p-3 focus:outline-none focus:border-gold"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gold-gradient text-slate-900 font-luxury font-bold text-xs py-3.5 rounded-xl shadow-gold-glow hover:scale-102 transition-transform flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" /> {submitting ? 'Submitting Inquiry...' : 'Submit Inquiry'}
            </button>
          </form>
        </div>

      </div>

      {/* GOOGLE MAPS EMBEDDED IFRAME SECTION FOR SWARNIKA */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gold/40 shadow-md space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div>
            <span className="text-[10px] text-amber-800 font-extrabold uppercase tracking-widest">Showroom Location</span>
            <h3 className="font-luxury font-bold text-xl text-slate-900">Visit SWARNIKA Showroom</h3>
          </div>
          <span className="text-xs text-gold font-bold">SWARNIKA Davangere</span>
        </div>

        <div className="w-full h-[400px] rounded-2xl overflow-hidden border border-gold/30 shadow-inner">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d918.9725628528086!2d75.64928256955642!3d14.239336099137837!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bbbcbcb55751e63%3A0x7f00c6524cd9ce0f!2sSWARNIKA!5e1!3m2!1sen!2sin!4v1786206472351!5m2!1sen!2sin" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="strict-origin-when-cross-origin"
            title="SWARNIKA Google Maps Location"
          ></iframe>
        </div>
      </div>

    </div>
  );
}
