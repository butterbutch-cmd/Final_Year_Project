// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { getProductById } from "../services/publicAPI";
// import Header from "../Components/Header/Header";
// import ProductSection from "../Components/ProductSection";
// import Breadcrumb from "../Components/ProductDetailPageComponent/Breadcrumb";
// import ImageGallery from "../Components/ProductDetailPageComponent/ImageGallery";
// import ProductHeader from "../Components/ProductDetailPageComponent/ProductHeader";
// import CareDashboard from "../Components/ProductDetailPageComponent/CareDashboard";
// import VariantSelector from "../Components/ProductDetailPageComponent/VariantSelector";
// import QuantityStepper from "../Components/ProductDetailPageComponent/QuantityStepper";
// import PurchaseActions from "../Components/ProductDetailPageComponent/PurchaseActions";
// import Accordion from "../Components/ProductDetailPageComponent/Accordion";

// const getUserWishlist = async () => {
//   const token = localStorage.getItem("token");
//   if (!token) return [];
//   const res = await fetch("http://localhost:5000/api/user/wishlist", {
//     headers: { Authorization: `Bearer ${token}` },
//   });
//   if (!res.ok) return [];
//   const data = await res.json();
//   return data.wishlist || [];
// };

// const ProductPage = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [product, setProduct] = useState(null);
//   const [selectedImage, setSelectedImage] = useState("");
//   const [quantity, setQuantity] = useState(1);
//   const [selectedPot, setSelectedPot] = useState("nursery");
//   const [wishlist, setWishlist] = useState([]);

//   useEffect(() => {
//     getProductById(id)
//       .then((data) => {
//         setProduct(data);
//         setSelectedImage(data.image1 || data.image2 || data.image3 || "");
//       })
//       .catch(console.error);

//     getUserWishlist().then(setWishlist);
//   }, [id]);

//   if (!product) {
//     return (
//       <>
//         <Header />
//         <div className="flex items-center justify-center min-h-screen">
//           <div className="text-lg text-gray-600">Loading...</div>
//         </div>
//       </>
//     );
//   }

//   const potPrice = selectedPot === "ceramic" ? 250 : 0;
//   const unitPrice = product.price + potPrice;
//   const totalPrice = unitPrice * quantity;

//   /* ================= ADD TO CART ================= */
//   const handleAddToCart = async () => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       alert("Please login first");
//       return;
//     }

//     try {
//       const res = await fetch("http://localhost:5000/api/user/cart", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           productId: product._id,
//           quantity,
//           price: unitPrice, // snapshot unit price
//         }),
//       });

//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message);

//       navigate("/checkout");
//     } catch (err) {
//       console.error("Add to cart error:", err);
//       alert("Failed to add item to cart");
//     }
//   };

//   /* ================= WISHLIST ================= */
//   const handleToggleWishlist = async (productId) => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) return alert("Login first!");

//       const res = await fetch(
//         `http://localhost:5000/api/user/wishlist/${productId}`,
//         {
//           method: "PATCH",
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       const data = await res.json();
//       setWishlist(data.wishlist);
//     } catch (err) {
//       console.error("Wishlist error:", err);
//     }
//   };

//   return (
//     <>
//       <Header />

//       <main className="flex-grow w-full max-w-[1440px] mx-auto px-[15px] py-8 lg:py-16">
//         <Breadcrumb category={product.category} productName={product.name} />

//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 mt-6">
//           <div className="lg:col-span-7">
//             <ImageGallery
//               image1={product.image1 || ""}
//               image2={product.image2 || ""}
//               image3={product.image3 || ""}
//               selectedImage={selectedImage}
//               setSelectedImage={setSelectedImage}
//               bestseller={product.bestseller}
//               alt={product.name}
//             />
//           </div>

//           <div className="lg:col-span-5">
//             <div className="lg:sticky lg:top-28 flex flex-col gap-8">
//               <ProductHeader
//                 name={product.name}
//                 price={product.price}
//                 oldPrice={product.oldPrice}
//                 totalPrice={totalPrice}
//                 stock={product.stock}
//               />

//               <p className="text-base text-gray-600">
//                 {product.description || "No description available."}
//               </p>

//               <CareDashboard care={product.care} />

//               <VariantSelector
//                 selectedPot={selectedPot}
//                 setSelectedPot={setSelectedPot}
//                 potOptions={product.potOptions}
//               />

//               <div className="flex gap-4 items-center">
//                 <QuantityStepper
//                   quantity={quantity}
//                   setQuantity={setQuantity}
//                 />

//                 <PurchaseActions
//                   product={product}
//                   wishlist={wishlist}
//                   totalPrice={totalPrice}
//                   onAddToCart={handleAddToCart}
//                   onToggleWishlist={handleToggleWishlist}
//                 />
//               </div>

//               <Accordion
//                 sections={[
//                   {
//                     id: "care",
//                     title: "Plant Care Tips",
//                     content:
//                       product.care?.tips || [
//                         "Water every 1-2 weeks",
//                         "Bright indirect light",
//                         "Mist occasionally",
//                       ],
//                   },
//                   {
//                     id: "shipping",
//                     title: "Shipping & Returns",
//                     content:
//                       product.policies?.shipping ||
//                       "Free replacement within 30 days if damaged.",
//                   },
//                 ]}
//               />
//             </div>
//           </div>
//         </div>
//       </main>

//       <ProductSection title="Customer Also Enjoy" filterKey="trending" />
//     </>
//   );
// };

// export default ProductPage;



import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById } from "../services/publicAPI";
import Header from "../Components/Header/Header";
import ProductSection from "../Components/ProductSection";
import Breadcrumb from "../Components/ProductDetailPageComponent/Breadcrumb";
import ImageGallery from "../Components/ProductDetailPageComponent/ImageGallery";
import ProductHeader from "../Components/ProductDetailPageComponent/ProductHeader";
import CareDashboard from "../Components/ProductDetailPageComponent/CareDashboard";
import VariantSelector from "../Components/ProductDetailPageComponent/VariantSelector";
import QuantityStepper from "../Components/ProductDetailPageComponent/QuantityStepper";
import PurchaseActions from "../Components/ProductDetailPageComponent/PurchaseActions";
import Accordion from "../Components/ProductDetailPageComponent/Accordion";

const getUserWishlist = async () => {
  const token = localStorage.getItem("token");
  if (!token) return [];
  const res = await fetch("http://localhost:5000/api/user/wishlist", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.wishlist || [];
};

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedPot, setSelectedPot] = useState("nursery");
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    getProductById(id)
      .then((data) => {
        setProduct(data);
        setSelectedImage(data.image1 || data.image2 || data.image3 || "");
        // Ensure quantity never exceeds stock on load
        setQuantity(data.stock > 0 ? 1 : 0);
      })
      .catch(console.error);

    getUserWishlist().then(setWishlist);
  }, [id]);

  if (!product) {
    return (
      <>
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-lg text-gray-600">Loading...</div>
        </div>
      </>
    );
  }

  const potPrice = selectedPot === "ceramic" ? 250 : 0;
  const unitPrice = product.price + potPrice;
  const totalPrice = unitPrice * quantity;

  /* ================= LOW STOCK / OUT OF STOCK ================= */
  const isLowStock = product.stock > 0 && product.stock < 5;
  const isOutOfStock = product.stock === 0;

  /* ================= ADD TO CART ================= */
  const handleAddToCart = async () => {
    if (isOutOfStock) return; // prevent adding if out of stock
    if (quantity > product.stock) {
      alert(`Only ${product.stock} items available in stock.`);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/user/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: product._id,
          quantity,
          price: unitPrice,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      navigate("/checkout");
    } catch (err) {
      console.error("Add to cart error:", err);
      alert("Failed to add item to cart");
    }
  };

  /* ================= WISHLIST ================= */
  const handleToggleWishlist = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("Login first!");

      const res = await fetch(
        `http://localhost:5000/api/user/wishlist/${productId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json();
      setWishlist(data.wishlist);
    } catch (err) {
      console.error("Wishlist error:", err);
    }
  };

  /* ================= QUANTITY LIMIT HANDLER ================= */
  const handleQuantityChange = (newQuantity) => {
    if (newQuantity > product.stock) {
      setQuantity(product.stock); // limit to available stock
    } else if (newQuantity < 1) {
      setQuantity(1); // minimum 1
    } else {
      setQuantity(newQuantity);
    }
  };

  return (
    <>
      <Header />

      <main className="flex-grow w-full max-w-[1440px] mx-auto px-[15px] py-8 lg:py-16">
        <Breadcrumb category={product.category} productName={product.name} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 mt-6">
          <div className="lg:col-span-7">
            <ImageGallery
              image1={product.image1 || ""}
              image2={product.image2 || ""}
              image3={product.image3 || ""}
              selectedImage={selectedImage}
              setSelectedImage={setSelectedImage}
              bestseller={product.bestseller}
              alt={product.name}
            />
          </div>

          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28 flex flex-col gap-8">
              <ProductHeader
                name={product.name}
                price={product.price}
                oldPrice={product.oldPrice}
                totalPrice={totalPrice}
                stock={product.stock}
              />

              <p className="text-base text-gray-600">
                {product.description || "No description available."}
              </p>

              <CareDashboard care={product.care} />

              <VariantSelector
                selectedPot={selectedPot}
                setSelectedPot={setSelectedPot}
                potOptions={product.potOptions}
              />

              {/* ================= QUANTITY & ADD TO CART ================= */}
              <div className="flex flex-col gap-2">
                <div className="flex gap-4 items-center">
                  <QuantityStepper
                    quantity={quantity}
                    setQuantity={handleQuantityChange} // enforce stock limits
                  />

                  <PurchaseActions
                    product={product}
                    wishlist={wishlist}
                    totalPrice={totalPrice}
                    onAddToCart={handleAddToCart}
                    onToggleWishlist={handleToggleWishlist}
                    disabled={isOutOfStock} // disable button if stock = 0
                  />
                </div>

                {/* Low stock warning */}
                {isLowStock && (
                  <p className="text-red-600 font-semibold">
                    Hurry! Only {product.stock} left in stock.
                  </p>
                )}

                {/* Out of stock message */}
                {isOutOfStock && (
                  <p className="text-gray-500 font-semibold">Out of stock</p>
                )}
              </div>

              <Accordion
                sections={[
                  {
                    id: "care",
                    title: "Plant Care Tips",
                    content:
                      product.care?.tips || [
                        "Water every 1-2 weeks",
                        "Bright indirect light",
                        "Mist occasionally",
                      ],
                  },
                  {
                    id: "shipping",
                    title: "Shipping & Returns",
                    content:
                      product.policies?.shipping ||
                      "Free replacement within 30 days if damaged.",
                  },
                ]}
              />
            </div>
          </div>
        </div>
      </main>

      <ProductSection title="Customer Also Enjoy" filterKey="trending" />
    </>
  );
};

export default ProductPage;
