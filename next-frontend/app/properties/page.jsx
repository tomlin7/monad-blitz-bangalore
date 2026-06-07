"use client";

import { useRouter } from "next/navigation";
import { PROPERTIES } from "../../data/properties";
import Image from "next/image";

export default function PropertiesPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-8">
      <h2 className="font-pixel text-2xl bg-white neo-border inline-block px-4 py-2 w-fit mx-auto md:mx-0">AVAILABLE RENTALS</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PROPERTIES.map(p => (
          <div key={p.id} className="neo-container bg-white flex flex-col justify-between">
            <div>
              <div className="w-full h-48 bg-gray-200 neo-border mb-4 overflow-hidden relative group">
                 {p.image ? (
                   <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                 ) : (
                   <div className="absolute inset-0 flex items-center justify-center font-pixel text-xs text-gray-500 z-10 group-hover:scale-110 transition-transform">NO IMAGE</div>
                 )}
              </div>
              <h3 className="font-body font-bold text-xl mb-1">{p.name}</h3>
              <p className="font-body text-gray-600 mb-4">{p.location}</p>
              <p className="font-pixel text-sm text-neo-accent-blue mb-4">₹{p.deposit}</p>
            </div>
            <button onClick={() => router.push(`/property/${p.id}`)} className="neo-btn bg-neo-bg-yellow w-full text-xs py-2">
              DETAILS
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
