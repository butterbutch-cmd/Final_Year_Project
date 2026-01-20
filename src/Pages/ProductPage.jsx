import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../services/publicAPI";
import Breadcrumb from "../components/Breadcrumb";
import Header from "../Components/Header/Header";

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    getProductById(id)
      .then((data) => setProduct(data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!product) return <div>Loading...</div>;

  return (
    <>
    <Header></Header>
    <div className="px-6 py-4">
      {/* Breadcrumb */}
      <Breadcrumb category={product.category} productName={product.name} />

      {/* Product Details */}
      <div className="flex flex-col md:flex-row gap-6">
        <img
          src={product.image}
          alt={product.name}
          className="w-full md:w-1/2 rounded-lg object-cover"
        />
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          {product.subtitle && (
            <p className="text-gray-500 mb-4">{product.subtitle}</p>
          )}
          <p className="text-lg font-semibold mb-2">Rs {product.price}</p>
          {product.oldPrice && (
            <p className="text-gray-400 line-through mb-4">
              Rs {product.oldPrice}
            </p>
          )}
          <p className="mb-4">{product.description}</p>
          {/* Add to Cart Button */}
          <button className="bg-emerald-500 text-white px-4 py-2 rounded-lg">
            Add to Cart
          </button>
        </div>
      </div>
    </div>    
    </>
  );
};

export default ProductPage;
