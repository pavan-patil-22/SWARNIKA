import React, { useState } from 'react';
import { Plus, Edit3, Trash2, X, Upload } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { uploadService } from '../../services/api';
import { toast } from 'react-toastify';

export default function AdminBanners() {
  const { banners, saveBanner, removeBanner } = useAdmin();
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    tag: '',
    imageUrl: '',
    buttonText: 'Shop Collection',
    buttonLink: '/products'
  });

  const openCreateModal = () => {
    setEditId(null);
    setFormData({
      title: 'Festive 1 Gram Gold Polish Edition',
      subtitle: 'Micro-plated heirloom necklaces with traditional antique sheen',
      tag: 'New Festive Launch',
      imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1600&q=80',
      buttonText: 'Explore 1-Gram Range',
      buttonLink: '/products'
    });
    setShowModal(true);
  };

  const openEditModal = (ban) => {
    setEditId(ban.id);
    setFormData({
      title: ban.title,
      subtitle: ban.subtitle,
      tag: ban.tag || '',
      imageUrl: ban.imageUrl,
      buttonText: ban.buttonText || 'Shop Collection',
      buttonLink: ban.buttonLink || '/products'
    });
    setShowModal(true);
  };

  // Upload hero banner image from device to Cloudinary (.env)
  const handleDeviceFileUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);

    try {
      const urls = await uploadService.uploadDeviceFiles(files);
      if (urls.length > 0) {
        setFormData(prev => ({ ...prev, imageUrl: urls[0] }));
        toast.success('Hero Banner image uploaded to Cloudinary!', {
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
    await saveBanner(formData, editId);
    toast.success(`Hero Banner ${editId ? 'updated' : 'added'}!`, { style: { background: '#FFF', color: '#D4AF37', border: '1px solid #D4AF37' } });
    setShowModal(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this banner slide?')) {
      await removeBanner(id);
      toast.info('Banner removed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div>
          <h2 className="font-luxury font-bold text-2xl text-gold-gradient">Homepage Carousel Manager</h2>
          <p className="text-xs text-gray-500">Upload hero banner slides directly from your computer via Cloudinary or edit CTA links</p>
        </div>

        <button
          onClick={openCreateModal}
          className="bg-gold-gradient text-slate-900 font-luxury font-bold text-xs px-5 py-2.5 rounded-xl shadow-gold-glow flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Banner Slide
        </button>
      </div>

      <div className="space-y-4">
        {banners.map((banner, index) => (
          <div key={banner.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm flex flex-col md:flex-row items-center justify-between p-4 gap-4 text-slate-800">
            <div className="flex items-center gap-4 w-full md:w-auto">
              <span className="font-bold text-gold text-sm">#{index + 1}</span>
              <img src={banner.imageUrl} alt="" className="w-32 h-20 object-cover rounded-xl border border-gold/30" />
              <div>
                <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-bold uppercase border border-gold/30">
                  {banner.tag || "Hero Banner"}
                </span>
                <h3 className="font-luxury font-bold text-base text-slate-900 mt-1">{banner.title}</h3>
                <p className="text-xs text-gray-500 line-clamp-1">{banner.subtitle}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => openEditModal(banner)}
                className="p-2 bg-amber-50 text-amber-900 rounded-lg hover:bg-gold hover:text-slate-900 text-xs font-bold flex items-center gap-1"
              >
                <Edit3 className="w-4 h-4" /> Edit
              </button>
              <button
                onClick={() => handleDelete(banner.id)}
                className="p-2 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-600 hover:text-white text-xs font-bold flex items-center gap-1"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-gold/40 max-w-md w-full p-6 rounded-2xl space-y-4 text-slate-800 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-luxury font-bold text-lg text-gold-gradient">{editId ? 'Edit Hero Banner' : 'Add Hero Banner'}</h3>
              <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Banner Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-300 text-slate-900 p-2.5 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Subtitle</label>
                <input
                  type="text"
                  required
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-300 text-slate-900 p-2.5 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Tag / Badge Text</label>
                <input
                  type="text"
                  value={formData.tag}
                  onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-300 text-slate-900 p-2.5 rounded-lg"
                />
              </div>

              {/* CLOUDINARY DEVICE UPLOAD & URL INPUT */}
              <div className="p-3 bg-amber-50/50 rounded-xl border border-gold/30 space-y-3">
                <div className="space-y-1">
                  <label className="block text-amber-900 font-bold flex items-center gap-1.5">
                    <Upload className="w-4 h-4 text-gold" /> Upload Image File from Device (Cloudinary)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleDeviceFileUpload}
                    className="w-full text-xs text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-gold file:text-slate-900 cursor-pointer"
                  />
                  {uploading && <p className="text-xs text-gold animate-pulse">Uploading file to Cloudinary...</p>}
                </div>

                <div className="pt-2 border-t border-gray-200">
                  <label className="block text-gray-700 font-bold mb-1">Or Image URL Link</label>
                  <input
                    type="text"
                    required
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full bg-white border border-gray-300 text-slate-900 p-2.5 rounded-lg"
                  />
                </div>

                {formData.imageUrl && (
                  <div className="aspect-video rounded-lg overflow-hidden border border-gold/30">
                    <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Button Text</label>
                  <input
                    type="text"
                    value={formData.buttonText}
                    onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 text-slate-900 p-2.5 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Button Link</label>
                  <input
                    type="text"
                    value={formData.buttonLink}
                    onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 text-slate-900 p-2.5 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 bg-gold-gradient text-slate-900 font-bold p-3 rounded-lg">Save Banner</button>
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-100 text-slate-700 font-bold p-3 rounded-lg">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
