// // // import { useEffect, useState } from "react";
// // // import { MessageSquare, Flag, Eye } from "lucide-react";
// // // import StatCard from "../components/StatCard";
// // // import DataTable from "../components/DataTable";

// // // import {
// // //   getReportedReviews,
// // //   getReviewReports,
// // //   getReviewProduct,
// // //   deleteReview,
// // // } from "../../services/ReportAPI";

// // // export default function ContentManager() {
// // //   const [reviews, setReviews] = useState([]);
// // //   const [selectedReview, setSelectedReview] = useState(null);
// // //   const [reports, setReports] = useState([]);
// // //   const [productDetails, setProductDetails] = useState(null);
// // //   const [loading, setLoading] = useState(false);
// // //   const [detailLoading, setDetailLoading] = useState(false);

// // //   useEffect(() => {
// // //     loadReviews();
// // //   }, []);

// // //   const loadReviews = async () => {
// // //     try {
// // //       setLoading(true);
// // //       const data = await getReportedReviews();
// // //       setReviews(data || []);
// // //     } catch (error) {
// // //       console.error(error.message);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const handleViewReports = async (row) => {
// // //     try {
// // //       setDetailLoading(true);
// // //       const data = await getReviewReports(row._id);

// // //       setSelectedReview({
// // //         id: data.reviewId,
// // //         rating: data.rating,
// // //         comment: data.comment,
// // //         createdAt: data.createdAt,
// // //         reviewAuthor: data.reviewAuthor,
// // //         product: data.product,
// // //       });

// // //       setReports(data.reports || []);
// // //       setProductDetails(data.product || null);
// // //     } catch (error) {
// // //       console.error(error.message);
// // //     } finally {
// // //       setDetailLoading(false);
// // //     }
// // //   };

// // //   const handleViewProduct = async (row) => {
// // //     try {
// // //       setDetailLoading(true);
// // //       const product = await getReviewProduct(row._id);
// // //       setProductDetails(product);

// // //       if (!selectedReview || selectedReview.id !== row._id) {
// // //         setSelectedReview({
// // //           id: row._id,
// // //           rating: row.rating,
// // //           comment: row.comment,
// // //           createdAt: row.createdAt,
// // //           reviewAuthor: { id: row.userId, username: row.userName },
// // //           product: {
// // //             id: row.productId,
// // //             name: row.productName,
// // //             image1: row.productImage,
// // //             price: row.productPrice,
// // //             category: row.productCategory,
// // //           },
// // //         });
// // //       }
// // //     } catch (error) {
// // //       console.error(error.message);
// // //     } finally {
// // //       setDetailLoading(false);
// // //     }
// // //   };

// // //   // ✅ DELETE HANDLER
// // //   const handleDeleteReview = async (reviewId) => {
// // //     const confirmDelete = window.confirm(
// // //       "Are you sure you want to permanently delete this review?"
// // //     );
// // //     if (!confirmDelete) return;

// // //     try {
// // //       setDetailLoading(true);
// // //       await deleteReview(reviewId);

// // //       setReviews((prev) => prev.filter((r) => r._id !== reviewId));

// // //       if (selectedReview?.id === reviewId) {
// // //         setSelectedReview(null);
// // //         setReports([]);
// // //         setProductDetails(null);
// // //       }
// // //     } catch (error) {
// // //       console.error(error.message);
// // //       alert("Failed to delete review");
// // //     } finally {
// // //       setDetailLoading(false);
// // //     }
// // //   };

// // //   const totalReports = reviews.reduce(
// // //     (acc, r) => acc + (r.reportCount || 0),
// // //     0
// // //   );

// // //   return (
// // //     <div className="space-y-8">
// // //       <StatCard
// // //         pageTitle="Content Management"
// // //         pageSubtitle="Manage reported reviews and user feedback"
// // //         stats={[
// // //           {
// // //             title: "Reported Reviews",
// // //             value: reviews.length,
// // //             Icon: Flag,
// // //             iconBg: "bg-red-100",
// // //             iconColor: "text-red-600",
// // //           },
// // //           {
// // //             title: "Total Reports",
// // //             value: totalReports,
// // //             Icon: MessageSquare,
// // //             iconBg: "bg-yellow-100",
// // //             iconColor: "text-yellow-600",
// // //           },
// // //         ]}
// // //       />

// // //       <DataTable
// // //         title="Reported Reviews"
// // //         subtitle="Click 'View' to see review details and reporter reasons"
// // //         columns={[
// // //           { label: "Product", key: "productName", sortable: true },
// // //           { label: "User (name & id)", key: "userName", sortable: true },
// // //           { label: "User ID", key: "userId", sortable: true },
// // //           { label: "Rating", key: "rating", sortable: true },
// // //           { label: "Reports", key: "reportCount", sortable: true },
// // //         ]}
// // //         data={reviews}
// // //         searchableKeys={[
// // //           "productName",
// // //           "userName",
// // //           "userId",
// // //           "comment",
// // //         ]}
// // //         itemsPerPage={8}
// // //         loading={loading}
// // //         renderRow={(row) => (
// // //           <>
// // //             <td className="px-6 py-4">
// // //               <div className="flex items-center gap-3">
// // //                 {row.productImage ? (
// // //                   <img
// // //                     src={row.productImage}
// // //                     alt={row.productName}
// // //                     className="w-12 h-12 object-cover rounded"
// // //                   />
// // //                 ) : (
// // //                   <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400">
// // //                     No Image
// // //                   </div>
// // //                 )}
// // //                 <div>
// // //                   <div className="font-medium">{row.productName}</div>
// // //                   <div className="text-xs text-gray-500">
// // //                     {row.productCategory}
// // //                   </div>
// // //                 </div>
// // //               </div>
// // //             </td>

// // //             <td className="px-6 py-4 font-medium">
// // //               {row.userName}
// // //             </td>

// // //             <td className="px-6 py-4 text-xs text-gray-500">
// // //               ID: {row.userId}
// // //             </td>

// // //             <td className="px-6 py-4">
// // //               <div className="font-semibold">
// // //                 {row.rating} ⭐
// // //               </div>
// // //               <div className="text-xs text-gray-500 mt-1">
// // //                 {new Date(row.createdAt).toLocaleDateString()}
// // //               </div>
// // //             </td>

// // //             <td className="px-6 py-4 text-red-600 font-semibold">
// // //               {row.reportCount}
// // //             </td>
// // //           </>
// // //         )}
// // //         actions={(row) => (
// // //           <div className="flex gap-3 items-center justify-center">
// // //             <button
// // //               onClick={() => handleViewReports(row)}
// // //               className="text-emerald-600 hover:underline text-sm flex items-center gap-1"
// // //             >
// // //               <Eye size={14} /> View
// // //             </button>

// // //             <button
// // //               onClick={() => handleViewProduct(row)}
// // //               className="text-gray-600 hover:underline text-sm flex items-center gap-1"
// // //             >
// // //               <Eye size={14} /> Product
// // //             </button>

// // //             <button
// // //               onClick={() => handleDeleteReview(row._id)}
// // //               className="text-red-600 hover:underline text-sm font-semibold"
// // //             >
// // //               Delete
// // //             </button>
// // //           </div>
// // //         )}
// // //       />

// // //       {selectedReview && (
// // //         <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
// // //           <div className="flex items-start justify-between">
// // //             <div className="flex-1 pr-6">

// // //               <div className="flex items-center justify-between mb-4">
// // //                 <h3 className="text-xl font-semibold">
// // //                   Review Details
// // //                 </h3>

// // //                 <button
// // //                   onClick={() =>
// // //                     handleDeleteReview(selectedReview.id)
// // //                   }
// // //                   className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition"
// // //                 >
// // //                   Delete Review
// // //                 </button>
// // //               </div>

// // //               <div className="bg-gray-50 p-4 rounded-lg border mb-4">
// // //                 <p className="text-sm text-gray-600 mb-2">
// // //                   Review by{" "}
// // //                   <strong>
// // //                     {selectedReview.reviewAuthor?.username}
// // //                   </strong>{" "}
// // //                   (ID: {selectedReview.reviewAuthor?.id})
// // //                 </p>

// // //                 <p className="text-xs text-gray-500 mb-3">
// // //                   {new Date(
// // //                     selectedReview.createdAt
// // //                   ).toLocaleString()}
// // //                 </p>

// // //                 <div className="text-3xl font-bold text-yellow-500 mb-3">
// // //                   {selectedReview.rating} ⭐
// // //                 </div>

// // //                 <div className="bg-white p-4 rounded border text-gray-800 leading-relaxed">
// // //                   {selectedReview.comment}
// // //                 </div>
// // //               </div>

// // //               <h4 className="font-semibold mb-2 text-red-600">
// // //                 Reports ({reports.length})
// // //               </h4>

// // //               {reports.length > 0 ? (
// // //                 <div className="space-y-3">
// // //                   {reports.map((report, i) => (
// // //                     <div
// // //                       key={i}
// // //                       className="border border-red-200 bg-red-50 rounded-lg p-3"
// // //                     >
// // //                       <div className="text-sm font-medium">
// // //                         {report.reportedBy}
// // //                         <span className="text-xs text-gray-500 ml-2">
// // //                           ID: {report.reportedById}
// // //                         </span>
// // //                       </div>

// // //                       <div className="text-xs text-gray-500">
// // //                         {new Date(
// // //                           report.reportedAt
// // //                         ).toLocaleString()}
// // //                       </div>

// // //                       <div className="mt-2 text-sm text-gray-700">
// // //                         {report.reason ||
// // //                           "No reason provided"}
// // //                       </div>
// // //                     </div>
// // //                   ))}
// // //                 </div>
// // //               ) : (
// // //                 <p className="text-gray-500 text-sm">
// // //                   No detailed reports found.
// // //                 </p>
// // //               )}
// // //             </div>

// // //             <div className="w-64 ml-6">
// // //               <h4 className="text-sm text-gray-600 mb-3">
// // //                 Product
// // //               </h4>

// // //               {productDetails ? (
// // //                 <div className="border rounded-lg overflow-hidden">
// // //                   <img
// // //                     src={
// // //                       productDetails.image1 ||
// // //                       productDetails.image2 ||
// // //                       productDetails.image3 ||
// // //                       ""
// // //                     }
// // //                     alt={productDetails.name}
// // //                     className="w-full h-40 object-cover bg-gray-100"
// // //                   />
// // //                   <div className="p-3">
// // //                     <div className="font-medium">
// // //                       {productDetails.name}
// // //                     </div>
// // //                     <div className="text-xs text-gray-500">
// // //                       {productDetails.category}
// // //                     </div>
// // //                     <div className="mt-2 font-semibold">
// // //                       Rs {productDetails.price}
// // //                     </div>
// // //                     <div className="text-xs text-gray-500 mt-1">
// // //                       Stock:{" "}
// // //                       {productDetails.stock ?? "N/A"}
// // //                     </div>
// // //                   </div>
// // //                 </div>
// // //               ) : (
// // //                 <div className="border rounded-lg p-4 text-sm text-gray-500">
// // //                   No product loaded.
// // //                 </div>
// // //               )}
// // //             </div>
// // //           </div>
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // }

// // import { useEffect, useState } from "react";
// // import { MessageSquare, Flag, Eye } from "lucide-react";
// // import StatCard from "../components/StatCard";
// // import DataTable from "../components/DataTable";

// // import {
// //   getReportedReviews,
// //   getReviewReports,
// //   getReviewProduct,
// //   deleteReview,
// // } from "../../services/ReportAPI";

// // import { getMyAdminProfile } from "../../services/adminAPI";

// // export default function ContentManager() {
// //   const [reviews, setReviews] = useState([]);
// //   const [selectedReview, setSelectedReview] = useState(null);
// //   const [reports, setReports] = useState([]);
// //   const [productDetails, setProductDetails] = useState(null);
// //   const [loading, setLoading] = useState(false);
// //   const [detailLoading, setDetailLoading] = useState(false);

// //   // ✅ PERMISSIONS
// //   const [permissions, setPermissions] = useState({});

// //   /* =========================
// //      FETCH ADMIN PROFILE
// //   ========================== */
// //   const fetchProfile = async () => {
// //     try {
// //       const data = await getMyAdminProfile();
// //       setPermissions(data.permissions || {});
// //     } catch (err) {
// //       console.error("Failed to fetch admin profile:", err.message);
// //     }
// //   };

// //   /* =========================
// //      LOAD REVIEWS
// //   ========================== */
// //   const loadReviews = async () => {
// //     if (!permissions.reviews?.view) return;

// //     try {
// //       setLoading(true);
// //       const data = await getReportedReviews();
// //       setReviews(data || []);
// //     } catch (error) {
// //       console.error(error.message);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   /* =========================
// //      LIFECYCLE
// //   ========================== */
// //   useEffect(() => {
// //     fetchProfile();
// //   }, []);

// //   useEffect(() => {
// //     loadReviews();
// //   }, [permissions]);

// //   /* =========================
// //      VIEW REPORTS
// //   ========================== */
// //   const handleViewReports = async (row) => {
// //     if (!permissions.reviews?.view) return;

// //     try {
// //       setDetailLoading(true);
// //       const data = await getReviewReports(row._id);

// //       setSelectedReview({
// //         id: data.reviewId,
// //         rating: data.rating,
// //         comment: data.comment,
// //         createdAt: data.createdAt,
// //         reviewAuthor: data.reviewAuthor,
// //         product: data.product,
// //       });

// //       setReports(data.reports || []);
// //       setProductDetails(data.product || null);
// //     } catch (error) {
// //       console.error(error.message);
// //     } finally {
// //       setDetailLoading(false);
// //     }
// //   };

// //   /* =========================
// //      VIEW PRODUCT
// //   ========================== */
// //   const handleViewProduct = async (row) => {
// //     if (!permissions.reviews?.view) return;

// //     try {
// //       setDetailLoading(true);
// //       const product = await getReviewProduct(row._id);
// //       setProductDetails(product);
// //     } catch (error) {
// //       console.error(error.message);
// //     } finally {
// //       setDetailLoading(false);
// //     }
// //   };

// //   /* =========================
// //      DELETE REVIEW
// //   ========================== */
// //   const handleDeleteReview = async (reviewId) => {
// //     if (!permissions.reviews?.delete) return;

// //     const confirmDelete = window.confirm(
// //       "Are you sure you want to permanently delete this review?"
// //     );
// //     if (!confirmDelete) return;

// //     try {
// //       setDetailLoading(true);
// //       await deleteReview(reviewId);

// //       setReviews((prev) => prev.filter((r) => r._id !== reviewId));

// //       if (selectedReview?.id === reviewId) {
// //         setSelectedReview(null);
// //         setReports([]);
// //         setProductDetails(null);
// //       }
// //     } catch (error) {
// //       console.error(error.message);
// //       alert("Failed to delete review");
// //     } finally {
// //       setDetailLoading(false);
// //     }
// //   };

// //   const totalReports = reviews.reduce(
// //     (acc, r) => acc + (r.reportCount || 0),
// //     0
// //   );

// //   /* =========================
// //      RENDER
// //   ========================== */
// //   return (
// //     <div className="space-y-8">
// //       {/* ❌ BLOCK IF NO VIEW PERMISSION */}
// //       {!permissions.reviews?.view ? (
// //         <div className="bg-white p-6 rounded-lg text-center text-red-600">
// //           You do not have permission to view reported reviews.
// //         </div>
// //       ) : (
// //         <>
// //           <StatCard
// //             pageTitle="Content Management"
// //             pageSubtitle="Manage reported reviews and user feedback"
// //             stats={[
// //               {
// //                 title: "Reported Reviews",
// //                 value: reviews.length,
// //                 Icon: Flag,
// //                 iconBg: "bg-red-100",
// //                 iconColor: "text-red-600",
// //               },
// //               {
// //                 title: "Total Reports",
// //                 value: totalReports,
// //                 Icon: MessageSquare,
// //                 iconBg: "bg-yellow-100",
// //                 iconColor: "text-yellow-600",
// //               },
// //             ]}
// //           />

// //           <DataTable
// //             title="Reported Reviews"
// //             subtitle="Click 'View' to see review details"
// //             columns={[
// //               { label: "Product", key: "productName", sortable: true },
// //               { label: "User (name & id)", key: "userName", sortable: true },
// //               { label: "User ID", key: "userId", sortable: true },
// //               { label: "Rating", key: "rating", sortable: true },
// //               { label: "Reports", key: "reportCount", sortable: true },
// //             ]}
// //             data={reviews}
// //             searchableKeys={[
// //               "productName",
// //               "userName",
// //               "userId",
// //               "comment",
// //             ]}
// //             itemsPerPage={8}
// //             loading={loading}
// //             renderRow={(row) => (
// //               <>
// //                 <td className="px-6 py-4 font-medium">
// //                   {row.productName}
// //                 </td>
// //                 <td className="px-6 py-4">{row.userName}</td>
// //                 <td className="px-6 py-4 text-xs">
// //                   ID: {row.userId}
// //                 </td>
// //                 <td className="px-6 py-4">{row.rating} ⭐</td>
// //                 <td className="px-6 py-4 text-red-600 font-semibold">
// //                   {row.reportCount}
// //                 </td>
// //               </>
// //             )}
// //             actions={(row) =>
// //               permissions.reviews?.edit || permissions.reviews?.delete ? (
// //                 <div className="flex gap-3 justify-center">
// //                   {permissions.reviews?.edit && (
// //                     <>
// //                       <button
// //                         onClick={() => handleViewReports(row)}
// //                         className="text-emerald-600 hover:underline text-sm flex items-center gap-1"
// //                       >
// //                         <Eye size={14} /> View
// //                       </button>

// //                       <button
// //                         onClick={() => handleViewProduct(row)}
// //                         className="text-gray-600 hover:underline text-sm flex items-center gap-1"
// //                       >
// //                         <Eye size={14} /> Product
// //                       </button>
// //                     </>
// //                   )}

// //                   {permissions.reviews?.delete && (
// //                     <button
// //                       onClick={() => handleDeleteReview(row._id)}
// //                       className="text-red-600 hover:underline text-sm font-semibold"
// //                     >
// //                       Delete
// //                     </button>
// //                   )}
// //                 </div>
// //               ) : null
// //             }
// //           />
// //         </>
// //       )}
// //     </div>
// //   );
// // }


// import { useEffect, useState } from "react";
// import { MessageSquare, Flag, Eye } from "lucide-react";
// import StatCard from "../components/StatCard";
// import DataTable from "../components/DataTable";

// import {
//   getReportedReviews,
//   getReviewReports,
//   getReviewProduct,
//   deleteReview,
// } from "../../services/ReportAPI";

// import { getMyAdminProfile } from "../../services/adminAPI";

// export default function ContentManager() {
//   const [reviews, setReviews] = useState([]);
//   const [selectedReview, setSelectedReview] = useState(null);
//   const [reports, setReports] = useState([]);
//   const [productDetails, setProductDetails] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [detailLoading, setDetailLoading] = useState(false);

//   // ✅ PERMISSIONS
//   const [permissions, setPermissions] = useState({});

//   /* =========================
//      FETCH ADMIN PROFILE
//   ========================== */
//   const fetchProfile = async () => {
//     try {
//       const data = await getMyAdminProfile();
//       setPermissions(data.permissions || {});
//     } catch (err) {
//       console.error("Failed to fetch admin profile:", err.message);
//     }
//   };

//   /* =========================
//      LOAD REVIEWS
//   ========================== */
//   const loadReviews = async () => {
//     if (!permissions.content?.view) return;

//     try {
//       setLoading(true);
//       const data = await getReportedReviews();
//       setReviews(data || []);
//     } catch (error) {
//       console.error(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* =========================
//      LIFECYCLE
//   ========================== */
//   useEffect(() => {
//     fetchProfile();
//   }, []);

//   useEffect(() => {
//     loadReviews();
//   }, [permissions]);

//   /* =========================
//      VIEW REPORTS
//   ========================== */
//   const handleViewReports = async (row) => {
//     if (!permissions.content?.view) return;

//     try {
//       setDetailLoading(true);
//       const data = await getReviewReports(row._id);

//       setSelectedReview({
//         id: data.reviewId,
//         rating: data.rating,
//         comment: data.comment,
//         createdAt: data.createdAt,
//         reviewAuthor: data.reviewAuthor,
//         product: data.product,
//       });

//       setReports(data.reports || []);
//       setProductDetails(data.product || null);
//     } catch (error) {
//       console.error(error.message);
//     } finally {
//       setDetailLoading(false);
//     }
//   };

//   /* =========================
//      VIEW PRODUCT
//   ========================== */
//   const handleViewProduct = async (row) => {
//     if (!permissions.content?.view) return;

//     try {
//       setDetailLoading(true);
//       const product = await getReviewProduct(row._id);
//       setProductDetails(product);
//     } catch (error) {
//       console.error(error.message);
//     } finally {
//       setDetailLoading(false);
//     }
//   };

//   /* =========================
//      DELETE REVIEW
//   ========================== */
//   const handleDeleteReview = async (reviewId) => {
//     if (!permissions.content?.delete) return;

//     const confirmDelete = window.confirm(
//       "Are you sure you want to permanently delete this review?"
//     );
//     if (!confirmDelete) return;

//     try {
//       setDetailLoading(true);
//       await deleteReview(reviewId);

//       setReviews((prev) => prev.filter((r) => r._id !== reviewId));

//       if (selectedReview?.id === reviewId) {
//         setSelectedReview(null);
//         setReports([]);
//         setProductDetails(null);
//       }
//     } catch (error) {
//       console.error(error.message);
//       alert("Failed to delete review");
//     } finally {
//       setDetailLoading(false);
//     }
//   };

//   const totalReports = reviews.reduce(
//     (acc, r) => acc + (r.reportCount || 0),
//     0
//   );

//   /* =========================
//      RENDER
//   ========================== */
//   return (
//     <div className="space-y-8">
//       {/* ❌ BLOCK IF NO VIEW PERMISSION */}
//       {!permissions.content?.view ? (
//         <div className="bg-white p-6 rounded-lg text-center text-red-600">
//           You do not have permission to view reported reviews.
//         </div>
//       ) : (
//         <>
//           <StatCard
//             pageTitle="Content Management"
//             pageSubtitle="Manage reported reviews and user feedback"
//             stats={[
//               {
//                 title: "Reported Reviews",
//                 value: reviews.length,
//                 Icon: Flag,
//                 iconBg: "bg-red-100",
//                 iconColor: "text-red-600",
//               },
//               {
//                 title: "Total Reports",
//                 value: totalReports,
//                 Icon: MessageSquare,
//                 iconBg: "bg-yellow-100",
//                 iconColor: "text-yellow-600",
//               },
//             ]}
//           />

//           <DataTable
//             title="Reported Reviews"
//             subtitle="Click 'View' to see review details"
//             columns={[
//               { label: "Product", key: "productName", sortable: true },
//               { label: "User (name & id)", key: "userName", sortable: true },
//               { label: "User ID", key: "userId", sortable: true },
//               { label: "Rating", key: "rating", sortable: true },
//               { label: "Reports", key: "reportCount", sortable: true },
//             ]}
//             data={reviews}
//             searchableKeys={[
//               "productName",
//               "userName",
//               "userId",
//               "comment",
//             ]}
//             itemsPerPage={8}
//             loading={loading}
//             renderRow={(row) => (
//               <>
//                 <td className="px-6 py-4 font-medium">
//                   {row.productName}
//                 </td>
//                 <td className="px-6 py-4">{row.userName}</td>
//                 <td className="px-6 py-4 text-xs">
//                   ID: {row.userId}
//                 </td>
//                 <td className="px-6 py-4">{row.rating} ⭐</td>
//                 <td className="px-6 py-4 text-red-600 font-semibold">
//                   {row.reportCount}
//                 </td>
//               </>
//             )}
//             actions={(row) =>
//               permissions.content?.edit || permissions.content?.delete ? (
//                 <div className="flex gap-3 justify-center">
//                   {permissions.content?.edit && (
//                     <>
//                       <button
//                         onClick={() => handleViewReports(row)}
//                         className="text-emerald-600 hover:underline text-sm flex items-center gap-1"
//                       >
//                         <Eye size={14} /> View
//                       </button>

//                       <button
//                         onClick={() => handleViewProduct(row)}
//                         className="text-gray-600 hover:underline text-sm flex items-center gap-1"
//                       >
//                         <Eye size={14} /> Product
//                       </button>
//                     </>
//                   )}

//                   {permissions.content?.delete && (
//                     <button
//                       onClick={() => handleDeleteReview(row._id)}
//                       className="text-red-600 hover:underline text-sm font-semibold"
//                     >
//                       Delete
//                     </button>
//                   )}
//                 </div>
//               ) : null
//             }
//           />
//         </>
//       )}
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import { MessageSquare, Flag, Eye, X, Star, User, Package, AlertTriangle } from "lucide-react";
import StatCard from "../components/StatCard";
import DataTable from "../components/DataTable";

import {
  getReportedReviews,
  getReviewReports,
  getReviewProduct,
  deleteReview,
} from "../../services/ReportAPI";

import { getMyAdminProfile } from "../../services/adminAPI";

export default function ContentManager() {
  const [reviews, setReviews] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null);
  const [reports, setReports] = useState([]);
  const [productDetails, setProductDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false); // ✅ NEW: controls modal visibility

  // ✅ PERMISSIONS
  const [permissions, setPermissions] = useState({});

  /* =========================
     FETCH ADMIN PROFILE
  ========================== */
  const fetchProfile = async () => {
    try {
      const data = await getMyAdminProfile();
      setPermissions(data.permissions || {});
    } catch (err) {
      console.error("Failed to fetch admin profile:", err.message);
    }
  };

  /* =========================
     LOAD REVIEWS
  ========================== */
  const loadReviews = async () => {
    if (!permissions.content?.view) return;

    try {
      setLoading(true);
      const data = await getReportedReviews();
      setReviews(data || []);
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     LIFECYCLE
  ========================== */
  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    loadReviews();
  }, [permissions]);

  /* =========================
     VIEW REPORTS
     ✅ FIX: now opens modal so fetched data is actually displayed
  ========================== */
  const handleViewReports = async (row) => {
    if (!permissions.content?.view) return;

    try {
      setDetailLoading(true);
      setModalOpen(true); // open modal immediately — shows spinner while loading

      const data = await getReviewReports(row._id);

      setSelectedReview({
        id: data.reviewId,
        rating: data.rating,
        comment: data.comment,
        createdAt: data.createdAt,
        reviewAuthor: data.reviewAuthor,
        product: data.product,
      });

      setReports(data.reports || []);
      setProductDetails(data.product || null);
    } catch (error) {
      console.error(error.message);
      setModalOpen(false);
    } finally {
      setDetailLoading(false);
    }
  };

  /* =========================
     VIEW PRODUCT
  ========================== */
  const handleViewProduct = async (row) => {
    if (!permissions.content?.view) return;

    try {
      setDetailLoading(true);
      const product = await getReviewProduct(row._id);
      setProductDetails(product);
    } catch (error) {
      console.error(error.message);
    } finally {
      setDetailLoading(false);
    }
  };

  /* =========================
     CLOSE MODAL
  ========================== */
  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedReview(null);
    setReports([]);
    setProductDetails(null);
  };

  /* =========================
     DELETE REVIEW
  ========================== */
  const handleDeleteReview = async (reviewId) => {
    if (!permissions.content?.delete) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to permanently delete this review?"
    );
    if (!confirmDelete) return;

    try {
      setDetailLoading(true);
      await deleteReview(reviewId);

      setReviews((prev) => prev.filter((r) => r._id !== reviewId));

      if (selectedReview?.id === reviewId) {
        handleCloseModal();
      }
    } catch (error) {
      console.error(error.message);
      alert("Failed to delete review");
    } finally {
      setDetailLoading(false);
    }
  };

  const totalReports = reviews.reduce(
    (acc, r) => acc + (r.reportCount || 0),
    0
  );

  /* =========================
     RENDER STARS HELPER
  ========================== */
  const renderStars = (rating) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={14}
        className={i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
      />
    ));

  /* =========================
     RENDER
  ========================== */
  return (
    <div className="space-y-8">
      {/* ❌ BLOCK IF NO VIEW PERMISSION */}
      {!permissions.content?.view ? (
        <div className="bg-white p-6 rounded-lg text-center text-red-600">
          You do not have permission to view reported reviews.
        </div>
      ) : (
        <>
          <StatCard
            pageTitle="Content Management"
            pageSubtitle="Manage reported reviews and user feedback"
            stats={[
              {
                title: "Reported Reviews",
                value: reviews.length,
                Icon: Flag,
                iconBg: "bg-red-100",
                iconColor: "text-red-600",
              },
              {
                title: "Total Reports",
                value: totalReports,
                Icon: MessageSquare,
                iconBg: "bg-yellow-100",
                iconColor: "text-yellow-600",
              },
            ]}
          />

          <DataTable
            title="Reported Reviews"
            subtitle="Click 'View' to see review details"
            columns={[
              { label: "Product", key: "productName", sortable: true },
              { label: "User (name & id)", key: "userName", sortable: true },
              { label: "User ID", key: "userId", sortable: true },
              { label: "Rating", key: "rating", sortable: true },
              { label: "Reports", key: "reportCount", sortable: true },
            ]}
            data={reviews}
            searchableKeys={["productName", "userName", "userId", "comment"]}
            itemsPerPage={8}
            loading={loading}
            renderRow={(row) => (
              <>
                <td className="px-6 py-4 font-medium">{row.productName}</td>
                <td className="px-6 py-4">{row.userName}</td>
                <td className="px-6 py-4 text-xs">ID: {row.userId}</td>
                <td className="px-6 py-4">{row.rating} ⭐</td>
                <td className="px-6 py-4 text-red-600 font-semibold">
                  {row.reportCount}
                </td>
              </>
            )}
            actions={(row) =>
              permissions.content?.edit || permissions.content?.delete ? (
                <div className="flex gap-3 justify-center">
                  {permissions.content?.edit && (
                    <>
                      <button
                        onClick={() => handleViewReports(row)}
                        className="text-emerald-600 hover:underline text-sm flex items-center gap-1"
                      >
                        <Eye size={14} /> View
                      </button>

                      <button
                        onClick={() => handleViewProduct(row)}
                        className="text-gray-600 hover:underline text-sm flex items-center gap-1"
                      >
                        <Eye size={14} /> Product
                      </button>
                    </>
                  )}

                  {permissions.content?.delete && (
                    <button
                      onClick={() => handleDeleteReview(row._id)}
                      className="text-red-600 hover:underline text-sm font-semibold"
                    >
                      Delete
                    </button>
                  )}
                </div>
              ) : null
            }
          />

          {/* ✅ REVIEW DETAIL MODAL — was missing entirely before */}
          {modalOpen && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
              onClick={handleCloseModal}
            >
              <div
                className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Review Details
                  </h2>
                  <button
                    onClick={handleCloseModal}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Modal Body */}
                {detailLoading ? (
                  <div className="flex items-center justify-center py-16">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
                  </div>
                ) : selectedReview ? (
                  <div className="p-6 space-y-6">

                    {/* Review Info */}
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                      <div className="flex items-center gap-2">
                        <User size={16} className="text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">
                          {selectedReview.reviewAuthor?.username || "Unknown"}
                        </span>
                        <span className="text-xs text-gray-400">
                          (ID: {selectedReview.reviewAuthor?.id})
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        {renderStars(selectedReview.rating)}
                        <span className="text-sm text-gray-500 ml-1">
                          {selectedReview.rating}/5
                        </span>
                      </div>

                      <p className="text-sm text-gray-700 bg-white border rounded p-3 italic">
                        "{selectedReview.comment}"
                      </p>

                      <p className="text-xs text-gray-400">
                        Posted:{" "}
                        {selectedReview.createdAt
                          ? new Date(selectedReview.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })
                          : "—"}
                      </p>
                    </div>

                    {/* Product Info */}
                    {(productDetails || selectedReview.product) && (
                      <div className="border rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Package size={16} className="text-emerald-600" />
                          <span className="text-sm font-semibold text-gray-700">
                            Linked Product
                          </span>
                        </div>
                        {(() => {
                          const p = productDetails || selectedReview.product;
                          return (
                            <div className="flex gap-4">
                              {p.image1 && (
                                <img
                                  src={p.image1}
                                  alt={p.name}
                                  className="w-16 h-16 object-cover rounded-lg border"
                                />
                              )}
                              <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-800">
                                  {p.name}
                                </p>
                                {p.price != null && (
                                  <p className="text-sm text-emerald-600 font-semibold">
                                    Rs. {p.price}
                                  </p>
                                )}
                                {p.category && (
                                  <span className="inline-block text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                                    {p.category}
                                  </span>
                                )}
                                {p.stock != null && (
                                  <p className="text-xs text-gray-400">
                                    Stock: {p.stock}
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    )}

                    {/* Reports List */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <AlertTriangle size={16} className="text-red-500" />
                        <span className="text-sm font-semibold text-gray-700">
                          Reports ({reports.length})
                        </span>
                      </div>

                      {reports.length === 0 ? (
                        <p className="text-sm text-gray-400 text-center py-4">
                          No reports found.
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {reports.map((report, idx) => (
                            <div
                              key={idx}
                              className="bg-red-50 border border-red-100 rounded-lg px-4 py-3"
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium text-gray-700">
                                  {report.reportedBy}
                                </span>
                                <span className="text-xs text-gray-400">
                                  {report.reportedAt
                                    ? new Date(report.reportedAt).toLocaleDateString()
                                    : "—"}
                                </span>
                              </div>
                              {report.reason && (
                                <p className="text-sm text-red-700">{report.reason}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Delete Action */}
                    {permissions.content?.delete && (
                      <div className="flex justify-end pt-2 border-t">
                        <button
                          onClick={() => handleDeleteReview(selectedReview.id)}
                          disabled={detailLoading}
                          className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors"
                        >
                          Delete Review
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-6 text-center text-gray-400 text-sm">
                    No review data available.
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}