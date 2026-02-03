// Final_Year_Project/src/Components/ProductDetailPageComponent/ImageGallery.jsx
import React, { useMemo, useEffect } from "react";

export default function ImageGallery({
  image1,
  image2,
  image3,
  selectedImage,
  setSelectedImage,
  bestseller = false,
  alt = ""
}) {
  // Prepare images array with placeholders for missing images
  const validImages = useMemo(() => {
    return [
      image1 || "https://via.placeholder.com/400x500?text=Image+Not+Found",
      image2 || "https://via.placeholder.com/400x500?text=Image+Not+Found",
      image3 || "https://via.placeholder.com/400x500?text=Image+Not+Found"
    ];
  }, [image1, image2, image3]);

  // Hero image: selectedImage if valid, else first image
  const hero = selectedImage && validImages.includes(selectedImage)
    ? selectedImage
    : validImages[0];

  // Ensure selectedImage is set on first render
  useEffect(() => {
    if (!selectedImage) {
      setSelectedImage(hero);
    }
  }, [hero, selectedImage, setSelectedImage]);

  return (
    <div className="flex flex-col gap-4">
      {/* Hero Image */}
      <div className="relative group w-full aspect-[4/5] rounded-2xl overflow-hidden bg-gray-100 shadow-md">
        <img
          alt={alt}
          className="object-cover w-full h-full transition-transform duration-500 ease-out group-hover:scale-105"
          src={hero}
        />
        {bestseller && (
          <div className="absolute top-2 left-2">
            <span className="bg-white/90 backdrop-blur px-2 py-1 text-xs font-bold rounded-full shadow">
              Bestseller
            </span>
          </div>
        )}
      </div>

      {/* Thumbnail Images */}
      <div className="grid grid-cols-3 gap-2">
        {validImages.map((img, i) => (
          <div
            key={i}
            onClick={() => setSelectedImage(img)}
            className={`aspect-square rounded-lg overflow-hidden bg-gray-100 cursor-pointer transition-all ${
              hero === img
                ? "ring-2 ring-emerald-500 opacity-100"
                : "opacity-70 hover:opacity-100"
            }`}
          >
            <img
              className="w-full h-full object-cover"
              src={img}
              alt={`thumb-${i}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
