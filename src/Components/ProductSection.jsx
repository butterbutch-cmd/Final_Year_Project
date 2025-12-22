import React, { useEffect, useState } from "react";
import PlantCard from "./ProductCard/PlantCard";
import { getProducts } from "../services/productAPI";
import { Link } from "react-router-dom";

const ProductSection = ({ title, filterKey }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts().then((data) => {
      if (filterKey) {
        setProducts(data.filter(p => p[filterKey]));
      } else {
        setProducts(data);
      }
    });
  }, [filterKey]);

  return (
    <section>
      <h2>{title}</h2>

      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
        {products.map(product => (
          <Link key={product._id} to={`/product/${product._id}`}>
            <PlantCard {...product} />
          </Link>
        ))}
      </div>
    </section>
  );
};

export default ProductSection;
