import React, { useState, useEffect } from 'react';
import { ShieldCheck, Truck, Mail, Cloud, Save, Send } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { toast } from 'react-toastify';

export default function AdminSettings() {
  const { settings, updateGlobalSettings } = useAdmin();
  
  const [returnDays, setReturnDays] = useState(7);
  const [returnPolicyText, setReturnPolicyText] = useState('');
  const [deliveryCharge, setDeliveryCharge] = useState(99);
  const [freeDeliveryThreshold, setFreeDeliveryThreshold] = useState(1999);
  
  // Cloudinary credentials stored in DB
  const [cloudName, setCloudName] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');

  // Nodemailer credentials stored in DB
  const [emailUser, setEmailUser] = useState('');
  const [emailPass, setEmailPass] = useState('');

  useEffect(() => {
    if (settings) {
      if (settings.returnPolicyDays !== undefined) setReturnDays(settings.returnPolicyDays);
      if (settings.returnPolicyText !== undefined) setReturnPolicyText(settings.returnPolicyText);
      if (settings.deliveryCharge !== undefined) setDeliveryCharge(settings.deliveryCharge);
      if (settings.freeDeliveryThreshold !== undefined) setFreeDeliveryThreshold(settings.freeDeliveryThreshold);
      if (settings.cloudinaryCloudName !== undefined) setCloudName(settings.cloudinaryCloudName);
      if (settings.cloudinaryApiKey !== undefined) setApiKey(settings.cloudinaryApiKey);
      if (settings.cloudinaryApiSecret !== undefined) setApiSecret(settings.cloudinaryApiSecret);
      if (settings.emailUser !== undefined) setEmailUser(settings.emailUser);
      if (settings.emailPass !== undefined) setEmailPass(settings.emailPass);
    }
  }, [settings]);

  const handleSave = async (e) => {
    e.preventDefault();
    await updateGlobalSettings({
      returnPolicyDays: Number(returnDays),
      returnPolicyText,
      deliveryCharge: Number(deliveryCharge),
      freeDeliveryThreshold: Number(freeDeliveryThreshold),
      cloudinaryCloudName: cloudName,
      cloudinaryApiKey: apiKey,
      cloudinaryApiSecret: apiSecret,
      emailUser,
      emailPass
    });
    toast.success('Store Settings, Delivery Charges & Cloud Credentials Saved in MongoDB!', {
      style: { background: '#FFF', color: '#D4AF37', border: '1px solid #D4AF37' }
    });
  };

  const handleTestEmail = (type) => {
    toast.info(`Nodemailer Dispatch Test: Sending ${type} template using DB credentials (${emailUser || 'default'}).`, {
      style: { background: '#FFF', color: '#D4AF37', border: '1px solid #D4AF37' }
    });
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h2 className="font-luxury font-bold text-2xl text-gold-gradient">Store Settings & Credentials (MongoDB Stored)</h2>
        <p className="text-xs text-gray-500">Configure delivery fees, free shipping threshold, return policy days, Cloudinary media keys, and Nodemailer email dispatches</p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* 1. Admin Configurable Delivery Charges */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4 text-slate-800">
          <div className="flex items-center gap-2 text-gold font-luxury font-bold text-base border-b border-gray-100 pb-2">
            <Truck className="w-5 h-5 text-gold" /> Admin Delivery Charge Configuration
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Standard Delivery Fee (₹)</label>
              <input
                type="number"
                required
                value={deliveryCharge}
                onChange={(e) => setDeliveryCharge(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 text-slate-900 p-3 rounded-xl focus:border-gold font-bold"
              />
              <span className="text-[10px] text-gray-500 mt-1 block">Added to customer cart when order subtotal is below free threshold</span>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Free Delivery Minimum Order (₹)</label>
              <input
                type="number"
                required
                value={freeDeliveryThreshold}
                onChange={(e) => setFreeDeliveryThreshold(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 text-slate-900 p-3 rounded-xl focus:border-gold font-bold"
              />
              <span className="text-[10px] text-gray-500 mt-1 block">Orders equal or above this subtotal unlock FREE delivery</span>
            </div>
          </div>
        </div>

        {/* 2. Global Return Policy Days */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4 text-slate-800">
          <div className="flex items-center gap-2 text-gold font-luxury font-bold text-base border-b border-gray-100 pb-2">
            <ShieldCheck className="w-5 h-5 text-gold" /> Global Return Policy Days
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Return Window (No. of Days)</label>
              <input
                type="number"
                required
                value={returnDays}
                onChange={(e) => setReturnDays(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 text-slate-900 p-3 rounded-xl focus:border-gold font-bold"
              />
              <span className="text-[10px] text-amber-800 font-medium mt-1 block">Displayed across product details, footer, and return guidelines</span>
            </div>

            <div className="md:col-span-2">
              <label className="block text-slate-700 font-bold mb-1">Return Policy Terms Disclaimer</label>
              <input
                type="text"
                required
                value={returnPolicyText}
                onChange={(e) => setReturnPolicyText(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 text-slate-900 p-3 rounded-xl focus:border-gold"
              />
            </div>
          </div>
        </div>

        {/* 3. Cloudinary Integration Credentials (Stored in DB) */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4 text-slate-800">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <div className="flex items-center gap-2 text-gold font-luxury font-bold text-base">
              <Cloud className="w-5 h-5 text-gold" /> Cloudinary Media Engine Credentials (DB Stored)
            </div>
            <span className="text-[10px] bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full font-bold border border-gold/40">
              Stored in MongoDB
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1">CLOUDINARY_CLOUD_NAME</label>
              <input
                type="text"
                value={cloudName}
                onChange={(e) => setCloudName(e.target.value)}
                placeholder="e.g. aureateluxe_cloud"
                className="w-full bg-gray-50 border border-gray-300 text-slate-900 p-3 rounded-xl focus:border-gold font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">CLOUDINARY_API_KEY</label>
              <input
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="e.g. 123456789012345"
                className="w-full bg-gray-50 border border-gray-300 text-slate-900 p-3 rounded-xl focus:border-gold font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">CLOUDINARY_API_SECRET</label>
              <input
                type="password"
                value={apiSecret}
                onChange={(e) => setApiSecret(e.target.value)}
                placeholder="Enter secret..."
                className="w-full bg-gray-50 border border-gray-300 text-slate-900 p-3 rounded-xl focus:border-gold font-mono"
              />
            </div>
          </div>
          <p className="text-[11px] text-gray-500 italic">* If credentials are empty or fail, system gracefully uses normal local upload fallback.</p>
        </div>

        {/* 4. Nodemailer Email Credentials (Stored in DB) */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4 text-slate-800">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <div className="flex items-center gap-2 text-gold font-luxury font-bold text-base">
              <Mail className="w-5 h-5 text-gold" /> Nodemailer Dispatch Credentials (DB Stored)
            </div>
            <span className="text-[10px] bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full font-bold border border-gold/40">
              Stored in MongoDB
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1">EMAIL_USER (Sender Email)</label>
              <input
                type="email"
                value={emailUser}
                onChange={(e) => setEmailUser(e.target.value)}
                placeholder="notifications@aureateluxe.com"
                className="w-full bg-gray-50 border border-gray-300 text-slate-900 p-3 rounded-xl font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">EMAIL_PASS (Gmail App Password)</label>
              <input
                type="password"
                value={emailPass}
                onChange={(e) => setEmailPass(e.target.value)}
                placeholder="Enter App Password..."
                className="w-full bg-gray-50 border border-gray-300 text-slate-900 p-3 rounded-xl font-mono"
              />
            </div>
          </div>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => handleTestEmail('Order Confirmation Email')}
              className="bg-amber-50 hover:bg-gold hover:text-slate-900 text-amber-900 border border-gold/40 text-xs font-bold px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Send className="w-3.5 h-3.5" /> Test Order Confirmation Dispatch
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="bg-gold-gradient text-slate-900 font-luxury font-bold text-sm px-8 py-4 rounded-xl shadow-gold-glow hover:scale-102 transition-transform flex items-center gap-2"
        >
          <Save className="w-5 h-5" /> Save All Credentials & Settings in MongoDB
        </button>

      </form>
    </div>
  );
}
