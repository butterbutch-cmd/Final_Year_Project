import { useEffect, useState } from "react";
import {
  createProduct,
  getProducts,
  deleteProduct,
  updateProduct,
} from "../../services/productAPI";
import "./Inventory.css";

const Inventory = () => {
  const [form, setForm] = useState({
    name: "",
    subtitle: "",
    price: "",
    oldPrice: "",
    image: "",
    stock: "",
    tags: "",
    onSale: false,
    trending: false,
    topPick: false,
  });

  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState("all");
  const [editingId, setEditingId] = useState(null);

  /* ---------- FETCH PRODUCTS ---------- */
  const fetchProducts = async () => {
    const data = await getProducts();
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  /* ---------- FORM HANDLERS ---------- */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const resetForm = () => {
    setForm({
      name: "",
      subtitle: "",
      price: "",
      oldPrice: "",
      image: "",
      stock: "",
      tags: "",
      onSale: false,
      trending: false,
      topPick: false,
    });
    setEditingId(null);
  };

  const handleSubmit = async () => {
    const payload = {
      ...form,
      price: Number(form.price),
      oldPrice: form.oldPrice ? Number(form.oldPrice) : null,
      stock: Number(form.stock),
      tags: form.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    };

    if (editingId) {
      await updateProduct(editingId, payload);
      alert("Product updated");
    } else {
      await createProduct(payload);
      alert("Product added");
    }

    resetForm();
    fetchProducts();
  };

  /* ---------- EDIT ---------- */
  const handleEdit = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name,
      subtitle: product.subtitle || "",
      price: product.price,
      oldPrice: product.oldPrice || "",
      image: product.image,
      stock: product.stock,
      tags: product.tags?.join(", ") || "",
      onSale: product.onSale,
      trending: product.trending,
      topPick: product.topPick,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ---------- DELETE ---------- */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    await deleteProduct(id);
    fetchProducts();
  };

  /* ---------- FILTER ---------- */
  const filteredProducts = products.filter((p) => {
    if (filter === "sale") return p.onSale;
    if (filter === "trending") return p.trending;
    if (filter === "topPick") return p.topPick;
    return true;
  });

  return (
    <div className="inventory-container">
      <h2>Inventory Management</h2>

      {/* ===== FORM ===== */}
      <section className="product-form">
        <h3>{editingId ? "Edit Product" : "Add Product"}</h3>

        <input name="name" placeholder="Product Name" value={form.name} onChange={handleChange} />
        <input name="subtitle" placeholder="Subtitle" value={form.subtitle} onChange={handleChange} />
        <input name="image" placeholder="Image URL" value={form.image} onChange={handleChange} />
        <input type="number" name="price" placeholder="Price" value={form.price} onChange={handleChange} />
        <input type="number" name="oldPrice" placeholder="Old Price" value={form.oldPrice} onChange={handleChange} />
        <input type="number" name="stock" placeholder="Stock Quantity" value={form.stock} onChange={handleChange} />
        <input name="tags" placeholder="Tags (Indoor, Easy care)" value={form.tags} onChange={handleChange} />

        <div className="checkbox-group">
          <label><input type="checkbox" name="onSale" checked={form.onSale} onChange={handleChange} /> Sale</label>
          <label><input type="checkbox" name="trending" checked={form.trending} onChange={handleChange} /> Trending</label>
          <label><input type="checkbox" name="topPick" checked={form.topPick} onChange={handleChange} /> Top Pick</label>
        </div>

        <button onClick={handleSubmit}>
          {editingId ? "Update Product" : "Add Product"}
        </button>

        {editingId && (
          <button className="cancel-btn" onClick={resetForm}>
            Cancel
          </button>
        )}
      </section>

      {/* ===== FILTERS ===== */}
      <section className="filter-buttons">
        <button onClick={() => setFilter("all")}>All</button>
        <button onClick={() => setFilter("sale")}>Sale</button>
        <button onClick={() => setFilter("trending")}>Trending</button>
        <button onClick={() => setFilter("topPick")}>Top Picks</button>
      </section>

      {/* ===== LIST ===== */}
      <section className="product-list">
        {filteredProducts.map((product) => (
          <div className="product-card" key={product._id}>
            <img src={product.image} alt={product.name} />
            <h4>{product.name}</h4>
            <p>Rs. {product.price}</p>
            <p>Stock: {product.stock}</p>

            <div className="tags">
              {product.tags?.map((tag, i) => (
                <span key={i} className="tag custom">{tag}</span>
              ))}
            </div>

            <div className="action-buttons">
              <button className="edit-btn" onClick={() => handleEdit(product)}>Edit</button>
              <button className="delete-btn" onClick={() => handleDelete(product._id)}>Delete</button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Inventory;
