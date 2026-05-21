import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById } from "../services/publicAPI";
import Header from "../Components/Header/Header";
import Footer from "../Components/Header/Footer";
import ProductSection from "../Components/ProductSection";
import Breadcrumb from "../Components/ProductDetailPageComponent/Breadcrumb";
import ImageGallery from "../Components/ProductDetailPageComponent/ImageGallery";
import ProductHeader from "../Components/ProductDetailPageComponent/ProductHeader";
import CareDashboard from "../Components/ProductDetailPageComponent/CareDashboard";
import VariantSelector from "../Components/ProductDetailPageComponent/VariantSelector";
import QuantityStepper from "../Components/ProductDetailPageComponent/QuantityStepper";
import PurchaseActions from "../Components/ProductDetailPageComponent/PurchaseActions";
import Accordion from "../Components/ProductDetailPageComponent/Accordion";
import ProductReviews from "../Components/ProductDetailPageComponent/ProductReviews";

const serif = { fontFamily: "'Cormorant Garamond', serif" };
const sans  = { fontFamily: "'DM Sans', sans-serif" };

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

  const [product, setProduct]           = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity]         = useState(1);
  const [selectedPot, setSelectedPot]   = useState("nursery");
  const [wishlist, setWishlist]         = useState([]);

  useEffect(() => {
    getProductById(id)
      .then((data) => {
        setProduct(data);
        setSelectedImage(data.image1 || data.image2 || data.image3 || "");
        setQuantity(data.stock > 0 ? 1 : 0);
      })
      .catch(console.error);

    getUserWishlist().then(setWishlist);
  }, [id]);

  /* ── Loading state ── */
  if (!product) {
    return (
      <>
        <Header />
        <div className="flex items-center justify-center min-h-[60vh] bg-[#fdfcf8]">
          <div className="flex flex-col items-center gap-4">
            <span
              className="text-3xl text-[#7a9e7e] animate-spin"
              style={{ animationDuration: "3s" }}
            >
              ✦
            </span>
            <p
              className="text-[13px] tracking-[0.2em] uppercase text-[#8c8880]"
              style={sans}
            >
              Loading…
            </p>
          </div>
        </div>
      </>
    );
  }

  const potPrice   = selectedPot === "ceramic" ? 250 : 0;
  const unitPrice  = product.price + potPrice;
  const totalPrice = unitPrice * quantity;

  const isLowStock   = product.stock > 0 && product.stock < 5;
  const isOutOfStock = product.stock === 0;

  /* ── Add to cart ── */
  const handleAddToCart = async () => {
    if (isOutOfStock) return;
    if (quantity > product.stock) {
      alert(`Only ${product.stock} items available in stock.`);
      return;
    }
    const token = localStorage.getItem("token");
    if (!token) { alert("Please login first"); return; }
    try {
      const res = await fetch("http://localhost:5000/api/user/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: product._id, quantity, price: unitPrice }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      window.dispatchEvent(new Event("cartUpdated"));
      navigate("/checkout");
    } catch (err) {
      console.error("Add to cart error:", err);
      alert("Failed to add item to cart");
    }
  };

  /* ── Wishlist ── */
  const handleToggleWishlist = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("Login first!");
      const res = await fetch(`http://localhost:5000/api/user/wishlist/${productId}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      const data = await res.json();
      setWishlist(data.wishlist);
    } catch (err) { console.error("Wishlist error:", err); }
  };

  /* ── Quantity limit ── */
  const handleQuantityChange = (newQty) => {
    if (newQty > product.stock) setQuantity(product.stock);
    else if (newQty < 1)        setQuantity(1);
    else                        setQuantity(newQty);
  };

  return (
    <div className="bg-[#fdfcf8] min-h-screen">
      <Header />

      <main className="w-full max-w-[1440px] mx-auto px-6 lg:px-14 py-10 lg:py-16">

        {/* ── Breadcrumb ── */}
        <div className="mb-8">
          <Breadcrumb category={product.category} productName={product.name} />
        </div>

        {/* ── Main product grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">

          {/* Gallery */}
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

          {/* Details */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28 flex flex-col gap-7">

              {/* Product header */}
              <ProductHeader
                name={product.name}
                price={product.price}
                oldPrice={product.oldPrice}
                totalPrice={totalPrice}
                stock={product.stock}
              />

              {/* Divider */}
              <div className="h-px bg-[#2d4a2d]/10" />

              {/* Description */}
              <p
                className="text-[14px] leading-relaxed text-[#8c8880] font-light"
                style={sans}
              >
                {product.description || "No description available."}
              </p>

              {/* Care dashboard */}
              <CareDashboard care={product.care} />

              {/* Divider */}
              <div className="h-px bg-[#2d4a2d]/10" />

              {/* Variant selector */}
              {/* <VariantSelector
                selectedPot={selectedPot}
                setSelectedPot={setSelectedPot}
                potOptions={product.potOptions}
              /> */}

              {/* Quantity + actions */}
              <div className="flex flex-col gap-3">
                <label
                  className="text-[11px] tracking-[0.12em] uppercase text-[#8c8880]"
                  style={sans}
                >
                  Quantity
                </label>

                <div className="flex gap-3 items-center">
                  <QuantityStepper
                    quantity={quantity}
                    setQuantity={handleQuantityChange}
                  />

                  <PurchaseActions
                    product={product}
                    wishlist={wishlist}
                    totalPrice={totalPrice}
                    onAddToCart={handleAddToCart}
                    onToggleWishlist={handleToggleWishlist}
                    disabled={isOutOfStock}
                  />
                </div>

                {/* Stock notices */}
                {isLowStock && (
                  <div className="flex items-center gap-2 mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#c4704a] animate-pulse flex-shrink-0" />
                    <p
                      className="text-[12px] text-[#c4704a] font-medium tracking-[0.04em]"
                      style={sans}
                    >
                      Only {product.stock} left — order soon
                    </p>
                  </div>
                )}

                {isOutOfStock && (
                  <div className="flex items-center gap-2 mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8c8880] flex-shrink-0" />
                    <p
                      className="text-[12px] text-[#8c8880] font-medium tracking-[0.04em]"
                      style={sans}
                    >
                      Currently out of stock
                    </p>
                  </div>
                )}
              </div>

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-3 py-5 border-y border-[#2d4a2d]/10">
                {[
                  { icon: "🚚", label: "Free delivery", sub: "over Rs. 2,500" },
                  { icon: "🌿", label: "Ethically grown", sub: "100% natural" },
                  { icon: "💧", label: "Care guide", sub: "included" },
                ].map(({ icon, label, sub }) => (
                  <div key={label} className="flex flex-col items-center text-center gap-1">
                    <span className="text-lg">{icon}</span>
                    <p className="text-[11px] font-medium text-[#1a3320] m-0" style={sans}>{label}</p>
                    <p className="text-[10px] text-[#8c8880] m-0 font-light" style={sans}>{sub}</p>
                  </div>
                ))}
              </div>

              {/* Accordion */}
              <Accordion
                sections={[
                  {
                    id: "care",
                    title: "Plant Care Tips",
                    content: product.care?.tips || [
                      "Water every 1–2 weeks",
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

      {/* ── Divider before related ── */}
      <div className="max-w-[1440px] mx-auto px-14">
        <div className="h-px bg-[#2d4a2d]/10" />
      </div>

      {/* ── Related products ── */}
      <ProductSection title="You May Also Enjoy" filterKey="trending" />

      {/* ── Reviews ── */}
      <div className="bg-[#f7f4ee]">
        <div className="max-w-[1440px] mx-auto">
          <ProductReviews productId={product._id} />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductPage;