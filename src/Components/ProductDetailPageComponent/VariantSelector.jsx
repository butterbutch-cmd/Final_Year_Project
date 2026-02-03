// Final_Year_Project/src/Components/ProductDetailPageComponent/VariantSelector.jsx

/* -------------------------------------------------------------------------- */
/* VariantSelector
   - Accepts potOptions: [{ id, label, price }]
   - Defaults to two options if none provided
---------------------------------------------------------------------------- */
export default function VariantSelector({ selectedPot, setSelectedPot, potOptions = null }) {
  const defaultOptions = [
    { id: "nursery", label: "Nursery Pot", price: 0 },
    { id: "ceramic", label: "Ceramic Pot", price: 250 },
  ];

  const options = potOptions && potOptions.length ? potOptions : defaultOptions;

  return (
    <div className="flex flex-col gap-3">
      <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Choose Pot Style</span>
      <div className="grid grid-cols-2 gap-4">
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => setSelectedPot(opt.id)}
            className={`relative flex items-center justify-center py-4 px-4 rounded-xl border-2 font-bold transition-all shadow-sm ${
              selectedPot === opt.id ? "border-[#54735e] bg-[#54735e]/5 text-[#54735e]" : "border-gray-200 bg-white text-gray-600 hover:border-[#54735e]/50"
            }`}
          >
            <span className="z-10">{opt.label}</span>
            {opt.price ? <span className="text-xs absolute bottom-2 right-3">Rs{opt.price.toFixed(2)}</span> : null}
            {selectedPot === opt.id && (
              <svg className="absolute top-2 right-2 w-4 h-4 text-[#54735e]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11,16.5L6.5,12L7.91,10.59L11,13.67L16.59,8.09L18,9.5L11,16.5Z" />
              </svg>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
