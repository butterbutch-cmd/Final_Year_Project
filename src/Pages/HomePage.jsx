import Header from "../Components/Header/Header";
import CoverBanner from "../Components/Banner/CoverBanner";
import ProductSection from "../Components/ProductSection";

export default function HomePage() {
  return (
    <>
      <Header />

      <CoverBanner
        title="Bring Nature Home"
        subtitle="Minimal • Fresh • Green"
        height="80vh"
      />

      {/* PRODUCT SECTIONS */}
      <ProductSection title="Trending Plants" filterKey="trending" />
      <ProductSection title="On Sale" filterKey="onSale" />
      <ProductSection title="Top Picks" filterKey="topPick" />
    </>
  );
}
