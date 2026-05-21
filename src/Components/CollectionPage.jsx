import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PlantCard from "../Components/ProductCard/PlantCard";
import { getProducts, getRecommendations } from "../services/publicAPI";

const serif = { fontFamily: "'Cormorant Garamond', serif" };
const sans  = { fontFamily: "'DM Sans', sans-serif" };

const ITEMS_PER_PAGE = 8;

/**
 * CollectionPage
 *
 * Props:
 *  - title       {string}  Display title, e.g. "New Arrivals"
 *  - subtitle    {string}  Optional subtitle line below the title
 *  - filterKey   {string}  Key on the product object to filter by (e.g. "indoor", "onSale")
 *  - type        {string}  Pass "recommendation" to use the personalised endpoint
 */
export default function CollectionPage({ title, subtitle, filterKey, type }) {
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [visible,  setVisible]  = useState(false);
  const [page,     setPage]     = useState(1);

  /* ─── fetch ─────────────────────────────────────────────────────── */
  useEffect(() => {
    setLoading(true);
    setVisible(false);
    setPage(1);

    const token = localStorage.getItem("token");

    if (type === "recommendation" && token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        getRecommendations(payload._id).then((data) => {
          setProducts(data);
          setLoading(false);
          setTimeout(() => setVisible(true), 80);
        });
        return;
      } catch (_) { /* fall through */ }
    }

    getProducts().then((data) => {
      const filtered = filterKey ? data.filter((p) => p[filterKey]) : data;

      // Sort newest → oldest using createdAt (falls back to _id timestamp if no createdAt)
      const sorted = [...filtered].sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt) : new Date(parseInt(a._id.substring(0, 8), 16) * 1000);
        const dateB = b.createdAt ? new Date(b.createdAt) : new Date(parseInt(b._id.substring(0, 8), 16) * 1000);
        return dateB - dateA;
      });

      setProducts(sorted);
      setLoading(false);
      setTimeout(() => setVisible(true), 80);
    });
  }, [filterKey, type, title]);

  /* ─── pagination ─────────────────────────────────────────────────── */
  const totalPages  = Math.max(1, Math.ceil(products.length / ITEMS_PER_PAGE));
  const startIndex  = (page - 1) * ITEMS_PER_PAGE;
  const currentPage = products.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const goTo = (p) => {
    setVisible(false);
    setTimeout(() => {
      setPage(p);
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => setVisible(true), 80);
    }, 250);
  };

  /* ─── skeleton ───────────────────────────────────────────────────── */
  const Skeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-7">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl bg-[#e8ede8] animate-pulse"
          style={{ height: 340 }}
        />
      ))}
    </div>
  );

  /* ─── pagination controls ────────────────────────────────────────── */
  const PaginationBar = () => {
    if (totalPages <= 1) return null;

    // Build page numbers with ellipsis
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push("…");
      for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
        pages.push(i);
      }
      if (page < totalPages - 2) pages.push("…");
      pages.push(totalPages);
    }

    return (
      <div className="flex items-center justify-center gap-2 mt-14" style={sans}>
        {/* Prev */}
        <button
          onClick={() => goTo(page - 1)}
          disabled={page === 1}
          className="w-9 h-9 flex items-center justify-center rounded-full border border-[#2d4a2d]/20 text-[#2d4a2d] hover:bg-[#2d4a2d] hover:text-[#f7f4ee] hover:border-[#2d4a2d] transition-all duration-200 disabled:opacity-25 disabled:cursor-not-allowed text-sm"
        >
          ‹
        </button>

        {/* Page numbers */}
        {pages.map((p, i) =>
          p === "…" ? (
            <span key={`ellipsis-${i}`} className="w-9 text-center text-[#7a9e7e] text-sm">
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => goTo(p)}
              className={`w-9 h-9 flex items-center justify-center rounded-full text-sm transition-all duration-200 border ${
                p === page
                  ? "bg-[#2d4a2d] text-[#f7f4ee] border-[#2d4a2d]"
                  : "border-[#2d4a2d]/20 text-[#2d4a2d] hover:bg-[#2d4a2d]/10 hover:border-[#2d4a2d]/40"
              }`}
            >
              {p}
            </button>
          )
        )}

        {/* Next */}
        <button
          onClick={() => goTo(page + 1)}
          disabled={page === totalPages}
          className="w-9 h-9 flex items-center justify-center rounded-full border border-[#2d4a2d]/20 text-[#2d4a2d] hover:bg-[#2d4a2d] hover:text-[#f7f4ee] hover:border-[#2d4a2d] transition-all duration-200 disabled:opacity-25 disabled:cursor-not-allowed text-sm"
        >
          ›
        </button>
      </div>
    );
  };

  /* ─── render ─────────────────────────────────────────────────────── */
  return (
    <section className="px-14 py-16 max-lg:px-10 max-md:px-5 max-md:py-10">

      {/* Results count */}
      {!loading && (
        <p
          className="text-[12px] tracking-[0.08em] text-[#7a9e7e] mb-8"
          style={sans}
        >
          {products.length} {products.length === 1 ? "plant" : "plants"} found
          {totalPages > 1 && ` — page ${page} of ${totalPages}`}
        </p>
      )}

      {/* Grid */}
      {loading ? (
        <Skeleton />
      ) : currentPage.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-[40px] mb-3" style={serif}>Nothing here yet</p>
          <p className="text-[#7a9e7e] text-sm" style={sans}>
            Check back soon — we&apos;re always adding new plants.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-7">
          {currentPage.map((product, i) => (
            <Link
              key={product._id}
              to={`/product/${product._id}`}
              className="block no-underline"
              style={{
                opacity:   visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(16px)",
                transition: `opacity 0.45s ease ${i * 0.055}s, transform 0.45s ease ${i * 0.055}s`,
              }}
            >
              <PlantCard
                {...product}
                image={product.image1 || "/fallback-image.png"}
              />
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && <PaginationBar />}
    </section>
  );
}