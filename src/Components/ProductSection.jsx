// import { useEffect, useState } from "react";
// import PlantCard from "./ProductCard/PlantCard";
// import { getProducts, getRecommendations } from "../services/publicAPI";
// import { Link } from "react-router-dom";
// import { ArrowRight } from "lucide-react";

// const serif = { fontFamily: "'Cormorant Garamond', serif" };
// const sans  = { fontFamily: "'DM Sans', sans-serif" };

// const ProductSection = ({ title, filterKey, type }) => {
//   const [products, setProducts] = useState([]);
//   const [visible, setVisible]   = useState(false);

// useEffect(() => {
//   const token = localStorage.getItem("token");

//   console.log("Section:", title);
//   console.log("Type:", type);
//   console.log("Token:", token);

//   // =============================
//   // FOR YOU (RECOMMENDATIONS)
//   // =============================
//   if (type === "recommendation" && token) {
//     try {
//       const payload = JSON.parse(atob(token.split(".")[1]));
//       const userId = payload._id;

//       console.log("✅ Using recommendations API");
//       console.log("UserId:", userId);

//       getRecommendations(userId).then((data) => {
//         console.log("Recommended:", data);
//         setProducts(data);
//         setTimeout(() => setVisible(true), 80);
//       });

//       return;

//     } catch (err) {
//       console.log("Token decode failed → fallback");
//     }
//   }

//   // =============================
//   // DEFAULT PRODUCTS
//   // =============================
//   console.log("Using default products");

//   getProducts().then((data) => {
//     const filtered = filterKey
//       ? data.filter((p) => p[filterKey])
//       : data;

//     console.log("Filtered:", filtered);

//     setProducts(filtered);
//     setTimeout(() => setVisible(true), 80);
//   });

// }, [filterKey, type, title]);

//   return (
//     <section className="px-14 py-20 border-b border-[#2d4a2d]/10 last:border-b-0 max-lg:px-10 max-md:px-5 max-md:py-12">

//       <div className="flex items-end justify-between mb-12">
//         <div className="flex flex-col gap-1.5">
//           <span className="text-[11px] tracking-[0.2em] uppercase text-[#7a9e7e]" style={sans}>
//             — Collection
//           </span>
//           <h2
//             className="text-[40px] font-light text-[#1a3320] m-0 leading-tight max-md:text-3xl"
//             style={{ ...serif, letterSpacing: "-0.01em" }}
//           >
//             {title}
//           </h2>
//         </div>

//         <Link
//           to="/pots"
//           className="inline-flex items-center gap-1.5 text-[11px] font-medium tracking-[0.1em] uppercase text-[#2d4a2d] no-underline border-b border-[#2d4a2d] pb-0.5 hover:opacity-60 transition-all duration-200 hover:gap-2.5 whitespace-nowrap"
//           style={sans}
//         >
//           View all <ArrowRight size={13} />
//         </Link>
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-7">
//         {products.slice(0, 4).map((product, i) => (
//           <Link
//             key={product._id}
//             to={`/product/${product._id}`}
//             className="block no-underline"
//             style={{
//               opacity: visible ? 1 : 0,
//               transform: visible ? "translateY(0)" : "translateY(16px)",
//               transition: `opacity 0.5s ease ${i * 0.1}s, transform 0.5s ease ${i * 0.1}s`,
//             }}
//           >
//             <PlantCard
//               {...product}
//               image={product.image1 || "/fallback-image.png"}
//             />
//           </Link>
//         ))}
//       </div>
//     </section>
//   );
// };

// export default ProductSection;

import { useEffect, useState } from "react";
import PlantCard from "./ProductCard/PlantCard";
import { getProducts, getRecommendations } from "../services/publicAPI";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const serif = { fontFamily: "'Cormorant Garamond', serif" };
const sans = { fontFamily: "'DM Sans', sans-serif" };

const ProductSection = ({ title, filterKey, type }) => {
  const [products, setProducts] = useState([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    console.log("Section:", title);
    console.log("Type:", type);
    console.log("Token:", token);

    // =============================
    // FOR YOU (RECOMMENDATIONS)
    // =============================
    if (type === "recommendation" && token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const userId = payload._id;

        console.log("✅ Using recommendations API");
        console.log("UserId:", userId);

        getRecommendations(userId).then((data) => {
          console.log("Recommended:", data);
          setProducts(data);
          setTimeout(() => setVisible(true), 80);
        });

        return;
      } catch (err) {
        console.log("Token decode failed → fallback");
      }
    }

    // =============================
    // DEFAULT PRODUCTS
    // =============================
    console.log("Using default products");

    getProducts().then((data) => {
      const filtered = filterKey ? data.filter((p) => p[filterKey]) : data;

      console.log("Filtered:", filtered);

      setProducts(filtered);
      setTimeout(() => setVisible(true), 80);
    });
  }, [filterKey, type, title]);

  return (
    <section className="px-14 py-20 border-b border-[#2d4a2d]/10 last:border-b-0 max-lg:px-10 max-md:px-5 max-md:py-12">
      <div className="flex items-end justify-between mb-12">
        <div className="flex flex-col gap-1.5">
          <span
            className="text-[11px] tracking-[0.2em] uppercase text-[#7a9e7e]"
            style={sans}
          >
            — Collection
          </span>
          <h2
            className="text-[40px] font-light text-[#1a3320] m-0 leading-tight max-md:text-3xl"
            style={{ ...serif, letterSpacing: "-0.01em" }}
          >
            {title}
          </h2>
        </div>

        <Link
          to="/pots"
          className="inline-flex items-center gap-1.5 text-[11px] font-medium tracking-[0.1em] uppercase text-[#2d4a2d] no-underline border-b border-[#2d4a2d] pb-0.5 hover:opacity-60 transition-all duration-200 hover:gap-2.5 whitespace-nowrap"
          style={sans}
        >
          View all <ArrowRight size={13} />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-7">
        {products.slice(0, 4).map((product, i) => (
          <Link
            key={product._id}
            to={`/product/${product._id}`}
            className="block no-underline"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(16px)",
              transition: `opacity 0.5s ease ${i * 0.1}s, transform 0.5s ease ${i * 0.1}s`,
            }}
          >
            <PlantCard
              productId={product._id}
              name={product.name}
              image={product.image1 || "/fallback-image.png"}
              price={product.price}
              oldPrice={product.oldPrice}
              subtitle={product.subtitle}
              onSale={product.onSale}
            />
          </Link>
        ))}
      </div>
    </section>
  );
};

export default ProductSection;