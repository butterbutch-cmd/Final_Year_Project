// Final_Year_Project/src/Components/ProductDetailPageComponent/Accordion.jsx
import React, { useState } from "react";

/* -------------------------------------------------------------------------- */
/* Accordion
   - sections: [{ id, title, content }]
   - content can be string | array
---------------------------------------------------------------------------- */
export default function Accordion({ sections = [] }) {
  const [open, setOpen] = useState(null);
  const toggle = (id) => setOpen(open === id ? null : id);

  return (
    <div className="border-t border-gray-200 mt-2">
      {sections.map((s) => (
        <div key={s.id} className="py-4 border-b border-gray-200 cursor-pointer">
          <div onClick={() => toggle(s.id)} className="flex justify-between items-center font-bold text-sm uppercase tracking-wide">
            <span>{s.title}</span>
            <svg className={`w-6 h-6 transition-transform duration-300 ${open === s.id ? "rotate-180" : ""}`} fill="currentColor" viewBox="0 0 24 24">
              <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />
            </svg>
          </div>

          {open === s.id && (
            <div className="pt-4 text-sm text-gray-600 leading-relaxed">
              {Array.isArray(s.content) ? (
                <ul className="list-disc pl-4 space-y-2">
                  {s.content.map((c, idx) => <li key={idx}>{c}</li>)}
                </ul>
              ) : (
                <div>{s.content}</div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
