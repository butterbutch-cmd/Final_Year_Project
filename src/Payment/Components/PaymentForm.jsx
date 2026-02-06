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
//     paymentGateway: "esewa",
//   });

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

//   // ---------------- CALCULATE TOTAL AMOUNT ----------------
//   const totalAmount = cartItems.reduce(
//     (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
//     0
//   );

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
//         // optional: you can let backend compute total to avoid mismatch,
//         // but we still send amount for convenience.
//         amount: totalAmount,
//         paymentGateway: formData.paymentGateway,
//         deliveryAddress: selectedAddress,
//       };

//       const token = localStorage.getItem("token");
//       const response = await axios.post(
//         "http://localhost:5000/api/payment/initiate-payment",
//         payload,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       if (response.data.url && response.data.transactionId) {
//         // store transactionId (MongoDB id) — backend expects this later
//         sessionStorage.setItem("current_transaction_id", response.data.transactionId);
//         // redirect to payment provider (eSewa / Khalti)
//         window.location.href = response.data.url;
//       } else {
//         alert("Payment URL missing");
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
//                 if (!item.product) return null; // skip invalid
//                 return (
//                   <div key={item._id} className="flex justify-between p-3 border rounded-lg">
//                     <span>
//                       {item.product.name} x {item.quantity}
//                     </span>
//                     <span>Rs {item.price * item.quantity}</span>
//                   </div>
//                 );
//               })}
//               <div className="flex justify-between font-semibold mt-2">
//                 <span>Total:</span>
//                 <span>Rs {totalAmount}</span>
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
//           </select>
//           <button
//             type="submit"
//             disabled={isSubmitting}
//             className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 rounded-lg"
//           >
//             {isSubmitting ? "Processing..." : "Proceed to Payment"}
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

const PaymentComponent = () => {
  const navigate = useNavigate();

  const [userAddresses, setUserAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loadingAddress, setLoadingAddress] = useState(true);

  const [cartItems, setCartItems] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    paymentGateway: "esewa",
  });

  // ---------------- TAX & SHIPPING ----------------
  const TAX_RATE = 0.13; // 13% tax
  const BASE_SHIPPING_COST = 100; // default shipping
  const FREE_SHIPPING_THRESHOLD = 3000; // free shipping if subtotal > 3000

  // ---------------- FETCH CART ITEMS ----------------
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

  // ---------------- FETCH USER ADDRESSES ----------------
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
        const defaultAddr = data.find((addr) => addr.isDefault);
        if (defaultAddr) setSelectedAddress(defaultAddr);
      } catch (err) {
        console.error("Error fetching addresses:", err);
      } finally {
        setLoadingAddress(false);
      }
    };
    fetchAddresses();
  }, []);

  // ---------------- CALCULATE AMOUNTS ----------------
  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
    0
  );
  const taxAmount = subtotal * TAX_RATE;
  const shippingCost = subtotal > FREE_SHIPPING_THRESHOLD ? 0 : BASE_SHIPPING_COST;
  const totalAmount = subtotal + taxAmount + shippingCost;

  // ---------------- HANDLE PAYMENT ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedAddress) return alert("Please select a delivery address first");
    if (!cartItems.length) return alert("Your cart is empty");

    setIsSubmitting(true);

    try {
      const payload = {
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        cartItems: cartItems.map((item) => ({
          productId: item.product?._id,
          name: item.product?.name || "Unknown",
          price: item.price,
          quantity: item.quantity,
        })),
        subtotal,
        taxAmount,
        shippingCost,
        amount: totalAmount, // total for payment
        paymentGateway: formData.paymentGateway,
        deliveryAddress: selectedAddress,
      };

      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/payment/initiate-payment",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.url && response.data.transactionId) {
        sessionStorage.setItem("current_transaction_id", response.data.transactionId);
        window.location.href = response.data.url; // redirect to payment gateway
      } else {
        alert("Payment URL missing");
      }
    } catch (err) {
      console.error("Payment error:", err.response?.data || err);
      alert(err.response?.data?.message || "Payment failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Checkout
        </h1>

        {/* ---------------- DELIVERY ADDRESS ---------------- */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-700">Delivery Address</h3>
            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="text-blue-600 font-medium text-sm hover:underline"
            >
              Edit
            </button>
          </div>

          {loadingAddress ? (
            <p className="text-gray-500 text-sm">Loading addresses...</p>
          ) : userAddresses.length === 0 ? (
            <p className="text-gray-500 text-sm">
              No saved addresses. Please add one in your profile.
            </p>
          ) : (
            <div className="space-y-2">
              {userAddresses.map((addr) => {
                const isSelected = selectedAddress?._id === addr._id;
                return (
                  <div
                    key={addr._id}
                    onClick={() => setSelectedAddress(addr)}
                    className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-all ${
                      isSelected
                        ? "border-green-600 bg-green-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="mt-1">
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          isSelected ? "border-green-600" : "border-gray-400"
                        }`}
                      >
                        {isSelected && (
                          <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                        )}
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm text-gray-800">
                          {addr.label || "Address"}
                        </span>
                        {addr.isDefault && (
                          <span className="text-xs px-2 py-0.5 bg-green-600 text-white rounded-full">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-gray-700 text-sm">
                        {addr.street}, {addr.city}, {addr.state}, {addr.postalCode},{" "}
                        {addr.country}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ---------------- CART ITEMS ---------------- */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-700 mb-2">Your Cart</h3>
          {cartItems.length === 0 ? (
            <p className="text-gray-500 text-sm">Your cart is empty.</p>
          ) : (
            <div className="space-y-2">
              {cartItems.map((item) => {
                if (!item.product) return null;
                return (
                  <div key={item._id} className="flex justify-between p-3 border rounded-lg">
                    <span>
                      {item.product.name} x {item.quantity}
                    </span>
                    <span>Rs {item.price * item.quantity}</span>
                  </div>
                );
              })}
              <div className="flex justify-between text-sm mt-2">
                <span>Subtotal:</span>
                <span>Rs {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax (13%):</span>
                <span>Rs {taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Shipping:</span>
                <span>
                  Rs {shippingCost} {shippingCost === 0 && "(Free!)"}
                </span>
              </div>
              <div className="flex justify-between font-semibold mt-2">
                <span>Total:</span>
                <span>Rs {totalAmount.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>

        {/* ---------------- CHECKOUT FORM ---------------- */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="customerName"
            placeholder="Full Name"
            value={formData.customerName}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, customerName: e.target.value }))
            }
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <input
            name="customerEmail"
            type="email"
            placeholder="Email"
            value={formData.customerEmail}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, customerEmail: e.target.value }))
            }
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <input
            name="customerPhone"
            placeholder="Phone"
            value={formData.customerPhone}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, customerPhone: e.target.value }))
            }
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <select
            name="paymentGateway"
            value={formData.paymentGateway}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, paymentGateway: e.target.value }))
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
          >
            <option value="esewa">eSewa</option>
            <option value="khalti">Khalti</option>
          </select>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 rounded-lg"
          >
            {isSubmitting ? "Processing..." : "Proceed to Payment"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentComponent;
