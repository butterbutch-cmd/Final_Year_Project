import React, { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import toast from "react-hot-toast";

export default function PurchaseActions({ product = {}, wishlist = [], totalPrice = 0, onAddToCart = () => {}, onToggleWishlist = () => {} }) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Update heart active state whenever wishlist or product changes
  useEffect(() => {
    if (!product._id) return;
    const wishlistIds = wishlist.map(p => p._id?.toString() || p.toString());
    setIsWishlisted(wishlistIds.includes(product._id.toString()));
  }, [wishlist, product]);

  const handleWishlistClick = async () => {
    if (!product._id) return toast.error("Product ID missing!");
    try {
      await onToggleWishlist(product._id);
    } catch (err) {
      console.error("Error toggling wishlist:", err);
      toast.error("Failed to update wishlist");
    }
  };

  return (
    <div className="flex items-center gap-3 w-full">
      {/* Add to Cart */}
      <button
        onClick={onAddToCart}
        className="flex-1 min-w-[280px] bg-[#54735e] hover:bg-[#45614d] text-white font-bold text-lg rounded-xl h-14 flex items-center justify-center gap-2 shadow-lg shadow-[#54735e]/30 hover:shadow-[#54735e]/50 transition-all active:scale-[0.98]"
      >
        Add to Cart
        <span className="text-sm opacity-90"> (Rs {totalPrice.toFixed(2)})</span>
      </button>

      {/* Wishlist Heart */}
      <button
        onClick={handleWishlistClick}
        className={`group w-14 h-14 flex items-center justify-center rounded-full border transition-all active:scale-[0.95]
          ${isWishlisted
            ? "bg-[#54735e] border-[#54735e] shadow-lg shadow-[#54735e]/30"
            : "bg-white border-gray-300 hover:bg-[#45614d] hover:border-[#45614d] hover:shadow-lg hover:shadow-[#54735e]/20"
          }`}
        aria-label="Add to wishlist"
      >
        <Heart
          size={22}
          className={`transition-colors ${isWishlisted ? "text-white fill-white" : "text-gray-500 fill-none group-hover:text-white group-hover:fill-white"}`}
        />
      </button>
    </div>
  );
}
