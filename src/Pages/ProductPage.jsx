import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../services/publicAPI";
import Breadcrumb from "../Components/ProductDetailPageComponent/Breadcrumb";
import Header from "../Components/Header/Header";

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");

  useEffect(() => {
    getProductById(id)
      .then((data) => {
        setProduct(data);
        setSelectedImage(data.image);
      })
      .catch((err) => console.error(err));
  }, [id]);

  const thumbnailImages = [
    product?.image,
    "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=400",
    "https://images.unsplash.com/photo-1614594737306-4f1e3e576a66?w=400"
  ];

  if (!product) return <div>Loading...</div>;

  return (
    <>
      <Header />
      <div className="px-[55px] py-4">
        {/* Breadcrumb */}
        <Breadcrumb category={product.category} productName={product.name} />
        
        {/* Product Details */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Image Gallery */}
          <div className="w-full md:w-1/2">
            {/* Main Image */}
            <div className="bg-gray-100 rounded-lg mb-4 overflow-hidden relative">
              {product.bestseller && (
                <span className="absolute top-4 left-4 bg-white text-gray-800 text-xs font-semibold px-3 py-1 rounded">
                  BESTSELLER
                </span>
              )}
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-[500px] object-cover"
              />
            </div>
            
            {/* Thumbnail Images */}
            <div className="grid grid-cols-3 gap-4">
              {thumbnailImages.map((img, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedImage(img)}
                  className={`bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition border-2 ${
                    selectedImage === img ? "border-emerald-500" : "border-transparent"
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} view ${index + 1}`}
                    className="w-full h-[150px] object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            {product.subtitle && (
              <p className="text-gray-500 mb-4">{product.subtitle}</p>
            )}
            <p className="text-2xl font-semibold mb-2">Rs {product.price}</p>
            {product.oldPrice && (
              <p className="text-gray-400 line-through mb-4">
                Rs {product.oldPrice}
              </p>
            )}
            <p className="mb-6 text-gray-700 leading-relaxed">{product.description}</p>
            
            {/* Add to Cart Button */}
            <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg transition font-medium">
              Add to Cart
            </button>
          </div>
        </div>
      </div>    
    </>
  );
};

export default ProductPage;