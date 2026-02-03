import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserHeader from "../Components/UserProfilePageComponent/UserProfileHeader";
import { getProductById } from "../services/publicAPI";

export default function WishlistPage() {
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWishlist = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch("http://localhost:5000/api/user/wishlist", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch wishlist");
        const data = await res.json();

        const products = await Promise.all(
          data.wishlist.map((item) => getProductById(item._id || item))
        );

        setWishlistProducts(products);
      } catch (err) {
        console.error("Error fetching wishlist products:", err);
      }
    };

    fetchWishlist();
  }, []);

  return (
    <>
      <UserHeader />

      <main className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">My Wishlist</h1>

        {wishlistProducts.length === 0 ? (
          <p className="text-gray-600">Your wishlist is empty.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistProducts.map((product) => (
              <div
                key={product._id}
                className="bg-white shadow rounded-lg p-4 flex flex-col items-center gap-3"
              >
                <img
                  src={product.image1 || product.image2 || product.image3}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <h2 className="text-lg font-semibold text-gray-800 text-center">
                  {product.name}
                </h2>
                <p className="text-green-700 font-bold">Rs {product.price?.toFixed(2)}</p>

                <button
                  onClick={() => navigate(`/product/${product._id}`)}
                  className="w-full bg-[#54735e] hover:bg-[#45614d] text-white font-bold py-2 px-4 rounded-lg transition-all active:scale-[0.98]"
                >
                  View Product
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
