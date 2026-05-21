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
      alert("Please select a category!");
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


// import { useState } from "react";
// import {
//   Package,
//   Image,
//   Tag,
//   Leaf,
//   FileText,
//   X,
//   ChevronRight,
//   ChevronLeft,
//   Check,
//   Plus,
//   Trash2,
//   Droplets,
//   Sun,
//   Thermometer,
//   Sparkles,
// } from "lucide-react";

// const waterOptions = ["Daily", "Weekly", "Twice a week", "Every 2-3 days"];
// const categories = ["Indoor", "Outdoor", "Accessories", "Large Plants"];

// const STEPS = [
//   { id: 0, label: "Basics",    icon: Package  },
//   { id: 1, label: "Media",     icon: Image    },
//   { id: 2, label: "Tags",      icon: Tag      },
//   { id: 3, label: "Care",      icon: Leaf     },
//   { id: 4, label: "Policies",  icon: FileText },
// ];

// const defaultForm = {
//   name: "", subtitle: "", description: "",
//   price: "", oldPrice: "", stock: "", category: "",
//   image1: "", image2: "", image3: "",
//   onSale: false, trending: false, topPick: false,
//   indoor: false, outdoor: false, newArrival: false,
//   care: { level: "Easy", levelPercent: 33, sunlight: "Partial", water: "Weekly", temp: "18-30°C", tips: [] },
//   potOptions: [],
//   policies: { shipping: "", returns: "", sustainability: "" },
// };

// /* ─── tiny helpers ─── */
// const Input = ({ label, ...props }) => (
//   <div className="pf-field">
//     {label && <label className="pf-label">{label}</label>}
//     <input className="pf-input" {...props} />
//   </div>
// );

// const Textarea = ({ label, ...props }) => (
//   <div className="pf-field">
//     {label && <label className="pf-label">{label}</label>}
//     <textarea className="pf-input pf-textarea" {...props} />
//   </div>
// );

// const Chip = ({ active, color = "emerald", onClick, children }) => {
//   const colorMap = {
//     emerald: active ? "pf-chip-emerald-active" : "pf-chip-base",
//     yellow:  active ? "pf-chip-yellow-active"  : "pf-chip-base",
//     blue:    active ? "pf-chip-blue-active"    : "pf-chip-base",
//     gray:    active ? "pf-chip-gray-active"    : "pf-chip-base",
//   };
//   return (
//     <button type="button" onClick={onClick} className={`pf-chip ${colorMap[color]}`}>
//       {children}
//     </button>
//   );
// };

// /* ─── step panels ─── */
// const StepBasics = ({ form, onChange }) => (
//   <div className="pf-step-content">
//     <div className="pf-step-header">
//       <Package size={22} className="pf-step-icon-accent" />
//       <div>
//         <h4 className="pf-step-title">Product Basics</h4>
//         <p className="pf-step-sub">Core information about this listing</p>
//       </div>
//     </div>
//     <div className="pf-grid-2">
//       <Input label="Product Name *" name="name"  value={form.name}  onChange={onChange} placeholder="e.g. Monstera Deliciosa" />
//       <Input label="Subtitle"       name="subtitle" value={form.subtitle} onChange={onChange} placeholder="Short tagline" />
//     </div>
//     <Textarea label="Description" name="description" value={form.description} onChange={onChange} placeholder="Tell customers what makes this product special…" rows={3} />
//     <div className="pf-grid-3">
//       <Input label="Price (Rs) *"    name="price"    value={form.price}    onChange={onChange} placeholder="0"    type="number" />
//       <Input label="Old Price (Rs)"  name="oldPrice" value={form.oldPrice} onChange={onChange} placeholder="0"    type="number" />
//       <Input label="Stock Qty *"     name="stock"    value={form.stock}    onChange={onChange} placeholder="0"    type="number" />
//     </div>

//     <div className="pf-field">
//       <label className="pf-label">Category *</label>
//       <div className="pf-chip-row">
//         {categories.map((c) => (
//           <Chip key={c} active={form.category === c} color="emerald"
//             onClick={() => onChange({ target: { name: "category", value: c } })}>
//             {c}
//           </Chip>
//         ))}
//       </div>
//     </div>
//   </div>
// );

// const StepMedia = ({ form, onChange }) => (
//   <div className="pf-step-content">
//     <div className="pf-step-header">
//       <Image size={22} className="pf-step-icon-accent" />
//       <div>
//         <h4 className="pf-step-title">Product Images</h4>
//         <p className="pf-step-sub">Paste image URLs (CDN or hosted links work best)</p>
//       </div>
//     </div>
//     {["image1", "image2", "image3"].map((key, i) => (
//       <div key={key} className="pf-media-row">
//         <div className="pf-media-preview">
//           {form[key]
//             ? <img src={form[key]} alt={key} className="pf-media-thumb" onError={(e) => (e.target.style.display = "none")} />
//             : <span className="pf-media-placeholder">{i + 1}</span>
//           }
//         </div>
//         <Input label={`Image ${i + 1}${i === 0 ? " (Main) *" : " (optional)"}`}
//           name={key} value={form[key]} onChange={onChange}
//           placeholder={`https://example.com/${key}.jpg`} />
//       </div>
//     ))}
//   </div>
// );

// const StepTags = ({ form, onChange }) => {
//   const flags = ["newArrival", "onSale", "trending", "topPick", "indoor", "outdoor"];
//   const flagLabels = {
//     newArrival: "🆕 New Arrival", onSale: "🏷️ On Sale", trending: "🔥 Trending",
//     topPick: "⭐ Top Pick", indoor: "🏠 Indoor", outdoor: "🌿 Outdoor",
//   };
//   return (
//     <div className="pf-step-content">
//       <div className="pf-step-header">
//         <Tag size={22} className="pf-step-icon-accent" />
//         <div>
//           <h4 className="pf-step-title">Labels & Tags</h4>
//           <p className="pf-step-sub">Control how this product appears in collections</p>
//         </div>
//       </div>
//       <div className="pf-tags-grid">
//         {flags.map((key) => (
//           <label key={key} className={`pf-toggle-card ${form[key] ? "pf-toggle-card-active" : ""}`}>
//             <input type="checkbox" name={key} checked={!!form[key]} onChange={onChange} className="sr-only" />
//             <span className="pf-toggle-label">{flagLabels[key]}</span>
//             <span className={`pf-toggle-dot ${form[key] ? "pf-toggle-dot-on" : ""}`} />
//           </label>
//         ))}
//       </div>
//     </div>
//   );
// };

// const StepCare = ({ form, setForm }) => {
//   const addTip = () => setForm((p) => ({ ...p, care: { ...p.care, tips: [...p.care.tips, ""] } }));
//   const removeTip = (i) => setForm((p) => {
//     const tips = p.care.tips.filter((_, idx) => idx !== i);
//     return { ...p, care: { ...p.care, tips } };
//   });
//   const updateTip = (i, val) => setForm((p) => {
//     const tips = [...p.care.tips]; tips[i] = val;
//     return { ...p, care: { ...p.care, tips } };
//   });
//   const setCare = (key, val) => setForm((p) => ({ ...p, care: { ...p.care, [key]: val } }));

//   const levelColor = { Easy: "#34d399", Medium: "#fbbf24", Hard: "#f87171" };

//   return (
//     <div className="pf-step-content">
//       <div className="pf-step-header">
//         <Leaf size={22} className="pf-step-icon-accent" />
//         <div>
//           <h4 className="pf-step-title">Care Instructions</h4>
//           <p className="pf-step-sub">Help customers keep their plants alive</p>
//         </div>
//       </div>

//       {/* Care Level */}
//       <div className="pf-care-section">
//         <label className="pf-label"><Sparkles size={13} style={{ display: "inline", marginRight: 4 }} />Care Level</label>
//         <div className="pf-chip-row">
//           {["Easy", "Medium", "Hard"].map((lvl) => {
//             const pct = lvl === "Easy" ? 33 : lvl === "Medium" ? 66 : 100;
//             const active = form.care.level === lvl;
//             return (
//               <button key={lvl} type="button"
//                 onClick={() => setForm((p) => ({ ...p, care: { ...p.care, level: lvl, levelPercent: pct } }))}
//                 className={`pf-chip ${active ? "pf-chip-care-active" : "pf-chip-base"}`}
//                 style={active ? { backgroundColor: levelColor[lvl], borderColor: levelColor[lvl], color: "#fff" } : {}}>
//                 {lvl}
//               </button>
//             );
//           })}
//         </div>
//         <div className="pf-care-bar-track">
//           <div className="pf-care-bar-fill"
//             style={{ width: `${form.care.levelPercent}%`, backgroundColor: levelColor[form.care.level] }} />
//         </div>
//       </div>

//       <div className="pf-grid-2">
//         {/* Sunlight */}
//         <div className="pf-care-section">
//           <label className="pf-label"><Sun size={13} style={{ display: "inline", marginRight: 4 }} />Sunlight</label>
//           <div className="pf-chip-row">
//             {["Full", "Indirect", "Shade"].map((s) => (
//               <Chip key={s} active={form.care.sunlight === s} color="yellow" onClick={() => setCare("sunlight", s)}>{s}</Chip>
//             ))}
//           </div>
//         </div>

//         {/* Temperature */}
//         <div className="pf-care-section">
//           <label className="pf-label"><Thermometer size={13} style={{ display: "inline", marginRight: 4 }} />Temperature</label>
//           <input className="pf-input" value={form.care.temp}
//             onChange={(e) => setCare("temp", e.target.value)} placeholder="e.g. 18–30°C" />
//         </div>
//       </div>

//       {/* Water */}
//       <div className="pf-care-section">
//         <label className="pf-label"><Droplets size={13} style={{ display: "inline", marginRight: 4 }} />Watering</label>
//         <div className="pf-chip-row">
//           {waterOptions.map((w) => (
//             <Chip key={w} active={form.care.water === w} color="blue" onClick={() => setCare("water", w)}>{w}</Chip>
//           ))}
//         </div>
//       </div>

//       {/* Care Tips */}
//       <div className="pf-care-section">
//         <label className="pf-label">Care Tips</label>
//         {form.care.tips.map((tip, i) => (
//           <div key={i} className="pf-tip-row">
//             <span className="pf-tip-num">{i + 1}</span>
//             <input className="pf-input pf-tip-input" value={tip}
//               onChange={(e) => updateTip(i, e.target.value)} placeholder={`Tip ${i + 1}…`} />
//             <button type="button" onClick={() => removeTip(i)} className="pf-tip-delete">
//               <Trash2 size={14} />
//             </button>
//           </div>
//         ))}
//         <button type="button" onClick={addTip} className="pf-add-tip-btn">
//           <Plus size={14} /> Add Tip
//         </button>
//       </div>
//     </div>
//   );
// };

// const StepPolicies = ({ form, onChange }) => (
//   <div className="pf-step-content">
//     <div className="pf-step-header">
//       <FileText size={22} className="pf-step-icon-accent" />
//       <div>
//         <h4 className="pf-step-title">Store Policies</h4>
//         <p className="pf-step-sub">Shipping, returns, and sustainability details</p>
//       </div>
//     </div>
//     {[
//       { key: "shipping",       emoji: "🚚", label: "Shipping Policy",       placeholder: "e.g. Free delivery on orders above Rs 2000" },
//       { key: "returns",        emoji: "↩️", label: "Returns Policy",        placeholder: "e.g. 7-day hassle-free returns" },
//       { key: "sustainability", emoji: "♻️", label: "Sustainability Note",   placeholder: "e.g. Eco-friendly packaging used" },
//     ].map(({ key, emoji, label, placeholder }) => (
//       <div key={key} className="pf-policy-card">
//         <span className="pf-policy-emoji">{emoji}</span>
//         <div className="pf-policy-body">
//           <label className="pf-label">{label}</label>
//           <input className="pf-input" name={`policies.${key}`}
//             value={form.policies[key]} onChange={onChange} placeholder={placeholder} />
//         </div>
//       </div>
//     ))}
//   </div>
// );

// /* ─── Main Modal ─── */
// export default function ProductModal({ show, editingId, form, setForm, onSubmit, onClose }) {
//   const [step, setStep] = useState(0);

//   if (!show) return null;

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     if (name.includes(".")) {
//       const [parent, key] = name.split(".");
//       setForm((p) => ({ ...p, [parent]: { ...p[parent], [key]: value } }));
//     } else {
//       setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
//     }
//   };

//   const isLast  = step === STEPS.length - 1;
//   const isFirst = step === 0;

//   const stepPanels = [
//     <StepBasics    form={form} onChange={handleChange} />,
//     <StepMedia     form={form} onChange={handleChange} />,
//     <StepTags      form={form} onChange={handleChange} />,
//     <StepCare      form={form} setForm={setForm} />,
//     <StepPolicies  form={form} onChange={handleChange} />,
//   ];

//   return (
//     <>
//       <style>{`
//         /* ── overlay ── */
//         .pf-overlay {
//           position: fixed; inset: 0; background: rgba(0,0,0,.55);
//           backdrop-filter: blur(4px); display: flex; align-items: center;
//           justify-content: center; z-index: 50; padding: 16px;
//           animation: pf-fade-in .18s ease;
//         }
//         @keyframes pf-fade-in { from { opacity:0 } to { opacity:1 } }

//         /* ── shell ── */
//         .pf-shell {
//           background: #fff; border-radius: 20px; width: 100%; max-width: 780px;
//           max-height: 90vh; display: flex; overflow: hidden;
//           box-shadow: 0 32px 80px rgba(0,0,0,.22);
//           animation: pf-slide-up .22s cubic-bezier(.22,1,.36,1);
//         }
//         @keyframes pf-slide-up { from { transform:translateY(24px); opacity:0 } to { transform:translateY(0); opacity:1 } }

//         /* ── sidebar ── */
//         .pf-sidebar {
//           width: 200px; flex-shrink: 0; background: #f0faf4;
//           padding: 32px 0; display: flex; flex-direction: column;
//           border-right: 1px solid #d1f0de;
//         }
//         .pf-sidebar-title {
//           font-size: 11px; font-weight: 700; letter-spacing: .12em;
//           text-transform: uppercase; color: #6b8f78; padding: 0 20px 20px;
//         }
//         .pf-step-nav {
//           display: flex; flex-direction: column; gap: 2px; flex: 1;
//         }
//         .pf-step-btn {
//           display: flex; align-items: center; gap: 10px;
//           padding: 11px 20px; cursor: pointer; border: none;
//           background: transparent; text-align: left; transition: background .15s;
//           position: relative;
//         }
//         .pf-step-btn:hover { background: #daf2e6; }
//         .pf-step-btn.active { background: #fff; border-right: 3px solid #059669; }
//         .pf-step-btn.done .pf-step-dot { background: #059669; }
//         .pf-step-dot {
//           width: 26px; height: 26px; border-radius: 50%; flex-shrink: 0;
//           background: #c9ead6; display: flex; align-items: center; justify-content: center;
//           transition: background .2s;
//         }
//         .pf-step-btn.active .pf-step-dot { background: #059669; }
//         .pf-step-dot svg { color: #fff; }
//         .pf-step-btn-label { font-size: 13px; font-weight: 500; color: #374151; }
//         .pf-step-btn.active .pf-step-btn-label { color: #059669; font-weight: 600; }

//         /* ── main ── */
//         .pf-main {
//           flex: 1; display: flex; flex-direction: column; overflow: hidden;
//           min-width: 0;
//         }
//         .pf-topbar {
//           display: flex; align-items: center; justify-content: space-between;
//           padding: 20px 28px 16px; border-bottom: 1px solid #f3f4f6;
//         }
//         .pf-modal-title { font-size: 18px; font-weight: 700; color: #111827; font-family: Georgia, serif; }
//         .pf-modal-badge {
//           font-size: 11px; font-weight: 600; letter-spacing: .05em;
//           background: #d1fae5; color: #065f46; padding: 3px 9px;
//           border-radius: 20px; text-transform: uppercase;
//         }
//         .pf-close-btn {
//           background: #f3f4f6; border: none; cursor: pointer; border-radius: 8px;
//           width: 32px; height: 32px; display: flex; align-items: center;
//           justify-content: center; color: #6b7280; transition: background .15s;
//         }
//         .pf-close-btn:hover { background: #fee2e2; color: #ef4444; }

//         .pf-body { flex: 1; overflow-y: auto; padding: 24px 28px; }

//         /* ── step content ── */
//         .pf-step-content { display: flex; flex-direction: column; gap: 16px; }
//         .pf-step-header { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 4px; }
//         .pf-step-icon-accent { color: #059669; margin-top: 2px; flex-shrink: 0; }
//         .pf-step-title { font-size: 15px; font-weight: 700; color: #111827; margin: 0 0 2px; }
//         .pf-step-sub { font-size: 12px; color: #6b7280; margin: 0; }

//         /* ── fields ── */
//         .pf-field { display: flex; flex-direction: column; gap: 5px; }
//         .pf-label { font-size: 11.5px; font-weight: 600; color: #374151; letter-spacing: .03em; text-transform: uppercase; }
//         .pf-input {
//           border: 1.5px solid #e5e7eb; border-radius: 10px; padding: 9px 13px;
//           font-size: 13.5px; color: #111827; outline: none; transition: border .15s, box-shadow .15s;
//           background: #fafafa; width: 100%; box-sizing: border-box;
//           font-family: inherit;
//         }
//         .pf-input:focus { border-color: #059669; box-shadow: 0 0 0 3px rgba(5,150,105,.1); background: #fff; }
//         .pf-textarea { resize: vertical; min-height: 80px; }

//         .pf-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
//         .pf-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }

//         /* ── chips ── */
//         .pf-chip-row { display: flex; flex-wrap: wrap; gap: 6px; }
//         .pf-chip {
//           padding: 5px 14px; border-radius: 20px; font-size: 12.5px;
//           font-weight: 500; cursor: pointer; border: 1.5px solid transparent;
//           transition: all .15s;
//         }
//         .pf-chip-base { background: #f3f4f6; border-color: #e5e7eb; color: #374151; }
//         .pf-chip-base:hover { background: #e5e7eb; }
//         .pf-chip-emerald-active { background: #059669; border-color: #059669; color: #fff; }
//         .pf-chip-yellow-active  { background: #d97706; border-color: #d97706; color: #fff; }
//         .pf-chip-blue-active    { background: #2563eb; border-color: #2563eb; color: #fff; }

//         /* ── media ── */
//         .pf-media-row { display: flex; align-items: flex-end; gap: 12px; }
//         .pf-media-preview {
//           width: 56px; height: 56px; border-radius: 10px; border: 2px dashed #d1d5db;
//           background: #f9fafb; flex-shrink: 0; overflow: hidden;
//           display: flex; align-items: center; justify-content: center;
//         }
//         .pf-media-thumb { width: 100%; height: 100%; object-fit: cover; }
//         .pf-media-placeholder { font-size: 18px; color: #d1d5db; font-weight: 700; }
//         .pf-media-row .pf-field { flex: 1; }

//         /* ── tags/toggles ── */
//         .pf-tags-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
//         .pf-toggle-card {
//           display: flex; align-items: center; justify-content: space-between;
//           padding: 12px 14px; border-radius: 12px; border: 1.5px solid #e5e7eb;
//           background: #fafafa; cursor: pointer; transition: all .15s;
//         }
//         .pf-toggle-card:hover { border-color: #a7f3d0; background: #f0fdf4; }
//         .pf-toggle-card-active { border-color: #059669; background: #f0fdf4; }
//         .pf-toggle-label { font-size: 13px; font-weight: 500; color: #374151; }
//         .pf-toggle-dot {
//           width: 36px; height: 20px; border-radius: 10px; background: #d1d5db;
//           position: relative; transition: background .2s; flex-shrink: 0;
//         }
//         .pf-toggle-dot::after {
//           content: ""; position: absolute; top: 3px; left: 3px;
//           width: 14px; height: 14px; border-radius: 50%; background: #fff;
//           transition: transform .2s; box-shadow: 0 1px 3px rgba(0,0,0,.2);
//         }
//         .pf-toggle-dot-on { background: #059669; }
//         .pf-toggle-dot-on::after { transform: translateX(16px); }

//         /* ── care ── */
//         .pf-care-section { display: flex; flex-direction: column; gap: 7px; }
//         .pf-care-bar-track {
//           height: 6px; background: #e5e7eb; border-radius: 99px; overflow: hidden; margin-top: 2px;
//         }
//         .pf-care-bar-fill { height: 100%; border-radius: 99px; transition: width .3s, background-color .3s; }

//         .pf-tip-row { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
//         .pf-tip-num {
//           width: 24px; height: 24px; border-radius: 50%; background: #d1fae5;
//           color: #065f46; font-size: 11px; font-weight: 700; display: flex;
//           align-items: center; justify-content: center; flex-shrink: 0;
//         }
//         .pf-tip-input { flex: 1; }
//         .pf-tip-delete {
//           background: #fee2e2; border: none; color: #ef4444; cursor: pointer;
//           border-radius: 8px; width: 30px; height: 30px; display: flex;
//           align-items: center; justify-content: center; flex-shrink: 0; transition: background .15s;
//         }
//         .pf-tip-delete:hover { background: #fecaca; }
//         .pf-add-tip-btn {
//           display: inline-flex; align-items: center; gap: 5px;
//           font-size: 12.5px; font-weight: 600; color: #059669; background: #d1fae5;
//           border: none; cursor: pointer; padding: 6px 14px; border-radius: 8px;
//           transition: background .15s;
//         }
//         .pf-add-tip-btn:hover { background: #a7f3d0; }

//         /* ── policies ── */
//         .pf-policy-card {
//           display: flex; gap: 12px; align-items: flex-start;
//           background: #fafafa; border: 1.5px solid #e5e7eb;
//           border-radius: 12px; padding: 14px;
//         }
//         .pf-policy-emoji { font-size: 22px; margin-top: 2px; }
//         .pf-policy-body { flex: 1; display: flex; flex-direction: column; gap: 5px; }

//         /* ── footer ── */
//         .pf-footer {
//           display: flex; align-items: center; justify-content: space-between;
//           padding: 16px 28px; border-top: 1px solid #f3f4f6; background: #fff;
//         }
//         .pf-progress { display: flex; gap: 5px; }
//         .pf-progress-dot {
//           width: 6px; height: 6px; border-radius: 50%; background: #d1d5db; transition: background .2s;
//         }
//         .pf-progress-dot.active { background: #059669; width: 18px; border-radius: 3px; }
//         .pf-btn {
//           display: inline-flex; align-items: center; gap: 7px;
//           padding: 9px 18px; border-radius: 10px; font-size: 13.5px;
//           font-weight: 600; cursor: pointer; border: none; transition: all .15s;
//         }
//         .pf-btn-ghost { background: #f3f4f6; color: #374151; }
//         .pf-btn-ghost:hover { background: #e5e7eb; }
//         .pf-btn-primary { background: #059669; color: #fff; }
//         .pf-btn-primary:hover { background: #047857; }
//         .pf-btn-submit { background: #111827; color: #fff; padding: 9px 22px; }
//         .pf-btn-submit:hover { background: #1f2937; }
//         .pf-btn-group { display: flex; gap: 8px; }
//       `}</style>

//       <div className="pf-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
//         <div className="pf-shell">
//           {/* ── Sidebar ── */}
//           <aside className="pf-sidebar">
//             <div className="pf-sidebar-title">Add Product</div>
//             <nav className="pf-step-nav">
//               {STEPS.map((s) => {
//                 const Icon = s.icon;
//                 const isDone   = s.id < step;
//                 const isActive = s.id === step;
//                 return (
//                   <button key={s.id}
//                     className={`pf-step-btn ${isActive ? "active" : ""} ${isDone ? "done" : ""}`}
//                     onClick={() => setStep(s.id)}>
//                     <span className="pf-step-dot">
//                       {isDone
//                         ? <Check size={12} strokeWidth={3} />
//                         : <Icon size={13} />}
//                     </span>
//                     <span className="pf-step-btn-label">{s.label}</span>
//                   </button>
//                 );
//               })}
//             </nav>
//           </aside>

//           {/* ── Main ── */}
//           <div className="pf-main">
//             <div className="pf-topbar">
//               <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//                 <span className="pf-modal-title">
//                   {editingId ? "Edit Product" : "New Product"}
//                 </span>
//                 <span className="pf-modal-badge">{STEPS[step].label}</span>
//               </div>
//               <button className="pf-close-btn" onClick={onClose}><X size={16} /></button>
//             </div>

//             <div className="pf-body">
//               {stepPanels[step]}
//             </div>

//             <div className="pf-footer">
//               <div className="pf-progress">
//                 {STEPS.map((s) => (
//                   <div key={s.id} className={`pf-progress-dot ${s.id === step ? "active" : ""}`} />
//                 ))}
//               </div>
//               <div className="pf-btn-group">
//                 {!isFirst && (
//                   <button className="pf-btn pf-btn-ghost" onClick={() => setStep((p) => p - 1)}>
//                     <ChevronLeft size={15} /> Back
//                   </button>
//                 )}
//                 {!isLast && (
//                   <button className="pf-btn pf-btn-primary" onClick={() => setStep((p) => p + 1)}>
//                     Next <ChevronRight size={15} />
//                   </button>
//                 )}
//                 {isLast && (
//                   <button className="pf-btn pf-btn-submit" onClick={onSubmit}>
//                     <Check size={15} /> {editingId ? "Save Changes" : "Add Product"}
//                   </button>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }