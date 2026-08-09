import React, { useState } from 'react';
import { User, Mail, Shield, Sparkles, MapPin, Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function Profile() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  const handleSave = (e) => {
    e.preventDefault();
    toast.success('Profile details updated!', { style: { background: '#111', color: '#D4AF37' } });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="font-luxury font-bold text-3xl text-onyx">Account Profile</h1>
        <p className="text-xs text-gray-500">Manage your member details and preferences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Profile Card Sidebar */}
        <div className="bg-onyx text-white p-6 rounded-2xl border border-gold/40 text-center space-y-4 shadow-xl">
          <div className="w-20 h-20 rounded-full bg-gold-gradient text-onyx font-bold text-2xl flex items-center justify-center mx-auto shadow-gold-glow">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-luxury font-bold text-lg text-gold-gradient">{user?.name}</h3>
            <p className="text-xs text-gray-300">{user?.email}</p>
            <span className="inline-block mt-2 text-[10px] bg-gold/20 text-gold px-3 py-1 rounded-full font-bold uppercase tracking-wider">
              {user?.role === 'admin' ? 'Administrator' : 'Valued Patron'}
            </span>
          </div>

          <div className="pt-4 border-t border-gray-800 space-y-2 text-left text-xs">
            <Link to="/orders" className="flex items-center gap-2 text-gray-300 hover:text-gold p-2 bg-onyx-light rounded-lg">
              <Package className="w-4 h-4 text-gold" /> Track Orders
            </Link>
            <Link to="/addresses" className="flex items-center gap-2 text-gray-300 hover:text-gold p-2 bg-onyx-light rounded-lg">
              <MapPin className="w-4 h-4 text-gold" /> Address Book
            </Link>
          </div>
        </div>

        {/* Update Form */}
        <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
          <h3 className="font-luxury font-bold text-lg text-onyx border-b border-gray-100 pb-3">Personal Information</h3>
          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl focus:border-gold"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl focus:border-gold"
              />
            </div>
            <button
              type="submit"
              className="bg-onyx text-gold font-bold text-xs px-6 py-3 rounded-xl hover:bg-gold hover:text-onyx transition-colors"
            >
              Save Changes
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
