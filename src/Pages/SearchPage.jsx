import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getProducts } from "../services/publicAPI";

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q") || "";

  const [products, setProducts] = useState([]);
  const [sortOrder, setSortOrder] = useState("none");
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

    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    const term = q.trim().toLowerCase();

    let result = products.filter((p) =>
      p?.name?.toLowerCase().includes(term)
    );

    if (sortOrder === "asc") {
      result = [...result].sort((a, b) => a.price - b.price);
    }

    if (sortOrder === "desc") {
      result = [...result].sort((a, b) => b.price - a.price);
    }

    return result;
  }, [products, q, sortOrder]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Search results</h1>
          <p className="text-sm text-gray-500">
            {q ? `Showing results for "${q}"` : "All products"}
          </p>
        </div>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="rounded-xl border px-3 py-2 text-sm outline-none"
        >
          <option value="none">Sort by price</option>
          <option value="asc">Price: Low to High</option>
          <option value="desc">Price: High to Low</option>
        </select>
      </div>

      {loading ? (
        <p className="text-sm text-gray-500">Loading products...</p>
      ) : filteredProducts.length === 0 ? (
        <p className="text-sm text-gray-500">No products found.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className="rounded-2xl border bg-white p-4 shadow-sm"
            >
              <img
                src={product.image1}
                alt={product.name}
                className="h-48 w-full rounded-xl object-cover"
              />
              <h2 className="mt-3 text-lg font-semibold">{product.name}</h2>
              <p className="text-sm text-gray-500">{product.category}</p>
              <p className="mt-2 text-base font-bold">Rs. {product.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}