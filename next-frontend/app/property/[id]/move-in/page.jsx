"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PROPERTIES } from "../../../../data/properties";
import { ImageUploader } from "../../../../components/ImageUploader";

export default function MoveInPage() {
  const { id } = useParams();
  const router = useRouter();
  const property = PROPERTIES.find(p => p.id === parseInt(id));
  const [imagesUploaded, setImagesUploaded] = useState(false);
  const [isLocking, setIsLocking] = useState(false);

  const handleLockFunds = () => {
    setIsLocking(true);
    setTimeout(() => {
      localStorage.setItem(`property_${id}_state`, JSON.stringify({
        status: 'Occupied',
        deposit: property.deposit,
        timestamp: new Date().toISOString()
      }));
      setIsLocking(false);
      router.push(`/property/${id}`);
    }, 2500);
  };

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-8">
      <h2 className="font-pixel text-xl bg-white neo-border px-4 py-2 inline-block self-start">STEP 1: MOVE-IN EVIDENCE</h2>
      
      <div className="neo-container bg-neo-bg-blue text-white">
        <h3 className="font-pixel text-sm mb-4 text-center">UPLOAD ROOM PHOTOS</h3>
        <ImageUploader onImagesChange={(imgs) => setImagesUploaded(imgs.length > 0)} />
      </div>

      <div className="neo-container bg-white">
        <h3 className="font-pixel text-sm mb-4">SMART CONTRACT ESCROW</h3>
        <div className="flex justify-between items-center mb-6 font-body font-bold text-lg border-b-2 border-black pb-2">
          <span>Security Deposit:</span>
          <span className="font-pixel text-sm text-neo-accent-blue">₹{property?.deposit}</span>
        </div>
        
        <button 
          onClick={handleLockFunds}
          disabled={!imagesUploaded || isLocking}
          className={`neo-btn w-full ${!imagesUploaded ? 'bg-gray-300 text-gray-500' : 'bg-neo-bg-yellow'} ${isLocking ? 'animate-pulse' : ''}`}
        >
          {isLocking ? 'LOCKING ON MONAD...' : 'SUBMIT & LOCK FUNDS'}
        </button>
      </div>
    </div>
  );
}
