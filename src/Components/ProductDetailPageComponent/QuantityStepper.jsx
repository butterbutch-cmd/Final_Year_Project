  // Final_Year_Project/src/Components/ProductDetailPageComponent/QuantityStepper.jsx
  import React from "react";

  /* -------------------------------------------------------------------------- */
  /* QuantityStepper - small, focused: parent manages quantity state
  ---------------------------------------------------------------------------- */
  export default function QuantityStepper({ quantity, setQuantity }) {
    const handleChange = (delta) => {
      setQuantity((prev) => Math.max(1, prev + delta));
    };

    return (
      <div className="flex items-center justify-between w-32 h-14 bg-white border border-gray-200 rounded-xl px-2">
        <button onClick={() => handleChange(-1)} className="size-10 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19,13H5V11H19V13Z"/></svg>
        </button>
        <span className="font-bold text-lg">{quantity}</span>
        <button onClick={() => handleChange(1)} className="size-10 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"/></svg>
        </button>
      </div>
    );
  }
