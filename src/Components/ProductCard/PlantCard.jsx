// import { Star, Heart } from "lucide-react";

// const serif = { fontFamily: "'Cormorant Garamond', serif" };
// const sans  = { fontFamily: "'DM Sans', sans-serif" };

// const PlantCard = ({
//   name,
//   image,
//   reviews,
//   price,
//   oldPrice,
//   onSale,
//   subtitle,
//   rating = 5,
//   onClick,
// }) => {
//   return (
//     <div
//       onClick={onClick}
//       className="group cursor-pointer flex flex-col bg-[#fdfcf8]"
//     >
//       {/* ── Image ── */}
//       <div className="relative overflow-hidden bg-[#f7f4ee] aspect-[3/4]">
//         <img
//           src={image}
//           alt={name}
//           className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
//         />

//         {/* Sale badge */}
//         {onSale && (
//           <span
//             className="absolute top-3 left-3 bg-[#c4704a] text-[#fdfcf8] text-[10px] font-medium tracking-[0.12em] uppercase px-2.5 py-1 rounded-sm"
//             style={sans}
//           >
//             Sale
//           </span>
//         )}

//         {/* Wishlist button — appears on hover */}
//         <button
//           onClick={(e) => e.stopPropagation()}
//           className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-[#fdfcf8]/80 backdrop-blur-sm border border-[#2d4a2d]/10 text-[#2c2c2c] opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300 hover:bg-[#fdfcf8] hover:text-[#c4704a]"
//         >
//           <Heart size={13} />
//         </button>
//       </div>

//       {/* ── Info ── */}
//       <div className="flex flex-col gap-2 pt-4 pb-1">

//         {/* Subtitle */}
//         {subtitle && (
//           <p
//             className="text-[10.5px] tracking-[0.15em] uppercase text-[#7a9e7e] m-0"
//             style={sans}
//           >
//             {subtitle}
//           </p>
//         )}

//         {/* Name */}
//         <h3
//           className="text-[20px] font-light text-[#1a3320] m-0 leading-snug group-hover:text-[#2d4a2d] transition-colors duration-200"
//           style={serif}
//         >
//           {name}
//         </h3>

//         {/* Stars + reviews */}
//         <div className="flex items-center gap-2">
//           <div className="flex items-center gap-0.5">
//             {[...Array(5)].map((_, i) => (
//               <Star
//                 key={i}
//                 size={11}
//                 className={i < rating ? "text-[#c4704a] fill-[#c4704a]" : "text-[#2d4a2d]/20"}
//               />
//             ))}
//           </div>
//           {reviews && (
//             <span
//               className="text-[11px] text-[#8c8880] font-light"
//               style={sans}
//             >
//               ({reviews})
//             </span>
//           )}
//         </div>

//         {/* Price */}
//         <div className="flex items-baseline gap-2.5 mt-1">
//           <span
//             className="text-[16px] font-medium text-[#1a3320]"
//             style={sans}
//           >
//             Rs. {price}
//           </span>
//           {oldPrice && (
//             <span
//               className="text-[13px] text-[#8c8880] line-through font-light"
//               style={sans}
//             >
//               Rs. {oldPrice}
//             </span>
//           )}
//         </div>

//       </div>

//       {/* ── Hover underline bar ── */}
//       <div className="h-px bg-[#2d4a2d] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left mt-2" />
//     </div>
//   );
// };

// export default PlantCard;


import { useEffect, useState } from "react";
import { Star, Heart } from "lucide-react";
import { getReviewsByProduct } from "../../services/publicAPI"; // adjust path if needed

const serif = { fontFamily: "'Cormorant Garamond', serif" };
const sans = { fontFamily: "'DM Sans', sans-serif" };

const PlantCard = ({
  productId,
  name,
  image,
  price,
  oldPrice,
  onSale,
  subtitle,
  onClick,
}) => {
  const [ratingData, setRatingData] = useState({
    averageRating: 0,
    reviewCount: 0,
  });

  useEffect(() => {
    let isMounted = true;

    const fetchReviews = async () => {
      try {
        if (!productId) return;

        const data = await getReviewsByProduct(productId);

        if (isMounted) {
          setRatingData({
            averageRating: data.averageRating || 0,
            reviewCount: data.reviewCount || 0,
          });
        }
      } catch (err) {
        console.error("Failed to load reviews:", err);
      }
    };

    fetchReviews();

    return () => {
      isMounted = false;
    };
  }, [productId]);

  const roundedRating = Math.round(ratingData.averageRating);

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer flex flex-col bg-[#fdfcf8]"
    >
      {/* ── Image ── */}
      <div className="relative overflow-hidden bg-[#f7f4ee] aspect-[3/4]">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Sale badge */}
        {onSale && (
          <span
            className="absolute top-3 left-3 bg-[#c4704a] text-[#fdfcf8] text-[10px] font-medium tracking-[0.12em] uppercase px-2.5 py-1 rounded-sm"
            style={sans}
          >
            Sale
          </span>
        )}

        {/* Wishlist button */}
        <button
          onClick={(e) => e.stopPropagation()}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-[#fdfcf8]/80 backdrop-blur-sm border border-[#2d4a2d]/10 text-[#2c2c2c] opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300 hover:bg-[#fdfcf8] hover:text-[#c4704a]"
        >
          <Heart size={13} />
        </button>
      </div>

      {/* ── Info ── */}
      <div className="flex flex-col gap-2 pt-4 pb-1">
        {/* Subtitle */}
        {subtitle && (
          <p
            className="text-[10.5px] tracking-[0.15em] uppercase text-[#7a9e7e] m-0"
            style={sans}
          >
            {subtitle}
          </p>
        )}

        {/* Name */}
        <h3
          className="text-[20px] font-light text-[#1a3320] m-0 leading-snug group-hover:text-[#2d4a2d] transition-colors duration-200"
          style={serif}
        >
          {name}
        </h3>

        {/* Stars + reviews */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={11}
                className={
                  i < roundedRating
                    ? "text-[#c4704a] fill-[#c4704a]"
                    : "text-[#2d4a2d]/20"
                }
              />
            ))}
          </div>

          <span className="text-[11px] text-[#8c8880] font-light" style={sans}>
            ({ratingData.reviewCount})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2.5 mt-1">
          <span
            className="text-[16px] font-medium text-[#1a3320]"
            style={sans}
          >
            Rs. {price}
          </span>

          {oldPrice && (
            <span
              className="text-[13px] text-[#8c8880] line-through font-light"
              style={sans}
            >
              Rs. {oldPrice}
            </span>
          )}
        </div>
      </div>

      {/* ── Hover underline bar ── */}
      <div className="h-px bg-[#2d4a2d] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left mt-2" />
    </div>
  );
};

export default PlantCard;