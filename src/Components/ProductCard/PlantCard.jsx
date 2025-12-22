import React from "react";
import { Star } from "lucide-react";
import "./PlantCard.css";

const PlantCard = ({
  name,
  image,
  reviews,
  price,
  oldPrice,
  onSale,
  subtitle,
  rating = 5
}) => {
  return (
    <div className="plant-card">
      <div className="image-wrapper">
        {onSale && <span className="sale-badge">On Sale</span>}
        <img src={image} alt={name} />
      </div>

      <div className="plant-info">
        <h3 className="plant-name">{name}</h3>
        <p className="subtitle">{subtitle}</p>

        <div className="rating">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={16}
              className={i < rating ? "star filled" : "star"}
            />
          ))}
          <span>{reviews} reviews</span>
        </div>

        <div className="price">
          <span className="current">Rs{price}</span>
          {oldPrice && <span className="old">Rs{oldPrice}</span>}
        </div>
      </div>
    </div>
  );
};

export default PlantCard;
