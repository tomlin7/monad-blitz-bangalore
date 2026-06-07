import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PROPERTIES } from "../data/properties";

export function MoveInPage() {
  const { id } = useParams();
  const navigate = useNavigate();
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
      navigate(`/property/${id}`);
    }, 2500);
  };

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-8">
      <h2 className="font-pixel text-xl bg-white neo-border px-4 py-2 inline-block self-start">STEP 1: MOVE-IN EVIDENCE</h2>
      
      <div className="neo-container bg-neo-bg-blue text-white text-center">
        <h3 className="font-pixel text-sm mb-4">UPLOAD ROOM PHOTOS</h3>
        <div 
          onClick={() => setImagesUploaded(true)}
          className={`neo-inner-card bg-white text-black border-dashed border-4 flex flex-col items-center justify-center h-48 cursor-pointer hover:bg-gray-50 transition-colors ${imagesUploaded ? 'border-neo-accent-green' : 'border-black'}`}
        >
          {!imagesUploaded ? (
            <>
              <span className="text-4xl mb-2">📸</span>
              <p className="font-pixel text-[10px]">CLICK TO BROWSE</p>
            </>
          ) : (
            <>
              <span className="text-4xl mb-2">✅</span>
              <p className="font-pixel text-[10px] text-neo-accent-green">EVIDENCE SECURED</p>
            </>
          )}
        </div>
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
