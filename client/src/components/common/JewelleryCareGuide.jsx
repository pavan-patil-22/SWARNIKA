import React from 'react';
import { 
  DropletOff, 
  Box, 
  Sparkles, 
  Hand, 
  ShieldCheck, 
  Heart 
} from 'lucide-react';

export default function JewelleryCareGuide() {
  const careSteps = [
    {
      icon: DropletOff,
      title: "Avoid Moisture",
      desc: "Remove before bathing, swimming, or exercising to protect 1-gram gold polish."
    },
    {
      icon: Box,
      title: "Store Properly",
      desc: "Keep each piece in a zip-lock pouch or soft velvet box to prevent oxidation."
    },
    {
      icon: Sparkles,
      title: "Avoid Perfume",
      desc: "Apply perfumes, hairsprays, & cosmetics before putting on your jewellery."
    },
    {
      icon: Hand,
      title: "Clean Gently",
      desc: "Wipe with a soft, dry cotton cloth after wearing to remove oil & moisture."
    },
    {
      icon: ShieldCheck,
      title: "Keep It Dry",
      desc: "Never immerse in water or chemical cleaning fluids. Keep away from harsh soaps."
    },
    {
      icon: Heart,
      title: "Handle with Care",
      desc: "Avoid accidental drops, hard friction, or rough handling to prevent scratches."
    }
  ];

  return (
    <section className="bg-gradient-to-b from-amber-50/70 via-white to-amber-50/50 border border-gold/30 rounded-3xl p-6 sm:p-10 shadow-sm max-w-7xl mx-auto my-8 relative overflow-hidden">
      
      {/* Background Subtle Shimmer Line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gold-gradient rounded-full" />

      <div className="text-center space-y-2 mb-8 sm:mb-12">
        <div className="flex items-center justify-center gap-2 mb-1">
          <img src="/shoplogo.png" alt="SWARNIKA" className="h-10 w-auto object-contain" />
        </div>
        <span className="text-[10px] sm:text-xs text-amber-900 font-extrabold tracking-[0.3em] uppercase block">
          LUXURY HERITAGE
        </span>
        <h2 className="font-brand-royal font-black text-2xl sm:text-4xl text-slate-900 tracking-wide">
          Jewellery Care Guide
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto italic">
          Simple daily steps to preserve the lustrous shine & micro-gold plating of your SWARNIKA creations.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8">
        {careSteps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div 
              key={idx}
              className="bg-white/80 border border-gold/30 p-4 sm:p-6 rounded-2xl text-center space-y-3 shadow-xs hover:border-gold hover:shadow-md transition-all group flex flex-col items-center justify-center"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-amber-50 border border-gold/40 flex items-center justify-center text-amber-800 group-hover:scale-110 group-hover:bg-gold group-hover:text-slate-900 transition-all duration-300 shadow-xs">
                <Icon className="w-6 h-6 stroke-[1.75]" />
              </div>
              <h3 className="font-luxury font-bold text-sm sm:text-base text-slate-900 group-hover:text-gold transition-colors">
                {step.title}
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed font-medium">
                {step.desc}
              </p>
            </div>
          );
        })}
      </div>

    </section>
  );
}
