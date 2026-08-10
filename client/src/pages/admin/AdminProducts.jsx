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
  CheckCircle2
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { uploadService } from '../../services/api';
import { toast } from 'react-toastify';

export default function AdminProducts() {
  const { products, categories, saveProduct, removeProduct } = useAdmin();

  // Search, Filter & Sort States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [stockFilter, setStockFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('NEWEST');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: 'Necklaces',
    description: '',
    price: '',
    originalPrice: '',
    stock: 10,
    images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80'],
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
      stock: '',
      images: [],
      material: 'Brass-Copper alloy with 1 Gram Gold Polish (Imitation Jewellery)',
      weight: '',
      featured: false,
      bestSeller: false,
      newArrival: true,
      trending: false
    });
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
      material: product.material || 'Brass-Copper alloy with 1 Gram Gold Polish',
      weight: product.weight || '45 grams',
      featured: !!product.featured,
      bestSeller: !!product.bestSeller,
      newArrival: !!product.newArrival,
      trending: !!product.trending
    });
    setShowModal(true);
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
        toast.success(`Uploaded ${urls.length} product image(s) to Cloudinary!`, {
          style: { background: '#FFF', color: '#D4AF37', border: '1px solid #D4AF37' }
        });
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
    toast.info(`Updated ${product.name} stock to ${newStock}`, { style: { background: '#FFF', color: '#D4AF37', border: '1px solid #D4AF37' } });
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
    toast.success(`Product ${editId ? 'updated' : 'created'} successfully!`, {
      style: { background: '#FFF', color: '#D4AF37', border: '1px solid #D4AF37' }
    });
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
      
      {/* Top Header & Quick Action Button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <h2 className="font-luxury font-bold text-2xl text-gold-gradient flex items-center gap-2">
            <Layers className="w-6 h-6 text-gold" /> Products & Inventory Manager
          </h2>
          <p className="text-xs text-gray-500">Live search, category filters, quick stock adjustments, and device Cloudinary image uploads</p>
        </div>

        <button
          onClick={openCreateModal}
          className="bg-gold-gradient text-slate-900 font-luxury font-bold text-xs px-5 py-3 rounded-xl shadow-gold-glow flex items-center justify-center gap-2 hover:scale-102 transition-transform"
        >
          <Plus className="w-4 h-4" /> Add New 1-Gram Product
        </button>
      </div>

      {/* QUICK SUMMARY METRICS BAR */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Total Products</span>
            <span className="font-luxury font-bold text-2xl text-slate-900">{totalCount}</span>
          </div>
          <PackageCheck className="w-8 h-8 text-gold p-1.5 bg-amber-50 rounded-xl" />
        </div>

        <div className={`p-4 rounded-2xl border shadow-sm flex items-center justify-between ${
          lowStockCount > 0 ? 'bg-amber-50/70 border-amber-300' : 'bg-white border-gray-200'
        }`}>
          <div>
            <span className="text-[10px] text-amber-900 font-bold uppercase tracking-wider block">Low Stock (&le; 5)</span>
            <span className="font-luxury font-bold text-2xl text-amber-900">{lowStockCount}</span>
          </div>
          <AlertTriangle className="w-8 h-8 text-amber-600 p-1.5 bg-amber-100 rounded-xl" />
        </div>

        <div className={`p-4 rounded-2xl border shadow-sm flex items-center justify-between ${
          outOfStockCount > 0 ? 'bg-rose-50/70 border-rose-300' : 'bg-white border-gray-200'
        }`}>
          <div>
            <span className="text-[10px] text-rose-900 font-bold uppercase tracking-wider block">Out of Stock</span>
            <span className="font-luxury font-bold text-2xl text-rose-700">{outOfStockCount}</span>
          </div>
          <AlertTriangle className="w-8 h-8 text-rose-600 p-1.5 bg-rose-100 rounded-xl" />
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gold/30 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Inventory Valuation</span>
            <span className="font-luxury font-bold text-xl text-gold-gradient">₹{inventoryValue.toLocaleString()}</span>
          </div>
          <Sparkles className="w-8 h-8 text-gold p-1.5 bg-amber-50 rounded-xl" />
        </div>
      </div>

      {/* USER-FRIENDLY INTERACTIVE FILTER & SEARCH BAR */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          
          {/* Live Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search product name or SKU..."
              className="w-full bg-gray-50 border border-gray-300 text-slate-900 pl-9 pr-3 py-2.5 rounded-xl focus:border-gold"
            />
          </div>

          {/* Category Dropdown Filter */}
          <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-300 rounded-xl px-3 py-1">
            <Filter className="w-4 h-4 text-gold shrink-0" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-transparent text-slate-900 py-1 font-bold focus:outline-none"
            >
              <option value="ALL">All Categories ({categories.length})</option>
              {categories.map(c => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Stock Level Filter */}
          <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-300 rounded-xl px-3 py-1">
            <PackageCheck className="w-4 h-4 text-gold shrink-0" />
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="w-full bg-transparent text-slate-900 py-1 font-bold focus:outline-none"
            >
              <option value="ALL">All Stock Levels</option>
              <option value="IN_STOCK">In Stock (&gt; 5)</option>
              <option value="LOW_STOCK">Low Stock (&le; 5)</option>
              <option value="OUT_OF_STOCK">Out of Stock (0)</option>
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-300 rounded-xl px-3 py-1">
            <ArrowUpDown className="w-4 h-4 text-gold shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-transparent text-slate-900 py-1 font-bold focus:outline-none"
            >
              <option value="NEWEST">Newest First</option>
              <option value="PRICE_LOW">Price: Low to High</option>
              <option value="PRICE_HIGH">Price: High to Low</option>
              <option value="RATING">Highest Rating</option>
              <option value="STOCK">Stock Level: Low to High</option>
            </select>
          </div>

        </div>

        <div className="flex items-center justify-between text-[11px] text-gray-500 border-t border-gray-100 pt-2 px-1">
          <span>Showing <strong>{filteredProducts.length}</strong> of <strong>{totalCount}</strong> products</span>
          {(searchQuery || selectedCategory !== 'ALL' || stockFilter !== 'ALL') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('ALL');
                setStockFilter('ALL');
                setSortBy('NEWEST');
              }}
              className="text-rose-600 font-bold hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* PRODUCTS DISPLAY GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((prod) => {
          const isLow = prod.stock > 0 && prod.stock <= 5;
          const isOut = prod.stock === 0;

          return (
            <div key={prod.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm p-5 space-y-4 flex flex-col justify-between">
              
              <div className="space-y-3">
                
                {/* Image & Compliance Badge */}
                <div className="aspect-square rounded-xl overflow-hidden relative border border-gold/30 group">
                  <img
                    src={prod.images?.[0] || prod.image}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <span className="absolute top-2 left-2 bg-white/90 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded border border-gold/40 shadow">
                    1 Gram Polish
                  </span>

                  {/* Stock Status Badge */}
                  <span className={`absolute top-2 right-2 text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow ${
                    isOut ? 'bg-rose-600 text-white' :
                    isLow ? 'bg-amber-500 text-white animate-pulse' :
                    'bg-emerald-600 text-white'
                  }`}>
                    {isOut ? 'Out of Stock' : isLow ? `Low Stock (${prod.stock})` : `In Stock (${prod.stock})`}
                  </span>
                </div>

                {/* Details */}
                <div>
                  <div className="flex items-center justify-between text-[10px] text-gray-500 font-mono">
                    <span>SKU: {prod.sku}</span>
                    <span className="text-amber-800 font-bold uppercase">{prod.category}</span>
                  </div>

                  <h3 className="font-luxury font-bold text-slate-900 text-base mt-1 line-clamp-1">{prod.name}</h3>
                  <p className="text-xs text-gray-500 line-clamp-2 mt-0.5">{prod.description}</p>
                </div>

                {/* Pricing & Ratings */}
                <div className="flex items-center justify-between pt-1">
                  <div>
                    <span className="font-luxury font-bold text-lg text-gold-gradient">₹{prod.price.toLocaleString()}</span>
                    {prod.originalPrice > prod.price && (
                      <span className="text-xs text-gray-400 line-through ml-2">₹{prod.originalPrice.toLocaleString()}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-xs font-bold text-amber-800 bg-amber-50 px-2 py-1 rounded-lg border border-gold/20">
                    <Star className="w-3.5 h-3.5 fill-gold text-gold" /> {prod.rating || 5.0} ({prod.reviewCount || 0})
                  </div>
                </div>

                {/* Quick Toggle Feature Flags */}
                <div className="flex flex-wrap gap-1.5 text-[10px] pt-1">
                  <button
                    onClick={() => handleToggleBadge(prod, 'featured')}
                    className={`px-2 py-0.5 rounded font-bold transition-colors ${
                      prod.featured ? 'bg-amber-100 text-amber-900 border border-gold/40' : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    Featured
                  </button>
                  <button
                    onClick={() => handleToggleBadge(prod, 'bestSeller')}
                    className={`px-2 py-0.5 rounded font-bold transition-colors ${
                      prod.bestSeller ? 'bg-amber-100 text-amber-900 border border-gold/40' : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    Best Seller
                  </button>
                  <button
                    onClick={() => handleToggleBadge(prod, 'newArrival')}
                    className={`px-2 py-0.5 rounded font-bold transition-colors ${
                      prod.newArrival ? 'bg-amber-100 text-amber-900 border border-gold/40' : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    New Arrival
                  </button>
                </div>

              </div>

              {/* Bottom Quick Actions Bar */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                
                {/* Instant Stock Modifier (+ / -) */}
                <div className="flex items-center border border-gray-300 rounded-lg bg-gray-50 text-xs">
                  <button
                    onClick={() => handleStockAdjust(prod, -1)}
                    className="px-2 py-1 text-gray-600 hover:text-slate-900 font-bold"
                  >
                    -
                  </button>
                  <span className="px-2 font-bold text-slate-900">Stock: {prod.stock}</span>
                  <button
                    onClick={() => handleStockAdjust(prod, 1)}
                    className="px-2 py-1 text-gray-600 hover:text-slate-900 font-bold"
                  >
                    +
                  </button>
                </div>

                {/* Edit & Delete Buttons */}
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

      {/* CREATE & EDIT MODAL WITH OUTSIDE BACKDROP CLICK CLOSE */}
      {showModal && (
        <div 
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowModal(false);
          }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-white border border-gold/40 max-w-2xl w-full p-6 rounded-2xl space-y-4 text-slate-800 shadow-2xl max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-luxury font-bold text-lg text-gold-gradient">
                {editId ? 'Edit 1-Gram Product Details' : 'Add New 1-Gram Jewellery Item'}
              </h3>
              <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-gray-400" /></button>
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
                    className="w-full bg-gray-50 border border-gray-300 text-slate-900 p-2.5 rounded-lg focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">SKU Code</label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 text-slate-900 p-2.5 rounded-lg focus:border-gold font-mono"
                  />
                </div>
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
                  <label className="block text-slate-700 font-bold mb-1">Selling Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 text-slate-900 p-2.5 rounded-lg font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Original Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 text-slate-900 p-2.5 rounded-lg"
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
                    className="w-full bg-gray-50 border border-gray-300 text-slate-900 p-2.5 rounded-lg font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Weight Specification</label>
                  <input
                    type="text"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 text-slate-900 p-2.5 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Product Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-300 text-slate-900 p-2.5 rounded-lg"
                />
              </div>

              {/* CLOUDINARY DEVICE FILE UPLOAD & URL SECTION */}
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
                  <label className="block text-gray-700 font-bold mb-1">Or Image URL Link</label>
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

              {/* Feature Badges Toggle Checkboxes */}
              <div className="flex flex-wrap gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="accent-gold"
                  />
                  Featured Product
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={formData.bestSeller}
                    onChange={(e) => setFormData({ ...formData, bestSeller: e.target.checked })}
                    className="accent-gold"
                  />
                  Best Seller
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={formData.newArrival}
                    onChange={(e) => setFormData({ ...formData, newArrival: e.target.checked })}
                    className="accent-gold"
                  />
                  New Arrival
                </label>
              </div>

              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 bg-gold-gradient text-slate-900 font-bold p-3 rounded-lg">
                  Save Product to Database
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
