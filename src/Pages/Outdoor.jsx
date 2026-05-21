import Header from "../Components/Header/Header";
import Footer from "../Components/Header/Footer";
import CollectionPage from "../Components/CollectionPage";

const serif = { fontFamily: "'Cormorant Garamond', serif" };
const sans  = { fontFamily: "'DM Sans', sans-serif" };

export default function Outdoor() {
  return (
    <div>
      <Header />

      {/* ── Top Banner ─────────────────────────────────────────────── */}
      <div className="bg-[#1a3320] px-6 lg:px-14 pt-10 pb-16" style={sans}>
        <p className="text-[11px] tracking-[0.2em] uppercase text-[#7a9e7e] mb-2">
          ✦ Collection
        </p>
        <h1
          className="font-light text-[#f7f4ee] m-0 leading-tight"
          style={{ ...serif, fontSize: "clamp(32px, 4vw, 48px)" }}
        >
          Outdoor Plants
        </h1>
        <p className="mt-3 text-[#a8c5a0] text-sm max-w-md" style={sans}>
          Hardy, vibrant plants made for the open air — gardens, balconies & beyond.
        </p>
      </div>

      {/* ── Product Grid + Pagination ───────────────────────────────── */}
      <CollectionPage
        title="Outdoor Plants"
        filterKey="outdoor"
      />

      <Footer />
    </div>
  );
}