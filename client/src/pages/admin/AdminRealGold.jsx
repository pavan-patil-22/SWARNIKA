import React, { useState } from 'react';
import { Plus, Edit3, Trash2, X, Upload, Crown, ShieldCheck, Scale, Image as ImageIcon } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { uploadService } from '../../services/api';
import { toast } from 'react-toastify';

export default function AdminRealGold() {
  const { realGoldItems, categories, saveRealGoldItem, removeRealGoldItem } = useAdmin();

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    category: categories[0]?.name || 'Necklace Sets',
    purity: '22K (916) BIS Hallmarked Gold',
    weightInGrams: '45.0 grams',
    description: '',
    images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=80']
  });

  const openCreateModal = () => {
    setEditId(null);
    setFormData({
      title: 'Royal Heirloom 22K Hallmarked Gold Necklace',
      category: categories[0]?.name || 'Necklace Sets',
      purity: '22K (916) BIS Hallmarked Gold',
      weightInGrams: '58.5 grams',
      description: 'Masterwork hand-carved in 22 Karat solid gold with official 916 BIS hallmark stamp. Showcase piece for showroom display.',
      images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=80']
    });
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditId(item.id);
    setFormData({
      title: item.title,
      category: item.category,
      purity: item.purity || '22K (916) BIS Hallmarked Gold',
      weightInGrams: item.weightInGrams || '45.0 grams',
      description: item.description || '',
      images: item.images?.length ? item.images : [item.image || '']
    });
    setShowModal(true);
  };

  // Upload image from device via Cloudinary (.env)
  const handleDeviceFileUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);

    try {
      const urls = await uploadService.uploadDeviceFiles(files);
      if (urls.length > 0) {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images.filter(img => !img.includes('unsplash')), ...urls]
        }));
        toast.success(`Uploaded ${urls.length} real gold image(s) to Cloudinary!`, {
          style: { background: '#FFF', color: '#D4AF37', border: '1px solid #D4AF37' }
        });
      }
    } catch (err) {
      toast.error('Device image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.weightInGrams) return;

    await saveRealGoldItem(formData, editId);
    toast.success(`Real Gold item ${editId ? 'updated' : 'added'} successfully!`, {
      style: { background: '#FFF', color: '#D4AF37', border: '1px solid #D4AF37' }
    });
    setShowModal(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Remove this Real Gold collection item?')) {
      await removeRealGoldItem(id);
      toast.info('Item removed from Real Gold collection');
    }
  };

  return (
    <div className="space-y-6 text-slate-800">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <h2 className="font-luxury font-bold text-2xl text-gold-gradient flex items-center gap-2">
            <Crown className="w-6 h-6 text-gold" /> Real 22K/24K Gold Showcase Manager
          </h2>
          <p className="text-xs text-gray-500">Manage showroom original gold items with grams weight, purity tags, categories & multiple Cloudinary images (No online pricing)</p>
        </div>

        <button
          onClick={openCreateModal}
          className="bg-gold-gradient text-slate-900 font-luxury font-bold text-xs px-5 py-3 rounded-xl shadow-gold-glow flex items-center justify-center gap-2 hover:scale-102 transition-transform"
        >
          <Plus className="w-4 h-4" /> Add Real Gold Item
        </button>
      </div>

      {/* Real Gold Showcase Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {realGoldItems.map(item => (
          <div key={item.id} className="bg-white rounded-2xl border border-gold/40 shadow-sm p-5 space-y-4 flex flex-col justify-between">
            
            <div className="space-y-3">
              {/* Image Banner */}
              <div className="aspect-square rounded-xl overflow-hidden relative border border-gold/30">
                <img src={item.images?.[0]} alt="" className="w-full h-full object-cover" />
                <span className="absolute top-2 left-2 bg-slate-900 text-gold text-[10px] font-bold px-2.5 py-1 rounded-full shadow border border-gold/40 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-gold" /> {item.purity || "22K (916) Gold"}
                </span>
                <span className="absolute bottom-2 right-2 bg-amber-50 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded shadow border border-gold/40 flex items-center gap-1">
                  <Scale className="w-3.5 h-3.5 text-gold" /> {item.weightInGrams}
                </span>
              </div>

              <div>
                <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-bold uppercase border border-gold/30">
                  {item.category}
                </span>
                <h3 className="font-luxury font-bold text-lg text-slate-900 mt-1 line-clamp-1">{item.title}</h3>
                <p className="text-xs text-gray-500 line-clamp-2 mt-0.5">{item.description}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <span className="text-[10px] text-amber-800 font-bold bg-amber-50 px-2 py-1 rounded border border-gold/30">
                No Online Price (Showroom Inquiry)
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEditModal(item)}
                  className="p-2 bg-amber-50 text-amber-900 hover:bg-gold hover:text-slate-900 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* CREATE & EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-gold/40 max-w-xl w-full p-6 rounded-2xl space-y-4 text-slate-800 shadow-2xl max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-luxury font-bold text-lg text-gold-gradient">
                {editId ? 'Edit Real Gold Item' : 'Add Real Gold Showcase Item'}
              </h3>
              <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              <div>
                <label className="block text-slate-700 font-bold mb-1">Item Title / Name</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Imperial Antique 22K Hallmarked Gold Haram"
                  className="w-full bg-gray-50 border border-gray-300 text-slate-900 p-2.5 rounded-lg focus:border-gold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 text-slate-900 p-2.5 rounded-lg font-bold"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Gold Purity Tag</label>
                  <input
                    type="text"
                    required
                    value={formData.purity}
                    onChange={(e) => setFormData({ ...formData, purity: e.target.value })}
                    placeholder="e.g. 22K (916) BIS Hallmarked"
                    className="w-full bg-gray-50 border border-gray-300 text-slate-900 p-2.5 rounded-lg font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Weight in Grams</label>
                  <input
                    type="text"
                    required
                    value={formData.weightInGrams}
                    onChange={(e) => setFormData({ ...formData, weightInGrams: e.target.value })}
                    placeholder="e.g. 52.4 grams"
                    className="w-full bg-gray-50 border border-gray-300 text-slate-900 p-2.5 rounded-lg font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Description & Craftsmanship Details</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Details about craftsmanship, certified hallmark..."
                  className="w-full bg-gray-50 border border-gray-300 text-slate-900 p-2.5 rounded-lg"
                />
              </div>

              {/* CLOUDINARY DEVICE FILE UPLOAD */}
              <div className="p-3 bg-amber-50/50 rounded-xl border border-gold/30 space-y-3">
                <div className="space-y-1">
                  <label className="block text-amber-900 font-bold flex items-center gap-1.5">
                    <Upload className="w-4 h-4 text-gold" /> Upload Image File(s) from Device (Cloudinary)
                  </label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleDeviceFileUpload}
                    className="w-full text-xs text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-gold file:text-slate-900 cursor-pointer"
                  />
                  {uploading && <p className="text-xs text-gold animate-pulse">Uploading file to Cloudinary...</p>}
                </div>

                <div className="pt-2 border-t border-gray-200">
                  <label className="block text-gray-700 font-bold mb-1">Or Primary Image URL Link</label>
                  <input
                    type="text"
                    value={formData.images[0] || ''}
                    onChange={(e) => setFormData({ ...formData, images: [e.target.value] })}
                    className="w-full bg-white border border-gray-300 text-slate-900 p-2 rounded-lg"
                  />
                </div>

                {formData.images[0] && (
                  <div className="flex gap-2 pt-1 overflow-x-auto">
                    {formData.images.map((img, i) => (
                      <img key={i} src={img} alt="" className="w-16 h-16 object-cover rounded-lg border border-gold/30" />
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 bg-gold-gradient text-slate-900 font-bold p-3 rounded-lg">
                  Save Real Gold Showcase Item
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-100 text-slate-700 font-bold p-3 rounded-lg">
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
