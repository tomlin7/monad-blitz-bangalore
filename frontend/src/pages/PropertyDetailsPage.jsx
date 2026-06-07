import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PROPERTIES } from "../data/properties";

export function PropertyDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [propertyState, setPropertyState] = useState(null);

  const property = PROPERTIES.find(p => p.id === parseInt(id));

  useEffect(() => {
    const savedState = localStorage.getItem(`property_${id}_state`);
    if (savedState) {
      setPropertyState(JSON.parse(savedState));
    }
  }, [id]);

  if (!property) return <div className="font-pixel">Property not found.</div>;

  const isOccupied = propertyState && propertyState.status === 'Occupied';

  return (
    <div className="neo-container bg-white max-w-2xl mx-auto flex flex-col gap-6">
      <div className="w-full h-64 bg-gray-200 neo-border relative overflow-hidden">
         <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjY2NjIi8+CjxyZWN0IHg9IjQiIHk9IjQiIHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNjY2MiLz4KPC9zdmc+')] opacity-50"></div>
         <div className="absolute inset-0 flex items-center justify-center font-pixel text-gray-500 text-sm">ROOM PREVIEW</div>
      </div>
      
      <div>
        <h2 className="font-pixel text-2xl mb-2 leading-relaxed">{property.name}</h2>
        <p className="font-body text-lg text-gray-600 mb-4">{property.location}</p>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="neo-inner-card bg-neo-bg-yellow">
            <span className="font-pixel text-[10px] uppercase block mb-2">Deposit</span>
            <span className="font-body font-bold text-xl">₹{property.deposit}</span>
          </div>
          <div className="neo-inner-card bg-neo-bg-blue text-white">
            <span className="font-pixel text-[10px] uppercase block mb-2 text-blue-100">Host</span>
            <span className="font-body font-bold text-xl">{property.host}</span>
          </div>
        </div>

        <div className="mb-6 p-4 border-2 border-dashed border-black bg-gray-50">
          <span className="font-pixel text-[10px] uppercase block mb-2">Current Status</span>
          <span className={`font-pixel text-sm ${isOccupied ? 'text-neo-accent-pink' : 'text-neo-accent-green'}`}>
            {isOccupied ? 'OCCUPIED (ESCROW LOCKED)' : 'AVAILABLE'}
          </span>
        </div>

        <div className="flex gap-4">
          {!isOccupied ? (
            <button onClick={() => navigate(`/property/${id}/move-in`)} className="neo-btn bg-neo-accent-green w-full">
              INITIATE MOVE-IN
            </button>
          ) : (
            <button onClick={() => navigate(`/property/${id}/move-out`)} className="neo-btn bg-neo-accent-pink w-full text-white">
              INITIATE MOVE-OUT
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
