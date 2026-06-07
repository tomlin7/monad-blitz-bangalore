export function Footer() {
  return (
    <footer className="w-full max-w-5xl mt-12 bg-neo-card-white neo-border neo-shadow px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-4 z-50">
      <div className="flex flex-col items-center md:items-start">
        <span className="font-pixel text-lg mb-2">RENT CHAUKIDAAR</span>
        <span className="font-body text-sm font-bold text-gray-600">AI-Powered Rental Escrow on Monad</span>
      </div>
      <div className="flex gap-4 font-body font-bold text-sm">
        <a href="#" className="hover:text-neo-accent-blue transition-colors">How it Works</a>
        <a href="#" className="hover:text-neo-accent-pink transition-colors">Trust Model</a>
        <a href="#" className="hover:text-neo-accent-green transition-colors">Github</a>
      </div>
    </footer>
  );
}
