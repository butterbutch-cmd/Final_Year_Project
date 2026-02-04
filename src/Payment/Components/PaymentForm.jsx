// // // // import { useState } from "react";
// // // // import axios from "axios";
// // // // import "./demo.css";
// // // // import { generateUniqueId } from "../utils/helpers";


// // // // const PaymentComponent = () => {
// // // //   const [formData, setFormData] = useState({
// // // //     customerName: "John Doe",
// // // //     customerEmail: "john.doe@example.com",
// // // //     customerPhone: "9801234567",
// // // //     productName: "Test Product",
// // // //     amount: "1000",
// // // //     paymentGateway: "esewa",
// // // //   });

// // // //   const [isSubmitting, setIsSubmitting] = useState(false);

// // // //   const handleChange = (e) => {
// // // //     const { name, value } = e.target;
// // // //     setFormData({
// // // //       ...formData,
// // // //       [name]: value,
// // // //     });
// // // //   };

// // // //   const handleSubmit = async (e) => {
// // // //     e.preventDefault();
// // // //     setIsSubmitting(true);

// // // //     try {
// // // //       const productId = generateUniqueId(); // you can keep this as is
// // // //       sessionStorage.setItem("current_transaction_id", productId);

// // // //       const response = await axios.post(
// // // //         "http://localhost:5000/api/payment/initiate-payment",
// // // //         {
// // // //           ...formData,
// // // //           productId,
// // // //         }
// // // //       );

// // // //       if (response.data.url) {
// // // //         window.location.href = response.data.url;
// // // //       } else {
// // // //         console.error("Error: Payment URL is undefined.");
// // // //         alert("Payment URL is invalid. Please try again.");
// // // //       }
// // // //     } catch (error) {
// // // //       console.error("Error initiating payment:", error);
// // // //       alert("Payment failed. Please check the console for details.");
// // // //     } finally {
// // // //       setIsSubmitting(false);
// // // //     }
// // // //   };

// // // //   return (
// // // //     <div className="payment-container">
// // // //       <h1>Payment Integration</h1>
// // // //       <p>Please fill in all the details to proceed with payment</p>

// // // //       <div className="form-container">
// // // //         <form className="styled-form" onSubmit={handleSubmit}>
// // // //           <div className="form-group">
// // // //             <label htmlFor="customerName">Full Name:</label>
// // // //             <input
// // // //               type="text"
// // // //               id="customerName"
// // // //               name="customerName"
// // // //               value={formData.customerName}
// // // //               onChange={handleChange}
// // // //               required
// // // //               placeholder="Enter your full name"
// // // //             />
// // // //           </div>

// // // //           <div className="form-group">
// // // //             <label htmlFor="customerEmail">Email:</label>
// // // //             <input
// // // //               type="email"
// // // //               id="customerEmail"
// // // //               name="customerEmail"
// // // //               value={formData.customerEmail}
// // // //               onChange={handleChange}
// // // //               required
// // // //               placeholder="Enter your email"
// // // //             />
// // // //           </div>

// // // //           <div className="form-group">
// // // //             <label htmlFor="customerPhone">Phone Number:</label>
// // // //             <input
// // // //               type="tel"
// // // //               id="customerPhone"
// // // //               name="customerPhone"
// // // //               value={formData.customerPhone}
// // // //               onChange={handleChange}
// // // //               required
// // // //               placeholder="Enter your phone number"
// // // //             />
// // // //           </div>

// // // //           <div className="form-group">
// // // //             <label htmlFor="productName">Product/Service Name:</label>
// // // //             <input
// // // //               type="text"
// // // //               id="productName"
// // // //               name="productName"
// // // //               value={formData.productName}
// // // //               onChange={handleChange}
// // // //               required
// // // //               placeholder="Enter product/service name"
// // // //             />
// // // //           </div>

// // // //           <div className="form-group">
// // // //             <label htmlFor="amount">Amount (NPR):</label>
// // // //             <input
// // // //               type="number"
// // // //               id="amount"
// // // //               name="amount"
// // // //               value={formData.amount}
// // // //               onChange={handleChange}
// // // //               required
// // // //               min="1"
// // // //               placeholder="Enter amount"
// // // //             />
// // // //           </div>

// // // //           <div className="form-group">
// // // //             <label htmlFor="paymentGateway">Payment Method:</label>
// // // //             <select
// // // //               id="paymentGateway"
// // // //               name="paymentGateway"
// // // //               value={formData.paymentGateway}
// // // //               onChange={handleChange}
// // // //               required
// // // //             >
// // // //               <option value="esewa">eSewa</option>
// // // //               <option value="khalti">Khalti</option>
// // // //             </select>
// // // //           </div>

// // // //           <button
// // // //             type="submit"
// // // //             className="submit-button"
// // // //             disabled={isSubmitting}
// // // //           >
// // // //             {isSubmitting ? "Processing..." : "Proceed to Payment"}
// // // //           </button>
// // // //         </form>
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // };

// // // // export default PaymentComponent;


// // // import { useState, useEffect } from "react";
// // // import { useLocation } from "react-router-dom";
// // // import axios from "axios";
// // // import AddressModal from "../../Components/UserProfilePageComponent/AddressModal";

// // // const PaymentComponent = () => {
// // //   const location = useLocation();
// // //   const productData = location.state;

// // //   const [formData, setFormData] = useState({
// // //     customerName: "",
// // //     customerEmail: "",
// // //     customerPhone: "",
// // //     productName: "",
// // //     amount: "",
// // //     paymentGateway: "esewa",
// // //   });

// // //   const [isSubmitting, setIsSubmitting] = useState(false);

// // //   useEffect(() => {
// // //     if (productData) {
// // //       setFormData((prev) => ({
// // //         ...prev,
// // //         productName: productData.productName || "",
// // //         amount: productData.amount || "",
// // //       }));
// // //     }
// // //   }, [productData]);

// // //   const handleChange = (e) => {
// // //     const { name, value } = e.target;
// // //     setFormData((prev) => ({
// // //       ...prev,
// // //       [name]: value,
// // //     }));
// // //   };

// // //   const handleSubmit = async (e) => {
// // //     e.preventDefault();
// // //     setIsSubmitting(true);

// // //     try {
// // //       const payload = {
// // //         customerName: formData.customerName,
// // //         customerEmail: formData.customerEmail,
// // //         customerPhone: formData.customerPhone,
// // //         productName: formData.productName,
// // //         amount: Number(formData.amount),
// // //         paymentGateway: formData.paymentGateway,
// // //         productId: productData?.productId,
// // //       };

// // //       console.log("🚀 Sending:", payload);

// // //       const response = await axios.post(
// // //         "http://localhost:5000/api/payment/initiate-payment",
// // //         payload
// // //       );

// // //       if (response.data.url) {
// // //         window.location.href = response.data.url;
// // //       } else {
// // //         alert("Payment URL missing");
// // //       }
// // //     } catch (error) {
// // //       console.error("Payment error:", error.response?.data || error);
// // //       alert("Payment failed");
// // //     } finally {
// // //       setIsSubmitting(false);
// // //     }
// // //   };

// // //   return (
// // //     <>
// // //     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
// // //       <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
// // //         <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
// // //           Checkout
// // //         </h1>

// // //         <form onSubmit={handleSubmit} className="space-y-4">
// // //           <div>
// // //             <input
// // //               name="customerName"
// // //               placeholder="Full Name"
// // //               value={formData.customerName}
// // //               onChange={handleChange}
// // //               required
// // //               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
// // //             />
// // //           </div>

// // //           <div>
// // //             <input
// // //               name="customerEmail"
// // //               type="email"
// // //               placeholder="Email"
// // //               value={formData.customerEmail}
// // //               onChange={handleChange}
// // //               required
// // //               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
// // //             />
// // //           </div>

// // //           <div>
// // //             <input
// // //               name="customerPhone"
// // //               placeholder="Phone"
// // //               value={formData.customerPhone}
// // //               onChange={handleChange}
// // //               required
// // //               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
// // //             />
// // //           </div>

// // //           <div>
// // //             <input
// // //               name="productName"
// // //               placeholder="Product"
// // //               value={formData.productName}
// // //               readOnly
// // //               className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
// // //             />
// // //           </div>

// // //           <div>
// // //             <input
// // //               name="amount"
// // //               type="number"
// // //               placeholder="Amount"
// // //               value={formData.amount}
// // //               readOnly
// // //               className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
// // //             />
// // //           </div>

// // //           <div>
// // //             <select
// // //               name="paymentGateway"
// // //               value={formData.paymentGateway}
// // //               onChange={handleChange}
// // //               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white"
// // //             >
// // //               <option value="esewa">eSewa</option>
// // //               <option value="khalti">Khalti</option>
// // //             </select>
// // //           </div>

// // //           <button
// // //             type="submit"
// // //             disabled={isSubmitting}
// // //             className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 disabled:cursor-not-allowed"
// // //           >
// // //             {isSubmitting ? "Processing..." : "Proceed to Payment"}
// // //           </button>
// // //         </form>
// // //       </div>
// // //     </div>
// // //     <AddressModal/>
// // //     </>

// // //   );
// // // };

// // // export default PaymentComponent;
// // import { useState, useEffect } from "react";
// // import { useLocation } from "react-router-dom";
// // import axios from "axios";
// // import AddressModal from "../../Components/UserProfilePageComponent/AddressModal";

// // const PaymentComponent = () => {
// //   const location = useLocation();
// //   const productData = location.state;

// //   const [showAddressModal, setShowAddressModal] = useState(false);
// //   const [selectedAddress, setSelectedAddress] = useState(null);
// //   const [userAddresses, setUserAddresses] = useState([]);
// //   const [loadingAddress, setLoadingAddress] = useState(true);

// //   const [formData, setFormData] = useState({
// //     customerName: "",
// //     customerEmail: "",
// //     customerPhone: "",
// //     productName: "",
// //     amount: "",
// //     paymentGateway: "esewa",
// //   });

// //   const [isSubmitting, setIsSubmitting] = useState(false);

// //   // Load product info
// //   useEffect(() => {
// //     if (productData) {
// //       setFormData((prev) => ({
// //         ...prev,
// //         productName: productData.productName || "",
// //         amount: productData.amount || "",
// //       }));
// //     }
// //   }, [productData]);

// //   // Fetch addresses from backend
// //   useEffect(() => {
// //     const fetchAddresses = async () => {
// //       try {
// //         const token = localStorage.getItem("token");

// //         const res = await fetch("http://localhost:5000/api/user/addresses", {
// //           headers: {
// //             Authorization: `Bearer ${token}`,
// //           },
// //         });

// //         if (!res.ok) throw new Error("Failed to fetch addresses");

// //         const data = await res.json();
// //         setUserAddresses(data);

// //         // Auto-select default
// //         const defaultAddr = data.find((addr) => addr.isDefault);
// //         if (defaultAddr) {
// //           setSelectedAddress(defaultAddr);
// //         }
// //       } catch (err) {
// //         console.error("Error fetching addresses:", err);
// //       } finally {
// //         setLoadingAddress(false);
// //       }
// //     };

// //     fetchAddresses();
// //   }, []);

// //   // When modal saves address
// //   const handleSaveAddress = (address) => {
// //     setSelectedAddress(address);
// //     setUserAddresses((prev) => [...prev, address]);
// //     setShowAddressModal(false);
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();

// //     if (!selectedAddress) {
// //       alert("Please select a delivery address first");
// //       return;
// //     }

// //     setIsSubmitting(true);

// //     try {
// //       const payload = {
// //         customerName: formData.customerName,
// //         customerEmail: formData.customerEmail,
// //         customerPhone: formData.customerPhone,
// //         productName: formData.productName,
// //         amount: Number(formData.amount),
// //         paymentGateway: formData.paymentGateway,
// //         productId: productData?.productId,

// //         deliveryAddress: selectedAddress,
// //       };

// //       console.log("🚀 Sending:", payload);

// //       const response = await axios.post(
// //         "http://localhost:5000/api/payment/initiate-payment",
// //         payload
// //       );

// //       if (response.data.url) {
// //         window.location.href = response.data.url;
// //       } else {
// //         alert("Payment URL missing");
// //       }
// //     } catch (error) {
// //       console.error("Payment error:", error.response?.data || error);
// //       alert("Payment failed");
// //     } finally {
// //       setIsSubmitting(false);
// //     }
// //   };

// //   return (
// //     <>
// //       <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
// //         <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
// //           <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
// //             Checkout
// //           </h1>

// //           {/* Address Section */}
// //           <div className="mb-5">
// //             <div className="flex items-center justify-between mb-2">
// //               <h3 className="font-semibold text-gray-700">Delivery Address</h3>
// //               <button
// //                 type="button"
// //                 onClick={() => setShowAddressModal(true)}
// //                 className="text-blue-600 font-medium text-sm hover:underline"
// //               >
// //                 {selectedAddress ? "Change" : "Add"}
// //               </button>
// //             </div>

// //             {loadingAddress ? (
// //               <p className="text-gray-500 text-sm">Loading address...</p>
// //             ) : selectedAddress ? (
// //               <div className="border border-blue-200 bg-blue-50 p-3 rounded-lg text-sm">
// //                 <p className="font-medium">{selectedAddress.label}</p>
// //                 <p>
// //                   {selectedAddress.street}, {selectedAddress.city}
// //                 </p>
// //                 <p>
// //                   {selectedAddress.postalCode}, {selectedAddress.country}
// //                 </p>
// //               </div>
// //             ) : (
// //               <p className="text-gray-500 text-sm">
// //                 No delivery address found. Please add one.
// //               </p>
// //             )}
// //           </div>

// //           <form onSubmit={handleSubmit} className="space-y-4">
// //             <input
// //               name="customerName"
// //               placeholder="Full Name"
// //               value={formData.customerName}
// //               onChange={(e) =>
// //                 setFormData((prev) => ({
// //                   ...prev,
// //                   customerName: e.target.value,
// //                 }))
// //               }
// //               required
// //               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
// //             />

// //             <input
// //               name="customerEmail"
// //               type="email"
// //               placeholder="Email"
// //               value={formData.customerEmail}
// //               onChange={(e) =>
// //                 setFormData((prev) => ({
// //                   ...prev,
// //                   customerEmail: e.target.value,
// //                 }))
// //               }
// //               required
// //               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
// //             />

// //             <input
// //               name="customerPhone"
// //               placeholder="Phone"
// //               value={formData.customerPhone}
// //               onChange={(e) =>
// //                 setFormData((prev) => ({
// //                   ...prev,
// //                   customerPhone: e.target.value,
// //                 }))
// //               }
// //               required
// //               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
// //             />

// //             <input
// //               name="productName"
// //               value={formData.productName}
// //               readOnly
// //               className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
// //             />

// //             <input
// //               name="amount"
// //               type="number"
// //               value={formData.amount}
// //               readOnly
// //               className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
// //             />

// //             <select
// //               name="paymentGateway"
// //               value={formData.paymentGateway}
// //               onChange={(e) =>
// //                 setFormData((prev) => ({
// //                   ...prev,
// //                   paymentGateway: e.target.value,
// //                 }))
// //               }
// //               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
// //             >
// //               <option value="esewa">eSewa</option>
// //               <option value="khalti">Khalti</option>
// //             </select>

// //             <button
// //               type="submit"
// //               disabled={isSubmitting}
// //               className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 rounded-lg"
// //             >
// //               {isSubmitting ? "Processing..." : "Proceed to Payment"}
// //             </button>
// //           </form>
// //         </div>
// //       </div>

// //       {/* Address Modal */}
// //       <AddressModal
// //         isOpen={showAddressModal}
// //         onClose={() => setShowAddressModal(false)}
// //         onSave={handleSaveAddress}
// //       />
// //     </>
// //   );
// // };

// // export default PaymentComponent;


// import { useState, useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import axios from "axios";


// const PaymentComponent = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const productData = location.state;

//   const [userAddresses, setUserAddresses] = useState([]);
//   const [selectedAddress, setSelectedAddress] = useState(null);
//   const [loadingAddress, setLoadingAddress] = useState(true);

//   const [formData, setFormData] = useState({
//     customerName: "",
//     customerEmail: "",
//     customerPhone: "",
//     productName: "",
//     amount: "",
//     paymentGateway: "esewa",
//   });

//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // Load product info
//   useEffect(() => {
//     if (productData) {
//       setFormData((prev) => ({
//         ...prev,
//         productName: productData.productName || "",
//         amount: productData.amount || "",
//       }));
//     }
//   }, [productData]);

//   // Fetch addresses from backend
//   useEffect(() => {
//     const fetchAddresses = async () => {
//       try {
//         const token = localStorage.getItem("token");

//         const res = await fetch("http://localhost:5000/api/user/addresses", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (!res.ok) throw new Error("Failed to fetch addresses");

//         const data = await res.json();
//         setUserAddresses(data);

//         // Auto-select default address
//         const defaultAddr = data.find((addr) => addr.isDefault);
//         if (defaultAddr) {
//           setSelectedAddress(defaultAddr);
//         }
//       } catch (err) {
//         console.error("Error fetching addresses:", err);
//       } finally {
//         setLoadingAddress(false);
//       }
//     };

//     fetchAddresses();
//   }, []);

// const handleSubmit = async (e) => {
//   e.preventDefault();

//   if (!selectedAddress) {
//     alert("Please select a delivery address first");
//     return;
//   }

//   setIsSubmitting(true);

//   try {
//     const payload = {
//       customerName: formData.customerName,
//       customerEmail: formData.customerEmail,
//       customerPhone: formData.customerPhone,
//       productName: formData.productName,
//       amount: Number(formData.amount),
//       paymentGateway: formData.paymentGateway,
//       productId: productData?.productId,
//       deliveryAddress: selectedAddress,
//     };

//     console.log("🚀 Sending:", payload);

//     const response = await axios.post(
//       "http://localhost:5000/api/payment/initiate-payment",
//       payload
//     );

//     if (response.data.url && response.data.transactionId) {
//       // ✅ Save transactionId for verification after redirect
//       sessionStorage.setItem("current_transaction_id", response.data.transactionId);

//       // Redirect to payment URL
//       window.location.href = response.data.url;
//     } else {
//       alert("Payment URL missing");
//     }
//   } catch (error) {
//     console.error("Payment error:", error.response?.data || error);
//     alert("Payment failed");
//   } finally {
//     setIsSubmitting(false);
//   }
// };


//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
//       <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
//         <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
//           Checkout
//         </h1>

//         {/* ADDRESS SELECT SECTION */}
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
//                     className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-all
//                       ${
//                         isSelected
//                           ? "border-green-600 bg-green-50"
//                           : "border-gray-200 hover:border-gray-300"
//                       }
//                     `}
//                   >
//                     {/* Radio Indicator */}
//                     <div className="mt-1">
//                       <div
//                         className={`w-4 h-4 rounded-full border-2 flex items-center justify-center
//                           ${
//                             isSelected
//                               ? "border-green-600"
//                               : "border-gray-400"
//                           }
//                         `}
//                       >
//                         {isSelected && (
//                           <div className="w-2 h-2 bg-green-600 rounded-full"></div>
//                         )}
//                       </div>
//                     </div>

//                     {/* Address Info */}
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
//                         {addr.street}, {addr.city}, {addr.state},{" "}
//                         {addr.postalCode}, {addr.country}
//                       </p>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </div>

//         {/* CHECKOUT FORM */}
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <input
//             name="customerName"
//             placeholder="Full Name"
//             value={formData.customerName}
//             onChange={(e) =>
//               setFormData((prev) => ({
//                 ...prev,
//                 customerName: e.target.value,
//               }))
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
//               setFormData((prev) => ({
//                 ...prev,
//                 customerEmail: e.target.value,
//               }))
//             }
//             required
//             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
//           />

//           <input
//             name="customerPhone"
//             placeholder="Phone"
//             value={formData.customerPhone}
//             onChange={(e) =>
//               setFormData((prev) => ({
//                 ...prev,
//                 customerPhone: e.target.value,
//               }))
//             }
//             required
//             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
//           />

//           <input
//             name="productName"
//             value={formData.productName}
//             readOnly
//             className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
//           />

//           <input
//             name="amount"
//             type="number"
//             value={formData.amount}
//             readOnly
//             className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
//           />

//           <select
//             name="paymentGateway"
//             value={formData.paymentGateway}
//             onChange={(e) =>
//               setFormData((prev) => ({
//                 ...prev,
//                 paymentGateway: e.target.value,
//               }))
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
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const PaymentComponent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const productData = location.state;

  const [userAddresses, setUserAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loadingAddress, setLoadingAddress] = useState(true);

  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    productName: "",
    amount: "",
    paymentGateway: "esewa",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load product info
  useEffect(() => {
    if (productData) {
      setFormData((prev) => ({
        ...prev,
        productName: productData.productName || "",
        amount: productData.amount || "",
      }));
    }
  }, [productData]);

  // Fetch addresses from backend
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedAddress) return alert("Please select a delivery address first");
    setIsSubmitting(true);

    try {
      const payload = {
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        productName: formData.productName,
        amount: Number(formData.amount),
        paymentGateway: formData.paymentGateway,
        productId: productData?.productId,
        deliveryAddress: selectedAddress,
      };

      const response = await axios.post(
        "http://localhost:5000/api/payment/initiate-payment",
        payload
      );

      if (response.data.url && response.data.transactionId) {
        sessionStorage.setItem("current_transaction_id", response.data.transactionId);
        window.location.href = response.data.url;
      } else {
        alert("Payment URL missing");
      }
    } catch (error) {
      console.error("Payment error:", error.response?.data || error);
      alert("Payment failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Checkout</h1>

        {/* ADDRESS SELECT */}
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
                    className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-all
                      ${
                        isSelected
                          ? "border-green-600 bg-green-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                  >
                    <div className="mt-1">
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center
                          ${
                            isSelected ? "border-green-600" : "border-gray-400"
                          }`}
                      >
                        {isSelected && <div className="w-2 h-2 bg-green-600 rounded-full"></div>}
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

        {/* CHECKOUT FORM */}
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
          <input
            name="productName"
            value={formData.productName}
            readOnly
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
          />
          <input
            name="amount"
            type="number"
            value={formData.amount}
            readOnly
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
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
