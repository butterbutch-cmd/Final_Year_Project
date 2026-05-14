///file location: src/services/paymentAPI.js
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
