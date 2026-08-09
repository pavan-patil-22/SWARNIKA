import React, { useState } from 'react';
import { X, ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ImageZoomModal({ isOpen, onClose, images, initialIndex = 0, productName }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoomLevel, setZoomLevel] = useState(1);

  if (!isOpen || !images || images.length === 0) return null;

  const currentImage = images[currentIndex] || images[0];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setZoomLevel(1);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setZoomLevel(1);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
      {/* Top Header */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-white z-20">
        <div>
          <h4 className="font-luxury font-bold text-gold text-lg">{productName}</h4>
          <span className="text-xs text-gray-400">1 Gram Micro-Gold Plated Replica Image View ({currentIndex + 1}/{images.length})</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoomLevel(prev => Math.min(2.5, prev + 0.5))}
            className="p-2 bg-onyx text-gold border border-gold/40 rounded-full hover:bg-gold hover:text-onyx transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-5 h-5" />
          </button>
          <button
            onClick={() => setZoomLevel(prev => Math.max(1, prev - 0.5))}
            className="p-2 bg-onyx text-gold border border-gold/40 rounded-full hover:bg-gold hover:text-onyx transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-5 h-5" />
          </button>
          <button
            onClick={onClose}
            className="p-2 bg-rose-600 text-white rounded-full hover:bg-rose-700 transition-colors ml-2"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-onyx/80 text-gold border border-gold/40 rounded-full hover:bg-gold hover:text-onyx transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-onyx/80 text-gold border border-gold/40 rounded-full hover:bg-gold hover:text-onyx transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Main Image Container */}
      <div className="w-full h-full flex items-center justify-center overflow-auto p-12">
        <img
          src={currentImage}
          alt={productName}
          style={{ transform: `scale(${zoomLevel})` }}
          className="max-h-[85vh] max-w-[90vw] object-contain transition-transform duration-300 cursor-zoom-in"
        />
      </div>
    </div>
  );
}
