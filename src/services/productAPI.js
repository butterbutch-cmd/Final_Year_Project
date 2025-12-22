const BASE_URL = "http://localhost:5000";

export const getProducts = async () => {
  const res = await fetch(`${BASE_URL}/api/products`);
  return res.json();
};

export const createProduct = async (product) => {
  const res = await fetch(`${BASE_URL}/api/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  return res.json();
};
