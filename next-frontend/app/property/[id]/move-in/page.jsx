"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { PROPERTIES } from "../../../../data/properties";
import { ImageUploader } from "../../../../components/ImageUploader";

export default function MoveInPage() {
  const { id } = useParams();
  const router = useRouter();
  const property = PROPERTIES.find(p => p.id === parseInt(id));
  
  const [bookingId, setBookingId] = useState("");
  const [depositAmount, setDepositAmount] = useState(0);
  const [images, setImages] = useState([]);
  const [isLocking, setIsLocking] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (property) {
      setDepositAmount(property.deposit);
      setBookingId(`BOOK-${id}-${Math.floor(1000 + Math.random() * 9000)}`);
    }
  }, [property, id]);

  const handleLockFunds = async () => {
    setIsLocking(true);
    setErrorMessage("");
    try {
      const response = await fetch("/api/move-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId,
          depositAmount: Number(depositAmount),
          images
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to register deposit on Monad");
      }

      // Save move-in evidence and state to localStorage
      localStorage.setItem(`property_${id}_state`, JSON.stringify({
        status: 'Occupied',
        deposit: Number(depositAmount),
        bookingId,
        moveInImages: images,
        moveInTxHash: data.transactionHash,
        timestamp: new Date().toISOString()
      }));

      setIsLocking(false);
      router.push(`/property/${id}`);
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message || "On-chain transaction failed.");
      setIsLocking(false);
    }
  };

  const handleBypass = () => {
    // Save state with mock tx hash to allow frontend testing when keys/contracts are not ready
    localStorage.setItem(`property_${id}_state`, JSON.stringify({
      status: 'Occupied',
      deposit: Number(depositAmount),
      bookingId,
      moveInImages: images,
      moveInTxHash: "0x" + Array(64).fill(0).map(() => Math.floor(Math.random()*16).toString(16)).join(""),
      timestamp: new Date().toISOString()
    }));
    router.push(`/property/${id}`);
  };

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-8">
      <h2 className="font-pixel text-xl bg-white neo-border px-4 py-2 inline-block self-start">STEP 1: MOVE-IN EVIDENCE</h2>
      
      <div className="neo-container bg-neo-bg-blue text-white">
        <h3 className="font-pixel text-sm mb-4 text-center">UPLOAD ROOM PHOTOS</h3>
        <ImageUploader onImagesChange={(imgs) => setImages(imgs)} />
      </div>

      <div className="neo-container bg-white">
        <h3 className="font-pixel text-sm mb-4">SMART CONTRACT ESCROW</h3>
        
        <div className="flex flex-col gap-4 mb-6">
          <div>
            <label className="font-pixel text-[10px] uppercase block mb-1">Booking ID</label>
            <input 
              type="text" 
              value={bookingId} 
              onChange={(e) => setBookingId(e.target.value)} 
              placeholder="e.g. BOOK-1"
              className="w-full p-2 border-2 border-black focus:outline-none focus:bg-yellow-50 font-body font-bold text-sm"
            />
          </div>
          <div>
            <label className="font-pixel text-[10px] uppercase block mb-1">Deposit Amount (₹)</label>
            <input 
              type="number" 
              value={depositAmount} 
              onChange={(e) => setDepositAmount(e.target.value)} 
              className="w-full p-2 border-2 border-black focus:outline-none focus:bg-yellow-50 font-body font-bold text-sm"
            />
          </div>
        </div>

        {errorMessage && (
          <div className="bg-red-100 border-2 border-red-500 text-red-700 p-3 mb-4 font-body font-bold text-xs">
            <p className="mb-2">⚠️ {errorMessage}</p>
            <button 
              onClick={handleBypass}
              className="text-[10px] underline uppercase font-pixel cursor-pointer hover:text-black"
            >
              [Bypass on-chain register for frontend testing]
            </button>
          </div>
        )}
        
        <button 
          onClick={handleLockFunds}
          disabled={images.length === 0 || isLocking || !bookingId}
          className={`neo-btn w-full ${images.length === 0 || !bookingId ? 'bg-gray-300 text-gray-500' : 'bg-neo-bg-yellow'} ${isLocking ? 'animate-pulse' : ''}`}
        >
          {isLocking ? 'LOCKING ON MONAD...' : 'SUBMIT & LOCK FUNDS'}
        </button>
      </div>
    </div>
  );
}

