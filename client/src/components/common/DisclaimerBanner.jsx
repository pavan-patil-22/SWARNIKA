import React from 'react';
import { Sparkles } from 'lucide-react';

export default function DisclaimerBanner() {
  return (
    <div className="bg-amber-50 text-amber-900 border-b border-gold/30 px-4 py-2 text-xs md:text-sm font-medium tracking-wide">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 text-center md:text-left">
        <div className="flex items-center gap-2 mx-auto md:mx-0">
          <Sparkles className="w-4 h-4 text-gold shrink-0 animate-pulse" />
          <span>
            <strong className="text-amber-800 font-bold uppercase">1 GRAM IMITATION JEWELLERY:</strong> All creations are 1 Gram micro-gold plated replica items. <span className="hidden sm:inline text-amber-900/80">They look like real gold but are non-real gold imitation pieces.</span>
          </span>
        </div>
      </div>
    </div>
  );
}
