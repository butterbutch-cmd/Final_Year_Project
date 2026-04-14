// // import Header from "../Components/Header/Header";
// // import CoverBanner from "../Components/Banner/CoverBanner";
// // import ProductSection from "../Components/ProductSection";

// // export default function HomePage() {
// //   return (
// //     <>
// //       <Header />

// //       <CoverBanner
// //         title="Bring Nature Home"
// //         subtitle="Minimal • Fresh • Green"
// //         height="80vh"
// //       />

// //       {/* PRODUCT SECTIONS */}
// //       <ProductSection title="Trending Plants" filterKey="trending" />
// //       <ProductSection title="On Sale" filterKey="onSale" />
// //       <ProductSection title="Top Picks" filterKey="topPick" />
// //     </>
// //   );
// // }

// import Header from "../Components/Header/Header";
// import CoverBanner from "../Components/Banner/CoverBanner";
// import ProductSection from "../Components/ProductSection";
// import { useNavigate } from "react-router-dom";

// const serif = { fontFamily: "'Cormorant Garamond', serif" };
// const sans  = { fontFamily: "'DM Sans', sans-serif" };

// const FEATURES = [
//   { icon: "🌿", label: "100% Natural",    sub: "Ethically sourced plants" },
//   { icon: "🚚", label: "Free Delivery",   sub: "On orders over Rs. 2,500" },
//   { icon: "💧", label: "Care Guide",      sub: "Included with every plant" },
//   { icon: "🌱", label: "Expert Support",  sub: "Green thumb advice" },
// ];

// export default function HomePage() {
//   const navigate = useNavigate();

//   return (
//     <div className="bg-[#fdfcf8]">
//       <Header />

//       <CoverBanner
//         title="Bring Nature Home"
//         subtitle="Minimal · Fresh · Green"
//         height="90vh"
//       />

//       {/* ── Feature strip ── */}
//       <div className="grid grid-cols-4 bg-[#f7f4ee] border-b border-[#2d4a2d]/10 max-lg:grid-cols-2 max-sm:grid-cols-1">
//         {FEATURES.map(({ icon, label, sub }, i) => (
//           <div
//             key={label}
//             className={`flex items-center gap-4 px-9 py-7 hover:bg-[#2d4a2d]/5 transition-colors duration-200
//               ${i < 3 ? "border-r border-[#2d4a2d]/10" : ""}
//               max-lg:${i === 1 ? "border-r-0" : ""}
//               max-sm:border-r-0 max-sm:border-b border-[#2d4a2d]/10 last:border-b-0`}
//           >
//             <span className="text-2xl flex-shrink-0">{icon}</span>
//             <div>
//               <p className="text-[13px] font-medium text-[#1a3320] m-0 mb-0.5" style={sans}>{label}</p>
//               <p className="text-[11.5px] font-light text-[#8c8880] m-0" style={sans}>{sub}</p>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* ── Product sections ── */}
//       <ProductSection title="Trending Plants" filterKey="trending" />
//       <ProductSection title="On Sale"         filterKey="onSale" />
//       <ProductSection title="Top Picks"       filterKey="topPick" />

//       {/* ── Footer CTA banner ── */}
//       <div className="bg-[#1a3320] text-center py-20 px-6">
//         <p className="text-[11px] tracking-[0.22em] uppercase text-[#7a9e7e] m-0 mb-4" style={sans}>
//           ✦ Community
//         </p>
//         <h2
//           className="font-light text-[#f7f4ee] m-0 mb-3"
//           style={{ ...serif, fontSize: "clamp(36px, 5vw, 56px)", letterSpacing: "-0.01em" }}
//         >
//           Share your green space
//         </h2>
//         <p className="text-[15px] font-light text-[#f7f4ee]/50 m-0 mb-9" style={sans}>
//           Join hundreds of plant lovers on our forum
//         </p>
//         <button
//           onClick={() => navigate("/forum")}
//           className="inline-block px-10 py-3.5 bg-[#f7f4ee] text-[#1a3320] text-[11px] font-medium tracking-[0.14em] uppercase border-none cursor-pointer rounded-sm hover:bg-[#7a9e7e] hover:text-white transition-all duration-200"
//           style={sans}
//         >
//           Join the Forum →
//         </button>
//       </div>
//     </div>
//   );
// }


import Header from "../Components/Header/Header";
import CoverBanner from "../Components/Banner/CoverBanner";
import ProductSection from "../Components/ProductSection";
import { useNavigate } from "react-router-dom";
import { Leaf, Truck, Droplets, Sprout } from "lucide-react";

const serif = { fontFamily: "'Cormorant Garamond', serif" };
const sans  = { fontFamily: "'DM Sans', sans-serif" };

const FEATURES = [
  { icon: Leaf,     label: "100% Natural",   sub: "Ethically sourced plants" },
  { icon: Truck,    label: "Free Delivery",  sub: "On orders over Rs. 2,500" },
  { icon: Droplets, label: "Care Guide",     sub: "Included with every plant" },
  { icon: Sprout,   label: "Expert Support", sub: "Green thumb advice" },
];

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#fdfcf8]">
      <Header />

      <CoverBanner
        title="Bring Nature Home"
        subtitle="Minimal · Fresh · Green"
        height="90vh"
      />

      {/* ── Feature strip ── */}
      <div className="grid grid-cols-4 bg-[#f7f4ee] border-b border-[#2d4a2d]/10 max-lg:grid-cols-2 max-sm:grid-cols-1">
        {FEATURES.map(({ icon: Icon, label, sub }, i) => (
          <div
            key={label}
            className={`group flex items-center gap-4 px-9 py-7 hover:bg-[#2d4a2d]/5 transition-colors duration-200
              ${i < 3 ? "border-r border-[#2d4a2d]/10" : ""}
              max-lg:${i === 1 ? "border-r-0" : ""}
              max-sm:border-r-0 max-sm:border-b border-[#2d4a2d]/10 last:border-b-0`}
          >
            <span className="flex-shrink-0 text-[#2d4a2d]">
              <Icon
                size={26}
                strokeWidth={1.5}
                className="transition-transform duration-200 group-hover:scale-110"
              />
            </span>

            <div>
              <p
                className="text-[13px] font-medium text-[#1a3320] m-0 mb-0.5"
                style={sans}
              >
                {label}
              </p>
              <p
                className="text-[11.5px] font-light text-[#8c8880] m-0"
                style={sans}
              >
                {sub}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Product sections ── */}
      <ProductSection title="Trending Plants" filterKey="trending" />
      <ProductSection title="On Sale" filterKey="onSale" />
      <ProductSection title="Top Picks" filterKey="topPick" />

      {/* ── Footer CTA banner ── */}
      <div className="bg-[#1a3320] text-center py-20 px-6">
        <p
          className="text-[11px] tracking-[0.22em] uppercase text-[#7a9e7e] m-0 mb-4"
          style={sans}
        >
          ✦ Community
        </p>

        <h2
          className="font-light text-[#f7f4ee] m-0 mb-3"
          style={{
            ...serif,
            fontSize: "clamp(36px, 5vw, 56px)",
            letterSpacing: "-0.01em",
          }}
        >
          Share your green space
        </h2>

        <p
          className="text-[15px] font-light text-[#f7f4ee]/50 m-0 mb-9"
          style={sans}
        >
          Join hundreds of plant lovers on our forum
        </p>

        <button
          onClick={() => navigate("/forum")}
          className="inline-block px-10 py-3.5 bg-[#f7f4ee] text-[#1a3320] text-[11px] font-medium tracking-[0.14em] uppercase border-none cursor-pointer rounded-sm hover:bg-[#7a9e7e] hover:text-white transition-all duration-200"
          style={sans}
        >
          Join the Forum →
        </button>
      </div>
    </div>
  );
}