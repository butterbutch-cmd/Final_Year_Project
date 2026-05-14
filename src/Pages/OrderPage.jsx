// import { useEffect, useState } from "react";
// import UserHeader from "../Components/UserProfilePageComponent/UserProfileHeader";
// import noImage from "../assets/no-image.png"; // fallback image

// export default function OrdersPage() {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // 🔹 Fetch orders on mount
//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) return setOrders([]);

//         const res = await fetch("http://localhost:5000/api/user/orders", {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         if (!res.ok) throw new Error("Failed to fetch orders");

//         const data = await res.json();
//         setOrders(data || []);
//       } catch (err) {
//         console.error("Failed to fetch orders", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOrders();
//   }, []);

//   // 🔹 Helper to resolve product images
//   const getImageSrc = (image) => image || noImage;

//   // 🔹 Helper to determine color based on status
//   const getStatusColor = (status) => {
//     switch (status) {
//       case "COMPLETED":
//       case "DELIVERED":
//         return "green";
//       case "SHIPPED":
//         return "orange";
//       case "PENDING":
//         return "blue";
//       case "FAILED":
//       case "CANCELLED":
//         return "red";
//       default:
//         return "#555";
//     }
//   };

//   // 🔹 Determine if order can be cancelled
//   const canCancel = (order) =>
//     order.status === "PENDING" ||
//     order.deliveryStatus === "PENDING" ||
//     order.transaction?.status === "PENDING" ||
//     order.transaction?.deliveryStatus === "PENDING";

//   // 🔹 Cancel order handler
//   const handleCancelOrder = async (orderId) => {
//     const reason = prompt(
//       "Please enter the reason for cancelling this order:\nRefunds may take up to 12 hours."
//     );
//     if (!reason) return alert("Cancellation reason is required.");

//     const confirmCancel = window.confirm(
//       "Are you sure you want to cancel this order? Refunds may take up to 12 hours."
//     );
//     if (!confirmCancel) return;

//     try {
//       const token = localStorage.getItem("token");
//       const res = await fetch(
//         `http://localhost:5000/api/user/orders/${orderId}/cancel`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({ reason }),
//         }
//       );

//       if (!res.ok) throw new Error("Failed to cancel order");

//       alert(
//         "Order cancelled successfully. Refund will be processed within 12 hours."
//       );

//       // 🔹 Update orders locally immediately
//       setOrders((prev) =>
//         prev.map((o) =>
//           o.orderId === orderId || o._id === orderId
//             ? {
//                 ...o,
//                 status: "CANCELLED",
//                 deliveryStatus: "CANCELLED",
//                 cancellation: { reason, cancelledAt: new Date() },
//                 transaction: o.transaction
//                   ? {
//                       ...o.transaction,
//                       status: "CANCELLED",
//                       deliveryStatus: "CANCELLED",
//                       cancellation: { reason, cancelledAt: new Date() },
//                     }
//                   : null,
//               }
//             : o
//         )
//       );
//     } catch (err) {
//       console.error("Cancel order failed:", err);
//       alert("Failed to cancel order. Please try again.");
//     }
//   };

//   // 🔹 Calculate subtotal, tax & shipping from total amount (frontend only)
//   const calculateBreakdown = (total) => {
//     const totalAmount = Number(total) || 0;

//     let subtotal = 0;
//     let tax = 0;
//     let shipping = 0;

//     // Try free-shipping case first
//     const possibleSubtotalFree = totalAmount / 1.13;

//     if (possibleSubtotalFree > 3000) {
//       subtotal = possibleSubtotalFree;
//       shipping = 0;
//     } else {
//       subtotal = (totalAmount - 100) / 1.13;
//       shipping = 100;
//     }

//     subtotal = Math.round(subtotal);
//     tax = Math.round(subtotal * 0.13);

//     return { subtotal, tax, shipping };
//   };

//   return (
//     <>
//       <UserHeader />

//       <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
//         <h2 style={{ marginBottom: "20px" }}>My Orders</h2>

//         {loading && <p>Loading orders...</p>}
//         {!loading && orders.length === 0 && (
//           <p>You have not placed any orders yet.</p>
//         )}

//         {orders.map((order, index) => (
//           <div
//             key={order.orderId || order._id}
//             style={{
//               border: "1px solid #ddd",
//               borderRadius: "10px",
//               padding: "16px",
//               marginBottom: "20px",
//               background: "#fff",
//             }}
//           >
//             <h4>Order #{index + 1}</h4>

//             <p>
//               <strong>Date:</strong>{" "}
//               {new Date(order.purchasedAt).toLocaleDateString()}
//             </p>

//             {/* Payment Status */}
//             <p>
//               <strong>Payment Status:</strong>{" "}
//               <span style={{ color: getStatusColor(order.transaction?.status) }}>
//                 {order.transaction?.status || "—"}
//               </span>
//             </p>

//             {/* Payment Gateway */}
//             <p>
//               <strong>Payment Gateway:</strong>{" "}
//               {(order.transaction?.paymentGateway || order.paymentGateway) === "cod"
//                 ? "Cash On Delivery"
//                 : order.transaction?.paymentGateway || order.paymentGateway || "—"}
//             </p>

//             {/* Transaction ID */}
//             <p>
//               <strong>Transaction ID:</strong>{" "}
//               {order.transaction?.transactionId || "—"}
//             </p>

//             {/* Delivery Status */}
//             <p>
//               <strong>Delivery Status:</strong>{" "}
//               <span
//                 style={{
//                   color: getStatusColor(order.transaction?.deliveryStatus),
//                 }}
//               >
//                 {order.transaction?.deliveryStatus || "—"}
//               </span>
//             </p>

//             {/* Subtotal / Tax / Shipping / Total */}
//             {(() => {
//               const total =
//                 order.totalAmount ?? order.transaction?.amount ?? 0;

//               const { subtotal, tax, shipping } = calculateBreakdown(total);

//               return (
//                 <>
//                   <p>
//                     <strong>Subtotal:</strong> Rs. {subtotal}
//                   </p>

//                   <p>
//                     <strong>Tax (13%):</strong> Rs. {tax}
//                   </p>

//                   <p>
//                     <strong>Shipping:</strong>{" "}
//                     {shipping === 0 ? "Free" : `Rs. ${shipping}`}
//                   </p>

//                   <p>
//                     <strong>Total:</strong> Rs. {total}
//                   </p>
//                 </>
//               );
//             })()}

//             {/* Cancel Order Button */}
//             {canCancel(order) && (
//               <button
//                 onClick={() => handleCancelOrder(order.orderId || order._id)}
//                 style={{
//                   backgroundColor: "red",
//                   color: "white",
//                   padding: "8px 12px",
//                   border: "none",
//                   borderRadius: "5px",
//                   cursor: "pointer",
//                   marginBottom: "10px",
//                 }}
//               >
//                 Cancel Order
//               </button>
//             )}

//             {/* Show cancellation reason if cancelled */}
//             {order.status === "CANCELLED" && order.cancellation?.reason && (
//               <p style={{ color: "red", fontStyle: "italic" }}>
//                 Cancelled: {order.cancellation.reason} (
//                 {new Date(order.cancellation.cancelledAt).toLocaleString()})
//               </p>
//             )}

//             <hr />

//             {/* Order Items */}
//             {order.items.map((item) => {
//               const product = item.product || {};
//               return (
//                 <div
//                   key={item._id || product._id || Math.random()}
//                   style={{
//                     display: "flex",
//                     alignItems: "center",
//                     gap: "14px",
//                     marginBottom: "12px",
//                   }}
//                 >
//                   {/* Product Image */}
//                   <img
//                     src={getImageSrc(product.image1)}
//                     alt={product.name || "Product"}
//                     style={{
//                       width: "60px",
//                       height: "60px",
//                       objectFit: "cover",
//                       borderRadius: "6px",
//                       border: "1px solid #ddd",
//                     }}
//                     onError={(e) => {
//                       e.currentTarget.src = noImage;
//                     }}
//                   />

//                   {/* Product Info */}
//                   <div>
//                     <p style={{ margin: 0, fontWeight: "500" }}>
//                       {product.name || item.name || "Product unavailable"}
//                     </p>
//                     <p style={{ margin: 0, fontSize: "14px", color: "#555" }}>
//                       Qty: {item.quantity} × Rs. {item.price}
//                     </p>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         ))}
//       </div>
//     </>
//   );
// }


import { useEffect, useState } from "react";
import UserHeader from "../Components/UserProfilePageComponent/UserProfileHeader";
import noImage from "../assets/no-image.png";

const serif = { fontFamily: "'Cormorant Garamond', serif" };
const sans = { fontFamily: "'DM Sans', sans-serif" };

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const getImageSrc = (image) => image || noImage;

  const getStatusStyle = (status) => {
    switch (status) {
      case "COMPLETED":
      case "DELIVERED":
        return "bg-[#2d4a2d]/10 text-[#2d4a2d]";
      case "SHIPPED":
        return "bg-amber-50 text-amber-700";
      case "PENDING":
        return "bg-sky-50 text-sky-700";
      case "FAILED":
      case "CANCELLED":
        return "bg-[#c4704a]/10 text-[#c4704a]";
      default:
        return "bg-[#f7f4ee] text-[#8c8880]";
    }
  };

  const canCancel = (order) =>
    order.status === "PENDING" ||
    order.deliveryStatus === "PENDING" ||
    order.transaction?.status === "PENDING" ||
    order.transaction?.deliveryStatus === "PENDING";

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

  const calculateBreakdown = (total) => {
    const totalAmount = Number(total) || 0;
    let subtotal = 0;
    let tax = 0;
    let shipping = 0;

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
    <div className="min-h-screen bg-[#fdfcf8]">
      <UserHeader />

      {/* Page Heading */}
      <div className="border-b border-[#2d4a2d]/10 px-6 lg:px-14 py-10">
        <p
          className="text-[11px] tracking-[0.2em] uppercase text-[#7a9e7e] mb-2"
          style={sans}
        >
          ✦ Your purchases
        </p>
        <h1
          className="font-light text-[#1a3320] m-0 leading-tight"
          style={{ ...serif, fontSize: "clamp(32px, 4vw, 48px)" }}
        >
          My Orders
        </h1>
      </div>

      <div className="max-w-[900px] mx-auto px-6 lg:px-14 py-12">

        {/* Loading */}
        {loading && (
          <div className="flex items-center gap-3 py-10">
            <div className="w-5 h-5 rounded-full border-2 border-[#2d4a2d]/20 border-t-[#2d4a2d] animate-spin" />
            <p className="text-[13px] text-[#8c8880] font-light" style={sans}>
              Loading orders…
            </p>
          </div>
        )}

        {/* Empty */}
        {!loading && orders.length === 0 && (
          <div className="text-center py-20 flex flex-col items-center gap-3">
            <p
              className="text-[11px] tracking-[0.2em] uppercase text-[#7a9e7e]"
              style={sans}
            >
              ✦ Nothing here yet
            </p>
            <p
              className="font-light text-[#1a3320] text-[28px]"
              style={serif}
            >
              No orders placed
            </p>
            <p
              className="text-[13px] text-[#8c8880] font-light"
              style={sans}
            >
              Your order history will appear here once you make a purchase.
            </p>
          </div>
        )}

        {/* Orders List */}
        <div className="flex flex-col gap-6">
          {orders.map((order, index) => {
            const total = order.totalAmount ?? order.transaction?.amount ?? 0;
            const { subtotal, tax, shipping } = calculateBreakdown(total);
            const paymentStatus = order.transaction?.status;
            const deliveryStatus = order.transaction?.deliveryStatus;
            const paymentGateway =
              order.transaction?.paymentGateway || order.paymentGateway;

            return (
              <div
                key={order.orderId || order._id}
                className="border border-[#2d4a2d]/12 bg-white rounded-sm overflow-hidden"
              >
                {/* Order Header */}
                <div className="px-6 py-4 bg-[#f7f4ee] border-b border-[#2d4a2d]/10 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p
                      className="text-[10px] tracking-[0.12em] uppercase text-[#8c8880] mb-0.5"
                      style={sans}
                    >
                      Order #{index + 1}
                    </p>
                    <p
                      className="text-[13px] font-light text-[#1a3320]"
                      style={sans}
                    >
                      {new Date(order.purchasedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {paymentStatus && (
                      <span
                        className={`text-[10px] px-2.5 py-1 rounded-sm tracking-[0.08em] uppercase font-medium ${getStatusStyle(paymentStatus)}`}
                        style={sans}
                      >
                        {paymentStatus}
                      </span>
                    )}
                    {deliveryStatus && (
                      <span
                        className={`text-[10px] px-2.5 py-1 rounded-sm tracking-[0.08em] uppercase font-medium ${getStatusStyle(deliveryStatus)}`}
                        style={sans}
                      >
                        {deliveryStatus}
                      </span>
                    )}
                  </div>
                </div>

                {/* Order Body */}
                <div className="px-6 py-5 flex flex-col gap-5">

                  {/* Meta Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex flex-col gap-0.5">
                      <p
                        className="text-[10px] tracking-[0.1em] uppercase text-[#8c8880]"
                        style={sans}
                      >
                        Payment Method
                      </p>
                      <p
                        className="text-[13px] font-light text-[#1a3320]"
                        style={sans}
                      >
                        {paymentGateway === "cod"
                          ? "Cash on Delivery 💵"
                          : paymentGateway === "esewa"
                          ? "eSewa 💚"
                          : paymentGateway === "khalti"
                          ? "Khalti 💜"
                          : paymentGateway || "—"}
                      </p>
                    </div>

                    <div className="flex flex-col gap-0.5">
                      <p
                        className="text-[10px] tracking-[0.1em] uppercase text-[#8c8880]"
                        style={sans}
                      >
                        Transaction ID
                      </p>
                      <p
                        className="text-[12px] font-medium text-[#1a3320] break-all"
                        style={sans}
                      >
                        {order.transaction?.transactionId || "—"}
                      </p>
                    </div>
                  </div>

                  <div className="h-px bg-[#2d4a2d]/8" />

                  {/* Order Items */}
                  <div className="flex flex-col gap-3">
                    {order.items.map((item) => {
                      const product = item.product || {};
                      return (
                        <div
                          key={item._id || product._id || Math.random()}
                          className="flex items-center gap-4"
                        >
                          <img
                            src={getImageSrc(product.image1)}
                            alt={product.name || "Product"}
                            className="w-14 h-14 object-cover rounded-sm flex-shrink-0 bg-[#e8e4dc] border border-[#2d4a2d]/10"
                            onError={(e) => {
                              e.currentTarget.src = noImage;
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <p
                              className="text-[13px] font-light text-[#1a3320] truncate"
                              style={sans}
                            >
                              {product.name || item.name || "Product unavailable"}
                            </p>
                            <p
                              className="text-[12px] text-[#8c8880] font-light mt-0.5"
                              style={sans}
                            >
                              Qty: {item.quantity} × Rs. {item.price}
                            </p>
                          </div>
                          <span
                            className="text-[13px] font-light text-[#1a3320] flex-shrink-0"
                            style={sans}
                          >
                            Rs. {(item.quantity * item.price).toFixed(0)}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="h-px bg-[#2d4a2d]/8" />

                  {/* Price Breakdown */}
                  <div className="flex flex-col gap-2">
                    {[
                      { label: "Subtotal", value: `Rs. ${subtotal}` },
                      { label: "Tax (13%)", value: `Rs. ${tax}` },
                      {
                        label: "Shipping",
                        value: shipping === 0 ? "Free" : `Rs. ${shipping}`,
                        highlight: shipping === 0,
                      },
                    ].map(({ label, value, highlight }) => (
                      <div
                        key={label}
                        className="flex items-center justify-between"
                      >
                        <span
                          className="text-[12px] font-light text-[#8c8880]"
                          style={sans}
                        >
                          {label}
                        </span>
                        <span
                          className={`text-[12px] font-light ${
                            highlight ? "text-[#2d4a2d] font-medium" : "text-[#2c2c2c]"
                          }`}
                          style={sans}
                        >
                          {value}
                        </span>
                      </div>
                    ))}

                    <div className="flex items-baseline justify-between pt-2 border-t border-[#2d4a2d]/10 mt-1">
                      <span
                        className="text-[12px] font-medium tracking-[0.06em] uppercase text-[#1a3320]"
                        style={sans}
                      >
                        Total
                      </span>
                      <span
                        className="text-[20px] font-light text-[#1a3320]"
                        style={serif}
                      >
                        Rs. {total}
                      </span>
                    </div>
                  </div>

                  {/* Cancellation Notice */}
                  {order.status === "CANCELLED" && order.cancellation?.reason && (
                    <div className="bg-[#c4704a]/5 border border-[#c4704a]/15 rounded-sm px-4 py-3">
                      <p
                        className="text-[12px] text-[#c4704a] font-light leading-relaxed"
                        style={sans}
                      >
                        <span className="font-medium">Cancelled:</span>{" "}
                        {order.cancellation.reason}{" "}
                        <span className="text-[#c4704a]/60">
                          ({new Date(order.cancellation.cancelledAt).toLocaleString()})
                        </span>
                      </p>
                    </div>
                  )}

                  {/* Cancel Button */}
                  {canCancel(order) && (
                    <button
                      onClick={() =>
                        handleCancelOrder(order.orderId || order._id)
                      }
                      className="self-start px-5 py-2.5 bg-transparent text-[#c4704a] text-[11.5px] font-medium tracking-[0.12em] uppercase border border-[#c4704a]/30 cursor-pointer rounded-sm hover:bg-[#c4704a]/5 hover:border-[#c4704a] transition-all duration-200"
                      style={sans}
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}