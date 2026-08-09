import React from 'react';
import { Crown, Sparkles, ShieldCheck, Award, Heart } from 'lucide-react';

export default function About() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <Crown className="w-12 h-12 text-gold mx-auto" />
        <h1 className="font-luxury font-bold text-4xl text-onyx">About Aureate Luxe</h1>
        <p className="text-sm text-gray-600 leading-relaxed">
          Crafting India's finest <strong>1 Gram Micro-Gold Plated Imitation Jewellery</strong> for women who desire royal elegance without compromising on quality or budget.
        </p>
      </div>

      {/* Story Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-4">
          <span className="text-xs text-gold font-bold uppercase tracking-widest">Our Heritage & Mission</span>
          <h2 className="font-luxury font-bold text-3xl text-onyx">The Art of 1-Gram Plating</h2>
          <p className="text-xs text-gray-600 leading-relaxed">
            Real gold jewellery prices make heirloom sets inaccessible for everyday occasions. At Aureate Luxe, we bridge the gap by combining ancient South Indian temple design carving with state-of-the-art 1 Gram micro-gold electroplating technology.
          </p>
          <div className="p-4 bg-amber-50 border border-gold/30 rounded-xl text-xs text-amber-900 font-medium">
            <strong>Non-Real Gold Guarantee:</strong> All items in our collections are copper-brass alloy base replica items finished with durable 1 gram micro gold polish. They look like real gold but are strictly non-real gold imitation items.
          </div>
        </div>

        <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gold/30 aspect-video">
          <img
            src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=80"
            alt="1 Gram Jewellery Craftsmanship"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Care Guide */}
      <div className="bg-onyx text-white p-8 md:p-12 rounded-2xl border border-gold/40 space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <Sparkles className="w-8 h-8 text-gold mx-auto" />
          <h3 className="font-luxury font-bold text-2xl text-gold-gradient">1 Gram Jewellery Care Guide</h3>
          <p className="text-xs text-gray-300">Follow these simple steps to ensure long-lasting luster for years</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-xs text-gray-300">
          <div className="p-4 bg-onyx-light rounded-xl border border-gold/20 space-y-2">
            <strong className="text-gold block font-bold">1. Keep Away from Perfume</strong>
            <p>Always apply perfumes, lotions, and hairsprays before putting on your 1 gram jewellery.</p>
          </div>
          <div className="p-4 bg-onyx-light rounded-xl border border-gold/20 space-y-2">
            <strong className="text-gold block font-bold">2. Store in Velvet Pouch</strong>
            <p>Keep each set in the provided Aureate Luxe velvet box to prevent scratch damage.</p>
          </div>
          <div className="p-4 bg-onyx-light rounded-xl border border-gold/20 space-y-2">
            <strong className="text-gold block font-bold">3. Avoid Water Contact</strong>
            <p>Remove jewellery while bathing or swimming to protect micro gold plating.</p>
          </div>
          <div className="p-4 bg-onyx-light rounded-xl border border-gold/20 space-y-2">
            <strong className="text-gold block font-bold">4. Wipe with Dry Cloth</strong>
            <p>Gently wipe with a soft dry cotton cloth after wearing to remove sweat or moisture.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
