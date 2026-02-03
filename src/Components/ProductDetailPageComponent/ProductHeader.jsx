// Final_Year_Project/src/Components/ProductDetailPageComponent/ProductHeader.jsx
import React from "react";

/* -------------------------------------------------------------------------- */
/* ProductHeader
   - Title, price, old price, and small badges (In Stock)
---------------------------------------------------------------------------- */
export default function ProductHeader({ name, price, oldPrice, totalPrice, stock }) {
  const inStock = typeof stock === "number" ? stock > 0 : true;

  return (
    <div className="flex flex-col gap-3">
      <h1 className="text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1]">{name}</h1>

      <div className="flex items-center justify-between mt-2">
        <span className="text-3xl font-medium text-[#54735e]">Rs{(totalPrice ?? price)?.toFixed(2)}</span>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-full border border-gray-200 shadow-sm">
            <svg className="w-4 h-4 text-[#54735e]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17,8C8,10,5.9,16.17,3.82,21.34L5.71,22L6.66,19.7C7.14,19.87,7.64,20,8,20C19,20,22,3,22,3C21,5,14,5.25,9,6.25C4,7.25,2,11.5,2,13.5C2,15.5,3.75,17.25,3.75,17.25C7,8,17,8,17,8Z" />
            </svg>
            <span className="text-xs font-semibold">Sustainable</span>
          </div>

          <div className={`flex items-center gap-1 bg-white px-3 py-1.5 rounded-full border border-gray-200 shadow-sm ${inStock ? "" : "opacity-60"}`}>
            <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L6.5,12L7.91,10.59L11,13.67L16.59,8.09L18,9.5L11,16.5Z" />
            </svg>
            <span className="text-xs font-semibold">{inStock ? "In Stock" : "Out of Stock"}</span>
          </div>
        </div>
      </div>

      {oldPrice && (
        <div className="text-sm text-gray-500 line-through">Rs{oldPrice.toFixed(2)}</div>
      )}
    </div>
  );
}
