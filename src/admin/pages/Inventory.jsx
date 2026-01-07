import { useEffect, useMemo, useState } from "react";
import {
  createProduct,
  getProducts,
  deleteProduct,
  updateProduct,
} from "../../services/productAPI";

import StatCard from "../components/StatCard";
import DataTable from "../components/DataTable";

import {
  Package,
  AlertTriangle,
  XCircle,
  Edit2,
  Trash2,
} from "lucide-react";

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    name: "",
    subtitle: "",
    price: "",
    oldPrice: "",
    image: "",
    stock: "",
    tags: [],
    onSale: false,
    trending: false,
    topPick: false,
  });

  const [newTag, setNewTag] = useState("");

  /* ---------- FETCH ---------- */
  const fetchProducts = async () => {
    const data = await getProducts();
    setProducts(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  /* ---------- ALL UNIQUE TAGS ---------- */
  const allTags = useMemo(() => {
    const tagSet = new Set();
    products.forEach((p) => {
      p.tags?.forEach((t) => tagSet.add(t));
    });
    return Array.from(tagSet);
  }, [products]);

  /* ---------- FORM ---------- */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const toggleTag = (tag) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const addNewTag = () => {
    if (!newTag.trim()) return;
    if (!form.tags.includes(newTag.trim())) {
      setForm((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
    }
    setNewTag("");
  };

  const resetForm = () => {
    setForm({
      name: "",
      subtitle: "",
      price: "",
      oldPrice: "",
      image: "",
      stock: "",
      tags: [],
      onSale: false,
      trending: false,
      topPick: false,
    });
    setEditingId(null);
    setNewTag("");
  };

  /* ---------- SAVE ---------- */
  const handleSubmit = async () => {
    const payload = {
      ...form,
      price: Number(form.price),
      oldPrice: form.oldPrice ? Number(form.oldPrice) : null,
      stock: Number(form.stock),
    };

    editingId
      ? await updateProduct(editingId, payload)
      : await createProduct(payload);

    resetForm();
    fetchProducts();
    setShowModal(false);
  };

  /* ---------- EDIT / DELETE ---------- */
  const handleEdit = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name,
      subtitle: product.subtitle || "",
      price: product.price,
      oldPrice: product.oldPrice || "",
      image: product.image,
      stock: product.stock,
      tags: product.tags || [],
      onSale: product.onSale,
      trending: product.trending,
      topPick: product.topPick,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    await deleteProduct(id);
    fetchProducts();
  };

  /* ---------- STATS ---------- */
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

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <StatCard
        pageTitle="Inventory Dashboard"
        pageSubtitle="Manage product listings"
        buttonText="Add Product"
        onButtonClick={() => {
          resetForm();
          setShowModal(true);
        }}
        stats={statsData}
      />

      <DataTable
        title="Product Listings"
        subtitle="Search and filter inventory items"
        columns={["Product", "Tags", "Price", "Stock", "Status"]}
        data={products}
        searchableKeys={["name", "subtitle"]}
        filterKey="tags"
        filterOptions={allTags.map((t) => ({ label: t, value: t }))}
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
                    src={product.image}
                    alt={product.name}
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                  <div>
                    <p className="font-medium">{product.name}</p>
                    {product.subtitle && (
                      <p className="text-xs text-gray-500">
                        {product.subtitle}
                      </p>
                    )}
                  </div>
                </div>
              </td>

              <td className="px-4 py-4 text-sm">
                {product.tags?.join(", ") || "—"}
              </td>

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
        actions={(product) => (
          <div className="flex justify-center gap-2">
            <button
              onClick={() => handleEdit(product)}
              className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              <Edit2 size={16} />
            </button>
            <button
              onClick={() => handleDelete(product._id)}
              className="p-2 bg-gray-100 rounded-lg text-red-500 hover:bg-red-100"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      />

      {/* ---------- MODAL ---------- */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg">
            <h3 className="text-xl font-semibold mb-4">
              {editingId ? "Edit Product" : "Add Product"}
            </h3>

            <div className="space-y-3">
              {["name", "subtitle", "image", "price", "oldPrice", "stock"].map(
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

              {/* TAG SELECT */}
              <div>
                <p className="text-sm font-medium mb-2">Tags</p>
                <div className="flex flex-wrap gap-2 mb-2">
                  {allTags.map((tag) => (
                    <button
                      type="button"
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1 rounded-full text-sm border ${
                        form.tags.includes(tag)
                          ? "bg-emerald-500 text-white border-emerald-500"
                          : "bg-gray-100"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add new tag"
                    className="flex-1 px-3 py-2 border rounded-lg text-sm"
                  />
                  <button
                    type="button"
                    onClick={addNewTag}
                    className="px-4 py-2 bg-emerald-500 text-white rounded-lg"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* SECTIONS */}
              <div className="flex gap-4 pt-2">
                {["onSale", "trending", "topPick"].map((key) => (
                  <label key={key} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      name={key}
                      checked={form[key]}
                      onChange={handleChange}
                    />
                    {key}
                  </label>
                ))}
              </div>

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
