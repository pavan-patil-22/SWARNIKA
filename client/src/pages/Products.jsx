import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, Search, RotateCcw, AlertCircle } from 'lucide-react';
import { productService, categoryService } from '../services/api';
import ProductCard from '../components/common/ProductCard';
import SkeletonCard from '../components/common/SkeletonCard';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  const initialSearch = searchParams.get('search') || '';

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [sortBy, setSortBy] = useState('featured');
  const [stockOnly, setStockOnly] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [prods, cats] = await Promise.all([
          productService.getProducts(),
          categoryService.getCategories()
        ]);
        setProducts(Array.isArray(prods) ? prods : []);
        setCategories(Array.isArray(cats) ? cats : []);
      } catch (e) {
        console.error("Products load error", e);
        setProducts([]);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const cat = searchParams.get('category');
    const srch = searchParams.get('search');
    if (cat) setSelectedCategory(cat);
    if (srch !== null) setSearchQuery(srch);
  }, [searchParams]);

  const safeProducts = Array.isArray(products) ? products : [];

  // Filter Logic
  const filteredProducts = safeProducts.filter(p => {
    // Category match
    if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
    // Search match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const nameMatch = p.name.toLowerCase().includes(q);
      const catMatch = p.category.toLowerCase().includes(q);
      const skuMatch = p.sku.toLowerCase().includes(q);
      if (!nameMatch && !catMatch && !skuMatch) return false;
    }
    // Price match
    if (p.price > maxPrice) return false;
    // Stock filter
    if (stockOnly && p.stock <= 0) return false;
    return true;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'newest') return (b.newArrival ? 1 : 0) - (a.newArrival ? 1 : 0);
    return 0; // featured default
  });

  const resetFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setMaxPrice(10000);
    setSortBy('featured');
    setStockOnly(false);
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
      
      {/* Top Banner Notice */}
      <div className="bg-amber-50 border border-gold/40 p-3 sm:p-4 rounded-xl flex items-center gap-3 text-xs text-amber-900 shadow-sm">
        <AlertCircle className="w-5 h-5 text-gold shrink-0" />
        <div>
          <strong className="font-bold uppercase tracking-wider">1 Gram Jewellery Disclaimer:</strong> All items in this catalog feature high-luster 1 Gram gold micro-plating on brass/copper base metal. They are non-real gold imitation items.
        </div>
      </div>

      {/* Page Title & Search Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-4 sm:pb-6">
        <div>
          <h1 className="font-luxury font-bold text-2xl sm:text-3xl text-slate-900">1 Gram Jewellery Collection</h1>
          <p className="text-xs text-gray-500 mt-1">
            Showing {filteredProducts.length} micro-gold plated replica pieces
          </p>
        </div>

        {/* Search & Sort Controls */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <div className="relative flex-1 sm:flex-none">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by name, SKU..."
              className="w-full bg-white border border-gray-300 text-xs rounded-lg py-2 pl-8 pr-3 text-slate-900 focus:outline-none focus:border-gold"
            />
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white border border-gray-300 text-xs rounded-lg p-2 text-slate-900 font-medium focus:outline-none focus:border-gold"
          >
            <option value="featured">Featured First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="newest">New Arrivals</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8">
        
        {/* Sidebar Filters */}
        <aside className="space-y-6 bg-white p-4 sm:p-6 rounded-2xl border border-gold/30 shadow-xs h-fit">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="font-luxury font-bold text-base text-slate-900 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-gold" /> Filter Collection
            </h3>
            <button onClick={resetFilters} className="text-[11px] text-amber-700 hover:underline flex items-center gap-1 font-semibold">
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>

          {/* Categories Filter Pills */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Category</h4>
            <div className="space-y-1 max-h-48 lg:max-h-none overflow-y-auto">
              <button
                onClick={() => setSelectedCategory('All')}
                className={`w-full text-left text-xs py-1.5 px-2.5 rounded-lg transition-colors flex justify-between ${
                  selectedCategory === 'All' ? 'bg-slate-900 text-gold font-bold' : 'text-gray-700 hover:bg-amber-50'
                }`}
              >
                <span>All Categories</span>
                <span>({products.length})</span>
              </button>
              {categories.map(cat => {
                const count = products.filter(p => p.category === cat.name).length;
                return (
                  <button
                    key={cat.id || cat._id}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`w-full text-left text-xs py-1.5 px-2.5 rounded-lg transition-colors flex justify-between ${
                      selectedCategory === cat.name ? 'bg-slate-900 text-gold font-bold' : 'text-gray-700 hover:bg-amber-50'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="text-gray-400 text-[10px]">({count})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-2 pt-4 border-t border-gray-100">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-900 uppercase tracking-wider">Max Price</span>
              <span className="font-bold text-amber-800">₹{maxPrice.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="500"
              max="10000"
              step="250"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-gold cursor-pointer"
            />
          </div>

          {/* Stock Filter */}
          <div className="pt-4 border-t border-gray-100">
            <label className="flex items-center gap-2 text-xs font-medium text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={stockOnly}
                onChange={(e) => setStockOnly(e.target.checked)}
                className="accent-gold rounded"
              />
              <span>In Stock Items Only</span>
            </label>
          </div>
        </aside>

        {/* Product Cards Grid: 2 PER ROW ON MOBILE ALWAYS */}
        <main className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-8 sm:p-12 text-center border border-gold/30 space-y-4">
              <Search className="w-12 h-12 text-gray-300 mx-auto" />
              <h3 className="font-luxury font-bold text-xl text-slate-900">No 1-Gram Products Found</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Try relaxing your filter criteria or searching for different keywords like necklace, bangles, or earrings.
              </p>
              <button
                onClick={resetFilters}
                className="bg-gold-gradient text-slate-900 font-bold text-xs px-5 py-2.5 rounded-full shadow-gold-glow hover:scale-105 transition-transform"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </main>
      </div>

    </div>
  );
}
