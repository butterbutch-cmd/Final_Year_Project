import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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

// Optional: fetch user's wishlist from backend
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
      })
      .catch((err) => console.error(err));

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

  // ---------------------------
  // Calculate total price dynamically
  // ---------------------------
  const potPrice = selectedPot === "ceramic" ? 250 : 0;
  const totalPrice = (product.price + potPrice) * quantity;

  // ---------------------------
  // Wishlist toggle handler
  // ---------------------------
  const handleToggleWishlist = async (productId) => {
    if (!productId) return alert("Product ID missing!");

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

      if (!res.ok) throw new Error("Failed to update wishlist");

      const data = await res.json();
      setWishlist(data.wishlist); // update local state
    } catch (err) {
      console.error("Error toggling wishlist:", err);
    }
  };

  return (
    <>
      <Header />
      <main className="flex-grow w-full max-w-[1440px] mx-auto px-[15px] py-8 lg:py-16">
        <div className="mb-6">
          <Breadcrumb category={product.category} productName={product.name} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          <div className="lg:col-span-7 flex flex-col gap-6">
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

          <div className="lg:col-span-5 relative">
            <div className="lg:sticky lg:top-28 flex flex-col gap-8">
              <ProductHeader
                name={product.name}
                price={product.price}
                oldPrice={product.oldPrice}
                totalPrice={totalPrice} // pass total price here if needed
                stock={product.stock}
              />

              <p className="text-base text-gray-600 leading-relaxed">
                {product.description || "No description available."}
              </p>

              <CareDashboard care={product.care} />

              <VariantSelector
                selectedPot={selectedPot}
                setSelectedPot={setSelectedPot}
                potOptions={product.potOptions}
              />

              <div className="flex gap-4 pt-2 items-center">
                <QuantityStepper
                  quantity={quantity}
                  setQuantity={setQuantity}
                />

                {/* Pass totalPrice to PurchaseActions */}
                <PurchaseActions
                  product={product}
                  wishlist={wishlist}
                  totalPrice={totalPrice}
                  onAddToCart={() => {
                    console.log("Add to cart:", { productId: product._id, quantity, selectedPot, totalPrice });
                    alert(`Added ${quantity} item(s) to cart for Rs ${totalPrice} (demo).`);
                  }}
                  onToggleWishlist={handleToggleWishlist}
                />
              </div>

              <Accordion
                sections={[
                  {
                    id: "care",
                    title: "Plant Care Tips",
                    content: product.care?.tips || [
                      "Water every 1-2 weeks, allowing soil to dry between waterings.",
                      "Expect to water more often in brighter light.",
                      "Mist occasionally to increase humidity.",
                    ],
                  },
                  {
                    id: "shipping",
                    title: "Shipping & Returns",
                    content:
                      product.policies?.shipping ||
                      "We ship all plants in custom engineered packaging to ensure they arrive safely. If your plant arrives damaged, we'll replace it free of charge within 30 days.",
                  },
                  {
                    id: "sustainability",
                    title: "Sustainability Promise",
                    content:
                      product.policies?.sustainability ||
                      "Our pots are made from recycled materials and our packaging is plastic-free and biodegradable.",
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
