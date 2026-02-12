// // // file: src/services/ReportAPI.js
// // const BASE_URL = "http://localhost:5000";

// // const handleResponse = async (res) => {
// //   const data = await res.json().catch(() => ({}));
// //   if (!res.ok) throw new Error(data.message || "Request failed");
// //   return data;
// // };

// // const getAuthHeaders = () => {
// //   const token = localStorage.getItem("token");
// //   if (!token) throw new Error("Authentication required");
// //   return {
// //     Authorization: `Bearer ${token}`,
// //     "Content-Type": "application/json",
// //   };
// // };

// // /* =======================================================
// //                 GET ALL REPORTED REVIEWS (ADMIN)
// // ======================================================= */
// // export const getReportedReviews = async () => {
// //   const res = await fetch(`${BASE_URL}/api/admin/reports`, {
// //     headers: getAuthHeaders(),
// //   });
// //   return handleResponse(res);
// // };

// // /* =======================================================
// //                 GET REPORT DETAILS FOR ONE REVIEW
// // ======================================================= */
// // export const getReviewReports = async (reviewId) => {
// //   const res = await fetch(`${BASE_URL}/api/admin/reports/${reviewId}`, {
// //     headers: getAuthHeaders(),
// //   });
// //   return handleResponse(res);
// // };

// // /* =======================================================
// //                 GET PRODUCT DETAILS FOR A REVIEW
// // ======================================================= */
// // export const getReviewProduct = async (reviewId) => {
// //   const res = await fetch(
// //     `${BASE_URL}/api/admin/reports/${reviewId}/product`,
// //     {
// //       headers: getAuthHeaders(),
// //     }
// //   );
// //   return handleResponse(res);
// // };


// // file: src/services/ReportAPI.js
// const BASE_URL = "http://localhost:5000";

// const handleResponse = async (res) => {
//   const data = await res.json().catch(() => ({}));
//   if (!res.ok) throw new Error(data.message || "Request failed");
//   return data;
// };

// const getAuthHeaders = () => {
//   const token = localStorage.getItem("token");
//   if (!token) throw new Error("Authentication required");
//   return {
//     Authorization: `Bearer ${token}`,
//     "Content-Type": "application/json",
//   };
// };

// export const getReportedReviews = async () => {
//   const res = await fetch(`${BASE_URL}/api/admin/reports`, {
//     headers: getAuthHeaders(),
//   });
//   return handleResponse(res);
// };

// export const getReviewReports = async (reviewId) => {
//   const res = await fetch(`${BASE_URL}/api/admin/reports/${reviewId}`, {
//     headers: getAuthHeaders(),
//   });
//   return handleResponse(res);
// };

// export const getReviewProduct = async (reviewId) => {
//   const res = await fetch(
//     `${BASE_URL}/api/admin/reports/${reviewId}/product`,
//     {
//       headers: getAuthHeaders(),
//     }
//   );
//   return handleResponse(res);
// };


// file: src/services/ReportAPI.js
const BASE_URL = "http://localhost:5000";

const handleResponse = async (res) => {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
};

const getAuthHeaders = () => {
  const token = localStorage.getItem("adminToken");
  if (!token) throw new Error("Authentication required");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

export const getReportedReviews = async () => {
  const res = await fetch(`${BASE_URL}/api/admin/reports`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
};

export const getReviewReports = async (reviewId) => {
  const res = await fetch(`${BASE_URL}/api/admin/reports/${reviewId}`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
};

export const getReviewProduct = async (reviewId) => {
  const res = await fetch(
    `${BASE_URL}/api/admin/reports/${reviewId}/product`,
    {
      headers: getAuthHeaders(),
    }
  );
  return handleResponse(res);
};


// ✅ NEW DELETE REVIEW API
export const deleteReview = async (reviewId) => {
  const res = await fetch(
    `${BASE_URL}/api/admin/reviews/${reviewId}`,
    {
      method: "DELETE",
      headers: getAuthHeaders(),
    }
  );

  return handleResponse(res);
};
