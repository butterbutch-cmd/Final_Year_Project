import { useEffect, useState } from "react";
import UserHeader from "../Components/UserProfilePageComponent/UserProfileHeader";
import noImage from "../assets/no-image.png"; // fallback image

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch orders on mount
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return setOrders([]);

        const res = await fetch("http://localhost:5000/api/user/orders", {
          headers: { Authorization: `Bearer ${token}` },
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

  // 🔹 Helper to resolve product images
  const getImageSrc = (image) => image || noImage;

  // 🔹 Helper to determine color based on status
  const getStatusColor = (status) => {
    switch (status) {
      case "COMPLETED":
      case "DELIVERED":
        return "green";
      case "SHIPPED":
        return "orange";
      case "PENDING":
        return "blue";
      case "FAILED":
      case "CANCELLED":
        return "red";
      default:
        return "#555";
    }
  };

  // 🔹 Determine if order can be cancelled
  const canCancel = (order) =>
    order.status === "PENDING" ||
    order.deliveryStatus === "PENDING" ||
    order.transaction?.status === "PENDING" ||
    order.transaction?.deliveryStatus === "PENDING";

  // 🔹 Cancel order handler
  const handleCancelOrder = async (orderId) => {
    const reason = prompt(
      "Please enter the reason for cancelling this order:\nRefunds may take up to 12 hours."
    );
    if (!reason) return alert("Cancellation reason is required.");

    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this order? Refunds may take up to 12 hours."
    );
    if (!confirmCancel) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:5000/api/user/orders/${orderId}/cancel`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ reason }),
        }
      );

      if (!res.ok) throw new Error("Failed to cancel order");

      alert(
        "Order cancelled successfully. Refund will be processed within 12 hours."
      );

      // 🔹 Update orders locally immediately
      setOrders((prev) =>
        prev.map((o) =>
          o.orderId === orderId || o._id === orderId
            ? {
                ...o,
                status: "CANCELLED",
                deliveryStatus: "CANCELLED",
                cancellation: { reason, cancelledAt: new Date() },
                transaction: o.transaction
                  ? {
                      ...o.transaction,
                      status: "CANCELLED",
                      deliveryStatus: "CANCELLED",
                      cancellation: { reason, cancelledAt: new Date() },
                    }
                  : null,
              }
            : o
        )
      );
    } catch (err) {
      console.error("Cancel order failed:", err);
      alert("Failed to cancel order. Please try again.");
    }
  };

  // 🔹 Calculate subtotal, tax & shipping from total amount (frontend only)
  const calculateBreakdown = (total) => {
    const totalAmount = Number(total) || 0;

    let subtotal = 0;
    let tax = 0;
    let shipping = 0;

    // Try free-shipping case first
    const possibleSubtotalFree = totalAmount / 1.13;

    if (possibleSubtotalFree > 3000) {
      subtotal = possibleSubtotalFree;
      shipping = 0;
    } else {
      subtotal = (totalAmount - 100) / 1.13;
      shipping = 100;
    }

    subtotal = Math.round(subtotal);
    tax = Math.round(subtotal * 0.13);

    return { subtotal, tax, shipping };
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
            key={order.orderId || order._id}
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

            {/* Payment Status */}
            <p>
              <strong>Payment Status:</strong>{" "}
              <span style={{ color: getStatusColor(order.transaction?.status) }}>
                {order.transaction?.status || "—"}
              </span>
            </p>

            {/* Payment Gateway */}
            <p>
              <strong>Payment Gateway:</strong>{" "}
              {(order.transaction?.paymentGateway || order.paymentGateway) === "cod"
                ? "Cash On Delivery"
                : order.transaction?.paymentGateway || order.paymentGateway || "—"}
            </p>

            {/* Transaction ID */}
            <p>
              <strong>Transaction ID:</strong>{" "}
              {order.transaction?.transactionId || "—"}
            </p>

            {/* Delivery Status */}
            <p>
              <strong>Delivery Status:</strong>{" "}
              <span
                style={{
                  color: getStatusColor(order.transaction?.deliveryStatus),
                }}
              >
                {order.transaction?.deliveryStatus || "—"}
              </span>
            </p>

            {/* Subtotal / Tax / Shipping / Total */}
            {(() => {
              const total =
                order.totalAmount ?? order.transaction?.amount ?? 0;

              const { subtotal, tax, shipping } = calculateBreakdown(total);

              return (
                <>
                  <p>
                    <strong>Subtotal:</strong> Rs. {subtotal}
                  </p>

                  <p>
                    <strong>Tax (13%):</strong> Rs. {tax}
                  </p>

                  <p>
                    <strong>Shipping:</strong>{" "}
                    {shipping === 0 ? "Free" : `Rs. ${shipping}`}
                  </p>

                  <p>
                    <strong>Total:</strong> Rs. {total}
                  </p>
                </>
              );
            })()}

            {/* Cancel Order Button */}
            {canCancel(order) && (
              <button
                onClick={() => handleCancelOrder(order.orderId || order._id)}
                style={{
                  backgroundColor: "red",
                  color: "white",
                  padding: "8px 12px",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  marginBottom: "10px",
                }}
              >
                Cancel Order
              </button>
            )}

            {/* Show cancellation reason if cancelled */}
            {order.status === "CANCELLED" && order.cancellation?.reason && (
              <p style={{ color: "red", fontStyle: "italic" }}>
                Cancelled: {order.cancellation.reason} (
                {new Date(order.cancellation.cancelledAt).toLocaleString()})
              </p>
            )}

            <hr />

            {/* Order Items */}
            {order.items.map((item) => {
              const product = item.product || {};
              return (
                <div
                  key={item._id || product._id || Math.random()}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    marginBottom: "12px",
                  }}
                >
                  {/* Product Image */}
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
                      e.currentTarget.src = noImage;
                    }}
                  />

                  {/* Product Info */}
                  <div>
                    <p style={{ margin: 0, fontWeight: "500" }}>
                      {product.name || item.name || "Product unavailable"}
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