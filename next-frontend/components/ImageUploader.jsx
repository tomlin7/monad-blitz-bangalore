"use client";

import { useState } from "react";

export function ImageUploader({ onImagesChange }) {
  const [images, setImages] = useState([]);

  const handleAddImage = () => {
    // Mocking an image upload by adding a random placeholder
    const newImage = {
      id: Date.now(),
      url: `https://picsum.photos/seed/${Date.now()}/400/300`
    };
    const updated = [...images, newImage];
    setImages(updated);
    if (onImagesChange) onImagesChange(updated);
  };

  const handleRemoveImage = (id) => {
    const updated = images.filter(img => img.id !== id);
    setImages(updated);
    if (onImagesChange) onImagesChange(updated);
  };

  return (
    <div className="flex flex-col gap-4">
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map(img => (
            <div key={img.id} className="relative group neo-border">
              <img src={img.url} alt="Evidence" className="w-full h-32 object-cover" />
              <button 
                onClick={() => handleRemoveImage(img.id)}
                className="absolute top-2 right-2 bg-neo-bg-red text-white neo-border w-8 h-8 flex items-center justify-center font-pixel text-xs hover:scale-110 transition-transform"
              >
                X
              </button>
            </div>
          ))}
        </div>
      )}
      
      <div 
        onClick={handleAddImage}
        className={`neo-inner-card bg-white text-black border-dashed border-4 flex flex-col items-center justify-center h-32 cursor-pointer hover:bg-neo-bg-yellow transition-colors ${images.length > 0 ? 'border-black' : 'border-neo-accent-green bg-green-50'}`}
      >
        <span className="text-3xl mb-2">📸</span>
        <p className="font-pixel text-[10px] uppercase">Click to add photo evidence</p>
      </div>
    </div>
  );
}
