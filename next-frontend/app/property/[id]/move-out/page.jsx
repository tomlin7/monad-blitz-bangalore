"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PROPERTIES } from "../../../../data/properties";
import { ImageUploader } from "../../../../components/ImageUploader";

export default function MoveOutPage() {
  const { id } = useParams();
  const router = useRouter();
  const property = PROPERTIES.find(p => p.id === parseInt(id));
  const [imagesUploaded, setImagesUploaded] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [settlement, setSettlement] = useState(null);

  const handleVerify = () => {
    setIsVerifying(true);
    setTimeout(() => {
      const damageCost = 1200;
      setSettlement({
        damageDesc: "Broken Ceiling Fan",
        damageCost: damageCost,
        refund: property.deposit - damageCost
      });
      setIsVerifying(false);
      localStorage.removeItem(`property_${id}_state`);
    }, 3000);
  };

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-8">
      <h2 className="font-pixel text-xl bg-white neo-border px-4 py-2 inline-block self-start">FINAL: MOVE-OUT & SETTLEMENT</h2>
      
      {!settlement ? (
        <>
          <div className="neo-container bg-neo-accent-pink text-white">
            <h3 className="font-pixel text-sm mb-4 text-center">UPLOAD CURRENT CONDITION</h3>
            <ImageUploader onImagesChange={(imgs) => setImagesUploaded(imgs.length > 0)} />
          </div>

          <button 
            onClick={handleVerify}
            disabled={!imagesUploaded || isVerifying}
            className={`neo-btn w-full ${!imagesUploaded ? 'bg-gray-300 text-gray-500' : 'bg-black text-white'} ${isVerifying ? 'animate-pulse bg-neo-bg-purple' : ''}`}
          >
            {isVerifying ? 'SARVAM AI ANALYZING...' : 'VERIFY & SETTLE'}
          </button>
        </>
      ) : (
        <div className="neo-container bg-white animate-fade-in flex flex-col gap-6">
          <div className="bg-neo-bg-red text-white p-4 text-center neo-border mb-2">
            <h3 className="font-pixel text-lg">⚠️ DAMAGE DETECTED</h3>
          </div>

          <div className="neo-inner-card bg-gray-50 border-black font-body">
            <h4 className="font-bold text-lg mb-2">AI Assessment:</h4>
            <div className="flex justify-between text-red-600 font-bold border-b-2 border-black pb-2 mb-2">
              <span>{settlement.damageDesc}</span>
              <span>-₹{settlement.damageCost}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Original Deposit</span>
              <span>₹{property.deposit}</span>
            </div>
          </div>

          <div className="bg-neo-accent-green text-black neo-border p-6 text-center shadow-[4px_4px_0px_#000]">
            <p className="font-pixel text-[10px] mb-2 uppercase">Amount Refunded to Tenant</p>
            <p className="font-pixel text-3xl md:text-4xl">₹{settlement.refund}</p>
          </div>

          <button onClick={() => router.push("/")} className="neo-btn bg-white w-full text-[10px]">
            RETURN TO HOME
          </button>
        </div>
      )}
    </div>
  );
}
