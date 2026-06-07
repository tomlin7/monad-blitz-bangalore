"use client";

import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-12 pb-12">
      <section className="text-center flex flex-col items-center mt-8 px-4">
        <div className="bg-neo-accent-pink neo-badge text-white mb-6 animate-pulse">
          Monad + Gemini + Sarvam
        </div>

        <h2 className="font-pixel text-2xl sm:text-4xl md:text-5xl uppercase leading-relaxed mb-6 tracking-tight text-center drop-shadow-[2px_2px_0px_#000]">
          <span className="bg-white px-2 leading-loose">EVIDENCE DECIDES.</span>
          <br className="md:hidden" />
          <span className="bg-neo-bg-red text-white px-4 inline-block transform -rotate-2 mt-6 text-xl sm:text-3xl p-2 drop-shadow-[4px_4px_0px_#000]">
            NO MORE VETO POWER
          </span>
          <br />
          <span className="bg-neo-bg-blue text-white px-4 inline-block transform rotate-1 mt-4 text-xl sm:text-3xl p-2 drop-shadow-[4px_4px_0px_#000]">
            TO THE OWNER.
          </span>
        </h2>

        <p className="text-lg md:text-xl font-body max-w-2xl mb-8 bg-white inline-block px-6 py-4 neo-border shadow-[4px_4px_0px_#000] text-left">
          <strong>Rent Chaukidaar</strong> is an AI-powered escrow platform that
          protects tenants and landlords from unfair security deposit disputes.
          Your deposit is locked in a Monad smart contract, analyzed by Gemini
          Vision, and supported by Sarvam AI.
        </p>

        <button
          onClick={() => router.push("/properties")}
          className="neo-btn bg-neo-accent-green text-black hover:bg-green-400 text-lg md:text-xl px-12 py-4 shadow-[6px_6px_0px_#000]"
        >
          VIEW PROPERTIES
        </button>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 md:px-0 mt-8">
        <div className="neo-container bg-neo-bg-purple text-white relative hover:-translate-y-2 transition-transform">
          <h3 className="font-pixel text-sm mb-4">1. UPLOAD</h3>
          <p className="font-body font-bold text-lg">
            Record condition at move-in. Cryptographically hashed on Monad.
          </p>
        </div>
        <div className="neo-container bg-neo-accent-blue text-white hover:-translate-y-2 transition-transform">
          <h3 className="font-pixel text-sm mb-4">2. ESCROW</h3>
          <p className="font-body font-bold text-lg">
            Deposit locked in smart contract. Trustless holding.
          </p>
        </div>
        <div className="neo-container bg-neo-accent-green text-black hover:-translate-y-2 transition-transform">
          <h3 className="font-pixel text-sm mb-4">3. VERIFY</h3>
          <p className="font-body font-bold text-lg">
            Gemini Vision checks condition, and Sarvam AI translates statements.
            Auto-settlement.
          </p>
        </div>
      </section>
    </div>
  );
}
