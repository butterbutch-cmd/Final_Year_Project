import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  MapPin,
  ShoppingBag,
  ChevronRight,
  Check,
  Minus,
  Plus,
  Trash2,
} from "lucide-react";
import Header from "../Components/Header/Header.jsx";
import esewaLogo from "/FYP/Final_Year_Project/src/assets/esewa.png";

const serif = { fontFamily: "'Cormorant Garamond', serif" };
const sans = { fontFamily: "'DM Sans', sans-serif" };

// const PAYMENT_OPTIONS = [
//   { value: "esewa", label: "eSewa", icon: "💚" },
//   { value: "khalti", label: "Khalti", icon: "💜" },
//   { value: "cod", label: "Cash on Delivery", icon: "💵" },
// ];

const PAYMENT_OPTIONS = [
  {
    value: "esewa",
    label: "eSewa",
    icon: (
      <img
        src={esewaLogo}
        alt="eSewa"
        className="w-10 h-10 object-contain"
      />
    ),
  },
  { value: "cod", label: "Cash on Delivery", icon: "💵" },
];


const Field = ({ label, children }) => (
  <div className="flex flex-col gap-1.5">
    <label
      className="text-[11px] tracking-[0.1em] uppercase text-[#8c8880]"
      style={sans}
    >
      {label}
    </label>
    {children}
  </div>
);

const inputCls =
  "w-full px-4 py-3 bg-transparent border border-[#2d4a2d]/20 rounded-sm text-[13.5px] text-[#2c2c2c] placeholder-[#c8c4bc] outline-none focus:border-[#2d4a2d] transition-colors duration-200";

const PaymentComponent = () => {
  const navigate = useNavigate();

  const [userAddresses, setUserAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loadingAddress, setLoadingAddress] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [codResult, setCodResult] = useState(null); // "success" | "failed"
  const [codTransactionId, setCodTransactionId] = useState(null);
  const [codErrorMessage, setCodErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    paymentGateway: "esewa",
  });

  const TAX_RATE = 0.13;
  const BASE_SHIPPING_COST = 100;
  const FREE_SHIPPING_THRESHOLD = 3000;
 {/* Fetch cart items on component mount */}
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/user/cart", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch cart");
        const data = await res.json();
        setCartItems(data.cart || []);
      } catch (err) {
        console.error("Error fetching cart:", err);
      }
    };

    fetchCart();
  }, []);

  {/** Fetch user addresses on component mount */}
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/user/addresses", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch addresses");
        const data = await res.json();
        setUserAddresses(data);
        const def = data.find((a) => a.isDefault);
        if (def) setSelectedAddress(def);
      } catch (err) {
        console.error("Error fetching addresses:", err);
      } finally {
        setLoadingAddress(false);
      }
    };

    fetchAddresses();
  }, []);

  const subtotal = cartItems.reduce(
    (s, i) => s + (i.price || 0) * (i.quantity || 0),
    0
  );
  const taxAmount = subtotal * TAX_RATE;
  const shippingCost =
    subtotal > FREE_SHIPPING_THRESHOLD ? 0 : BASE_SHIPPING_COST;
  const totalAmount = subtotal + taxAmount + shippingCost;

  const handleField = (key) => (e) =>
    setFormData((prev) => ({ ...prev, [key]: e.target.value }));

  const updateQuantity = async (productId, action) => {
    try {
      const targetItem = cartItems.find(
        (item) => item.product?._id === productId
      );
      if (!targetItem) return;

      const currentStock =
        typeof targetItem.product?.stock === "number"
          ? targetItem.product.stock
          : null;

      if (action === "increase" && currentStock !== null) {
        if (targetItem.quantity + 1 > currentStock) {
          alert(`Only ${currentStock} items available in stock.`);
          return;
        }
      }

      setCartItems((prev) =>
        prev.map((item) => {
          if (item.product?._id !== productId) return item;
          const nextQty =
            action === "increase"
              ? item.quantity + 1
              : Math.max(1, item.quantity - 1);
          return { ...item, quantity: nextQty };
        })
      );

      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/user/cart/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, action }),
      });

      if (!res.ok) throw new Error("Failed to update cart quantity");
    } catch (err) {
      console.error("Quantity update error:", err);
      window.location.reload();
    }
  };

  const removeItem = async (productId) => {
    try {
      const prevItems = [...cartItems];
      setCartItems((prev) =>
        prev.filter((item) => item.product?._id !== productId)
      );

      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/user/cart/remove", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId }),
      });

      if (!res.ok) {
        setCartItems(prevItems);
        throw new Error("Failed to remove cart item");
      }
    } catch (err) {
      console.error("Remove item error:", err);
      window.location.reload();
    }
  };

  const checkStockBeforeSubmit = async () => {
    const token = localStorage.getItem("token");

    for (const item of cartItems) {
      const productId = item.product?._id;
      if (!productId) throw new Error("Invalid cart item: missing product ID");

      let latestStock = null;
      let latestName = item.product?.name || "This item";

      try {
        const res = await fetch(
          `http://localhost:5000/api/products/${productId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) throw new Error("Failed to fetch latest product stock");

        const data = await res.json();
        const product = data.product || data.data || data;
        latestStock =
          typeof product?.stock === "number"
            ? product.stock
            : Number(product?.stock);
        latestName = product?.name || latestName;
      } catch (err) {
        console.error("Stock fetch error:", err);
        throw new Error(`Could not verify stock for ${latestName}`);
      }

      if (Number.isNaN(latestStock) || latestStock === null)
        throw new Error(`Stock data unavailable for ${latestName}`);

      if (item.quantity > latestStock) {
        alert(`Only ${latestStock} items available for ${latestName}.`);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedAddress) {
      alert("Please select a delivery address first");
      return;
    }

    if (!cartItems.length) {
      alert("Your cart is empty");
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");

      const stockOk = await checkStockBeforeSubmit();
      if (!stockOk) return;

      const payload = {
        ...formData,
        cartItems: cartItems.map((item) => ({
          productId: item.product?._id,
          name: item.product?.name || "Unknown",
          price: item.price,
          quantity: item.quantity,
        })),
        subtotal,
        taxAmount,
        shippingCost,
        amount: totalAmount,
        deliveryAddress: selectedAddress,
      };

      if (formData.paymentGateway === "cod") {
        const res = await axios.post(
          "http://localhost:5000/api/payment/initiate-cash-on-delivery-payment",
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.data?.transactionId) {
          sessionStorage.setItem(
            "current_transaction_id",
            res.data.transactionId
          );
          setCodTransactionId(res.data.transactionId);
          setCodResult("success");
        } else {
          setCodErrorMessage(
            res.data?.message || "Cash on Delivery initiation failed"
          );
          setCodResult("failed");
        }
        return;
      }

      // eSewa / Khalti
      const res = await axios.post(
        "http://localhost:5000/api/payment/initiate-payment",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data?.url && res.data?.transactionId) {
        sessionStorage.setItem(
          "current_transaction_id",
          res.data.transactionId
        );
        window.location.href = res.data.url;
      } else {
        alert("Payment URL missing");
      }
    } catch (err) {
      console.error("Payment error:", err.response?.data || err);
      if (formData.paymentGateway === "cod") {
        setCodErrorMessage(
          err.response?.data?.message || err.message || "Order failed"
        );
        setCodResult("failed");
      } else {
        alert(err.response?.data?.message || err.message || "Payment failed");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── COD SUCCESS SCREEN ───────────────────────────────────────────────────
  if (codResult === "success") {
    return (
      <div className="min-h-screen bg-[#fdfcf8] flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center px-6 py-20">
          <div className="max-w-md w-full text-center flex flex-col items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-[#2d4a2d]/10 flex items-center justify-center">
              <Check size={36} className="text-[#2d4a2d]" strokeWidth={1.8} />
            </div>

            <div>
              <p
                className="text-[11px] tracking-[0.2em] uppercase text-[#7a9e7e] mb-2"
                style={sans}
              >
                ✦ Order confirmed
              </p>
              <h1
                className="font-light text-[#1a3320] leading-tight mb-3"
                style={{ ...serif, fontSize: "clamp(28px, 4vw, 40px)" }}
              >
                Order Placed!
              </h1>
              <p
                className="text-[13.5px] text-[#8c8880] font-light leading-relaxed"
                style={sans}
              >
                Your Cash on Delivery order has been confirmed.
                <br />
                Payment will be collected upon delivery.
              </p>
            </div>

            <div className="w-full bg-[#f7f4ee] border border-[#2d4a2d]/12 rounded-sm px-5 py-4 text-left">
              <p
                className="text-[10px] tracking-[0.12em] uppercase text-[#8c8880] mb-1"
                style={sans}
              >
                Transaction ID
              </p>
              <p
                className="text-[13px] text-[#1a3320] font-medium break-all"
                style={sans}
              >
                {codTransactionId}
              </p>
            </div>

            <div className="w-full bg-[#f7f4ee] border border-[#2d4a2d]/12 rounded-sm px-5 py-4 text-left">
              <p
                className="text-[10px] tracking-[0.12em] uppercase text-[#8c8880] mb-1"
                style={sans}
              >
                Delivery Address
              </p>
              <p
                className="text-[13px] text-[#1a3320] font-light leading-relaxed"
                style={sans}
              >
                {selectedAddress?.street}, {selectedAddress?.city},{" "}
                {selectedAddress?.state}, {selectedAddress?.postalCode},{" "}
                {selectedAddress?.country}
              </p>
            </div>

            <div className="flex gap-3 w-full">
              <button
                onClick={() => navigate("/orders")}
                className="flex-1 py-3.5 bg-[#1a3320] text-[#f7f4ee] text-[12px] font-medium tracking-[0.14em] uppercase border-none cursor-pointer rounded-sm hover:bg-[#2d4a2d] hover:-translate-y-px transition-all duration-200"
                style={sans}
              >
                View Orders
              </button>
              <button
                onClick={() => navigate("/")}
                className="flex-1 py-3.5 bg-transparent text-[#1a3320] text-[12px] font-medium tracking-[0.14em] uppercase border border-[#2d4a2d]/25 cursor-pointer rounded-sm hover:border-[#2d4a2d] transition-all duration-200"
                style={sans}
              >
                Continue Shopping
              </button>
            </div>

            <p
              className="text-[11px] text-[#8c8880] font-light"
              style={sans}
            >
              A confirmation email has been sent to{" "}
              <span className="text-[#2d4a2d]">{formData.customerEmail}</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ─── COD FAILURE SCREEN ───────────────────────────────────────────────────
  if (codResult === "failed") {
    return (
      <div className="min-h-screen bg-[#fdfcf8] flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center px-6 py-20">
          <div className="max-w-md w-full text-center flex flex-col items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-[#c4704a]/10 flex items-center justify-center">
              <svg
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#c4704a"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </div>

            <div>
              <p
                className="text-[11px] tracking-[0.2em] uppercase text-[#c4704a]/70 mb-2"
                style={sans}
              >
                ✦ Order failed
              </p>
              <h1
                className="font-light text-[#1a3320] leading-tight mb-3"
                style={{ ...serif, fontSize: "clamp(28px, 4vw, 40px)" }}
              >
                Something went wrong
              </h1>
              <p
                className="text-[13.5px] text-[#8c8880] font-light leading-relaxed"
                style={sans}
              >
                {codErrorMessage ||
                  "We couldn't place your order. Please try again."}
              </p>
            </div>

            <div className="w-full bg-[#c4704a]/5 border border-[#c4704a]/15 rounded-sm px-5 py-4 text-left">
              <p
                className="text-[12px] text-[#c4704a] font-light leading-relaxed"
                style={sans}
              >
                If this keeps happening, please check your cart or contact
                support.
              </p>
            </div>

            <div className="flex gap-3 w-full">
              <button
                onClick={() => {
                  setCodResult(null);
                  setCodErrorMessage("");
                }}
                className="flex-1 py-3.5 bg-[#1a3320] text-[#f7f4ee] text-[12px] font-medium tracking-[0.14em] uppercase border-none cursor-pointer rounded-sm hover:bg-[#2d4a2d] hover:-translate-y-px transition-all duration-200"
                style={sans}
              >
                Try Again
              </button>
              <button
                onClick={() => navigate("/")}
                className="flex-1 py-3.5 bg-transparent text-[#1a3320] text-[12px] font-medium tracking-[0.14em] uppercase border border-[#2d4a2d]/25 cursor-pointer rounded-sm hover:border-[#2d4a2d] transition-all duration-200"
                style={sans}
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── MAIN CHECKOUT FORM ───────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#fdfcf8]">
      <Header />

      <div className="border-b border-[#2d4a2d]/10 px-6 lg:px-14 py-10">
        <p
          className="text-[11px] tracking-[0.2em] uppercase text-[#7a9e7e] m-0 mb-2"
          style={sans}
        >
          ✦ Almost there
        </p>
        <h1
          className="font-light text-[#1a3320] m-0 leading-tight"
          style={{ ...serif, fontSize: "clamp(32px, 4vw, 48px)" }}
        >
          Checkout
        </h1>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 lg:px-14 py-12 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 items-start">
        <form
          id="checkout-form"
          onSubmit={handleSubmit}
          className="flex flex-col gap-10"
        >
          {/* ── Delivery Address ── */}
          <section>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <MapPin size={15} className="text-[#7a9e7e]" />
                <h2
                  className="text-[13px] font-medium tracking-[0.08em] uppercase text-[#1a3320] m-0"
                  style={sans}
                >
                  Delivery Address
                </h2>
              </div>
              <button
                type="button"
                onClick={() => navigate("/profile")}
                className="flex items-center gap-1 text-[11.5px] text-[#2d4a2d] underline underline-offset-2 bg-transparent border-none cursor-pointer p-0 hover:text-[#1a3320] transition-colors"
                style={sans}
              >
                Manage <ChevronRight size={12} />
              </button>
            </div>

            {loadingAddress ? (
              <p
                className="text-[13px] text-[#8c8880] font-light"
                style={sans}
              >
                Loading addresses…
              </p>
            ) : userAddresses.length === 0 ? (
              <div className="border border-dashed border-[#2d4a2d]/20 rounded-sm px-5 py-4">
                <p
                  className="text-[13px] text-[#8c8880] font-light m-0"
                  style={sans}
                >
                  No saved addresses.{" "}
                  <span
                    className="underline underline-offset-2 cursor-pointer text-[#2d4a2d] hover:text-[#1a3320] transition-colors"
                    onClick={() => navigate("/profile")}
                  >
                    Add one in your profile.
                  </span>
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                {userAddresses.map((addr) => {
                  const selected = selectedAddress?._id === addr._id;
                  return (
                    <div
                      key={addr._id}
                      onClick={() => setSelectedAddress(addr)}
                      className={`flex items-start gap-4 px-5 py-4 border cursor-pointer transition-all duration-200 rounded-sm ${
                        selected
                          ? "border-[#2d4a2d] bg-[#2d4a2d]/[0.03]"
                          : "border-[#2d4a2d]/15 hover:border-[#2d4a2d]/35"
                      }`}
                    >
                      <div
                        className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                          selected
                            ? "border-[#2d4a2d]"
                            : "border-[#8c8880]/50"
                        }`}
                      >
                        {selected && (
                          <div className="w-2 h-2 bg-[#2d4a2d] rounded-full" />
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className="text-[13px] font-medium text-[#1a3320]"
                            style={sans}
                          >
                            {addr.label || "Address"}
                          </span>
                          {addr.isDefault && (
                            <span
                              className="text-[10px] px-2 py-0.5 bg-[#2d4a2d] text-[#f7f4ee] rounded-sm tracking-[0.08em] uppercase"
                              style={sans}
                            >
                              Default
                            </span>
                          )}
                        </div>
                        <p
                          className="text-[13px] font-light text-[#8c8880] m-0"
                          style={sans}
                        >
                          {addr.street}, {addr.city}, {addr.state},{" "}
                          {addr.postalCode}, {addr.country}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* ── Contact Details ── */}
          <section>
            <div className="flex items-center gap-2.5 mb-5">
              <span className="text-[#7a9e7e] text-sm">✦</span>
              <h2
                className="text-[13px] font-medium tracking-[0.08em] uppercase text-[#1a3320] m-0"
                style={sans}
              >
                Contact Details
              </h2>
            </div>

            <div className="flex flex-col gap-4">
              <Field label="Full Name">
                <input
                  name="customerName"
                  placeholder="Your full name"
                  value={formData.customerName}
                  onChange={handleField("customerName")}
                  required
                  className={inputCls}
                  style={sans}
                />
              </Field>
              <Field label="Email">
                <input
                  name="customerEmail"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.customerEmail}
                  onChange={handleField("customerEmail")}
                  required
                  className={inputCls}
                  style={sans}
                />
              </Field>
              <Field label="Phone">
                <input
                  name="customerPhone"
                  placeholder="+977 98XXXXXXXX"
                  value={formData.customerPhone}
                  onChange={handleField("customerPhone")}
                  required
                  className={inputCls}
                  style={sans}
                />
              </Field>
            </div>
          </section>

          {/* ── Payment Method ── */}
          <section>
            <div className="flex items-center gap-2.5 mb-5">
              <span className="text-[#7a9e7e] text-sm">✦</span>
              <h2
                className="text-[13px] font-medium tracking-[0.08em] uppercase text-[#1a3320] m-0"
                style={sans}
              >
                Payment Method
              </h2>
            </div>

            <div className="flex flex-col gap-2.5">
              {PAYMENT_OPTIONS.map(({ value, label, icon }) => {
                const active = formData.paymentGateway === value;
                return (
                  <label
                    key={value}
                    className={`flex items-center gap-4 px-5 py-4 border cursor-pointer transition-all duration-200 rounded-sm ${
                      active
                        ? "border-[#2d4a2d] bg-[#2d4a2d]/[0.03]"
                        : "border-[#2d4a2d]/15 hover:border-[#2d4a2d]/35"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentGateway"
                      value={value}
                      checked={active}
                      onChange={handleField("paymentGateway")}
                      className="sr-only"
                    />
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                        active ? "border-[#2d4a2d]" : "border-[#8c8880]/50"
                      }`}
                    >
                      {active && (
                        <div className="w-2 h-2 bg-[#2d4a2d] rounded-full" />
                      )}
                    </div>
                    <div className="flex items-center justify-center w-7 h-7">
                      {icon}
                    </div>
                    <span
                      className="text-[13.5px] font-light text-[#2c2c2c]"
                      style={sans}
                    >
                      {label}
                    </span>
                    {active && (
                      <Check size={14} className="ml-auto text-[#2d4a2d]" />
                    )}
                  </label>
                );
              })}
            </div>
          </section>

          <button
            type="submit"
            disabled={isSubmitting}
            className="lg:hidden w-full py-4 bg-[#1a3320] text-[#f7f4ee] text-[12px] font-medium tracking-[0.14em] uppercase border-none cursor-pointer rounded-sm hover:bg-[#2d4a2d] hover:-translate-y-px transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            style={sans}
          >
            {isSubmitting
              ? "Processing…"
              : formData.paymentGateway === "cod"
              ? "Place Order"
              : "Proceed to Payment"}
          </button>
        </form>

        {/* ── Order Summary Sidebar ── */}
        <aside className="lg:sticky lg:top-28">
          <div className="border border-[#2d4a2d]/12 bg-[#f7f4ee] rounded-sm p-6 flex flex-col gap-6">
            <div className="flex items-center gap-2.5">
              <ShoppingBag size={15} className="text-[#7a9e7e]" />
              <h2
                className="text-[13px] font-medium tracking-[0.08em] uppercase text-[#1a3320] m-0"
                style={sans}
              >
                Order Summary
              </h2>
            </div>

            {cartItems.length === 0 ? (
              <p
                className="text-[13px] text-[#8c8880] font-light m-0"
                style={sans}
              >
                Your cart is empty.
              </p>
            ) : (
              <div className="flex flex-col gap-4">
                {cartItems.map((item) => {
                  if (!item.product) return null;
                  return (
                    <div
                      key={item._id}
                      className="flex items-start justify-between gap-3 pb-3 border-b border-[#2d4a2d]/8 last:border-b-0 last:pb-0"
                    >
                      {item.product.image1 && (
                        <img
                          src={item.product.image1}
                          alt={item.product.name}
                          className="w-12 h-12 object-cover rounded-sm flex-shrink-0 bg-[#e8e4dc]"
                        />
                      )}

                      <div className="flex-1 min-w-0">
                        <p
                          className="text-[13px] font-light text-[#1a3320] m-0 truncate"
                          style={sans}
                        >
                          {item.product.name}
                        </p>

                        <div className="flex items-center gap-2 mt-2">
                          <button
                            type="button"
                            onClick={() =>
                              item.quantity > 1 &&
                              updateQuantity(item.product._id, "decrease")
                            }
                            disabled={item.quantity <= 1}
                            className="w-7 h-7 rounded border border-[#2d4a2d]/20 flex items-center justify-center text-[#2d4a2d] hover:bg-[#2d4a2d]/10 transition disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            <Minus size={13} />
                          </button>

                          <span
                            className="text-[12px] min-w-[20px] text-center text-[#1a3320]"
                            style={sans}
                          >
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.product._id, "increase")
                            }
                            className="w-7 h-7 rounded border border-[#2d4a2d]/20 flex items-center justify-center text-[#2d4a2d] hover:bg-[#2d4a2d]/10 transition"
                          >
                            <Plus size={13} />
                          </button>

                          <button
                            type="button"
                            onClick={() => removeItem(item.product._id)}
                            className="ml-2 w-7 h-7 rounded border border-[#c4704a]/20 flex items-center justify-center text-[#c4704a] hover:bg-[#c4704a]/10 transition"
                            title="Remove item"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>

                      <span
                        className="text-[13px] font-medium text-[#1a3320] flex-shrink-0"
                        style={sans}
                      >
                        Rs. {(item.price * item.quantity).toFixed(0)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="h-px bg-[#2d4a2d]/10" />

            <div className="flex flex-col gap-2.5">
              {[
                { label: "Subtotal", value: `Rs. ${subtotal.toFixed(2)}` },
                { label: "Tax (13%)", value: `Rs. ${taxAmount.toFixed(2)}` },
                {
                  label: "Shipping",
                  value:
                    shippingCost === 0 ? "Free" : `Rs. ${shippingCost}`,
                  highlight: shippingCost === 0,
                },
              ].map(({ label, value, highlight }) => (
                <div
                  key={label}
                  className="flex items-center justify-between"
                >
                  <span
                    className="text-[12.5px] font-light text-[#8c8880]"
                    style={sans}
                  >
                    {label}
                  </span>
                  <span
                    className={`text-[12.5px] ${
                      highlight
                        ? "text-[#2d4a2d] font-medium"
                        : "text-[#2c2c2c] font-light"
                    }`}
                    style={sans}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>

            <div className="h-px bg-[#2d4a2d]/10" />

            <div className="flex items-baseline justify-between">
              <span
                className="text-[13px] font-medium tracking-[0.06em] uppercase text-[#1a3320]"
                style={sans}
              >
                Total
              </span>
              <span
                className="text-[22px] font-light text-[#1a3320]"
                style={serif}
              >
                Rs. {totalAmount.toFixed(2)}
              </span>
            </div>

            {subtotal < FREE_SHIPPING_THRESHOLD && (
              <div className="bg-[#2d4a2d]/[0.05] border border-[#2d4a2d]/10 rounded-sm px-4 py-3">
                <p
                  className="text-[11.5px] font-light text-[#2d4a2d] m-0"
                  style={sans}
                >
                  Add Rs.{" "}
                  {(FREE_SHIPPING_THRESHOLD - subtotal).toFixed(0)} more for
                  free shipping 🌿
                </p>
              </div>
            )}

            <button
              type="submit"
              form="checkout-form"
              disabled={isSubmitting}
              className="w-full py-4 bg-[#1a3320] text-[#f7f4ee] text-[12px] font-medium tracking-[0.14em] uppercase border-none cursor-pointer rounded-sm hover:bg-[#2d4a2d] hover:-translate-y-px transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              style={sans}
            >
              {isSubmitting
                ? "Processing…"
                : formData.paymentGateway === "cod"
                ? "Place Order"
                : "Proceed to Payment"}
            </button>

            <p
              className="text-[11px] text-center text-[#8c8880] font-light m-0"
              style={sans}
            >
              🔒 Secure checkout · Free returns within 30 days
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default PaymentComponent;