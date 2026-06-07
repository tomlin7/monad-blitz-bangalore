"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { PROPERTIES } from "../../../../data/properties";
import { ImageUploader } from "../../../../components/ImageUploader";

// Helper to generate deterministic SHA-256 hash in browser
async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return "0x" + hashHex;
}

export default function MoveOutPage() {
  const { id } = useParams();
  const router = useRouter();
  const property = PROPERTIES.find(p => p.id === parseInt(id));
  
  const [moveInState, setMoveInState] = useState(null);
  const [images, setImages] = useState([]);
  const [statement, setStatement] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyingStep, setVerifyingStep] = useState("");
  const [settlement, setSettlement] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const savedState = localStorage.getItem(`property_${id}_state`);
    if (savedState) {
      setMoveInState(JSON.parse(savedState));
    }
  }, [id]);

  const handleVerify = async () => {
    setIsVerifying(true);
    setErrorMessage("");
    try {
      if (!moveInState) {
        throw new Error("Move-in record not found. Please initiate move-in first.");
      }

      const bookingId = moveInState.bookingId;
      const deposit = moveInState.deposit || property.deposit;
      const moveInImages = moveInState.moveInImages || [];

      // 1. Translate statement with Sarvam (if any)
      let translatedStatement = "";
      if (statement.trim()) {
        setVerifyingStep("SARVAM AI TRANSLATING STATEMENT...");
        const transRes = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: statement })
        });
        const transData = await transRes.json();
        if (!transRes.ok) throw new Error(transData.error || "Translation failed");
        translatedStatement = transData.translated_text;
      }

      // 2. Compare evidence with Gemini Vision
      setVerifyingStep("GEMINI VISION ANALYZING PHOTOS...");
      const analyzeRes = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          moveInImages: moveInImages,
          moveOutImages: images
        })
      });
      const analyzeData = await analyzeRes.json();
      if (!analyzeRes.ok) throw new Error(analyzeData.error || "AI comparison failed");

      const { damageFound, damageDescription, estimatedRepairCost } = analyzeData;

      // 3. Calculate refund
      const refundAmount = Math.max(0, deposit - estimatedRepairCost);

      // 4. Create inspection report object
      const report = {
        bookingId,
        damageFound,
        damageDescription,
        estimatedRepairCost,
        refundAmount,
        tenantStatement: statement,
        translatedStatement
      };

      // 5. Create deterministic hash of report
      setVerifyingStep("GENERATING REPORT HASH...");
      const reportHash = await sha256(JSON.stringify(report));

      // 6. Save inspection result to Monad
      setVerifyingStep("RECORDING ON MONAD TESTNET...");
      const recordRes = await fetch("/api/record-inspection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId,
          reportHash,
          repairCost: estimatedRepairCost,
          damageFound
        })
      });
      const recordData = await recordRes.json();
      if (!recordRes.ok) throw new Error(recordData.error || "Recording inspection on Monad failed");

      // 7. Persist final report
      const finalReport = {
        ...report,
        reportHash,
        moveInTxHash: moveInState.moveInTxHash,
        moveOutTxHash: recordData.transactionHash,
        moveInImages,
        moveOutImages: images,
        timestamp: new Date().toISOString()
      };
      
      localStorage.setItem(`property_${id}_final_report`, JSON.stringify(finalReport));
      localStorage.removeItem(`property_${id}_state`); // Clean active rental state

      setSettlement({
        damageDesc: damageDescription,
        damageCost: estimatedRepairCost,
        refund: refundAmount,
        reportHash,
        txHash: recordData.transactionHash
      });

      setIsVerifying(false);
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message || "An error occurred during verification.");
      setIsVerifying(false);
    }
  };

  const handleBypass = async () => {
    // Save mock final report and complete flow
    const bookingId = moveInState?.bookingId || `BOOK-${id}-MOCK`;
    const deposit = moveInState?.deposit || property.deposit;
    const damageCost = 1200;
    const refundAmount = deposit - damageCost;

    const report = {
      bookingId,
      damageFound: true,
      damageDescription: "Broken ceiling fan",
      estimatedRepairCost: damageCost,
      refundAmount,
      tenantStatement: statement,
      translatedStatement: "The fan was already broken."
    };

    const reportHash = await sha256(JSON.stringify(report));
    const mockTxHash = "0x" + Array(64).fill(0).map(() => Math.floor(Math.random()*16).toString(16)).join("");

    const finalReport = {
      ...report,
      reportHash,
      moveInTxHash: moveInState?.moveInTxHash || "0x0000000000000000000000000000000000000000000000000000000000000000",
      moveOutTxHash: mockTxHash,
      moveInImages: moveInState?.moveInImages || [],
      moveOutImages: images,
      timestamp: new Date().toISOString()
    };

    localStorage.setItem(`property_${id}_final_report`, JSON.stringify(finalReport));
    localStorage.removeItem(`property_${id}_state`);

    setSettlement({
      damageDesc: "Broken ceiling fan",
      damageCost: damageCost,
      refund: refundAmount,
      reportHash,
      txHash: mockTxHash
    });
  };

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-8">
      <h2 className="font-pixel text-xl bg-white neo-border px-4 py-2 inline-block self-start">FINAL: MOVE-OUT & SETTLEMENT</h2>
      
      {!settlement ? (
        <>
          <div className="neo-container bg-neo-accent-pink text-white">
            <h3 className="font-pixel text-sm mb-4 text-center">UPLOAD CURRENT CONDITION</h3>
            <ImageUploader onImagesChange={(imgs) => setImages(imgs)} />
          </div>

          <div className="neo-container bg-white">
            <h3 className="font-pixel text-sm mb-4">TENANT STATEMENT (LOCAL LANGUAGE)</h3>
            <textarea 
              value={statement}
              onChange={(e) => setStatement(e.target.value)}
              placeholder="e.g. Fan pehle se toot gaya tha (Submit in any regional language)"
              className="w-full p-2 border-2 border-black focus:outline-none focus:bg-yellow-50 font-body font-bold text-sm h-24"
            />
          </div>

          {errorMessage && (
            <div className="bg-red-100 border-2 border-red-500 text-red-700 p-3 font-body font-bold text-xs">
              <p className="mb-2">⚠️ {errorMessage}</p>
              <button 
                onClick={handleBypass}
                className="text-[10px] underline uppercase font-pixel cursor-pointer hover:text-black"
              >
                [Bypass analysis & on-chain register for frontend testing]
              </button>
            </div>
          )}

          <button 
            onClick={handleVerify}
            disabled={images.length === 0 || isVerifying}
            className={`neo-btn w-full ${images.length === 0 ? 'bg-gray-300 text-gray-500' : 'bg-black text-white'} ${isVerifying ? 'animate-pulse bg-neo-bg-purple' : ''}`}
          >
            {isVerifying ? verifyingStep : 'VERIFY & SETTLE'}
          </button>
        </>
      ) : (
        <div className="neo-container bg-white animate-fade-in flex flex-col gap-6">
          <div className={`${settlement.damageCost > 0 ? 'bg-neo-bg-red' : 'bg-neo-accent-green'} text-white p-4 text-center neo-border mb-2 shadow-[2px_2px_0px_#000]`}>
            <h3 className="font-pixel text-lg">{settlement.damageCost > 0 ? '⚠️ DAMAGE DETECTED' : '✅ NO DAMAGE DETECTED'}</h3>
          </div>

          <div className="neo-inner-card bg-gray-50 border-black font-body">
            <h4 className="font-bold text-lg mb-2">AI Assessment:</h4>
            <div className="flex justify-between text-red-600 font-bold border-b-2 border-black pb-2 mb-2">
              <span>{settlement.damageDesc || "No damage found"}</span>
              <span>-₹{settlement.damageCost}</span>
            </div>
            <div className="flex justify-between text-gray-500 text-sm">
              <span>Original Deposit</span>
              <span>₹{property.deposit}</span>
            </div>
          </div>

          <div className="bg-neo-accent-green text-black neo-border p-6 text-center shadow-[4px_4px_0px_#000]">
            <p className="font-pixel text-[10px] mb-2 uppercase">Amount Refunded to Tenant</p>
            <p className="font-pixel text-3xl md:text-4xl">₹{settlement.refund}</p>
          </div>

          <div className="neo-inner-card bg-yellow-50 text-xs font-body flex flex-col gap-2">
            <div className="flex justify-between border-b border-black pb-1">
              <span className="font-bold">Monad Tx Hash:</span>
              <a 
                href={`https://testnet.monadscan.com/tx/${settlement.txHash}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-neo-accent-blue underline font-mono truncate max-w-[150px]"
              >
                {settlement.txHash}
              </a>
            </div>
            <div className="flex justify-between">
              <span className="font-bold">Report Hash:</span>
              <span className="font-mono truncate max-w-[150px]">{settlement.reportHash}</span>
            </div>
          </div>

          <button onClick={() => router.push("/")} className="neo-btn bg-white w-full text-[10px]">
            RETURN TO HOME
          </button>
        </div>
      )}
    </div>
  );
}
