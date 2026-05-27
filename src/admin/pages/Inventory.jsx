// Final_Year_Project/src/Components/Admin/Inventory.jsx
import { useEffect, useState } from "react";
import {
  createProduct,
  getProducts,
  deleteProduct,
  updateProduct,
} from "../../services/productAPI";
import { getMyAdminProfile } from "../../services/adminAPI";
import StatCard from "../components/StatCard";
import DataTable from "../components/DataTable";
import { Package, AlertTriangle, XCircle, Edit2, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

const waterOptions = ["Daily", "Weekly", "Twice a week", "Every 2-3 days"];

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [permissions, setPermissions] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);

const [form, setForm] = useState({
  name: "",
  subtitle: "",
  description: "",
  price: "",
  oldPrice: "",
  image1: "",
  image2: "",
  image3: "",
  stock: "",
  category: "",
  onSale: false,
  trending: false,
  topPick: false,
  indoor: false,
  outdoor: false,
  newArrival: false,
  care: {
    level: "Easy",
    levelPercent: 33,
    sunlight: "Partial",
    water: "Weekly",
    temp: "18-30°C",
    tips: [],
  },
  potOptions: [],
  policies: { shipping: "", returns: "", sustainability: "" },
});

  const categories = ["Indoor", "Outdoor", "Accessories", "Large Plants"];

  // --------------------- Fetch Admin Permissions ---------------------
  const fetchProfile = async () => {
    try {
      const data = await getMyAdminProfile();
      setPermissions(data.permissions || {});
    } catch (err) {
      console.error("Failed to fetch profile:", err.message);
    }
  };

  // --------------------- Fetch Products ---------------------
  const fetchProducts = async () => {
    if (!permissions.products?.view) return;
    try {
      const data = await getProducts();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch products:", err.message);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [permissions]);

  // --------------------- Form Handlers ---------------------
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.includes(".")) {
      const [parent, key] = name.split(".");
      setForm((prev) => ({
        ...prev,
        [parent]: { ...prev[parent], [key]: value },
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const selectCategory = (cat) => {
    setForm((prev) => ({ ...prev, category: cat }));
  };

  const resetForm = () => {
    setForm({
      name: "",
      subtitle: "",
      description: "",
      price: "",
      oldPrice: "",
      image1: "",
      image2: "",
      image3: "",
      stock: "",
      category: "",
      onSale: false,
      trending: false,
      topPick: false,
      indoor: false,
      outdoor: false,
      care: {
        level: "Easy",
        levelPercent: 33,
        sunlight: "Partial",
        water: "Weekly",
        temp: "18-30°C",
        tips: [],
      },
      potOptions: [],
      policies: { shipping: "", returns: "", sustainability: "" },
    });
    setEditingId(null);
  };

  // --------------------- Submit Form ---------------------
  const handleSubmit = async () => {
    if (!permissions.products?.create && !editingId) return;
    if (!permissions.products?.edit && editingId) return;

    if (!form.category) {
      toast.error("Please select a category!");
      return;
    }

    const payload = {
      ...form,
      price: Number(form.price),
      oldPrice: form.oldPrice ? Number(form.oldPrice) : null,
      stock: Number(form.stock),
    };

    try {
      editingId
        ? await updateProduct(editingId, payload)
        : await createProduct(payload);
      resetForm();
      fetchProducts();
      setShowModal(false);
    } catch (err) {
      toast.error("Failed to save product:");
      console.error("Failed to save product:", err.message);
    }
  };

  // --------------------- Edit & Delete ---------------------
  const handleEdit = (product) => {
    if (!permissions.products?.edit) return;

    setEditingId(product._id);
    setForm({
      name: product.name,
      subtitle: product.subtitle || "",
      description: product.description || "",
      price: product.price,
      oldPrice: product.oldPrice || "",
      image1: product.image1 || "",
      image2: product.image2 || "",
      image3: product.image3 || "",
      stock: product.stock,
      category: product.category || "",
      onSale: !!product.onSale,
      trending: !!product.trending,
      topPick: !!product.topPick,
      indoor: !!product.indoor,
      outdoor: !!product.outdoor,
      care: product.care || {
        level: "Easy",
        levelPercent: 33,
        sunlight: "Partial",
        water: "Weekly",
        temp: "18-30°C",
        tips: [],
      },
      potOptions: product.potOptions || [],
      policies:
        product.policies || { shipping: "", returns: "", sustainability: "" },
    });

    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!permissions.products?.delete) return;
    if (!window.confirm("Delete this product?")) return;
    await deleteProduct(id);
    fetchProducts();
  };

  // --------------------- Stats ---------------------
  const statsData = [
    {
      title: "Total Products",
      value: products.length,
      subtitle: "Across all categories",
      Icon: Package,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Low Stock",
      value: products.filter((p) => p.stock < 10 && p.stock > 0).length,
      subtitle: "Items below 10",
      Icon: AlertTriangle,
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
    },
    {
      title: "Out of Stock",
      value: products.filter((p) => p.stock === 0).length,
      subtitle: "Needs restock",
      Icon: XCircle,
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
    },
  ];

  // --------------------- Render ---------------------
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <StatCard
        pageTitle="Inventory Dashboard"
        pageSubtitle="Manage product listings"
        buttonText="Add Product"
        onButtonClick={() => {
          if (!permissions.products?.create) return;
          resetForm();
          setShowModal(true);
        }}
        stats={statsData}
      />

      <DataTable
        title="Product Listings"
        subtitle="Search and filter inventory items"
        columns={["Product", "Category", "Price", "Stock", "Status"]}
        data={products}
        searchableKeys={["name", "subtitle"]}
        renderRow={(product) => {
          let statusLabel = "Active";
          let statusStyle = "bg-green-100 text-green-700";
          if (product.stock === 0) {
            statusLabel = "Out of Stock";
            statusStyle = "bg-red-100 text-red-700";
          } else if (product.stock < 10) {
            statusLabel = "Low Stock";
            statusStyle = "bg-yellow-100 text-yellow-700";
          }

          return (
            <>
              <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                  <img
                    src={product.image1 || "/fallback-image.png"}
                    alt={product.name}
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                  <div>
                    <p className="font-medium">{product.name}</p>
                    {product.subtitle && (
                      <p className="text-xs text-gray-500">{product.subtitle}</p>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-4 py-4 text-sm">{product.category}</td>
              <td className="px-4 py-4 text-sm font-medium">
                Rs {product.price}
              </td>
              <td className="px-4 py-4 text-sm">
                <span
                  className={
                    product.stock === 0
                      ? "text-red-600"
                      : product.stock < 10
                      ? "text-yellow-600"
                      : "text-green-600"
                  }
                >
                  {product.stock}
                </span>
              </td>
              <td className="px-4 py-4 text-sm">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyle}`}
                >
                  {statusLabel}
                </span>
              </td>
            </>
          );
        }}
        actions={(product) =>
          permissions.products?.edit || permissions.products?.delete ? (
            <div className="flex justify-center gap-2">
              {permissions.products?.edit && (
                <button
                  onClick={() => handleEdit(product)}
                  className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  <Edit2 size={16} />
                </button>
              )}
              {permissions.products?.delete && (
                <button
                  onClick={() => handleDelete(product._id)}
                  className="p-2 bg-gray-100 text-red-500 rounded-lg hover:bg-red-100"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ) : null
        }
      />

      {/* --------------------- Modal --------------------- */}
      {showModal && (permissions.products?.create || permissions.products?.edit) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4">
              {editingId ? "Edit Product" : "Add Product"}
            </h3>

            <div className="space-y-3">
              {/* Basic fields */}
              {["name", "subtitle", "description", "price", "oldPrice", "stock"].map(
                (name) => (
                  <input
                    key={name}
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    placeholder={name.toUpperCase()}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                )
              )}

              {/* Images */}
              {["image1", "image2", "image3"].map((key) => (
                <input
                  key={key}
                  name={key}
                  value={form[key]}
                  onChange={handleChange}
                  placeholder={`URL for ${key.toUpperCase()}`}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              ))}

              {/* Category */}
              <div>
                <p className="text-sm font-medium mb-2">Category</p>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      type="button"
                      key={cat}
                      onClick={() => selectCategory(cat)}
                      className={`px-3 py-1 rounded-full text-sm border ${
                        form.category === cat
                          ? "bg-emerald-500 text-white border-emerald-500"
                          : "bg-gray-100"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Checkboxes */}
              <div className="flex flex-wrap gap-4 pt-2">
                {["newArrival", "onSale", "trending", "topPick", "indoor", "outdoor"].map(
                  (key) => (
                    <label key={key} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        name={key}
                        checked={!!form[key]}
                        onChange={handleChange}
                      />
                      {key}
                    </label>
                  )
                )}
              </div>

              {/* Care Section */}
              <div className="pt-2">
                <p className="font-medium text-sm mb-1">Care</p>

                {/* Level */}
                <div className="flex gap-2 mb-2">
                  {["Easy", "Medium", "Hard"].map((level) => {
                    const percent =
                      level === "Easy" ? 33 : level === "Medium" ? 66 : 100;
                    return (
                      <button
                        key={level}
                        type="button"
                        onClick={() =>
                          setForm((prev) => ({
                            ...prev,
                            care: { ...prev.care, level, levelPercent: percent },
                          }))
                        }
                        className={`px-3 py-1 rounded-full text-sm border ${
                          form.care.level === level
                            ? "bg-emerald-500 text-white border-emerald-500"
                            : "bg-gray-100"
                        }`}
                      >
                        {level}
                      </button>
                    );
                  })}
                </div>

                {/* Sunlight */}
                <div className="flex gap-2 mb-2">
                  {["Full", "Indirect", "Shade"].map((sun) => (
                    <button
                      key={sun}
                      type="button"
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          care: { ...prev.care, sunlight: sun },
                        }))
                      }
                      className={`px-3 py-1 rounded-full text-sm border ${
                        form.care.sunlight === sun
                          ? "bg-yellow-400 text-white border-yellow-400"
                          : "bg-gray-100"
                      }`}
                    >
                      {sun}
                    </button>
                  ))}
                </div>

                {/* Water */}
                <div className="flex gap-2 mb-2">
                  {waterOptions.map((water) => (
                    <button
                      key={water}
                      type="button"
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          care: { ...prev.care, water },
                        }))
                      }
                      className={`px-3 py-1 rounded-full text-sm border ${
                        form.care.water === water
                          ? "bg-blue-500 text-white border-blue-500"
                          : "bg-gray-100"
                      }`}
                    >
                      {water}
                    </button>
                  ))}
                </div>

                {/* Temperature */}
                <input
                  type="text"
                  name="care.temp"
                  value={form.care.temp}
                  onChange={handleChange}
                  placeholder="Temperature (e.g. 18-30°C)"
                  className="w-full px-3 py-2 border rounded-lg text-sm mb-1"
                />

                {/* Tips */}
                <div className="pt-2">
                  <p className="font-medium text-sm mb-1">Care Tips</p>
                  {form.care.tips.map((tip, idx) => (
                    <div key={idx} className="flex gap-2 mb-1">
                      <input
                        type="text"
                        value={tip}
                        onChange={(e) => {
                          const newTips = [...form.care.tips];
                          newTips[idx] = e.target.value;
                          setForm((prev) => ({
                            ...prev,
                            care: { ...prev.care, tips: newTips },
                          }));
                        }}
                        placeholder={`Tip #${idx + 1}`}
                        className="flex-1 px-3 py-2 border rounded-lg text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newTips = form.care.tips.filter((_, i) => i !== idx);
                          setForm((prev) => ({
                            ...prev,
                            care: { ...prev.care, tips: newTips },
                          }));
                        }}
                        className="bg-red-500 text-white px-2 rounded-lg"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        care: { ...prev.care, tips: [...prev.care.tips, ""] },
                      }))
                    }
                    className="bg-green-500 text-white px-3 py-1 rounded-lg text-sm"
                  >
                    + Add Tip
                  </button>
                </div>

                {/* Care Level Bar */}
                <div className="w-full bg-gray-100 rounded-full h-2 mt-1 overflow-hidden">
                  <div
                    className="bg-[#54735e] h-full rounded-full"
                    style={{ width: `${form.care.levelPercent}%` }}
                  />
                </div>
              </div>

              {/* Policies */}
              <div className="pt-2">
                <p className="font-medium text-sm mb-1">Policies</p>
                {["shipping", "returns", "sustainability"].map((key) => (
                  <input
                    key={key}
                    type="text"
                    name={`policies.${key}`}
                    value={form.policies[key]}
                    onChange={handleChange}
                    placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                    className="w-full px-3 py-2 border rounded-lg text-sm mb-1"
                  />
                ))}
              </div>

              {/* Modal Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSubmit}
                  className="flex-1 bg-emerald-500 text-white py-2 rounded-lg"
                >
                  {editingId ? "Update" : "Add"}
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-100 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;


