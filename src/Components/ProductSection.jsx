/// file location: Final_Year_Project/src/Components/ProductSection.jsx
import React, { useEffect, useState } from "react";
import PlantCard from "./ProductCard/PlantCard";
import { getProducts } from "../services/productAPI";
import { Link } from "react-router-dom";

const ProductSection = ({ title, filterKey }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts().then((data) => {
      if (filterKey) {
        setProducts(data.filter((p) => p[filterKey]));
      } else {
        setProducts(data);
      }
    });
  }, [filterKey]);

  return (
    <section className="my-8 px-[55px]">
      <h2 className="text-3xl font-bold mb-6">{title}</h2>

      {/* ONLY SHOW FIRST 4 PRODUCTS */}
      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          md:grid-cols-2
          lg:grid-cols-2
          xl:grid-cols-4
          gap-10
        "
      >
        {products.slice(0, 4).map((product) => (
          <Link key={product._id} to={`/product/${product._id}`}>
            <PlantCard {...product} />
          </Link>
        ))}
      </div>
    </section>
  );
};

export default ProductSection;
