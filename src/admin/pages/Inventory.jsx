// // // import { useEffect, useMemo, useState } from "react";
// // // import {
// // //   createProduct,
// // //   getProducts,
// // //   deleteProduct,
// // //   updateProduct,
// // // } from "../../services/productAPI"; // ✅ correct import
// // // import { getMyAdminProfile } from "../../services/adminAPI";

// // // import StatCard from "../components/StatCard";
// // // import DataTable from "../components/DataTable";

// // // import { Package, AlertTriangle, XCircle, Edit2, Trash2,} from "lucide-react";

// // // const Inventory = () => {
// // //   const [products, setProducts] = useState([]);
// // //   const [permissions, setPermissions] = useState({});
// // //   const [editingId, setEditingId] = useState(null);
// // //   const [showModal, setShowModal] = useState(false);

// // //   const [form, setForm] = useState({
// // //     name: "",
// // //     subtitle: "",
// // //     price: "",
// // //     oldPrice: "",
// // //     image: "",
// // //     stock: "",
// // //     tags: [],
// // //     onSale: false,
// // //     trending: false,
// // //     topPick: false,
// // //   });

// // //   const [newTag, setNewTag] = useState("");

// // //   /* ---------- FETCH ADMIN PROFILE ---------- */
// // //   const fetchProfile = async () => {
// // //     try {
// // //       const data = await getMyAdminProfile();
// // //       setPermissions(data.permissions || {});
// // //     } catch (err) {
// // //       console.error("Failed to fetch profile:", err.message);
// // //     }
// // //   };

// // //   /* ---------- FETCH PRODUCTS ---------- */
// // //   const fetchProducts = async () => {
// // //     if (!permissions.products?.view) return; // ❌ block if no view
// // //     try {
// // //       const data = await getProducts();
// // //       setProducts(Array.isArray(data) ? data : []);
// // //     } catch (err) {
// // //       console.error("Failed to fetch products:", err.message);
// // //     }
// // //   };

// // //   useEffect(() => {
// // //     fetchProfile();
// // //   }, []);

// // //   useEffect(() => {
// // //     fetchProducts();
// // //   }, [permissions]);

// // //   /* ---------- ALL UNIQUE TAGS ---------- */
// // //   const allTags = useMemo(() => {
// // //     const tagSet = new Set();
// // //     products.forEach((p) => {
// // //       p.tags?.forEach((t) => tagSet.add(t));
// // //     });
// // //     return Array.from(tagSet);
// // //   }, [products]);

// // //   /* ---------- FORM ---------- */
// // //   const handleChange = (e) => {
// // //     const { name, value, type, checked } = e.target;
// // //     setForm({ ...form, [name]: type === "checkbox" ? checked : value });
// // //   };

// // //   const toggleTag = (tag) => {
// // //     setForm((prev) => ({
// // //       ...prev,
// // //       tags: prev.tags.includes(tag)
// // //         ? prev.tags.filter((t) => t !== tag)
// // //         : [...prev.tags, tag],
// // //     }));
// // //   };

// // //   const addNewTag = () => {
// // //     if (!newTag.trim()) return;
// // //     if (!form.tags.includes(newTag.trim())) {
// // //       setForm((prev) => ({
// // //         ...prev,
// // //         tags: [...prev.tags, newTag.trim()],
// // //       }));
// // //     }
// // //     setNewTag("");
// // //   };

// // //   const resetForm = () => {
// // //     setForm({
// // //       name: "",
// // //       subtitle: "",
// // //       price: "",
// // //       oldPrice: "",
// // //       image: "",
// // //       stock: "",
// // //       tags: [],
// // //       onSale: false,
// // //       trending: false,
// // //       topPick: false,
// // //     });
// // //     setEditingId(null);
// // //     setNewTag("");
// // //   };

// // //   /* ---------- SAVE ---------- */
// // //   const handleSubmit = async () => {
// // //     if (!permissions.products?.create && !editingId) return;
// // //     if (!permissions.products?.edit && editingId) return;

// // //     const payload = {
// // //       ...form,
// // //       price: Number(form.price),
// // //       oldPrice: form.oldPrice ? Number(form.oldPrice) : null,
// // //       stock: Number(form.stock),
// // //     };

// // //     try {
// // //       editingId
// // //         ? await updateProduct(editingId, payload)
// // //         : await createProduct(payload);

// // //       resetForm();
// // //       fetchProducts();
// // //       setShowModal(false);
// // //     } catch (err) {
// // //       console.error("Failed to save product:", err.message);
// // //     }
// // //   };

// // //   /* ---------- EDIT / DELETE ---------- */
// // //   const handleEdit = (product) => {
// // //     if (!permissions.products?.edit) return;

// // //     setEditingId(product._id);
// // //     setForm({
// // //       name: product.name,
// // //       subtitle: product.subtitle || "",
// // //       price: product.price,
// // //       oldPrice: product.oldPrice || "",
// // //       image: product.image,
// // //       stock: product.stock,
// // //       tags: product.tags || [],
// // //       onSale: product.onSale,
// // //       trending: product.trending,
// // //       topPick: product.topPick,
// // //     });
// // //     setShowModal(true);
// // //   };

// // //   const handleDelete = async (id) => {
// // //     if (!permissions.products?.delete) return;
// // //     if (!window.confirm("Delete this product?")) return;
// // //     await deleteProduct(id);
// // //     fetchProducts();
// // //   };

// // //   /* ---------- STATS ---------- */
// // //   const statsData = [
// // //     {
// // //       title: "Total Products",
// // //       value: products.length,
// // //       subtitle: "Across all categories",
// // //       Icon: Package,
// // //       iconBg: "bg-green-100",
// // //       iconColor: "text-green-600",
// // //     },
// // //     {
// // //       title: "Low Stock",
// // //       value: products.filter((p) => p.stock < 10 && p.stock > 0).length,
// // //       subtitle: "Items below 10",
// // //       Icon: AlertTriangle,
// // //       iconBg: "bg-yellow-100",
// // //       iconColor: "text-yellow-600",
// // //     },
// // //     {
// // //       title: "Out of Stock",
// // //       value: products.filter((p) => p.stock === 0).length,
// // //       subtitle: "Needs restock",
// // //       Icon: XCircle,
// // //       iconBg: "bg-red-100",
// // //       iconColor: "text-red-600",
// // //     },
// // //   ];

// // //   return (
// // //     <div className="p-6 bg-gray-100 min-h-screen">
// // //       <StatCard
// // //         pageTitle="Inventory Dashboard"
// // //         pageSubtitle="Manage product listings"
// // //         buttonText="Add Product"
// // //         onButtonClick={() => {
// // //           if (!permissions.products?.create) return;
// // //           resetForm();
// // //           setShowModal(true);
// // //         }}
// // //         stats={statsData}
// // //       />

// // //       <DataTable
// // //         title="Product Listings"
// // //         subtitle="Search and filter inventory items"
// // //         columns={["Product", "Tags", "Price", "Stock", "Status"]}
// // //         data={products}
// // //         searchableKeys={["name", "subtitle"]}
// // //         filterKey="tags"
// // //         filterOptions={allTags.map((t) => ({ label: t, value: t }))}
// // //         renderRow={(product) => {
// // //           let statusLabel = "Active";
// // //           let statusStyle = "bg-green-100 text-green-700";

// // //           if (product.stock === 0) {
// // //             statusLabel = "Out of Stock";
// // //             statusStyle = "bg-red-100 text-red-700";
// // //           } else if (product.stock < 10) {
// // //             statusLabel = "Low Stock";
// // //             statusStyle = "bg-yellow-100 text-yellow-700";
// // //           }

// // //           return (
// // //             <>
// // //               <td className="px-4 py-4">
// // //                 <div className="flex items-center gap-3">
// // //                   <img
// // //                     src={product.image}
// // //                     alt={product.name}
// // //                     className="w-10 h-10 rounded-lg object-cover"
// // //                   />
// // //                   <div>
// // //                     <p className="font-medium">{product.name}</p>
// // //                     {product.subtitle && (
// // //                       <p className="text-xs text-gray-500">{product.subtitle}</p>
// // //                     )}
// // //                   </div>
// // //                 </div>
// // //               </td>

// // //               <td className="px-4 py-4 text-sm">{product.tags?.join(", ") || "—"}</td>

// // //               <td className="px-4 py-4 text-sm font-medium">Rs {product.price}</td>

// // //               <td className="px-4 py-4 text-sm">
// // //                 <span
// // //                   className={
// // //                     product.stock === 0
// // //                       ? "text-red-600"
// // //                       : product.stock < 10
// // //                       ? "text-yellow-600"
// // //                       : "text-green-600"
// // //                   }
// // //                 >
// // //                   {product.stock}
// // //                 </span>
// // //               </td>

// // //               <td className="px-4 py-4 text-sm">
// // //                 <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyle}`}>
// // //                   {statusLabel}
// // //                 </span>
// // //               </td>
// // //             </>
// // //           );
// // //         }}
// // //         actions={(product) =>
// // //           permissions.products?.edit || permissions.products?.delete ? (
// // //             <div className="flex justify-center gap-2">
// // //               {permissions.products?.edit && (
// // //                 <button
// // //                   onClick={() => handleEdit(product)}
// // //                   className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
// // //                 >
// // //                   <Edit2 size={16} />
// // //                 </button>
// // //               )}
// // //               {permissions.products?.delete && (
// // //                 <button
// // //                   onClick={() => handleDelete(product._id)}
// // //                   className="p-2 bg-gray-100 text-red-500 rounded-lg hover:bg-red-100"
// // //                 >
// // //                   <Trash2 size={16} />
// // //                 </button>
// // //               )}
// // //             </div>
// // //           ) : null
// // //         }
// // //       />

// // //       {/* ---------- MODAL ---------- */}
// // //       {showModal && (permissions.products?.create || permissions.products?.edit) && (
// // //         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
// // //           <div className="bg-white rounded-2xl p-6 w-full max-w-lg">
// // //             <h3 className="text-xl font-semibold mb-4">
// // //               {editingId ? "Edit Product" : "Add Product"}
// // //             </h3>

// // //             <div className="space-y-3">
// // //               {["name", "subtitle", "image", "price", "oldPrice", "stock"].map(
// // //                 (name) => (
// // //                   <input
// // //                     key={name}
// // //                     name={name}
// // //                     value={form[name]}
// // //                     onChange={handleChange}
// // //                     placeholder={name.toUpperCase()}
// // //                     className="w-full px-3 py-2 border rounded-lg text-sm"
// // //                   />
// // //                 )
// // //               )}

// // //               {/* TAG SELECT */}
// // //               <div>
// // //                 <p className="text-sm font-medium mb-2">Tags</p>
// // //                 <div className="flex flex-wrap gap-2 mb-2">
// // //                   {allTags.map((tag) => (
// // //                     <button
// // //                       type="button"
// // //                       key={tag}
// // //                       onClick={() => toggleTag(tag)}
// // //                       className={`px-3 py-1 rounded-full text-sm border ${
// // //                         form.tags.includes(tag)
// // //                           ? "bg-emerald-500 text-white border-emerald-500"
// // //                           : "bg-gray-100"
// // //                       }`}
// // //                     >
// // //                       {tag}
// // //                     </button>
// // //                   ))}
// // //                 </div>

// // //                 <div className="flex gap-2">
// // //                   <input
// // //                     value={newTag}
// // //                     onChange={(e) => setNewTag(e.target.value)}
// // //                     placeholder="Add new tag"
// // //                     className="flex-1 px-3 py-2 border rounded-lg text-sm"
// // //                   />
// // //                   <button
// // //                     type="button"
// // //                     onClick={addNewTag}
// // //                     className="px-4 py-2 bg-emerald-500 text-white rounded-lg"
// // //                   >
// // //                     Add
// // //                   </button>
// // //                 </div>
// // //               </div>

// // //               {/* SECTIONS */}
// // //               <div className="flex gap-4 pt-2">
// // //                 {["onSale", "trending", "topPick"].map((key) => (
// // //                   <label key={key} className="flex items-center gap-2 text-sm">
// // //                     <input
// // //                       type="checkbox"
// // //                       name={key}
// // //                       checked={form[key]}
// // //                       onChange={handleChange}
// // //                     />
// // //                     {key}
// // //                   </label>
// // //                 ))}
// // //               </div>

// // //               <div className="flex gap-3 pt-4">
// // //                 <button
// // //                   onClick={handleSubmit}
// // //                   className="flex-1 bg-emerald-500 text-white py-2 rounded-lg"
// // //                 >
// // //                   {editingId ? "Update" : "Add"}
// // //                 </button>
// // //                 <button
// // //                   onClick={() => setShowModal(false)}
// // //                   className="flex-1 bg-gray-100 py-2 rounded-lg"
// // //                 >
// // //                   Cancel
// // //                 </button>
// // //               </div>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // };

// // // export default Inventory;




// // import { useEffect, useMemo, useState } from "react";
// // import {
// //   createProduct,
// //   getProducts,
// //   deleteProduct,
// //   updateProduct,
// // } from "../../services/productAPI"; // ✅ correct import
// // import { getMyAdminProfile } from "../../services/adminAPI";
// // import StatCard from "../components/StatCard";
// // import DataTable from "../components/DataTable";
// // import { Package, AlertTriangle, XCircle, Edit2, Trash2,} from "lucide-react";

// // // Main component for managing inventory
// // // This component handles fetching products, displaying stats, a data table, and a modal for adding/editing products
// // // It also manages admin permissions for CRUD operations
// // const Inventory = () => {
// //   // State to hold the list of products fetched from the API
// //   const [products, setProducts] = useState([]);

// //   // State to hold the admin's permissions (e.g., view, create, edit, delete for products)
// //   const [permissions, setPermissions] = useState({});

// //   // State to track the ID of the product being edited (null means creating a new one)
// //   const [editingId, setEditingId] = useState(null);

// //   // State to control the visibility of the add/edit modal
// //   const [showModal, setShowModal] = useState(false);

// //   // State for the form data used in the modal for product details
// //   const [form, setForm] = useState({
// //     name: "",
// //     subtitle: "",
// //     price: "",
// //     oldPrice: "",
// //     image: "",
// //     stock: "",
// //     tags: [], // Array of tags for the product
// //     onSale: false,
// //     trending: false,
// //     topPick: false,
// //   });

// //   // State for entering a new tag in the modal
// //   const [newTag, setNewTag] = useState("");

// //   /* ---------- FETCH ADMIN PROFILE ---------- */
// //   // Function to fetch the admin's profile and set permissions
// //   const fetchProfile = async () => {
// //     try {
// //       const data = await getMyAdminProfile();
// //       setPermissions(data.permissions || {}); // Default to empty object if no permissions
// //     } catch (err) {
// //       console.error("Failed to fetch profile:", err.message);
// //     }
// //   };

// //   /* ---------- FETCH PRODUCTS ---------- */
// //   // Function to fetch all products, but only if the user has view permission
// //   const fetchProducts = async () => {
// //     if (!permissions.products?.view) return; // Block if no view permission
// //     try {
// //       const data = await getProducts();
// //       setProducts(Array.isArray(data) ? data : []); // Ensure products is always an array
// //     } catch (err) {
// //       console.error("Failed to fetch products:", err.message);
// //     }
// //   };

// //   // Effect to fetch admin profile on component mount
// //   useEffect(() => {
// //     fetchProfile();
// //   }, []);

// //   // Effect to fetch products once permissions are loaded or change
// //   useEffect(() => {
// //     fetchProducts();
// //   }, [permissions]);

// //   /* ---------- ALL UNIQUE TAGS ---------- */
// //   // Memoized computation of all unique tags from products for filtering and selection
// //   const allTags = useMemo(() => {
// //     const tagSet = new Set();
// //     products.forEach((p) => {
// //       p.tags?.forEach((t) => tagSet.add(t)); // Add each tag to the set (unique)
// //     });
// //     return Array.from(tagSet); // Convert set to array
// //   }, [products]);

// //   /* ---------- FORM HANDLERS ---------- */
// //   // General handler for form input changes (text inputs and checkboxes)
// //   const handleChange = (e) => {
// //     const { name, value, type, checked } = e.target;
// //     setForm({ ...form, [name]: type === "checkbox" ? checked : value });
// //   };

// //   // Handler to toggle a tag in the form's tags array
// //   const toggleTag = (tag) => {
// //     setForm((prev) => ({
// //       ...prev,
// //       tags: prev.tags.includes(tag)
// //         ? prev.tags.filter((t) => t !== tag) // Remove if already included
// //         : [...prev.tags, tag], // Add if not included
// //     }));
// //   };

// //   // Handler to add a new custom tag from the input field
// //   const addNewTag = () => {
// //     if (!newTag.trim()) return; // Ignore if empty
// //     if (!form.tags.includes(newTag.trim())) {
// //       setForm((prev) => ({
// //         ...prev,
// //         tags: [...prev.tags, newTag.trim()], // Add trimmed tag
// //       }));
// //     }
// //     setNewTag(""); // Clear input
// //   };

// //   // Function to reset the form to initial state
// //   const resetForm = () => {
// //     setForm({
// //       name: "",
// //       subtitle: "",
// //       price: "",
// //       oldPrice: "",
// //       image: "",
// //       stock: "",
// //       tags: [],
// //       onSale: false,
// //       trending: false,
// //       topPick: false,
// //     });
// //     setEditingId(null); // Exit edit mode
// //     setNewTag("");
// //   };

// //   /* ---------- SAVE PRODUCT (CREATE/UPDATE) ---------- */
// //   // Handler for submitting the form (create or update based on editingId)
// //   const handleSubmit = async () => {
// //     // Permission checks: create for new, edit for existing
// //     if (!permissions.products?.create && !editingId) return;
// //     if (!permissions.products?.edit && editingId) return;
// //     // Prepare payload with numeric conversions
// //     const payload = {
// //       ...form,
// //       price: Number(form.price),
// //       oldPrice: form.oldPrice ? Number(form.oldPrice) : null,
// //       stock: Number(form.stock),
// //     };
// //     try {
// //       // Update or create based on editingId
// //       editingId
// //         ? await updateProduct(editingId, payload)
// //         : await createProduct(payload);
// //       resetForm(); // Reset form
// //       fetchProducts(); // Refresh product list
// //       setShowModal(false); // Close modal
// //     } catch (err) {
// //       console.error("Failed to save product:", err.message);
// //     }
// //   };

// //   /* ---------- EDIT / DELETE HANDLERS ---------- */
// //   // Handler to start editing a product: populate form and show modal
// //   const handleEdit = (product) => {
// //     if (!permissions.products?.edit) return; // Permission check
// //     setEditingId(product._id);
// //     setForm({
// //       name: product.name,
// //       subtitle: product.subtitle || "",
// //       price: product.price,
// //       oldPrice: product.oldPrice || "",
// //       image: product.image,
// //       stock: product.stock,
// //       tags: product.tags || [],
// //       onSale: product.onSale,
// //       trending: product.trending,
// //       topPick: product.topPick,
// //     });
// //     setShowModal(true);
// //   };

// //   // Handler to delete a product after confirmation
// //   const handleDelete = async (id) => {
// //     if (!permissions.products?.delete) return; // Permission check
// //     if (!window.confirm("Delete this product?")) return; // User confirmation
// //     await deleteProduct(id);
// //     fetchProducts(); // Refresh list
// //   };

// //   /* ---------- STATS DATA ---------- */
// //   // Array of stat cards data for dashboard overview
// //   const statsData = [
// //     {
// //       title: "Total Products",
// //       value: products.length,
// //       subtitle: "Across all categories",
// //       Icon: Package,
// //       iconBg: "bg-green-100",
// //       iconColor: "text-green-600",
// //     },
// //     {
// //       title: "Low Stock",
// //       value: products.filter((p) => p.stock < 10 && p.stock > 0).length, // Count products with stock 1-9
// //       subtitle: "Items below 10",
// //       Icon: AlertTriangle,
// //       iconBg: "bg-yellow-100",
// //       iconColor: "text-yellow-600",
// //     },
// //     {
// //       title: "Out of Stock",
// //       value: products.filter((p) => p.stock === 0).length, // Count zero stock
// //       subtitle: "Needs restock",
// //       Icon: XCircle,
// //       iconBg: "bg-red-100",
// //       iconColor: "text-red-600",
// //     },
// //   ];

// //   // Render the component UI
// //   return (
// //     <div className="p-6 bg-gray-100 min-h-screen"> {/* Main container */}
// //       {/* StatCard component for dashboard stats and add button */}
// //       <StatCard
// //         pageTitle="Inventory Dashboard"
// //         pageSubtitle="Manage product listings"
// //         buttonText="Add Product"
// //         onButtonClick={() => {
// //           if (!permissions.products?.create) return; // Permission check
// //           resetForm();
// //           setShowModal(true); // Open modal for new product
// //         }}
// //         stats={statsData}
// //       />
// //       {/* DataTable component for listing products */}
// //       <DataTable
// //         title="Product Listings"
// //         subtitle="Search and filter inventory items"
// //         columns={["Product", "Tags", "Price", "Stock", "Status"]} // Table headers
// //         data={products} // Data source
// //         searchableKeys={["name", "subtitle"]} // Keys for search functionality
// //         filterKey="tags" // Key for filtering
// //         filterOptions={allTags.map((t) => ({ label: t, value: t }))} // Tag filter options
// //         renderRow={(product) => { // Custom row rendering
// //           // Determine status based on stock
// //           let statusLabel = "Active";
// //           let statusStyle = "bg-green-100 text-green-700";
// //           if (product.stock === 0) {
// //             statusLabel = "Out of Stock";
// //             statusStyle = "bg-red-100 text-red-700";
// //           } else if (product.stock < 10) {
// //             statusLabel = "Low Stock";
// //             statusStyle = "bg-yellow-100 text-yellow-700";
// //           }
// //           return (
// //             <>
// //               <td className="px-4 py-4"> {/* Product column */}
// //                 <div className="flex items-center gap-3">
// //                   <img
// //                     src={product.image}
// //                     alt={product.name}
// //                     className="w-10 h-10 rounded-lg object-cover"
// //                   />
// //                   <div>
// //                     <p className="font-medium">{product.name}</p>
// //                     {product.subtitle && (
// //                       <p className="text-xs text-gray-500">{product.subtitle}</p>
// //                     )}
// //                   </div>
// //                 </div>
// //               </td>
// //               <td className="px-4 py-4 text-sm">{product.tags?.join(", ") || "—"}</td> {/* Tags */}
// //               <td className="px-4 py-4 text-sm font-medium">Rs {product.price}</td> {/* Price */}
// //               <td className="px-4 py-4 text-sm"> {/* Stock with color coding */}
// //                 <span
// //                   className={
// //                     product.stock === 0
// //                       ? "text-red-600"
// //                       : product.stock < 10
// //                       ? "text-yellow-600"
// //                       : "text-green-600"
// //                   }
// //                 >
// //                   {product.stock}
// //                 </span>
// //               </td>
// //               <td className="px-4 py-4 text-sm"> {/* Status badge */}
// //                 <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyle}`}>
// //                   {statusLabel}
// //                 </span>
// //               </td>
// //             </>
// //           );
// //         }}
// //         actions={(product) => // Action buttons (edit/delete) based on permissions
// //           permissions.products?.edit || permissions.products?.delete ? (
// //             <div className="flex justify-center gap-2">
// //               {permissions.products?.edit && (
// //                 <button
// //                   onClick={() => handleEdit(product)}
// //                   className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
// //                 >
// //                   <Edit2 size={16} />
// //                 </button>
// //               )}
// //               {permissions.products?.delete && (
// //                 <button
// //                   onClick={() => handleDelete(product._id)}
// //                   className="p-2 bg-gray-100 text-red-500 rounded-lg hover:bg-red-100"
// //                 >
// //                   <Trash2 size={16} />
// //                 </button>
// //               )}
// //             </div>
// //           ) : null
// //         }
// //       />
// //       {/* ---------- MODAL FOR ADD/EDIT ---------- */}
// //       {/* Conditional render: show modal if open and user has create/edit permission */}
// //       {showModal && (permissions.products?.create || permissions.products?.edit) && (
// //         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"> {/* Overlay */}
// //           <div className="bg-white rounded-2xl p-6 w-full max-w-lg"> {/* Modal content */}
// //             <h3 className="text-xl font-semibold mb-4">
// //               {editingId ? "Edit Product" : "Add Product"} {/* Title based on mode */}
// //             </h3>
// //             <div className="space-y-3"> {/* Form fields */}
// //               {["name", "subtitle", "image", "price", "oldPrice", "stock"].map(
// //                 (name) => (
// //                   <input
// //                     key={name}
// //                     name={name}
// //                     value={form[name]}
// //                     onChange={handleChange}
// //                     placeholder={name.toUpperCase()}
// //                     className="w-full px-3 py-2 border rounded-lg text-sm"
// //                   />
// //                 )
// //               )}
// //               {/* TAG SELECT */}
// //               <div>
// //                 <p className="text-sm font-medium mb-2">Tags</p>
// //                 <div className="flex flex-wrap gap-2 mb-2"> {/* Existing tags buttons */}
// //                   {allTags.map((tag) => (
// //                     <button
// //                       type="button"
// //                       key={tag}
// //                       onClick={() => toggleTag(tag)}
// //                       className={`px-3 py-1 rounded-full text-sm border ${
// //                         form.tags.includes(tag)
// //                           ? "bg-emerald-500 text-white border-emerald-500"
// //                           : "bg-gray-100"
// //                       }`}
// //                     >
// //                       {tag}
// //                     </button>
// //                   ))}
// //                 </div>
// //                 <div className="flex gap-2"> {/* New tag input */}
// //                   <input
// //                     value={newTag}
// //                     onChange={(e) => setNewTag(e.target.value)}
// //                     placeholder="Add new tag"
// //                     className="flex-1 px-3 py-2 border rounded-lg text-sm"
// //                   />
// //                   <button
// //                     type="button"
// //                     onClick={addNewTag}
// //                     className="px-4 py-2 bg-emerald-500 text-white rounded-lg"
// //                   >
// //                     Add
// //                   </button>
// //                 </div>
// //               </div>
// //               {/* SECTIONS (checkboxes) */}
// //               <div className="flex gap-4 pt-2">
// //                 {["onSale", "trending", "topPick"].map((key) => (
// //                   <label key={key} className="flex items-center gap-2 text-sm">
// //                     <input
// //                       type="checkbox"
// //                       name={key}
// //                       checked={form[key]}
// //                       onChange={handleChange}
// //                     />
// //                     {key}
// //                   </label>
// //                 ))}
// //               </div>
// //               <div className="flex gap-3 pt-4"> {/* Submit/Cancel buttons */}
// //                 <button
// //                   onClick={handleSubmit}
// //                   className="flex-1 bg-emerald-500 text-white py-2 rounded-lg"
// //                 >
// //                   {editingId ? "Update" : "Add"}
// //                 </button>
// //                 <button
// //                   onClick={() => setShowModal(false)}
// //                   className="flex-1 bg-gray-100 py-2 rounded-lg"
// //                 >
// //                   Cancel
// //                 </button>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };
// // export default Inventory;


// import { useEffect, useMemo, useState } from "react";
// import {
//   createProduct,
//   getProducts,
//   deleteProduct,
//   updateProduct,
// } from "../../services/productAPI";
// import { getMyAdminProfile } from "../../services/adminAPI";
// import StatCard from "../components/StatCard";
// import DataTable from "../components/DataTable";
// import { Package, AlertTriangle, XCircle, Edit2, Trash2 } from "lucide-react";

// const Inventory = () => {
//   const [products, setProducts] = useState([]);
//   const [permissions, setPermissions] = useState({});
//   const [editingId, setEditingId] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [form, setForm] = useState({
//     name: "",
//     subtitle: "",
//     price: "",
//     oldPrice: "",
//     image: "",
//     stock: "",
//     tags: [],
//     onSale: false,
//     trending: false,
//     topPick: false,
//   });
//   const [newTag, setNewTag] = useState("");

//   const fetchProfile = async () => {
//     try {
//       const data = await getMyAdminProfile();
//       setPermissions(data.permissions || {});
//     } catch (err) {
//       console.error("Failed to fetch profile:", err.message);
//     }
//   };

//   const fetchProducts = async () => {
//     if (!permissions.products?.view) return;
//     try {
//       const data = await getProducts();
//       setProducts(Array.isArray(data) ? data : []);
//     } catch (err) {
//       console.error("Failed to fetch products:", err.message);
//     }
//   };

//   useEffect(() => {
//     fetchProfile();
//   }, []);

//   useEffect(() => {
//     fetchProducts();
//   }, [permissions]);

//   const allTags = useMemo(() => {
//     const tagSet = new Set();
//     products.forEach((p) => {
//       p.tags?.forEach((t) => tagSet.add(t));
//     });
//     return Array.from(tagSet);
//   }, [products]);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setForm({ ...form, [name]: type === "checkbox" ? checked : value });
//   };

//   const toggleTag = (tag) => {
//     setForm((prev) => ({
//       ...prev,
//       tags: prev.tags.includes(tag)
//         ? prev.tags.filter((t) => t !== tag)
//         : [...prev.tags, tag],
//     }));
//   };

//   const addNewTag = () => {
//     if (!newTag.trim()) return;
//     if (!form.tags.includes(newTag.trim())) {
//       setForm((prev) => ({
//         ...prev,
//         tags: [...prev.tags, newTag.trim()],
//       }));
//     }
//     setNewTag("");
//   };

//   const resetForm = () => {
//     setForm({
//       name: "",
//       subtitle: "",
//       price: "",
//       oldPrice: "",
//       image: "",
//       stock: "",
//       tags: [],
//       onSale: false,
//       trending: false,
//       topPick: false,
//     });
//     setEditingId(null);
//     setNewTag("");
//   };

//   const handleSubmit = async () => {
//     if (!permissions.products?.create && !editingId) return;
//     if (!permissions.products?.edit && editingId) return;
//     const payload = {
//       ...form,
//       price: Number(form.price),
//       oldPrice: form.oldPrice ? Number(form.oldPrice) : null,
//       stock: Number(form.stock),
//     };
//     try {
//       editingId
//         ? await updateProduct(editingId, payload)
//         : await createProduct(payload);
//       resetForm();
//       fetchProducts();
//       setShowModal(false);
//     } catch (err) {
//       console.error("Failed to save product:", err.message);
//     }
//   };

//   const handleEdit = (product) => {
//     if (!permissions.products?.edit) return;
//     setEditingId(product._id);
//     setForm({
//       name: product.name,
//       subtitle: product.subtitle || "",
//       price: product.price,
//       oldPrice: product.oldPrice || "",
//       image: product.image,
//       stock: product.stock,
//       tags: product.tags || [],
//       onSale: product.onSale,
//       trending: product.trending,
//       topPick: product.topPick,
//     });
//     setShowModal(true);
//   };

//   const handleDelete = async (id) => {
//     if (!permissions.products?.delete) return;
//     if (!window.confirm("Delete this product?")) return;
//     await deleteProduct(id);
//     fetchProducts();
//   };

//   const statsData = [
//     {
//       title: "Total Products",
//       value: products.length,
//       subtitle: "Across all categories",
//       Icon: Package,
//       iconBg: "bg-green-100",
//       iconColor: "text-green-600",
//     },
//     {
//       title: "Low Stock",
//       value: products.filter((p) => p.stock < 10 && p.stock > 0).length,
//       subtitle: "Items below 10",
//       Icon: AlertTriangle,
//       iconBg: "bg-yellow-100",
//       iconColor: "text-yellow-600",
//     },
//     {
//       title: "Out of Stock",
//       value: products.filter((p) => p.stock === 0).length,
//       subtitle: "Needs restock",
//       Icon: XCircle,
//       iconBg: "bg-red-100",
//       iconColor: "text-red-600",
//     },
//   ];

//   return (
//     <div className="p-6 bg-gray-100 min-h-screen">
//       <StatCard
//         pageTitle="Inventory Dashboard"
//         pageSubtitle="Manage product listings"
//         buttonText="Add Product"
//         onButtonClick={() => {
//           if (!permissions.products?.create) return;
//           resetForm();
//           setShowModal(true);
//         }}
//         stats={statsData}
//       />
//       <DataTable
//         title="Product Listings"
//         subtitle="Search and filter inventory items"
//         columns={["Product", "Tags", "Price", "Stock", "Status"]}
//         data={products}
//         searchableKeys={["name", "subtitle"]}
//         filterKey="tags"
//         filterOptions={allTags.map((t) => ({ label: t, value: t }))}
//         renderRow={(product) => {
//           let statusLabel = "Active";
//           let statusStyle = "bg-green-100 text-green-700";
//           if (product.stock === 0) {
//             statusLabel = "Out of Stock";
//             statusStyle = "bg-red-100 text-red-700";
//           } else if (product.stock < 10) {
//             statusLabel = "Low Stock";
//             statusStyle = "bg-yellow-100 text-yellow-700";
//           }
//           return (
//             <><td className="px-4 py-4"><div className="flex items-center gap-3"><img src={product.image} alt={product.name} className="w-10 h-10 rounded-lg object-cover" /><div><p className="font-medium">{product.name}</p>{product.subtitle && (<p className="text-xs text-gray-500">{product.subtitle}</p>)}</div></div></td><td className="px-4 py-4 text-sm">{product.tags?.join(", ") || "—"}</td><td className="px-4 py-4 text-sm font-medium">Rs {product.price}</td><td className="px-4 py-4 text-sm"><span className={product.stock === 0 ? "text-red-600" : product.stock < 10 ? "text-yellow-600" : "text-green-600"}>{product.stock}</span></td><td className="px-4 py-4 text-sm"><span className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyle}`}>{statusLabel}</span></td></>
//           );
//         }}
//         actions={(product) =>
//           permissions.products?.edit || permissions.products?.delete ? (
//             <div className="flex justify-center gap-2">
//               {permissions.products?.edit && (
//                 <button
//                   onClick={() => handleEdit(product)}
//                   className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
//                 >
//                   <Edit2 size={16} />
//                 </button>
//               )}
//               {permissions.products?.delete && (
//                 <button
//                   onClick={() => handleDelete(product._id)}
//                   className="p-2 bg-gray-100 text-red-500 rounded-lg hover:bg-red-100"
//                 >
//                   <Trash2 size={16} />
//                 </button>
//               )}
//             </div>
//           ) : null
//         }
//       />
//       {showModal && (permissions.products?.create || permissions.products?.edit) && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-2xl p-6 w-full max-w-lg">
//             <h3 className="text-xl font-semibold mb-4">
//               {editingId ? "Edit Product" : "Add Product"}
//             </h3>
//             <div className="space-y-3">
//               {["name", "subtitle", "image", "price", "oldPrice", "stock"].map(
//                 (name) => (
//                   <input
//                     key={name}
//                     name={name}
//                     value={form[name]}
//                     onChange={handleChange}
//                     placeholder={name.toUpperCase()}
//                     className="w-full px-3 py-2 border rounded-lg text-sm"
//                   />
//                 )
//               )}
//               <div>
//                 <p className="text-sm font-medium mb-2">Tags</p>
//                 <div className="flex flex-wrap gap-2 mb-2">
//                   {allTags.map((tag) => (
//                     <button
//                       type="button"
//                       key={tag}
//                       onClick={() => toggleTag(tag)}
//                       className={`px-3 py-1 rounded-full text-sm border ${
//                         form.tags.includes(tag)
//                           ? "bg-emerald-500 text-white border-emerald-500"
//                           : "bg-gray-100"
//                       }`}
//                     >
//                       {tag}
//                     </button>
//                   ))}
//                 </div>
//                 <div className="flex gap-2">
//                   <input
//                     value={newTag}
//                     onChange={(e) => setNewTag(e.target.value)}
//                     placeholder="Add new tag"
//                     className="flex-1 px-3 py-2 border rounded-lg text-sm"
//                   />
//                   <button
//                     type="button"
//                     onClick={addNewTag}
//                     className="px-4 py-2 bg-emerald-500 text-white rounded-lg"
//                   >
//                     Add
//                   </button>
//                 </div>
//               </div>
//               <div className="flex gap-4 pt-2">
//                 {["onSale", "trending", "topPick"].map((key) => (
//                   <label key={key} className="flex items-center gap-2 text-sm">
//                     <input
//                       type="checkbox"
//                       name={key}
//                       checked={form[key]}
//                       onChange={handleChange}
//                     />
//                     {key}
//                   </label>
//                 ))}
//               </div>
//               <div className="flex gap-3 pt-4">
//                 <button
//                   onClick={handleSubmit}
//                   className="flex-1 bg-emerald-500 text-white py-2 rounded-lg"
//                 >
//                   {editingId ? "Update" : "Add"}
//                 </button>
//                 <button
//                   onClick={() => setShowModal(false)}
//                   className="flex-1 bg-gray-100 py-2 rounded-lg"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Inventory;

import { useEffect, useMemo, useState } from "react";
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

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [permissions, setPermissions] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: "",
    subtitle: "",
    price: "",
    oldPrice: "",
    image: "",
    stock: "",
    category: "", // <-- new field for category
    onSale: false,
    trending: false,
    topPick: false,
  });

  const categories = ["Indoor", "Outdoor", "Accessories", "Large Plants"];

  const fetchProfile = async () => {
    try {
      const data = await getMyAdminProfile();
      setPermissions(data.permissions || {});
    } catch (err) {
      console.error("Failed to fetch profile:", err.message);
    }
  };

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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const selectCategory = (cat) => {
    setForm((prev) => ({ ...prev, category: cat }));
  };

  const resetForm = () => {
    setForm({
      name: "",
      subtitle: "",
      price: "",
      oldPrice: "",
      image: "",
      stock: "",
      category: "",
      onSale: false,
      trending: false,
      topPick: false,
    });
    setEditingId(null);
  };

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

  const handleEdit = (product) => {
    if (!permissions.products?.edit) return;
    setEditingId(product._id);
    setForm({
      name: product.name,
      subtitle: product.subtitle || "",
      price: product.price,
      oldPrice: product.oldPrice || "",
      image: product.image,
      stock: product.stock,
      category: product.category || "",
      onSale: product.onSale,
      trending: product.trending,
      topPick: product.topPick,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!permissions.products?.delete) return;
    if (!window.confirm("Delete this product?")) return;
    await deleteProduct(id);
    fetchProducts();
  };

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
                    src={product.image}
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
              <td className="px-4 py-4 text-sm font-medium">Rs {product.price}</td>
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

      {showModal && (permissions.products?.create || permissions.products?.edit) && (
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

              {/* 🔹 Category Selection */}
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
