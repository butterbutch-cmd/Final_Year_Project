///file: Final_Year_Project/src/Components/ProductDetailPageComponent/Breadcrumb.jsx
import { Link } from "react-router-dom";

const Breadcrumb = ({ category, productName }) => {
  if (!category || !productName) return null; // 🛑 Don't render if data isn't ready

  const categorySlug = category.toLowerCase().replace(/\s+/g, "-");

  return (
    <nav className="text-sm text-gray-500 mb-4" aria-label="breadcrumb">
      <ol className="flex gap-1 flex-wrap">
        <li>
          <Link to="/" className="hover:text-emerald-500">
            Home
          </Link>
        </li>

        <li>/</li>

        <li>
          <Link
            to={`/category/${categorySlug}`}
            className="hover:text-emerald-500 capitalize"
          >
            {category}
          </Link>
        </li>

        <li>/</li>

        <li className="text-gray-700 font-medium">
          {productName}
        </li>
      </ol>
    </nav>
  );
};

export default Breadcrumb;
