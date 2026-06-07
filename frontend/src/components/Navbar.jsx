import { Link } from "react-router-dom";

export function Navbar() {
  return (
    <nav className="bg-neo-card-white neo-border neo-shadow px-6 py-4 mb-8 w-full max-w-5xl flex flex-col md:flex-row justify-between items-center z-50 gap-4">
      <Link to="/" className="font-pixel text-xl hover:text-neo-accent-blue transition-colors text-center md:text-left leading-relaxed">
        RENT CHAUKIDAAR
      </Link>
      <div className="flex flex-wrap justify-center md:justify-end gap-2 md:gap-4">
        <Link to="/properties" className="font-bold font-body hover:bg-neo-bg-blue px-4 py-2 border-2 border-transparent hover:border-black transition-all">Properties</Link>
      </div>
    </nav>
  );
}
