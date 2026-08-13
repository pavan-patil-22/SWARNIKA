import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Upload, 
  X, 
  Star, 
  Sparkles, 
  AlertTriangle, 
  PackageCheck, 
  Layers,
  ArrowUpDown,
  CheckCircle2,
  FileText,
  FileSpreadsheet,
  Crown
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { uploadService } from '../../services/api';
import { toast } from 'react-toastify';

export default function AdminProducts() {
  const { products, categories, saveProduct, removeProduct, exportProductReport } = useAdmin();

  // Search, Filter & Sort States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [stockFilter, setStockFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('NEWEST');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newColorInput, setNewColorInput] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: 'Necklaces',
    description: '',
    price: '',
    originalPrice: '',
    stock: 10,
    images: [],
    colors: ['Yellow Gold', 'Rose Gold'],
    material: 'Brass-Copper alloy with 1 Gram Gold Polish (Imitation Jewellery)',
    weight: '45 grams',
    featured: false,
    bestSeller: false,
    newArrival: true,
    trending: false
  });

  // Calculate Summary Metrics
  const totalCount = products.length;
  const lowStockCount = products.filter(p => p.stock > 0 && p.stock <= 5).length;
  const outOfStockCount = products.filter(p => p.stock === 0).length;
  const inventoryValue = products.reduce((sum, p) => sum + (p.price * (p.stock || 0)), 0);

  // Filtered & Sorted Products List
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // Search
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            p.sku.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Category
      const matchesCategory = selectedCategory === 'ALL' || p.category === selectedCategory;

      // Stock
      let matchesStock = true;
      if (stockFilter === 'IN_STOCK') matchesStock = p.stock > 5;
      if (stockFilter === 'LOW_STOCK') matchesStock = p.stock > 0 && p.stock <= 5;
      if (stockFilter === 'OUT_OF_STOCK') matchesStock = p.stock === 0;

      return matchesSearch && matchesCategory && matchesStock;
    }).sort((a, b) => {
      if (sortBy === 'PRICE_LOW') return a.price - b.price;
      if (sortBy === 'PRICE_HIGH') return b.price - a.price;
      if (sortBy === 'RATING') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'STOCK') return (a.stock || 0) - (b.stock || 0);
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });
  }, [products, searchQuery, selectedCategory, stockFilter, sortBy]);

  const openCreateModal = () => {
    setEditId(null);
    setFormData({
      name: '',
      sku: `1G-${Math.floor(1000 + Math.random() * 9000)}`,
      category: categories[0]?.name || 'Necklaces',
      description: '',
      price: '',
      originalPrice: '',
      stock: '10',
      images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80'],
      colors: ['Yellow Gold', 'Rose Gold'],
      material: 'Brass-Copper alloy with 1 Gram Gold Polish (Imitation Jewellery)',
      weight: '45 grams',
      featured: false,
      bestSeller: false,
      newArrival: true,
      trending: false
    });
    setNewImageUrl('');
    setNewColorInput('');
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setEditId(product.id);
    setFormData({
      name: product.name,
      sku: product.sku,
      category: product.category,
      description: product.description || '',
      price: product.price,
      originalPrice: product.originalPrice,
      stock: product.stock,
      images: product.images?.length ? product.images : [product.image || ''],
      colors: product.colors?.length ? product.colors : ['Yellow Gold', 'Rose Gold'],
      material: product.material || 'Brass-Copper alloy with 1 Gram Gold Polish',
      weight: product.weight || '45 grams',
      featured: !!product.featured,
      bestSeller: !!product.bestSeller,
      newArrival: !!product.newArrival,
      trending: !!product.trending
    });
    setNewImageUrl('');
    setNewColorInput('');
    setShowModal(true);
  };

  // Add custom Image URL to gallery
  const handleAddImageUrl = () => {
    if (!newImageUrl.trim()) return;
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, newImageUrl.trim()]
    }));
    setNewImageUrl('');
    toast.success('Image URL added to product gallery!');
  };

  // Remove image from gallery
  const handleRemoveImage = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== indexToRemove)
    }));
  };

  // Add custom Color Variant tag
  const handleAddColor = () => {
    if (!newColorInput.trim()) return;
    const cleanColor = newColorInput.trim();
    if (!formData.colors.includes(cleanColor)) {
      setFormData(prev => ({
        ...prev,
        colors: [...prev.colors, cleanColor]
      }));
    }
    setNewColorInput('');
  };

  // Remove color variant
  const handleRemoveColor = (colorToRemove) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.filter(c => c !== colorToRemove)
    }));
  };

  // Device file upload via Cloudinary (.env)
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
        toast.success(`Uploaded ${urls.length} product image(s) to Cloudinary!`);
      }
    } catch (err) {
      toast.error('Device image upload failed');
    } finally {
      setUploading(false);
    }
  };

  // Instant Stock Adjustment directly from product card
  const handleStockAdjust = async (product, delta) => {
    const newStock = Math.max(0, (product.stock || 0) + delta);
    await saveProduct({ ...product, stock: newStock }, product.id);
    toast.info(`Updated ${product.name} stock to ${newStock}`);
  };

  // Instant Badge Toggle directly from card
  const handleToggleBadge = async (product, fieldName) => {
    const updatedVal = !product[fieldName];
    await saveProduct({ ...product, [fieldName]: updatedVal }, product.id);
    toast.success(`Updated ${product.name} ${fieldName} flag to ${updatedVal ? 'ON' : 'OFF'}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.price) return;

    const discount = Math.round(((formData.originalPrice - formData.price) / formData.originalPrice) * 100);

    const payload = {
      ...formData,
      price: Number(formData.price),
      originalPrice: Number(formData.originalPrice),
      stock: Number(formData.stock),
      discountPercent: discount > 0 ? discount : 0,
      image: formData.images[0] || ''
    };

    await saveProduct(payload, editId);
    toast.success(`Product ${editId ? 'updated' : 'created'} successfully!`);
    setShowModal(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this product item?')) {
      await removeProduct(id);
      toast.info('Product removed from database');
    }
  };

  return (
    <div className="space-y-6 text-slate-800">
      
      {/* Top Header & Quick Action Buttons */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <h2 className="font-luxury font-bold text-2xl text-gold-gradient flex items-center gap-2">
            <Layers className="w-6 h-6 text-gold" /> Products & Inventory Manager
          </h2>
          <p className="text-xs text-gray-500">Manage multiple image URLs, colour variants, stock levels, and export filtered inventory PDFs</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* PRODUCT EXPORT BUTTON (PDF / EXCEL) */}
          <button
            onClick={() => exportProductReport(stockFilter, 'pdf')}
            className="bg-slate-900 text-gold border border-gold/40 font-luxury font-bold text-xs px-4 py-3 rounded-xl hover:bg-slate-800 transition-all flex items-center gap-2"
          >
            <FileText className="w-4 h-4 text-gold" /> Export Product PDF ({stockFilter})
          </button>

          <button
            onClick={openCreateModal}
            className="bg-gold-gradient text-slate-900 font-luxury font-bold text-xs px-5 py-3 rounded-xl shadow-gold-glow flex items-center justify-center gap-2 hover:scale-102 transition-transform"
          >
            <Plus className="w-4 h-4" /> Add New 1-Gram Product
          </button>
        </div>
      </div>

      {/* QUICK SUMMARY METRICS BAR */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Total Products</span>
            <span className="font-luxury font-bold text-2xl text-slate-900">{totalCount}</span>
          </div>
          <div className="p-3 bg-amber-50 text-gold rounded-xl border border-gold/30">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Low Stock Alert</span>
            <span className="font-luxury font-bold text-2xl text-amber-600">{lowStockCount}</span>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl border border-amber-200">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Out of Stock</span>
            <span className="font-luxury font-bold text-2xl text-rose-600">{outOfStockCount}</span>
          </div>
          <div className="p-3 bg-rose-50 text-rose-600 rounded-xl border border-rose-200">
            <X className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Inventory Value</span>
            <span className="font-luxury font-bold text-xl text-gold-gradient">₹{inventoryValue.toLocaleString()}</span>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-200">
            <PackageCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* FILTER & SEARCH CONTROL BAR */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        
        {/* Search */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by product name or SKU..."
            className="w-full bg-gray-50 border border-gray-300 rounded-xl py-2.5 pl-9 pr-3 text-slate-900 focus:outline-none focus:border-gold"
          />
          <Search className="w-4 h-4 text-gold absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-slate-800 font-bold focus:border-gold"
          >
            <option value="ALL">All Categories ({categories.length})</option>
            {categories.map(c => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>

          {/* Stock Filter */}
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-slate-800 font-bold focus:border-gold"
          >
            <option value="ALL">All Stock Status</option>
            <option value="IN_STOCK">In Stock (&gt; 5)</option>
            <option value="LOW_STOCK">Low Stock (1 - 5)</option>
            <option value="OUT_OF_STOCK">Out of Stock (0)</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-slate-800 font-bold focus:border-gold"
          >
            <option value="NEWEST">Sort: Newest First</option>
            <option value="PRICE_LOW">Price: Low to High</option>
            <option value="PRICE_HIGH">Price: High to Low</option>
            <option value="STOCK">Stock Quantity</option>
          </select>

        </div>
      </div>

      {/* PRODUCTS GRID LIST */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((prod) => {
          const isLowStock = prod.stock > 0 && prod.stock <= 5;
          const isOutOfStock = prod.stock === 0;

          return (
            <div 
              key={prod.id} 
              className={`bg-white rounded-2xl border p-4 space-y-3 shadow-sm hover:shadow-md transition-all relative flex flex-col justify-between ${
                isOutOfStock ? 'border-rose-300 bg-rose-50/20' : (isLowStock ? 'border-amber-300 bg-amber-50/20' : 'border-gray-200')
              }`}
            >
              <div>
                {/* Product Image & Badges */}
                <div className="relative h-48 w-full bg-amber-50/40 rounded-xl overflow-hidden mb-3 border border-gold/20 flex items-center justify-center">
                  <img 
                    src={prod.images?.[0] || prod.image} 
                    alt={prod.name} 
                    className="w-full h-full object-contain p-2"
                  />
                  
                  {/* Stock Tag */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {isOutOfStock && (
                      <span className="bg-rose-600 text-white font-extrabold text-[10px] px-2 py-0.5 rounded-full shadow">
                        OUT OF STOCK
                      </span>
                    )}
                    {isLowStock && (
                      <span className="bg-amber-500 text-white font-extrabold text-[10px] px-2 py-0.5 rounded-full shadow">
                        LOW: {prod.stock} LEFT
                      </span>
                    )}
                    {!isOutOfStock && !isLowStock && (
                      <span className="bg-slate-900 text-gold font-bold text-[10px] px-2 py-0.5 rounded-full">
                        Stock: {prod.stock}
                      </span>
                    )}
                  </div>

                  {/* Multi-Image Indicator */}
                  {prod.images?.length > 1 && (
                    <span className="absolute bottom-2 right-2 bg-slate-900/80 text-white text-[9px] font-bold px-2 py-0.5 rounded-full border border-gold/40">
                      📷 {prod.images.length} Images
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-amber-900 font-bold uppercase tracking-wider">
                    <span>{prod.category}</span>
                    <span className="font-mono text-gray-500">{prod.sku}</span>
                  </div>

                  <h3 className="font-luxury font-bold text-sm text-slate-900 line-clamp-1">{prod.name}</h3>

                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <span className="font-luxury font-bold text-base text-gold-gradient">₹{prod.price?.toLocaleString()}</span>
                      <span className="text-[10px] text-gray-400 line-through ml-2">₹{prod.originalPrice?.toLocaleString()}</span>
                    </div>
                    {prod.discountPercent > 0 && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {prod.discountPercent}% OFF
                      </span>
                    )}
                  </div>

                  {/* Colors summary */}
                  {prod.colors?.length > 0 && (
                    <div className="text-[10px] text-gray-500 pt-1 flex items-center gap-1">
                      <span className="font-bold text-slate-700">Colours:</span> {prod.colors.join(', ')}
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Quick Actions Bar */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                <div className="flex items-center border border-gray-300 rounded-lg bg-gray-50 text-xs">
                  <button
                    onClick={() => handleStockAdjust(prod, -1)}
                    className="px-2 py-1 text-gray-600 hover:text-slate-900 font-bold"
                  >
                    -
                  </button>
                  <span className="px-2 font-bold text-slate-900 text-[11px]">Stock: {prod.stock}</span>
                  <button
                    onClick={() => handleStockAdjust(prod, 1)}
                    className="px-2 py-1 text-gray-600 hover:text-slate-900 font-bold"
                  >
                    +
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEditModal(prod)}
                    className="p-1.5 bg-amber-50 text-amber-900 hover:bg-gold hover:text-slate-900 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(prod.id)}
                    className="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* CREATE & EDIT MODAL WITH MULTI-IMAGE & COLOUR VARIANT MANAGERS */}
      {showModal && (
        <div 
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowModal(false);
          }}
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-white border-2 border-gold max-w-3xl w-full p-6 rounded-3xl space-y-4 text-slate-800 shadow-2xl max-h-[92vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-luxury font-bold text-xl text-gold-gradient">
                {editId ? 'Edit 1-Gram Product & Gallery' : 'Add New 1-Gram Jewellery Item'}
              </h3>
              <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-gray-400 hover:text-slate-900" /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Product Title / Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 text-slate-900 p-2.5 rounded-xl focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">SKU Code</label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 text-slate-900 p-2.5 rounded-xl focus:border-gold font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 text-slate-900 p-2.5 rounded-xl font-bold"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Selling Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 text-slate-900 p-2.5 rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Original Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 text-slate-900 p-2.5 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 text-slate-900 p-2.5 rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Weight Specification</label>
                  <input
                    type="text"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 text-slate-900 p-2.5 rounded-xl"
                  />
                </div>
              </div>

              {/* MULTI-IMAGE GALLERY URL MANAGER */}
              <div className="p-4 bg-amber-50/60 rounded-2xl border border-gold/40 space-y-3">
                <label className="block text-amber-900 font-bold flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5"><Upload className="w-4 h-4 text-gold" /> Multiple Image Gallery Manager</span>
                  <span className="text-[10px] text-gray-500 font-normal">{formData.images.length} Image(s) Attached</span>
                </label>

                {/* Device Upload */}
                <div className="space-y-1">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleDeviceFileUpload}
                    className="w-full text-xs text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-gold file:text-slate-900 cursor-pointer"
                  />
                  {uploading && <p className="text-xs text-gold animate-pulse">Uploading image files to Cloudinary...</p>}
                </div>

                {/* Custom URL Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="Or paste external image URL link..."
                    className="w-full bg-white border border-gray-300 text-slate-900 p-2.5 rounded-xl text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="bg-amber-100 hover:bg-gold text-amber-900 font-bold px-4 rounded-xl text-xs shrink-0 border border-gold/40"
                  >
                    + Add Image URL
                  </button>
                </div>

                {/* Uploaded Gallery Thumbnails */}
                {formData.images.length > 0 && (
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 pt-2">
                    {formData.images.map((img, idx) => (
                      <div key={idx} className="relative group rounded-xl overflow-hidden border border-gold/40 bg-white">
                        <img src={img} alt="" className="w-full h-16 object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute top-1 right-1 bg-rose-600 text-white rounded-full p-0.5 text-[10px] shadow"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* MULTI-COLOUR VARIANTS MANAGER */}
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-3">
                <label className="block text-slate-900 font-bold text-xs">Optional Colour Variants</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newColorInput}
                    onChange={(e) => setNewColorInput(e.target.value)}
                    placeholder="e.g. Antique Rose Gold, Kundan Red"
                    className="w-full bg-white border border-gray-300 text-slate-900 p-2.5 rounded-xl text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddColor}
                    className="bg-slate-900 text-gold font-bold px-4 rounded-xl text-xs shrink-0 border border-gold/30"
                  >
                    + Add Colour
                  </button>
                </div>

                {/* Color Chips */}
                <div className="flex flex-wrap gap-2">
                  {formData.colors.map((col, idx) => (
                    <span key={idx} className="bg-amber-50 border border-gold/40 text-amber-900 font-bold text-xs px-3 py-1 rounded-full flex items-center gap-1.5">
                      {col}
                      <button type="button" onClick={() => handleRemoveColor(col)} className="text-rose-600 font-bold">✕</button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 bg-gold-gradient text-slate-900 font-luxury font-bold p-3.5 rounded-xl shadow-gold-glow hover:scale-102 transition-transform">
                  Save Product to Database
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-100 text-slate-700 font-bold p-3.5 rounded-xl">
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
