import { useEffect, useState } from "react";
import UserHeader from "../Components/UserProfilePageComponent/UserProfileHeader";
import noImage from "../assets/no-image.png"; // <-- small local fallback PNG

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return setOrders([]);

        const res = await fetch("http://localhost:5000/api/user/orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch orders");

        const data = await res.json();
        setOrders(data || []);
      } catch (err) {
        console.error("Failed to fetch orders", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // 🔹 image resolver
  const getImageSrc = (image) => {
    // return external URL if exists, otherwise fallback
    return image || noImage;
  };

  return (
    <>
      <UserHeader />

      <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
        <h2 style={{ marginBottom: "20px" }}>My Orders</h2>

        {loading && <p>Loading orders...</p>}

        {!loading && orders.length === 0 && (
          <p>You have not placed any orders yet.</p>
        )}

        {orders.map((order, index) => (
          <div
            key={order._id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "10px",
              padding: "16px",
              marginBottom: "20px",
              background: "#fff",
            }}
          >
            <h4>Order #{index + 1}</h4>

            <p>
              <strong>Date:</strong>{" "}
              {new Date(order.purchasedAt).toLocaleDateString()}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              <span
                style={{
                  color: order.status === "COMPLETED" ? "green" : "red",
                }}
              >
                {order.status || "—"}
              </span>
            </p>

            <p>
              <strong>Total:</strong> Rs. {order.totalAmount ?? "—"}
            </p>

            <hr />

            {order.items.map((item) => {
              const product = item.product || {};
              return (
                <div
                  key={item._id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    marginBottom: "12px",
                  }}
                >
                  {/* PRODUCT IMAGE */}
                  <img
                    src={getImageSrc(product.image1)}
                    alt={product.name || "Product"}
                    style={{
                      width: "60px",
                      height: "60px",
                      objectFit: "cover",
                      borderRadius: "6px",
                      border: "1px solid #ddd",
                    }}
                    onError={(e) => {
                      e.currentTarget.src = noImage; // fallback if link fails
                    }}
                  />

                  {/* PRODUCT INFO */}
                  <div>
                    <p style={{ margin: 0, fontWeight: "500" }}>
                      {product.name || "Product unavailable"}
                    </p>
                    <p style={{ margin: 0, fontSize: "14px", color: "#555" }}>
                      Qty: {item.quantity} × Rs. {item.price}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </>
  );
}
