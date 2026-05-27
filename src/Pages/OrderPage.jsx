import { useEffect, useState } from "react";
import UserHeader from "../Components/UserProfilePageComponent/UserProfileHeader";
import noImage from "../assets/no-image.png";
import Footer from "../Components/Header/Footer";
import toast from "react-hot-toast";

const serif = { fontFamily: "'Cormorant Garamond', serif" };
const sans = { fontFamily: "'DM Sans', sans-serif" };

const ORDERS_PER_PAGE = 6;

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState(null);

  // ---- Modal state ----
  const [cancelModal, setCancelModal] = useState({
    isOpen: false,
    orderId: null,
    step: "input", // "input" | "confirm"
    reason: "",
    loading: false,
  });

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

  // Open the modal instead of using prompt/confirm
  const openCancelModal = (orderId) => {
    setCancelModal({
      isOpen: true,
      orderId,
      step: "input",
      reason: "",
      loading: false,
    });
  };

  // Close the modal completely
  const closeCancelModal = () => {
    setCancelModal((prev) => ({ ...prev, isOpen: false }));
  };

  // Handle moving from input step to confirm step
  const proceedToConfirm = () => {
    if (!cancelModal.reason.trim()) {
      toast.error("Please provide a cancellation reason.");
      return;
    }
    setCancelModal((prev) => ({ ...prev, step: "confirm" }));
  };

  // Final cancellation call
  const executeCancel = async () => {
    setCancelModal((prev) => ({ ...prev, loading: true }));
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:5000/api/user/orders/${cancelModal.orderId}/cancel`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ reason: cancelModal.reason }),
        }
      );
      if (!res.ok) throw new Error("Failed to cancel order");
      toast.success("Order cancelled successfully. Refund will be processed within 12 hours.");
      setOrders((prev) =>
        prev.map((o) =>
          o.orderId === cancelModal.orderId || o._id === cancelModal.orderId
            ? {
                ...o,
                status: "CANCELLED",
                deliveryStatus: "CANCELLED",
                cancellation: { reason: cancelModal.reason, cancelledAt: new Date() },
                transaction: o.transaction
                  ? {
                      ...o.transaction,
                      status: "CANCELLED",
                      deliveryStatus: "CANCELLED",
                      cancellation: { reason: cancelModal.reason, cancelledAt: new Date() },
                    }
                  : null,
              }
            : o
        )
      );
      closeCancelModal();
    } catch (err) {
      console.error("Cancel order failed:", err);
      toast.error("Failed to cancel order. Please try again.");
    } finally {
      setCancelModal((prev) => ({ ...prev, loading: false }));
    }
  };

  const calculateBreakdown = (total) => {
    const totalAmount = Number(total) || 0;
    let subtotal, shipping;
    const possibleSubtotalFree = totalAmount / 1.13;
    if (possibleSubtotalFree > 3000) {
      subtotal = possibleSubtotalFree;
      shipping = 0;
    } else {
      subtotal = (totalAmount - 100) / 1.13;
      shipping = 100;
    }
    subtotal = Math.round(subtotal);
    const tax = Math.round(subtotal * 0.13);
    return { subtotal, tax, shipping };
  };

  const totalPages = Math.ceil(orders.length / ORDERS_PER_PAGE);
  const paginated = orders.slice((page - 1) * ORDERS_PER_PAGE, page * ORDERS_PER_PAGE);

  const toggleExpand = (id) => setExpanded((prev) => (prev === id ? null : id));

  return (
    <div className="min-h-screen bg-[#fdfcf8]">
      <UserHeader />

      {/* Page Heading */}
      <div className="border-b border-[#2d4a2d]/10 px-4 sm:px-8 py-8">
        <p
          className="text-[10px] tracking-[0.2em] uppercase text-[#7a9e7e] mb-1"
          style={sans}
        >
          ✦ Your purchases
        </p>
        <h1
          className="font-light text-[#1a3320] m-0 leading-tight"
          style={{ ...serif, fontSize: "clamp(26px, 3.5vw, 40px)" }}
        >
          My Orders
        </h1>
      </div>

      <div className="px-4 sm:px-8 py-8">
        {/* Loading */}
        {loading && (
          <div className="flex items-center gap-3 py-10">
            <div className="w-4 h-4 rounded-full border-2 border-[#2d4a2d]/20 border-t-[#2d4a2d] animate-spin" />
            <p className="text-[13px] text-[#8c8880] font-light" style={sans}>
              Loading orders…
            </p>
          </div>
        )}

        {/* Empty */}
        {!loading && orders.length === 0 && (
          <div className="text-center py-20 flex flex-col items-center gap-2">
            <p className="text-[10px] tracking-[0.2em] uppercase text-[#7a9e7e]" style={sans}>
              ✦ Nothing here yet
            </p>
            <p className="font-light text-[#1a3320] text-[26px]" style={serif}>
              No orders placed
            </p>
            <p className="text-[13px] text-[#8c8880] font-light" style={sans}>
              Your order history will appear here once you make a purchase.
            </p>
          </div>
        )}

        {/* Orders Grid */}
        {!loading && orders.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paginated.map((order, index) => {
                const globalIndex = (page - 1) * ORDERS_PER_PAGE + index + 1;
                const total = order.totalAmount ?? order.transaction?.amount ?? 0;
                const { subtotal, tax, shipping } = calculateBreakdown(total);
                const paymentStatus = order.transaction?.status;
                const deliveryStatus = order.transaction?.deliveryStatus;
                const paymentGateway =
                  order.transaction?.paymentGateway || order.paymentGateway;
                const cardId = order.orderId || order._id;
                const isOpen = expanded === cardId;

                return (
                  <div
                    key={cardId}
                    className="border border-[#2d4a2d]/12 bg-white rounded-sm overflow-hidden flex flex-col"
                  >
                    {/* Card Header — always visible, clickable to expand */}
                    <button
                      onClick={() => toggleExpand(cardId)}
                      className="w-full text-left px-4 py-3 bg-[#f7f4ee] border-b border-[#2d4a2d]/10 flex items-center justify-between gap-2 hover:bg-[#f0ece4] transition-colors duration-150"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Thumbnail stack */}
                        <div className="flex -space-x-2 flex-shrink-0">
                          {order.items.slice(0, 3).map((item, i) => (
                            <img
                              key={i}
                              src={getImageSrc(item.product?.image1)}
                              alt=""
                              className="w-8 h-8 rounded-sm object-cover border border-white bg-[#e8e4dc]"
                              onError={(e) => { e.currentTarget.src = noImage; }}
                            />
                          ))}
                          {order.items.length > 3 && (
                            <div className="w-8 h-8 rounded-sm bg-[#e8e4dc] border border-white flex items-center justify-center">
                              <span className="text-[9px] text-[#8c8880]" style={sans}>
                                +{order.items.length - 3}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="text-[10px] tracking-[0.1em] uppercase text-[#8c8880] leading-none mb-0.5" style={sans}>
                            Order #{globalIndex}
                          </p>
                          <p className="text-[12px] font-light text-[#1a3320] truncate" style={sans}>
                            {new Date(order.purchasedAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <div className="flex gap-1.5 flex-wrap justify-end">
                          {paymentStatus && (
                            <span
                              className={`text-[9px] px-2 py-0.5 rounded-sm tracking-[0.07em] uppercase font-medium ${getStatusStyle(paymentStatus)}`}
                              style={sans}
                            >
                              {paymentStatus}
                            </span>
                          )}
                          {deliveryStatus && (
                            <span
                              className={`text-[9px] px-2 py-0.5 rounded-sm tracking-[0.07em] uppercase font-medium ${getStatusStyle(deliveryStatus)}`}
                              style={sans}
                            >
                              {deliveryStatus}
                            </span>
                          )}
                        </div>
                        {/* Chevron */}
                        <svg
                          className={`w-3.5 h-3.5 text-[#8c8880] transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </button>

                    {/* Collapsed summary — always visible */}
                    <div className="px-4 py-3 flex items-center justify-between">
                      <p className="text-[12px] text-[#8c8880] font-light" style={sans}>
                        {order.items.length} item{order.items.length !== 1 ? "s" : ""} ·{" "}
                        {paymentGateway === "cod"
                          ? "Cash on Delivery"
                          : paymentGateway === "esewa"
                          ? "eSewa"
                          : paymentGateway === "khalti"
                          ? "Khalti"
                          : paymentGateway || "—"}
                      </p>
                      <span className="text-[16px] font-light text-[#1a3320]" style={serif}>
                        Rs. {total}
                      </span>
                    </div>

                    {/* Expanded details */}
                    {isOpen && (
                      <div className="border-t border-[#2d4a2d]/8 px-4 py-4 flex flex-col gap-4">
                        {/* Transaction ID */}
                        {order.transaction?.transactionId && (
                          <div>
                            <p className="text-[10px] tracking-[0.1em] uppercase text-[#8c8880] mb-0.5" style={sans}>
                              Transaction ID
                            </p>
                            <p className="text-[11px] font-medium text-[#1a3320] break-all" style={sans}>
                              {order.transaction.transactionId}
                            </p>
                          </div>
                        )}

                        <div className="h-px bg-[#2d4a2d]/8" />

                        {/* Items */}
                        <div className="flex flex-col gap-2.5">
                          {order.items.map((item) => {
                            const product = item.product || {};
                            return (
                              <div key={item._id || product._id || Math.random()} className="flex items-center gap-3">
                                <img
                                  src={getImageSrc(product.image1)}
                                  alt={product.name || "Product"}
                                  className="w-11 h-11 object-cover rounded-sm flex-shrink-0 bg-[#e8e4dc] border border-[#2d4a2d]/10"
                                  onError={(e) => { e.currentTarget.src = noImage; }}
                                />
                                <div className="flex-1 min-w-0">
                                  <p className="text-[12px] font-light text-[#1a3320] truncate" style={sans}>
                                    {product.name || item.name || "Product unavailable"}
                                  </p>
                                  <p className="text-[11px] text-[#8c8880] font-light mt-0.5" style={sans}>
                                    Qty: {item.quantity} × Rs. {item.price}
                                  </p>
                                </div>
                                <span className="text-[12px] font-light text-[#1a3320] flex-shrink-0" style={sans}>
                                  Rs. {(item.quantity * item.price).toFixed(0)}
                                </span>
                              </div>
                            );
                          })}
                        </div>

                        <div className="h-px bg-[#2d4a2d]/8" />

                        {/* Price Breakdown */}
                        <div className="flex flex-col gap-1.5">
                          {[
                            { label: "Subtotal", value: `Rs. ${subtotal}` },
                            { label: "Tax (13%)", value: `Rs. ${tax}` },
                            { label: "Shipping", value: shipping === 0 ? "Free" : `Rs. ${shipping}`, highlight: shipping === 0 },
                          ].map(({ label, value, highlight }) => (
                            <div key={label} className="flex items-center justify-between">
                              <span className="text-[11px] font-light text-[#8c8880]" style={sans}>{label}</span>
                              <span
                                className={`text-[11px] font-light ${highlight ? "text-[#2d4a2d] font-medium" : "text-[#2c2c2c]"}`}
                                style={sans}
                              >
                                {value}
                              </span>
                            </div>
                          ))}
                          <div className="flex items-baseline justify-between pt-1.5 border-t border-[#2d4a2d]/10 mt-0.5">
                            <span className="text-[11px] font-medium tracking-[0.06em] uppercase text-[#1a3320]" style={sans}>
                              Total
                            </span>
                            <span className="text-[17px] font-light text-[#1a3320]" style={serif}>
                              Rs. {total}
                            </span>
                          </div>
                        </div>

                        {/* Cancellation Notice */}
                        {order.status === "CANCELLED" && order.cancellation?.reason && (
                          <div className="bg-[#c4704a]/5 border border-[#c4704a]/15 rounded-sm px-3 py-2.5">
                            <p className="text-[11px] text-[#c4704a] font-light leading-relaxed" style={sans}>
                              <span className="font-medium">Cancelled:</span>{" "}
                              {order.cancellation.reason}{" "}
                              <span className="text-[#c4704a]/60">
                                ({new Date(order.cancellation.cancelledAt).toLocaleString()})
                              </span>
                            </p>
                          </div>
                        )}

                        {/* Cancel Button – now opens modal instead of prompt */}
                        {canCancel(order) && (
                          <button
                            onClick={() => openCancelModal(order.orderId || order._id)}
                            className="self-start px-4 py-2 bg-transparent text-[#c4704a] text-[10.5px] font-medium tracking-[0.12em] uppercase border border-[#c4704a]/30 cursor-pointer rounded-sm hover:bg-[#c4704a]/5 hover:border-[#c4704a] transition-all duration-200"
                            style={sans}
                          >
                            Cancel Order
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-[#2d4a2d]/10">
                <p className="text-[11px] text-[#8c8880] font-light" style={sans}>
                  Showing {(page - 1) * ORDERS_PER_PAGE + 1}–
                  {Math.min(page * ORDERS_PER_PAGE, orders.length)} of {orders.length} orders
                </p>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => { setPage((p) => Math.max(1, p - 1)); setExpanded(null); }}
                    disabled={page === 1}
                    className="w-8 h-8 flex items-center justify-center border border-[#2d4a2d]/15 text-[#1a3320] rounded-sm disabled:opacity-30 hover:bg-[#f7f4ee] transition-colors duration-150"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => { setPage(p); setExpanded(null); }}
                      className={`w-8 h-8 text-[11px] rounded-sm border transition-colors duration-150 ${
                        p === page
                          ? "bg-[#2d4a2d] text-white border-[#2d4a2d]"
                          : "border-[#2d4a2d]/15 text-[#1a3320] hover:bg-[#f7f4ee]"
                      }`}
                      style={sans}
                    >
                      {p}
                    </button>
                  ))}

                  <button
                    onClick={() => { setPage((p) => Math.min(totalPages, p + 1)); setExpanded(null); }}
                    disabled={page === totalPages}
                    className="w-8 h-8 flex items-center justify-center border border-[#2d4a2d]/15 text-[#1a3320] rounded-sm disabled:opacity-30 hover:bg-[#f7f4ee] transition-colors duration-150"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* ---- Cancellation Modal ---- */}
      {cancelModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
          {/* Modal backdrop click to close (when not loading) */}
          <div
            className="absolute inset-0"
            onClick={cancelModal.loading ? undefined : closeCancelModal}
          />

          {/* Modal dialog */}
          <div className="relative w-full max-w-md bg-white rounded-sm shadow-xl border border-[#2d4a2d]/10 p-6 z-10">
            {/* Close button */}
            {!cancelModal.loading && (
              <button
                onClick={closeCancelModal}
                className="absolute top-3 right-3 text-[#8c8880] hover:text-[#1a3320] transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}

            {cancelModal.step === "input" ? (
              <>
                <h2 className="text-lg font-light text-[#1a3320] mb-4" style={serif}>
                  Cancel Order
                </h2>
                <p className="text-[13px] text-[#8c8880] mb-4" style={sans}>
                  Please provide a reason for cancellation. Refunds may take up to 12 hours.
                </p>
                <textarea
                  value={cancelModal.reason}
                  onChange={(e) =>
                    setCancelModal((prev) => ({ ...prev, reason: e.target.value }))
                  }
                  placeholder="Enter cancellation reason..."
                  rows={3}
                  className="w-full border border-[#2d4a2d]/15 rounded-sm p-3 text-[13px] text-[#1a3320] placeholder:text-[#8c8880] focus:outline-none focus:border-[#2d4a2d]/50 resize-none"
                  style={sans}
                  disabled={cancelModal.loading}
                />
                <div className="flex justify-end gap-3 mt-5">
                  <button
                    onClick={closeCancelModal}
                    className="px-4 py-2 text-[11px] uppercase tracking-[0.1em] text-[#8c8880] border border-[#2d4a2d]/15 rounded-sm hover:bg-[#f7f4ee] transition-colors"
                    style={sans}
                  >
                    Keep Order
                  </button>
                  <button
                    onClick={proceedToConfirm}
                    className="px-4 py-2 text-[11px] uppercase tracking-[0.1em] bg-[#c4704a] text-white rounded-sm hover:bg-[#b05a3a] transition-colors disabled:opacity-50"
                    style={sans}
                    disabled={cancelModal.loading}
                  >
                    Proceed to Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-lg font-light text-[#1a3320] mb-4" style={serif}>
                  Confirm Cancellation
                </h2>
                <p className="text-[13px] text-[#8c8880] mb-2" style={sans}>
                  You are about to cancel this order for the following reason:
                </p>
                <div className="bg-[#f7f4ee] border border-[#2d4a2d]/10 rounded-sm p-3 mb-4">
                  <p className="text-[13px] text-[#1a3320] italic" style={sans}>
                    “{cancelModal.reason}”
                  </p>
                </div>
                <p className="text-[12px] text-[#c4704a] mb-5" style={sans}>
                  Refunds may take up to 12 hours. This action cannot be undone.
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() =>
                      setCancelModal((prev) => ({ ...prev, step: "input" }))
                    }
                    className="px-4 py-2 text-[11px] uppercase tracking-[0.1em] text-[#8c8880] border border-[#2d4a2d]/15 rounded-sm hover:bg-[#f7f4ee] transition-colors"
                    style={sans}
                    disabled={cancelModal.loading}
                  >
                    Back
                  </button>
                  <button
                    onClick={executeCancel}
                    className={`px-4 py-2 text-[11px] uppercase tracking-[0.1em] bg-[#c4704a] text-white rounded-sm hover:bg-[#b05a3a] transition-colors flex items-center gap-2 disabled:opacity-50 ${
                      cancelModal.loading ? "cursor-wait" : ""
                    }`}
                    style={sans}
                    disabled={cancelModal.loading}
                  >
                    {cancelModal.loading ? (
                      <>
                        <div className="w-3 h-3 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                        Cancelling…
                      </>
                    ) : (
                      "Confirm Cancel"
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}