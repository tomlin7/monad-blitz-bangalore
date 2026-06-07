"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navbar() {
  const pathname = usePathname();
  
  return (
    <nav className="bg-neo-bg-blue text-white neo-border shadow-[8px_8px_0px_#000] px-6 py-4 mb-8 w-full max-w-5xl flex flex-col md:flex-row justify-between items-center z-50 gap-4">
      <Link href="/" className="font-pixel text-xl hover:text-neo-bg-yellow hover:scale-105 transition-all text-center md:text-left leading-relaxed drop-shadow-[2px_2px_0px_#000]">
        RENT CHAUKIDAAR
      </Link>
      <div className="flex flex-wrap justify-center md:justify-end gap-2 md:gap-4">
        <Link href="/properties" className="font-pixel text-xs bg-white text-black hover:bg-neo-bg-yellow px-4 py-2 neo-border neo-shadow-hover transition-all">PROPERTIES</Link>
      </div>
    </nav>
  );
}
