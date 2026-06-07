"use client";

import { useState, useRef } from "react";

export function ImageUploader({ onImagesChange }) {
  const [images, setImages] = useState([]);
  const [isCompressing, setIsCompressing] = useState(false);
  const fileInputRef = useRef(null);

  const compressAndResize = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to JPEG with 0.7 quality for small size
          const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
          resolve(dataUrl);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsCompressing(true);
    const newImages = [];

    for (const file of files) {
      try {
        const base64Url = await compressAndResize(file);
        newImages.push({
          id: `${Date.now()}-${Math.random()}`,
          url: base64Url
        });
      } catch (err) {
        console.error("Error compressing image:", err);
      }
    }

    const updated = [...images, ...newImages];
    setImages(updated);
    if (onImagesChange) onImagesChange(updated);
    setIsCompressing(false);
    
    // Reset input value to allow selecting same file again
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemoveImage = (id) => {
    const updated = images.filter(img => img.id !== id);
    setImages(updated);
    if (onImagesChange) onImagesChange(updated);
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map(img => (
            <div key={img.id} className="relative group neo-border bg-black">
              <img src={img.url} alt="Evidence" className="w-full h-32 object-cover" />
              <button 
                onClick={() => handleRemoveImage(img.id)}
                className="absolute top-2 right-2 bg-neo-bg-red text-white neo-border w-8 h-8 flex items-center justify-center font-pixel text-xs hover:scale-110 transition-transform cursor-pointer"
              >
                X
              </button>
            </div>
          ))}
        </div>
      )}
      
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        multiple 
        className="hidden" 
      />

      <div 
        onClick={triggerFileInput}
        className={`neo-inner-card bg-white text-black border-dashed border-4 flex flex-col items-center justify-center h-32 cursor-pointer hover:bg-neo-bg-yellow transition-colors ${images.length > 0 ? 'border-black' : 'border-neo-accent-green bg-green-50'} ${isCompressing ? 'animate-pulse' : ''}`}
      >
        <span className="text-3xl mb-2">📸</span>
        <p className="font-pixel text-[10px] uppercase">
          {isCompressing ? 'Processing photos...' : 'Click to upload photo evidence'}
        </p>
      </div>
    </div>
  );
}

