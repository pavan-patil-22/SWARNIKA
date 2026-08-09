import React, { useState } from 'react';
import { MapPin, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

export default function Addresses() {
  const { addresses, addAddress, deleteAddress, setDefaultAddress } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAddr, setNewAddr] = useState({
    fullName: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pincode: ''
  });

  const handleCreate = (e) => {
    e.preventDefault();
    addAddress(newAddr);
    setShowAddModal(false);
    setNewAddr({ fullName: '', phone: '', street: '', city: '', state: '', pincode: '' });
    toast.success('Address added to book!', { style: { background: '#111', color: '#D4AF37' } });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div>
          <h1 className="font-luxury font-bold text-3xl text-onyx">Address Book</h1>
          <p className="text-xs text-gray-500">Manage default Cash on Delivery shipping addresses</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-onyx text-gold font-bold text-xs px-4 py-2.5 rounded-full border border-gold/40 hover:bg-gold hover:text-onyx flex items-center gap-1.5 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Address
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {addresses.map(addr => (
          <div key={addr.id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-gold" />
                <strong className="font-luxury font-bold text-sm text-onyx">{addr.fullName}</strong>
              </div>
              {addr.isDefault ? (
                <span className="text-[10px] bg-gold/20 text-onyx font-bold px-2.5 py-0.5 rounded-full border border-gold/40">
                  Default Address
                </span>
              ) : (
                <button
                  onClick={() => setDefaultAddress(addr.id)}
                  className="text-[10px] text-amber-800 hover:underline font-bold"
                >
                  Make Default
                </button>
              )}
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              {addr.street}, {addr.city}, {addr.state} - {addr.pincode}
            </p>
            <span className="text-xs text-gray-400 block">Phone: {addr.phone}</span>

            <button
              onClick={() => deleteAddress(addr.id)}
              className="text-rose-500 hover:text-rose-700 text-xs font-bold flex items-center gap-1 pt-2 border-t border-gray-100"
            >
              <Trash2 className="w-3.5 h-3.5" /> Remove Address
            </button>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full p-6 rounded-2xl border border-gold/40 space-y-4">
            <h3 className="font-luxury font-bold text-lg text-onyx">Add Delivery Address</h3>
            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <input
                type="text"
                required
                placeholder="Full Name"
                value={newAddr.fullName}
                onChange={(e) => setNewAddr({ ...newAddr, fullName: e.target.value })}
                className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg"
              />
              <input
                type="tel"
                required
                placeholder="Phone Number"
                value={newAddr.phone}
                onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg"
              />
              <input
                type="text"
                required
                placeholder="Street Address"
                value={newAddr.street}
                onChange={(e) => setNewAddr({ ...newAddr, street: e.target.value })}
                className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  required
                  placeholder="City"
                  value={newAddr.city}
                  onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                  className="p-2.5 bg-gray-50 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  required
                  placeholder="State"
                  value={newAddr.state}
                  onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                  className="p-2.5 bg-gray-50 border border-gray-300 rounded-lg"
                />
              </div>
              <input
                type="text"
                required
                placeholder="Pincode"
                value={newAddr.pincode}
                onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value })}
                className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg"
              />
              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 bg-onyx text-gold font-bold p-3 rounded-lg">Save Address</button>
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 bg-gray-100 text-gray-700 font-bold p-3 rounded-lg">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
