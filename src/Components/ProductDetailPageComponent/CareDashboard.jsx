// Final_Year_Project/src/Components/ProductDetailPageComponent/CareDashboard.jsx
import React from "react";
import { 
  Sun, 
  Droplets, 
  Thermometer 
} from 'lucide-react';

/* -------------------------------------------------------------------------- */
/* CareDashboard
   - Accepts `care` object:
     { level, levelPercent(0-100), sunlight, water, temp, tips }
---------------------------------------------------------------------------- */
export default function CareDashboard({ care = {} }) {
  const {
    level = "Easy",
    levelPercent = 33,
    sunlight = "Partial",
    water = "Weekly",
    temp = "18-30°C",
  } = care;

  const widthClass = `${Math.max(0, Math.min(100, levelPercent))}%`;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-[0_20px_40px_-15px_rgba(84,115,94,0.15)] border border-gray-100">
      {/* Care Level Section */}
      <div className="mb-6">
        <div className="flex justify-between items-end mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Care Level</span>
          <span className="text-sm font-bold text-[#54735e]">{level}</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
          <div 
            className="bg-[#54735e] h-full rounded-full" 
            style={{ width: widthClass }} 
          />
        </div>
      </div>

      {/* Care Icons Grid */}
      <div className="grid grid-cols-3 gap-4">
        {/* Sunlight */}
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="p-3 rounded-full bg-orange-50 text-orange-500">
            <Sun size={20} strokeWidth={1.8} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">{sunlight}</p>
            <p className="text-xs text-gray-500 mt-0.5">Sunlight</p>
          </div>
        </div>

        {/* Water */}
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="p-3 rounded-full bg-blue-50 text-blue-500">
            <Droplets size={20} strokeWidth={1.8} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">{water}</p>
            <p className="text-xs text-gray-500 mt-0.5">Water</p>
          </div>
        </div>

        {/* Temperature */}
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="p-3 rounded-full bg-red-50 text-red-500">
            <Thermometer size={20} strokeWidth={1.8} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">{temp}</p>
            <p className="text-xs text-gray-500 mt-0.5">Temp</p>
          </div>
        </div>
      </div>
    </div>
  );
}