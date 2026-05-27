import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts } from "../services/publicAPI";

const RECENT_KEY = "recent_searches";

export default function SearchOverlay({ open, query, setQuery, onClose }) {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const res = await getProducts();
        const list = Array.isArray(res) ? res : res?.products || [];
        setProducts(list);
      } catch (err) {
        console.error("Failed to load products:", err);
      } finally {
        setLoading(false);
      }
    };

    if (open) loadProducts();
  }, [open]);

  const recentSearches = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
    } catch {
      return [];
    }
  }, [open]);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products.slice(0, 6);

    return products
      .filter((p) => p?.name?.toLowerCase().includes(q))
      .slice(0, 6);
  }, [products, query]);

  const saveRecentSearch = (term) => {
    const clean = term.trim();
    if (!clean) return;

    const current = JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
    const updated = [clean, ...current.filter((x) => x !== clean)].slice(0, 6);
    localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
  };

  const goToSearch = (term) => {
    saveRecentSearch(term);
    setQuery(term);
    onClose?.();
    navigate(`/search?q=${encodeURIComponent(term)}`);
  };

  if (!open) return null;

  return (
    <div className="absolute left-0 top-full z-50 mt-2 w-full rounded-2xl border bg-white shadow-lg">
      <div className="p-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products..."
          className="w-full rounded-xl border px-4 py-2 outline-none"
          autoFocus
        />

        <div className="mt-3 max-h-72 overflow-auto">
          {loading ? (
            <p className="px-2 py-3 text-sm text-gray-500">Loading...</p>
          ) : (
            <>
              {!query.trim() && recentSearches.length > 0 && (
                <div className="mb-3">
                  <p className="mb-2 px-2 text-xs font-semibold uppercase text-gray-500">
                    Recent searches
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((item) => (
                      <button
                        key={item}
                        onClick={() => goToSearch(item)}
                        className="rounded-full bg-gray-100 px-3 py-1 text-sm hover:bg-gray-200"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <p className="mb-2 px-2 text-xs font-semibold uppercase text-gray-500">
                Matching products
              </p>

              {matches.length > 0 ? (
                <div className="space-y-1">
                  {matches.map((product) => (
                    <button
                      key={product._id}
                      onClick={() => goToSearch(product.name)}
                      className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left hover:bg-gray-100"
                    >
                      <span className="text-sm font-medium">{product.name}</span>
                      <span className="text-xs text-gray-500">
                        Rs. {product.price}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="px-2 py-3 text-sm text-gray-500">
                  No matching products found.
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}