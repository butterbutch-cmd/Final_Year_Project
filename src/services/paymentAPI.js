// // src/services/paymentAPI.js

// const BASE_URL = "http://localhost:5000";

// // -----------------------
// // Get token from localStorage
// // -----------------------
// const getToken = () => localStorage.getItem("adminToken");

// const authHeader = () => ({
//   Authorization: `Bearer ${getToken()}`,
// });

// // -----------------------
// // Unified response handler
// // -----------------------
// const handleResponse = async (res) => {
//   const data = await res.json().catch(() => ({}));
//   if (!res.ok) {
//     throw new Error(data.message || "Request failed");
//   }
//   return data;
// };

// // =======================================================
// // PAYMENT / TRANSACTION (ADMIN) API
// // =======================================================

// // ✅ Get all payments / transactions
// export const getPayments = async () => {
//   const res = await fetch(`${BASE_URL}/api/admin/payments`, {
//     headers: authHeader(),
//   });
//   return handleResponse(res);
// };

// // ✅ Get single payment by ID
// export const getPaymentById = async (id) => {
//   const res = await fetch(`${BASE_URL}/api/admin/payments/${id}`, {
//     headers: authHeader(),
//   });
//   return handleResponse(res);
// };

// // ✅ Update payment status
// // status: pending | completed | failed | refunded | cancelled
// export const updatePaymentStatus = async (id, status) => {
//   const res = await fetch(`${BASE_URL}/api/admin/payments/${id}/status`, {
//     method: "PATCH",
//     headers: {
//       "Content-Type": "application/json",
//       ...authHeader(),
//     },
//     body: JSON.stringify({ status }),
//   });
//   return handleResponse(res);
// };

// // ✅ Refund a payment
// export const refundPayment = async (id) => {
//   const res = await fetch(`${BASE_URL}/api/admin/payments/${id}/refund`, {
//     method: "POST",
//     headers: authHeader(),
//   });
//   return handleResponse(res);
// };

// // =======================================================
// // 🚚 DELIVERY STATUS (ADMIN)
// // =======================================================
// // deliveryStatus: PENDING | SHIPPED | DELIVERED | CANCELLED
// export const updateDeliveryStatus = async (id, deliveryStatus) => {
//   const res = await fetch(
//     `${BASE_URL}/api/admin/payments/${id}/delivery-status`,
//     {
//       method: "PATCH",
//       headers: {
//         "Content-Type": "application/json",
//         ...authHeader(),
//       },
//       body: JSON.stringify({ deliveryStatus }),
//     }
//   );

//   return handleResponse(res);
// };


const BASE_URL = "http://localhost:5000/api/admin/payments";

const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
  "Content-Type": "application/json",
});

const handle = async (res) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
};

export const getPayments = () =>
  fetch(BASE_URL, { headers: authHeader() }).then(handle);

export const getPaymentById = (id) =>
  fetch(`${BASE_URL}/${id}`, { headers: authHeader() }).then(handle);

export const updatePaymentStatus = (id, status) =>
  fetch(`${BASE_URL}/${id}/status`, {
    method: "PATCH",
    headers: authHeader(),
    body: JSON.stringify({ status }),
  }).then(handle);

export const updateDeliveryStatus = (id, deliveryStatus) =>
  fetch(`${BASE_URL}/${id}/delivery-status`, {
    method: "PATCH",
    headers: authHeader(),
    body: JSON.stringify({ deliveryStatus }),
  }).then(handle);

export const refundPayment = (id) =>
  fetch(`${BASE_URL}/${id}/refund`, {
    method: "POST",
    headers: authHeader(),
  }).then(handle);
