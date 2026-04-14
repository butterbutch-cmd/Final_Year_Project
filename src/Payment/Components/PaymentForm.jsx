// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// const PaymentComponent = () => {
//   const navigate = useNavigate();

//   const [userAddresses, setUserAddresses] = useState([]);
//   const [selectedAddress, setSelectedAddress] = useState(null);
//   const [loadingAddress, setLoadingAddress] = useState(true);

//   const [cartItems, setCartItems] = useState([]);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const [formData, setFormData] = useState({
//     customerName: "",
//     customerEmail: "",
//     customerPhone: "",
//     paymentGateway: "esewa", // default
//   });

//   // ---------------- TAX & SHIPPING ----------------
//   const TAX_RATE = 0.13; // 13% tax
//   const BASE_SHIPPING_COST = 100; // default shipping
//   const FREE_SHIPPING_THRESHOLD = 3000; // free shipping if subtotal > 3000

//   // ---------------- FETCH CART ITEMS ----------------
//   useEffect(() => {
//     const fetchCart = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const res = await fetch("http://localhost:5000/api/user/cart", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         if (!res.ok) throw new Error("Failed to fetch cart");
//         const data = await res.json();
//         setCartItems(data.cart || []);
//       } catch (err) {
//         console.error("Error fetching cart:", err);
//       }
//     };
//     fetchCart();
//   }, []);

//   // ---------------- FETCH USER ADDRESSES ----------------
//   useEffect(() => {
//     const fetchAddresses = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const res = await fetch("http://localhost:5000/api/user/addresses", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         if (!res.ok) throw new Error("Failed to fetch addresses");
//         const data = await res.json();
//         setUserAddresses(data);
//         const defaultAddr = data.find((addr) => addr.isDefault);
//         if (defaultAddr) setSelectedAddress(defaultAddr);
//       } catch (err) {
//         console.error("Error fetching addresses:", err);
//       } finally {
//         setLoadingAddress(false);
//       }
//     };
//     fetchAddresses();
//   }, []);

//   // ---------------- CALCULATE AMOUNTS ----------------
//   const subtotal = cartItems.reduce(
//     (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
//     0
//   );
//   const taxAmount = subtotal * TAX_RATE;
//   const shippingCost = subtotal > FREE_SHIPPING_THRESHOLD ? 0 : BASE_SHIPPING_COST;
//   const totalAmount = subtotal + taxAmount + shippingCost;

//   // ---------------- HANDLE PAYMENT ----------------
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!selectedAddress) return alert("Please select a delivery address first");
//     if (!cartItems.length) return alert("Your cart is empty");

//     setIsSubmitting(true);

//     try {
//       const payload = {
//         customerName: formData.customerName,
//         customerEmail: formData.customerEmail,
//         customerPhone: formData.customerPhone,
//         cartItems: cartItems.map((item) => ({
//           productId: item.product?._id,
//           name: item.product?.name || "Unknown",
//           price: item.price,
//           quantity: item.quantity,
//         })),
//         subtotal,
//         taxAmount,
//         shippingCost,
//         amount: totalAmount, // total for payment
//         paymentGateway: formData.paymentGateway,
//         deliveryAddress: selectedAddress,
//       };

//       const token = localStorage.getItem("token");

//       if (formData.paymentGateway === "cod" || formData.paymentGateway === "cash_on_delivery") {
//         // === Cash on Delivery flow ===
//         const response = await axios.post(
//           "http://localhost:5000/api/payment/initiate-cash-on-delivery-payment",
//           payload,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );

//         // expected response example: { transactionId: "...", message: "Order placed" }
//         if (response.data?.transactionId) {
//           sessionStorage.setItem("current_transaction_id", response.data.transactionId);
//           // You can redirect to any order-success page you have. Change as needed:
//           // navigate("/order-success");
//           alert(
//             `Order placed (Cash on Delivery).\nTransaction ID: ${response.data.transactionId}`
//           );
//           // Optionally clear cart in client or refetch cart state here
//         } else {
//           alert(response.data?.message || "Cash on Delivery initiation failed");
//         }
//       } else {
//         // === Online payment (eSewa / Khalti) flow ===
//         const response = await axios.post(
//           "http://localhost:5000/api/payment/initiate-payment",
//           payload,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );

//         if (response.data.url && response.data.transactionId) {
//           sessionStorage.setItem("current_transaction_id", response.data.transactionId);
//           window.location.href = response.data.url; // redirect to payment gateway
//         } else {
//           alert("Payment URL missing");
//         }
//       }
//     } catch (err) {
//       console.error("Payment error:", err.response?.data || err);
//       alert(err.response?.data?.message || "Payment failed");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
//       <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8">
//         <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
//           Checkout
//         </h1>

//         {/* ---------------- DELIVERY ADDRESS ---------------- */}
//         <div className="mb-6">
//           <div className="flex items-center justify-between mb-2">
//             <h3 className="font-semibold text-gray-700">Delivery Address</h3>
//             <button
//               type="button"
//               onClick={() => navigate("/profile")}
//               className="text-blue-600 font-medium text-sm hover:underline"
//             >
//               Edit
//             </button>
//           </div>

//           {loadingAddress ? (
//             <p className="text-gray-500 text-sm">Loading addresses...</p>
//           ) : userAddresses.length === 0 ? (
//             <p className="text-gray-500 text-sm">
//               No saved addresses. Please add one in your profile.
//             </p>
//           ) : (
//             <div className="space-y-2">
//               {userAddresses.map((addr) => {
//                 const isSelected = selectedAddress?._id === addr._id;
//                 return (
//                   <div
//                     key={addr._id}
//                     onClick={() => setSelectedAddress(addr)}
//                     className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-all ${
//                       isSelected
//                         ? "border-green-600 bg-green-50"
//                         : "border-gray-200 hover:border-gray-300"
//                     }`}
//                   >
//                     <div className="mt-1">
//                       <div
//                         className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
//                           isSelected ? "border-green-600" : "border-gray-400"
//                         }`}
//                       >
//                         {isSelected && (
//                           <div className="w-2 h-2 bg-green-600 rounded-full"></div>
//                         )}
//                       </div>
//                     </div>

//                     <div className="flex-1">
//                       <div className="flex items-center gap-2 mb-1">
//                         <span className="font-medium text-sm text-gray-800">
//                           {addr.label || "Address"}
//                         </span>
//                         {addr.isDefault && (
//                           <span className="text-xs px-2 py-0.5 bg-green-600 text-white rounded-full">
//                             Default
//                           </span>
//                         )}
//                       </div>
//                       <p className="text-gray-700 text-sm">
//                         {addr.street}, {addr.city}, {addr.state}, {addr.postalCode},{" "}
//                         {addr.country}
//                       </p>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </div>

//         {/* ---------------- CART ITEMS ---------------- */}
//         <div className="mb-6">
//           <h3 className="font-semibold text-gray-700 mb-2">Your Cart</h3>
//           {cartItems.length === 0 ? (
//             <p className="text-gray-500 text-sm">Your cart is empty.</p>
//           ) : (
//             <div className="space-y-2">
//               {cartItems.map((item) => {
//                 if (!item.product) return null;
//                 return (
//                   <div key={item._id} className="flex justify-between p-3 border rounded-lg">
//                     <span>
//                       {item.product.name} x {item.quantity}
//                     </span>
//                     <span>Rs {item.price * item.quantity}</span>
//                   </div>
//                 );
//               })}
//               <div className="flex justify-between text-sm mt-2">
//                 <span>Subtotal:</span>
//                 <span>Rs {subtotal.toFixed(2)}</span>
//               </div>
//               <div className="flex justify-between text-sm">
//                 <span>Tax (13%):</span>
//                 <span>Rs {taxAmount.toFixed(2)}</span>
//               </div>
//               <div className="flex justify-between text-sm">
//                 <span>Shipping:</span>
//                 <span>
//                   Rs {shippingCost} {shippingCost === 0 && "(Free!)"}
//                 </span>
//               </div>
//               <div className="flex justify-between font-semibold mt-2">
//                 <span>Total:</span>
//                 <span>Rs {totalAmount.toFixed(2)}</span>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* ---------------- CHECKOUT FORM ---------------- */}
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <input
//             name="customerName"
//             placeholder="Full Name"
//             value={formData.customerName}
//             onChange={(e) =>
//               setFormData((prev) => ({ ...prev, customerName: e.target.value }))
//             }
//             required
//             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
//           />
//           <input
//             name="customerEmail"
//             type="email"
//             placeholder="Email"
//             value={formData.customerEmail}
//             onChange={(e) =>
//               setFormData((prev) => ({ ...prev, customerEmail: e.target.value }))
//             }
//             required
//             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
//           />
//           <input
//             name="customerPhone"
//             placeholder="Phone"
//             value={formData.customerPhone}
//             onChange={(e) =>
//               setFormData((prev) => ({ ...prev, customerPhone: e.target.value }))
//             }
//             required
//             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
//           />
//           <select
//             name="paymentGateway"
//             value={formData.paymentGateway}
//             onChange={(e) =>
//               setFormData((prev) => ({ ...prev, paymentGateway: e.target.value }))
//             }
//             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
//           >
//             <option value="esewa">eSewa</option>
//             <option value="khalti">Khalti</option>
//             <option value="cod">Cash on Delivery</option>
//           </select>
//           <button
//             type="submit"
//             disabled={isSubmitting}
//             className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 rounded-lg"
//           >
//             {isSubmitting
//               ? "Processing..."
//               : formData.paymentGateway === "cod"
//               ? "Place Order (Cash on Delivery)"
//               : "Proceed to Payment"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default PaymentComponent;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { MapPin, ShoppingBag, ChevronRight, Check } from "lucide-react";
import Header from "/FYP/Final_Year_Project/src/Components/Header/Header";

const serif = { fontFamily: "'Cormorant Garamond', serif" };
const sans  = { fontFamily: "'DM Sans', sans-serif" };

const PAYMENT_OPTIONS = [
  { value: "esewa",  label: "eSewa",            icon: "💚" },
  { value: "khalti", label: "Khalti",            icon: "💜" },
  { value: "cod",    label: "Cash on Delivery",  icon: "💵" },
];

const Field = ({ label, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[11px] tracking-[0.1em] uppercase text-[#8c8880]" style={sans}>
      {label}
    </label>
    {children}
  </div>
);

const inputCls = "w-full px-4 py-3 bg-transparent border border-[#2d4a2d]/20 rounded-sm text-[13.5px] text-[#2c2c2c] placeholder-[#c8c4bc] outline-none focus:border-[#2d4a2d] transition-colors duration-200";

const PaymentComponent = () => {
  const navigate = useNavigate();

  const [userAddresses, setUserAddresses]   = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loadingAddress, setLoadingAddress] = useState(true);
  const [cartItems, setCartItems]           = useState([]);
  const [isSubmitting, setIsSubmitting]     = useState(false);

  const [formData, setFormData] = useState({
    customerName:    "",
    customerEmail:   "",
    customerPhone:   "",
    paymentGateway:  "esewa",
  });

  const TAX_RATE               = 0.13;
  const BASE_SHIPPING_COST     = 100;
  const FREE_SHIPPING_THRESHOLD = 3000;

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
      } catch (err) { console.error("Error fetching cart:", err); }
    };
    fetchCart();
  }, []);

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
      } catch (err) { console.error("Error fetching addresses:", err); }
      finally { setLoadingAddress(false); }
    };
    fetchAddresses();
  }, []);

  const subtotal     = cartItems.reduce((s, i) => s + (i.price || 0) * (i.quantity || 0), 0);
  const taxAmount    = subtotal * TAX_RATE;
  const shippingCost = subtotal > FREE_SHIPPING_THRESHOLD ? 0 : BASE_SHIPPING_COST;
  const totalAmount  = subtotal + taxAmount + shippingCost;

  const handleField = (key) => (e) =>
    setFormData((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAddress)   return alert("Please select a delivery address first");
    if (!cartItems.length)  return alert("Your cart is empty");
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const payload = {
        ...formData,
        cartItems: cartItems.map((item) => ({
          productId: item.product?._id,
          name:      item.product?.name || "Unknown",
          price:     item.price,
          quantity:  item.quantity,
        })),
        subtotal, taxAmount, shippingCost,
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
          sessionStorage.setItem("current_transaction_id", res.data.transactionId);
          alert(`Order placed (Cash on Delivery).\nTransaction ID: ${res.data.transactionId}`);
        } else {
          alert(res.data?.message || "Cash on Delivery initiation failed");
        }
      } else {
        const res = await axios.post(
          "http://localhost:5000/api/payment/initiate-payment",
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.data.url && res.data.transactionId) {
          sessionStorage.setItem("current_transaction_id", res.data.transactionId);
          window.location.href = res.data.url;
        } else {
          alert("Payment URL missing");
        }
      }
    } catch (err) {
      console.error("Payment error:", err.response?.data || err);
      alert(err.response?.data?.message || "Payment failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfcf8]">
      <Header />

      {/* Page title */}
      <div className="border-b border-[#2d4a2d]/10 px-6 lg:px-14 py-10">
        <p className="text-[11px] tracking-[0.2em] uppercase text-[#7a9e7e] m-0 mb-2" style={sans}>
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

        {/* ══════════════ LEFT — Form ══════════════ */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-10">

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
              <p className="text-[13px] text-[#8c8880] font-light" style={sans}>
                Loading addresses…
              </p>
            ) : userAddresses.length === 0 ? (
              <div className="border border-dashed border-[#2d4a2d]/20 rounded-sm px-5 py-4">
                <p className="text-[13px] text-[#8c8880] font-light m-0" style={sans}>
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
                      {/* Radio dot */}
                      <div className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                        selected ? "border-[#2d4a2d]" : "border-[#8c8880]/50"
                      }`}>
                        {selected && <div className="w-2 h-2 bg-[#2d4a2d] rounded-full" />}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[13px] font-medium text-[#1a3320]" style={sans}>
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
                        <p className="text-[13px] font-light text-[#8c8880] m-0" style={sans}>
                          {addr.street}, {addr.city}, {addr.state}, {addr.postalCode}, {addr.country}
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
                    {/* Custom radio */}
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                      active ? "border-[#2d4a2d]" : "border-[#8c8880]/50"
                    }`}>
                      {active && <div className="w-2 h-2 bg-[#2d4a2d] rounded-full" />}
                    </div>
                    <span className="text-xl">{icon}</span>
                    <span className="text-[13.5px] font-light text-[#2c2c2c]" style={sans}>
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

          {/* Submit — mobile only */}
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

        {/* ══════════════ RIGHT — Order Summary ══════════════ */}
        <aside className="lg:sticky lg:top-28">
          <div className="border border-[#2d4a2d]/12 bg-[#f7f4ee] rounded-sm p-6 flex flex-col gap-6">

            {/* Header */}
            <div className="flex items-center gap-2.5">
              <ShoppingBag size={15} className="text-[#7a9e7e]" />
              <h2
                className="text-[13px] font-medium tracking-[0.08em] uppercase text-[#1a3320] m-0"
                style={sans}
              >
                Order Summary
              </h2>
            </div>

            {/* Cart items */}
            {cartItems.length === 0 ? (
              <p className="text-[13px] text-[#8c8880] font-light m-0" style={sans}>
                Your cart is empty.
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {cartItems.map((item) => {
                  if (!item.product) return null;
                  return (
                    <div key={item._id} className="flex items-start justify-between gap-3">
                      {/* Thumbnail */}
                      {item.product.image1 && (
                        <img
                          src={item.product.image1}
                          alt={item.product.name}
                          className="w-12 h-12 object-cover rounded-sm flex-shrink-0 bg-[#e8e4dc]"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-light text-[#1a3320] m-0 truncate" style={sans}>
                          {item.product.name}
                        </p>
                        <p className="text-[11px] text-[#8c8880] m-0 mt-0.5" style={sans}>
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <span className="text-[13px] font-medium text-[#1a3320] flex-shrink-0" style={sans}>
                        Rs. {(item.price * item.quantity).toFixed(0)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Divider */}
            <div className="h-px bg-[#2d4a2d]/10" />

            {/* Totals */}
            <div className="flex flex-col gap-2.5">
              {[
                { label: "Subtotal",   value: `Rs. ${subtotal.toFixed(2)}` },
                { label: "Tax (13%)",  value: `Rs. ${taxAmount.toFixed(2)}` },
                {
                  label: "Shipping",
                  value: shippingCost === 0 ? "Free" : `Rs. ${shippingCost}`,
                  highlight: shippingCost === 0,
                },
              ].map(({ label, value, highlight }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-[12.5px] font-light text-[#8c8880]" style={sans}>{label}</span>
                  <span
                    className={`text-[12.5px] ${highlight ? "text-[#2d4a2d] font-medium" : "text-[#2c2c2c] font-light"}`}
                    style={sans}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div className="h-px bg-[#2d4a2d]/10" />

            {/* Total */}
            <div className="flex items-baseline justify-between">
              <span className="text-[13px] font-medium tracking-[0.06em] uppercase text-[#1a3320]" style={sans}>
                Total
              </span>
              <span
                className="text-[22px] font-light text-[#1a3320]"
                style={serif}
              >
                Rs. {totalAmount.toFixed(2)}
              </span>
            </div>

            {/* Free shipping nudge */}
            {subtotal < FREE_SHIPPING_THRESHOLD && (
              <div className="bg-[#2d4a2d]/[0.05] border border-[#2d4a2d]/10 rounded-sm px-4 py-3">
                <p className="text-[11.5px] font-light text-[#2d4a2d] m-0" style={sans}>
                  Add Rs. {(FREE_SHIPPING_THRESHOLD - subtotal).toFixed(0)} more for free shipping 🌿
                </p>
              </div>
            )}

            {/* Submit — desktop */}
            <button
              type="submit"
              form="checkout-form"
              disabled={isSubmitting}
              onClick={handleSubmit}
              className="w-full py-4 bg-[#1a3320] text-[#f7f4ee] text-[12px] font-medium tracking-[0.14em] uppercase border-none cursor-pointer rounded-sm hover:bg-[#2d4a2d] hover:-translate-y-px transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              style={sans}
            >
              {isSubmitting
                ? "Processing…"
                : formData.paymentGateway === "cod"
                ? "Place Order"
                : "Proceed to Payment"}
            </button>

            {/* Trust note */}
            <p className="text-[11px] text-center text-[#8c8880] font-light m-0" style={sans}>
              🔒 Secure checkout · Free returns within 30 days
            </p>
          </div>
        </aside>

      </div>
    </div>
  );
};

export default PaymentComponent;