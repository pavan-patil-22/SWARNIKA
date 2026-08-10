import React, { useEffect, useState } from 'react';
import { Plus, Edit3, Trash2, X, Upload } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { uploadService } from '../../services/api';
import { toast } from 'react-toastify';

export default function AdminCategories() {
  const { categories, saveCategory, removeCategory } = useAdmin();
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    console.log("Image state changed:", image);
  }, [image]);

  const openCreateModal = () => {
    setEditId(null);
    setName('');
    setDescription('');
    setImage('');
    setShowModal(true);
  };

  const openEditModal = (cat) => {
    setEditId(cat.id);
    setName(cat.name || '');
    setDescription(cat.description || '');
    setImage(cat.image || '');
    setShowModal(true);
  };

  // Upload image file from device to Cloudinary (.env)
  const handleDeviceFileUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);

    try {
      const urls = await uploadService.uploadDeviceFiles(files);
      if (urls.length > 0) {
        setImage(urls[0]);
        toast.success('Category banner image uploaded to Cloudinary!');
      }
    } catch (err) {
      toast.error('Device image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Please enter a category name');
      return;
    }

    await saveCategory({ name, description, image }, editId);
    toast.success(`Category ${editId ? 'updated' : 'added'}!`);
    setShowModal(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete category?')) {
      await removeCategory(id);
      toast.info('Category removed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div>
          <h2 className="font-luxury font-bold text-2xl text-gold-gradient">Categories Manager</h2>
          <p className="text-xs text-gray-500">Add, edit, or upload 1-gram jewellery category images directly from your computer via Cloudinary</p>
        </div>

        <button
          onClick={openCreateModal}
          className="bg-gold-gradient text-slate-900 font-luxury font-bold text-xs px-5 py-2.5 rounded-xl shadow-gold-glow flex items-center gap-2 hover:scale-102 transition-transform"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map(cat => (
          <div key={cat.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm p-5 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="aspect-video rounded-xl overflow-hidden relative border border-gold/20 bg-amber-50">
                <img 
                  src={cat.image || "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80"} 
                  alt={cat.name} 
                  className="w-full h-full object-cover" 
                />
                <span className="absolute top-2 left-2 bg-white/90 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded border border-gold/40 shadow">
                  1 Gram Polish
                </span>
              </div>

              <div>
                <h3 className="font-luxury font-bold text-lg text-slate-900">{cat.name}</h3>
                <p className="text-xs text-gray-500 line-clamp-2">{cat.description}</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
              <button
                onClick={() => openEditModal(cat)}
                className="p-1.5 bg-amber-50 text-amber-900 rounded hover:bg-gold hover:text-slate-900 transition-colors text-xs flex items-center gap-1 font-bold border border-gold/30"
              >
                <Edit3 className="w-3.5 h-3.5" /> Edit
              </button>
              <button
                onClick={() => handleDelete(cat.id)}
                className="p-1.5 bg-rose-50 text-rose-600 rounded hover:bg-rose-600 hover:text-white transition-colors text-xs flex items-center gap-1 font-bold"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div 
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowModal(false);
          }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-white border border-gold/40 max-w-md w-full p-6 rounded-2xl space-y-4 text-slate-800 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-luxury font-bold text-lg text-gold-gradient">{editId ? 'Edit Category' : 'Add Category'}</h3>
              <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-gray-400 hover:text-slate-900" /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter category name..."
                  className="w-full bg-gray-50 border border-gray-300 text-slate-900 p-2.5 rounded-lg focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Category description..."
                  className="w-full bg-gray-50 border border-gray-300 text-slate-900 p-2.5 rounded-lg focus:border-gold"
                />
              </div>

              {/* CLOUDINARY DEVICE FILE UPLOAD & URL INPUT */}
              <div className="p-3 bg-amber-50/50 rounded-xl border border-gold/30 space-y-3">
                <div className="space-y-1">
                  <label className="block text-amber-900 font-bold flex items-center gap-1.5">
                    <Upload className="w-4 h-4 text-gold" /> Upload Banner from Device (Cloudinary)
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
                  <label className="block text-gray-700 font-bold mb-1">Or Banner Image URL</label>
                  <input
                    type="text"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="Paste banner image URL..."
                    className="w-full bg-white border border-gray-300 text-slate-900 p-2 rounded-lg"
                  />
                </div>

                {image && (
                  <div className="aspect-video rounded-lg overflow-hidden border border-gold/30">
                    <img src={image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 bg-gold-gradient text-slate-900 font-bold p-3 rounded-lg shadow-gold-glow">
                  Save Category
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
