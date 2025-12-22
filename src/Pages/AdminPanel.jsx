import { useState } from "react";
import { createProduct } from "../services/productAPI";

const AdminPanel = () => {
  const [form, setForm] = useState({
    name: "",
    subtitle: "",
    price: "",
    oldPrice: "",
    image: "",
    onSale: false,
    trending: false,
    topPick: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async () => {
    await createProduct(form);
    alert("Product added");
  };

  return (
    <div>
      <h2>Admin Panel</h2>

      <input name="name" placeholder="Name" onChange={handleChange} />
      <input name="subtitle" placeholder="Subtitle" onChange={handleChange} />
      <input name="image" placeholder="Image URL" onChange={handleChange} />
      <input name="price" type="number" placeholder="Price" onChange={handleChange} />
      <input name="oldPrice" type="number" placeholder="Old Price" onChange={handleChange} />

      <label>
        <input type="checkbox" name="onSale" onChange={handleChange} /> On Sale
      </label>
      <label>
        <input type="checkbox" name="trending" onChange={handleChange} /> Trending
      </label>
      <label>
        <input type="checkbox" name="topPick" onChange={handleChange} /> Top Pick
      </label>

      <button onClick={handleSubmit}>Add Product</button>
    </div>
  );
};

export default AdminPanel;
