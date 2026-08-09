import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { categoryService } from '../services/api';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      setLoading(true);
      try {
        const cats = await categoryService.getCategories();
        setCategories(cats);
      } catch (e) {
        console.error("Categories error", e);
      } finally {
        setLoading(false);
      }
    };
    loadCategories();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-xs text-gold font-bold uppercase tracking-widest">Royalty in Every Category</span>
        <h1 className="font-luxury font-bold text-3xl md:text-4xl text-onyx">1 Gram Jewellery Categories</h1>
        <p className="text-xs text-gray-500">
          Browse our collections crafted in micro-gold electroplated brass & copper alloys.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map(cat => (
          <Link
            key={cat.id}
            to={`/products?category=${encodeURIComponent(cat.name)}`}
            className="group relative rounded-2xl overflow-hidden shadow-lg border border-amber-900/10 bg-onyx h-80 flex flex-col justify-end p-6 hover:shadow-2xl transition-all"
          >
            <img
              src={cat.image}
              alt={cat.name}
              className="absolute inset-0 w-full h-full object-cover opacity-65 group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-onyx via-onyx/40 to-transparent" />
            
            <div className="relative z-10 space-y-2">
              <span className="inline-block text-[10px] bg-gold/20 text-gold border border-gold/40 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                1 Gram Micro Polish
              </span>
              <h3 className="font-luxury font-bold text-2xl text-gold-gradient group-hover:translate-x-1 transition-transform">
                {cat.name}
              </h3>
              <p className="text-xs text-gray-300 line-clamp-2">{cat.description}</p>
              
              <div className="pt-2 flex items-center justify-between text-xs font-bold text-gold">
                <span>Explore Collection</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
