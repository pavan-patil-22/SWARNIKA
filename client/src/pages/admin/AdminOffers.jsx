import React, { useState } from 'react';
import { Plus, Trash2, Edit3, X } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { toast } from 'react-toastify';

export default function AdminOffers() {
  const { offers, saveOffer, removeOffer } = useAdmin();
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    code: '',
    minQuantity: 2,
    discountPercent: 10,
    startDate: '2026-08-01',
    endDate: '2026-12-31',
    description: ''
  });

  const openCreateModal = () => {
    setEditId(null);
    setFormData({
      title: 'Buy 2 Get 10% Extra Off',
      code: 'BUY2GOLD10',
      minQuantity: 2,
      discountPercent: 10,
      startDate: new Date().toISOString().split('T')[0],
      endDate: '2026-12-31',
      description: 'Automatic 10% discount applied when 2 or more 1-gram items are added to cart.'
    });
    setShowModal(true);
  };

  const openEditModal = (off) => {
    setEditId(off.id);
    setFormData({
      title: off.title,
      code: off.code,
      minQuantity: off.minQuantity,
      discountPercent: off.discountPercent,
      startDate: off.startDate,
      endDate: off.endDate,
      description: off.description
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.discountPercent) return;

    await saveOffer(formData, editId);
    toast.success(`Dynamic offer ${editId ? 'updated' : 'created'}!`, { style: { background: '#FFF', color: '#D4AF37', border: '1px solid #D4AF37' } });
    setShowModal(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete offer?')) {
      await removeOffer(id);
      toast.info('Offer removed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div>
          <h2 className="font-luxury font-bold text-2xl text-gold-gradient">Dynamic Offers Engine</h2>
          <p className="text-xs text-gray-500">Configure automated cart discounts (e.g. Buy 2 items -> 10% off)</p>
        </div>

        <button
          onClick={openCreateModal}
          className="bg-gold-gradient text-slate-900 font-luxury font-bold text-xs px-5 py-2.5 rounded-xl shadow-gold-glow flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Create Dynamic Offer
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {offers.map(offer => (
          <div key={offer.id} className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4 shadow-sm text-slate-800">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <span className="bg-gold-gradient text-slate-900 font-luxury font-bold text-xs px-3 py-1 rounded-full uppercase">
                Flat {offer.discountPercent}% OFF
              </span>
              <span className="text-[10px] text-gray-500 font-mono">Code: {offer.code}</span>
            </div>

            <div>
              <h3 className="font-luxury font-bold text-xl text-gold-gradient">{offer.title}</h3>
              <p className="text-xs text-gray-600 mt-1">{offer.description}</p>
            </div>

            <div className="p-3 bg-amber-50/50 rounded-xl border border-gold/20 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-600">Minimum Quantity Trigger:</span>
                <strong className="text-amber-900">{offer.minQuantity} items</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Validity Period:</span>
                <span className="text-slate-800 font-medium">{offer.startDate} to {offer.endDate}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
              <button
                onClick={() => openEditModal(offer)}
                className="p-1.5 bg-amber-50 text-amber-900 rounded hover:bg-gold hover:text-slate-900 text-xs font-bold flex items-center gap-1"
              >
                <Edit3 className="w-3.5 h-3.5" /> Edit
              </button>
              <button
                onClick={() => handleDelete(offer.id)}
                className="p-1.5 bg-rose-50 text-rose-600 rounded hover:bg-rose-600 hover:text-white text-xs font-bold flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-gold/40 max-w-md w-full p-6 rounded-2xl space-y-4 text-slate-800 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-luxury font-bold text-lg text-gold-gradient">{editId ? 'Edit Offer' : 'Create Offer'}</h3>
              <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Offer Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-300 text-slate-900 p-2.5 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Min Item Quantity</label>
                  <input
                    type="number"
                    required
                    value={formData.minQuantity}
                    onChange={(e) => setFormData({ ...formData, minQuantity: Number(e.target.value) })}
                    className="w-full bg-gray-50 border border-gray-300 text-slate-900 p-2.5 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Discount %</label>
                  <input
                    type="number"
                    required
                    value={formData.discountPercent}
                    onChange={(e) => setFormData({ ...formData, discountPercent: Number(e.target.value) })}
                    className="w-full bg-gray-50 border border-gray-300 text-slate-900 p-2.5 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Coupon Code</label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-300 text-slate-900 p-2.5 rounded-lg font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 text-slate-900 p-2.5 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 text-slate-900 p-2.5 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-300 text-slate-900 p-2.5 rounded-lg"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 bg-gold-gradient text-slate-900 font-bold p-3 rounded-lg">Save Offer</button>
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-100 text-slate-700 font-bold p-3 rounded-lg">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
