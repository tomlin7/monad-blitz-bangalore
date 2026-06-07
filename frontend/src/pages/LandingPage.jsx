import { useNavigate } from "react-router-dom";

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-12">
      <section className="text-center flex flex-col items-center mt-8 px-4">
        <div className="bg-neo-accent-pink neo-badge text-white mb-6">Monad + Sarvam AI</div>
        <h2 className="font-pixel text-3xl sm:text-4xl md:text-5xl uppercase leading-relaxed mb-6 tracking-tight text-center">
          <span className="bg-white px-2 leading-loose">EVIDENCE</span><br className="md:hidden" /> DECIDES.<br />
          <span className="bg-neo-bg-blue text-white px-4 inline-block transform -rotate-2 mt-4 text-2xl sm:text-4xl">NOT POWER.</span>
        </h2>
        <p className="text-lg md:text-xl font-bold font-body max-w-2xl mb-8 bg-white inline-block px-4 py-2 neo-border">
          AI-powered rental escrow & dispute resolution.
        </p>
        <button onClick={() => navigate("/properties")} className="neo-btn bg-neo-accent-green hover:bg-green-400">
          VIEW PROPERTIES
        </button>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 md:px-0 mt-8">
        <div className="neo-container bg-neo-bg-purple text-white relative">
          <h3 className="font-pixel text-sm mb-4">1. UPLOAD</h3>
          <p className="font-body font-bold text-lg">Record condition at move-in. Cryptographically hashed on Monad.</p>
        </div>
        <div className="neo-container bg-neo-accent-blue text-white">
          <h3 className="font-pixel text-sm mb-4">2. ESCROW</h3>
          <p className="font-body font-bold text-lg">Deposit locked in smart contract. Trustless holding.</p>
        </div>
        <div className="neo-container bg-neo-accent-green text-black">
          <h3 className="font-pixel text-sm mb-4">3. VERIFY</h3>
          <p className="font-body font-bold text-lg">Sarvam AI compares move-out condition. Auto-settlement.</p>
        </div>
      </section>
    </div>
  );
}
