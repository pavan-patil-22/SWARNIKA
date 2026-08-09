import React from 'react';

export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 flex flex-col space-y-3 animate-pulse">
      <div className="w-full aspect-square bg-gray-200 rounded-lg"></div>
      <div className="h-3 bg-gray-200 rounded w-1/3"></div>
      <div className="h-5 bg-gray-200 rounded w-3/4"></div>
      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      <div className="flex items-center justify-between pt-2">
        <div className="h-6 bg-gray-200 rounded w-1/3"></div>
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
      </div>
    </div>
  );
}
