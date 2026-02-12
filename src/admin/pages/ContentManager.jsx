// // // // file: src/admin/pages/ContentManager.jsx
// // // import { useEffect, useState } from "react";
// // // import { MessageSquare, Flag, Eye } from "lucide-react";
// // // import StatCard from "../components/StatCard";
// // // import DataTable from "../components/DataTable";

// // // import {
// // //   getReportedReviews,
// // //   getReviewReports,
// // //   getReviewProduct,
// // // } from "../../services/ReportAPI";

// // // export default function ContentManager() {
// // //   const [reviews, setReviews] = useState([]);
// // //   const [selectedReview, setSelectedReview] = useState(null);
// // //   const [reports, setReports] = useState([]);
// // //   const [productDetails, setProductDetails] = useState(null);
// // //   const [loading, setLoading] = useState(false);
// // //   const [detailLoading, setDetailLoading] = useState(false);

// // //   /* ================= LOAD REPORTED REVIEWS ================= */
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

// // //   /* ================= LOAD REPORTS FOR REVIEW ================= */
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

// // //   /* ================= LOAD PRODUCT (explicit) ================= */
// // //   const handleViewProduct = async (row) => {
// // //     try {
// // //       setDetailLoading(true);
// // //       const product = await getReviewProduct(row._id);
// // //       setProductDetails(product);
// // //       // Also set selected review if not already
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

// // //   /* ================= STATS ================= */
// // //   const totalReports = reviews.reduce((acc, r) => acc + (r.reportCount || 0), 0);

// // //   return (
// // //     <div className="space-y-8">
// // //       {/* ================= STATS ================= */}
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

// // //       {/* ================= TABLE ================= */}
// // //       <DataTable
// // //         title="Reported Reviews"
// // //         subtitle="Click 'View' to see review details and reporter reasons"
// // //         columns={["Product", "User", "Rating", "Reports", "Actions"]}
// // //         data={reviews}
// // //         searchableKeys={["productName", "userName", "comment"]}
// // //         itemsPerPage={8}
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
// // //                   <div className="text-xs text-gray-500">{row.productCategory}</div>
// // //                 </div>
// // //               </div>
// // //             </td>

// // //             <td className="px-6 py-4">{row.userName}</td>

// // //             <td className="px-6 py-4">
// // //               <span className="inline-flex items-center gap-1">
// // //                 <span className="font-semibold">{row.rating}</span> <span>⭐</span>
// // //               </span>
// // //               <div className="text-xs text-gray-500 mt-1">
// // //                 {new Date(row.createdAt).toLocaleDateString()}
// // //               </div>
// // //             </td>

// // //             <td className="px-6 py-4 text-red-600 font-semibold">{row.reportCount}</td>
// // //           </>
// // //         )}
// // //         actions={(row) => (
// // //           <div className="flex gap-2 items-center justify-center">
// // //             <button
// // //               onClick={() => handleViewReports(row)}
// // //               className="text-emerald-600 hover:underline text-sm flex items-center gap-2"
// // //               title="View reports and review"
// // //             >
// // //               <Eye size={14} /> View
// // //             </button>

// // //             <button
// // //               onClick={() => handleViewProduct(row)}
// // //               className="text-gray-600 hover:underline text-sm flex items-center gap-2"
// // //               title="View product"
// // //             >
// // //               <Eye size={14} /> Product
// // //             </button>
// // //           </div>
// // //         )}
// // //       />

// // //       {/* ================= REVIEW DETAILS ================= */}
// // //       {selectedReview && (
// // //         <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
// // //           <div className="flex items-start justify-between">
// // //             <div>
// // //               <h3 className="text-lg font-semibold mb-1">Review Details</h3>
// // //               <p className="text-sm text-gray-500 mb-3">
// // //                 Review by <strong>{selectedReview.reviewAuthor?.username}</strong> •{" "}
// // //                 {new Date(selectedReview.createdAt).toLocaleString()}
// // //               </p>

// // //               <div className="mb-4">
// // //                 <div className="flex items-center gap-2">
// // //                   <div className="text-2xl font-bold">{selectedReview.rating} ⭐</div>
// // //                 </div>
// // //                 <p className="mt-2 text-gray-700">{selectedReview.comment}</p>
// // //               </div>

// // //               <h4 className="font-semibold mb-2 text-red-600">Reports ({reports.length})</h4>

// // //               {reports.length > 0 ? (
// // //                 <ul className="list-disc pl-6 space-y-3 text-sm text-gray-700">
// // //                   {reports.map((report, i) => (
// // //                     <li key={i}>
// // //                       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
// // //                         <div>
// // //                           <span className="font-medium">{report.reportedBy}</span>{" "}
// // //                           <span className="text-xs text-gray-500">• {new Date(report.reportedAt).toLocaleString()}</span>
// // //                         </div>
// // //                         <div className="text-sm text-gray-700 mt-1 sm:mt-0">{report.reason || "No reason provided"}</div>
// // //                       </div>
// // //                     </li>
// // //                   ))}
// // //                 </ul>
// // //               ) : (
// // //                 <p className="text-gray-500 text-sm">No detailed reports found for this review.</p>
// // //               )}
// // //             </div>

// // //             {/* Product summary card */}
// // //             <div className="w-64 ml-6">
// // //               <h4 className="text-sm text-gray-600 mb-3">Product</h4>

// // //               {productDetails ? (
// // //                 <div className="border rounded-lg overflow-hidden">
// // //                   <img
// // //                     src={productDetails.image1 || productDetails.image2 || productDetails.image3 || ""}
// // //                     alt={productDetails.name}
// // //                     className="w-full h-40 object-cover bg-gray-100"
// // //                   />
// // //                   <div className="p-3">
// // //                     <div className="font-medium">{productDetails.name}</div>
// // //                     <div className="text-xs text-gray-500">{productDetails.category}</div>
// // //                     <div className="mt-2 font-semibold">Rs {productDetails.price}</div>
// // //                     <div className="text-xs text-gray-500 mt-1">Stock: {productDetails.stock ?? "N/A"}</div>

// // //                     {productDetails.care && (
// // //                       <div className="mt-3 text-xs text-gray-600">
// // //                         <div>Care: {productDetails.care.level}</div>
// // //                         {productDetails.care.tips && productDetails.care.tips.length > 0 && (
// // //                           <ul className="list-disc pl-5 mt-1">
// // //                             {productDetails.care.tips.slice(0, 3).map((t, idx) => (
// // //                               <li key={idx} className="text-xs text-gray-600">{t}</li>
// // //                             ))}
// // //                           </ul>
// // //                         )}
// // //                       </div>
// // //                     )}
// // //                   </div>
// // //                 </div>
// // //               ) : (
// // //                 <div className="border rounded-lg p-4 text-sm text-gray-500">No product loaded. Click "Product" to view details.</div>
// // //               )}
// // //             </div>
// // //           </div>
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // }


// // // file: src/admin/pages/ContentManager.jsx
// // import { useEffect, useState } from "react";
// // import { MessageSquare, Flag, Eye } from "lucide-react";
// // import StatCard from "../components/StatCard";
// // import DataTable from "../components/DataTable";

// // import {
// //   getReportedReviews,
// //   getReviewReports,
// //   getReviewProduct,
// // } from "../../services/ReportAPI";

// // export default function ContentManager() {
// //   const [reviews, setReviews] = useState([]);
// //   const [selectedReview, setSelectedReview] = useState(null);
// //   const [reports, setReports] = useState([]);
// //   const [productDetails, setProductDetails] = useState(null);
// //   const [loading, setLoading] = useState(false);
// //   const [detailLoading, setDetailLoading] = useState(false);

// //   useEffect(() => {
// //     loadReviews();
// //   }, []);

// //   const loadReviews = async () => {
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

// //   const handleViewReports = async (row) => {
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

// //   const handleViewProduct = async (row) => {
// //     try {
// //       setDetailLoading(true);
// //       const product = await getReviewProduct(row._id);
// //       setProductDetails(product);
// //       if (!selectedReview || selectedReview.id !== row._id) {
// //         setSelectedReview({
// //           id: row._id,
// //           rating: row.rating,
// //           comment: row.comment,
// //           createdAt: row.createdAt,
// //           reviewAuthor: { id: row.userId, username: row.userName },
// //           product: {
// //             id: row.productId,
// //             name: row.productName,
// //             image1: row.productImage,
// //             price: row.productPrice,
// //             category: row.productCategory,
// //           },
// //         });
// //       }
// //     } catch (error) {
// //       console.error(error.message);
// //     } finally {
// //       setDetailLoading(false);
// //     }
// //   };

// //   const totalReports = reviews.reduce((acc, r) => acc + (r.reportCount || 0), 0);

// //   return (
// //     <div className="space-y-8">
// //       <StatCard
// //         pageTitle="Content Management"
// //         pageSubtitle="Manage reported reviews and user feedback"
// //         stats={[
// //           {
// //             title: "Reported Reviews",
// //             value: reviews.length,
// //             Icon: Flag,
// //             iconBg: "bg-red-100",
// //             iconColor: "text-red-600",
// //           },
// //           {
// //             title: "Total Reports",
// //             value: totalReports,
// //             Icon: MessageSquare,
// //             iconBg: "bg-yellow-100",
// //             iconColor: "text-yellow-600",
// //           },
// //         ]}
// //       />

// //       <DataTable
// //         title="Reported Reviews"
// //         subtitle="Click 'View' to see review details and reporter reasons"
// //         // columns now as objects (label + key + sortable)
// //         columns={[
// //           { label: "Product", key: "productName", sortable: true },
// //           { label: "User (name & id)", key: "userName", sortable: true },
// //           { label: "User ID", key: "userId", sortable: true },
// //           { label: "Rating", key: "rating", sortable: true },
// //           { label: "Reports", key: "reportCount", sortable: true },
// //         ]}
// //         data={reviews}
// //         searchableKeys={["productName", "userName", "userId", "comment"]}
// //         itemsPerPage={8}
// //         renderRow={(row) => (
// //           <>
// //             <td className="px-6 py-4">
// //               <div className="flex items-center gap-3">
// //                 {row.productImage ? (
// //                   <img src={row.productImage} alt={row.productName} className="w-12 h-12 object-cover rounded" />
// //                 ) : (
// //                   <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400">No Image</div>
// //                 )}
// //                 <div>
// //                   <div className="font-medium">{row.productName}</div>
// //                   <div className="text-xs text-gray-500">{row.productCategory}</div>
// //                 </div>
// //               </div>
// //             </td>

// //             <td className="px-6 py-4">
// //               <div className="font-medium">{row.userName}</div>
// //             </td>

// //             <td className="px-6 py-4">
// //               <div className="text-xs text-gray-500">ID: {row.userId}</div>
// //             </td>

// //             <td className="px-6 py-4">
// //               <span className="inline-flex items-center gap-1">
// //                 <span className="font-semibold">{row.rating}</span> <span>⭐</span>
// //               </span>
// //               <div className="text-xs text-gray-500 mt-1">{new Date(row.createdAt).toLocaleDateString()}</div>
// //             </td>

// //             <td className="px-6 py-4 text-red-600 font-semibold">{row.reportCount}</td>
// //           </>
// //         )}
// //         actions={(row) => (
// //           <div className="flex gap-2 items-center justify-center">
// //             <button onClick={() => handleViewReports(row)} className="text-emerald-600 hover:underline text-sm flex items-center gap-2" title="View reports and review">
// //               <Eye size={14} /> View
// //             </button>

// //             <button onClick={() => handleViewProduct(row)} className="text-gray-600 hover:underline text-sm flex items-center gap-2" title="View product">
// //               <Eye size={14} /> Product
// //             </button>
// //           </div>
// //         )}
// //       />

// //       {selectedReview && (
// //         <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
// //           <div className="flex items-start justify-between">
// //             <div className="flex-1 pr-6">
// //               <h3 className="text-lg font-semibold mb-1">Review Details</h3>
// //               <p className="text-sm text-gray-500 mb-3">
// //                 Review by <strong>{selectedReview.reviewAuthor?.username}</strong> (ID: {selectedReview.reviewAuthor?.id}) •{" "}
// //                 {new Date(selectedReview.createdAt).toLocaleString()}
// //               </p>

// //               <div className="mb-4">
// //                 <div className="flex items-center gap-2">
// //                   <div className="text-2xl font-bold">{selectedReview.rating} ⭐</div>
// //                 </div>
// //                 <p className="mt-2 text-gray-700">{selectedReview.comment}</p>
// //               </div>

// //               <h4 className="font-semibold mb-2 text-red-600">Reports ({reports.length})</h4>

// //               {reports.length > 0 ? (
// //                 <ul className="list-disc pl-6 space-y-3 text-sm text-gray-700">
// //                   {reports.map((report, i) => (
// //                     <li key={i}>
// //                       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
// //                         <div>
// //                           <span className="font-medium">{report.reportedBy}</span>{" "}
// //                           <span className="text-xs text-gray-500">· ID: {report.reportedById}</span>{" "}
// //                           <span className="text-xs text-gray-500">· {new Date(report.reportedAt).toLocaleString()}</span>
// //                         </div>
// //                         <div className="text-sm text-gray-700 mt-1 sm:mt-0">{report.reason || "No reason provided"}</div>
// //                       </div>
// //                     </li>
// //                   ))}
// //                 </ul>
// //               ) : (
// //                 <p className="text-gray-500 text-sm">No detailed reports found for this review.</p>
// //               )}
// //             </div>

// //             <div className="w-64 ml-6">
// //               <h4 className="text-sm text-gray-600 mb-3">Product</h4>

// //               {productDetails ? (
// //                 <div className="border rounded-lg overflow-hidden">
// //                   <img src={productDetails.image1 || productDetails.image2 || productDetails.image3 || ""} alt={productDetails.name} className="w-full h-40 object-cover bg-gray-100" />
// //                   <div className="p-3">
// //                     <div className="font-medium">{productDetails.name}</div>
// //                     <div className="text-xs text-gray-500">{productDetails.category}</div>
// //                     <div className="mt-2 font-semibold">Rs {productDetails.price}</div>
// //                     <div className="text-xs text-gray-500 mt-1">Stock: {productDetails.stock ?? "N/A"}</div>

// //                     {productDetails.care && (
// //                       <div className="mt-3 text-xs text-gray-600">
// //                         <div>Care: {productDetails.care.level}</div>
// //                         {productDetails.care.tips && productDetails.care.tips.length > 0 && (
// //                           <ul className="list-disc pl-5 mt-1">
// //                             {productDetails.care.tips.slice(0, 3).map((t, idx) => (
// //                               <li key={idx} className="text-xs text-gray-600">{t}</li>
// //                             ))}
// //                           </ul>
// //                         )}
// //                       </div>
// //                     )}
// //                   </div>
// //                 </div>
// //               ) : (
// //                 <div className="border rounded-lg p-4 text-sm text-gray-500">No product loaded. Click "Product" to view details.</div>
// //               )}
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }



// // file: src/admin/pages/ContentManager.jsx
// import { useEffect, useState } from "react";
// import { MessageSquare, Flag, Eye, Trash2 } from "lucide-react";
// import StatCard from "../components/StatCard";
// import DataTable from "../components/DataTable";

// import {
//   getReportedReviews,
//   getReviewReports,
//   getReviewProduct,
// } from "../../services/ReportAPI";

// export default function ContentManager() {
//   const [reviews, setReviews] = useState([]);
//   const [selectedReview, setSelectedReview] = useState(null);
//   const [reports, setReports] = useState([]);
//   const [productDetails, setProductDetails] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [detailLoading, setDetailLoading] = useState(false);

//   useEffect(() => {
//     loadReviews();
//   }, []);

//   const loadReviews = async () => {
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

//   const handleViewReports = async (row) => {
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

//   const handleViewProduct = async (row) => {
//     try {
//       setDetailLoading(true);
//       const product = await getReviewProduct(row._id);
//       setProductDetails(product);
//       if (!selectedReview || selectedReview.id !== row._id) {
//         setSelectedReview({
//           id: row._id,
//           rating: row.rating,
//           comment: row.comment,
//           createdAt: row.createdAt,
//           reviewAuthor: { id: row.userId, username: row.userName },
//           product: {
//             id: row.productId,
//             name: row.productName,
//             image1: row.productImage,
//             price: row.productPrice,
//             category: row.productCategory,
//           },
//         });
//       }
//     } catch (error) {
//       console.error(error.message);
//     } finally {
//       setDetailLoading(false);
//     }
//   };

//   // Placeholder delete handler for now
//   const handleDeleteReview = (reviewId) => {
//     if (confirm("Are you sure you want to delete this review?")) {
//       console.log("Delete review:", reviewId);
//       // Next step: call API to delete review
//     }
//   };

//   const totalReports = reviews.reduce((acc, r) => acc + (r.reportCount || 0), 0);

//   return (
//     <div className="space-y-8">
//       <StatCard
//         pageTitle="Content Management"
//         pageSubtitle="Manage reported reviews and user feedback"
//         stats={[
//           {
//             title: "Reported Reviews",
//             value: reviews.length,
//             Icon: Flag,
//             iconBg: "bg-red-100",
//             iconColor: "text-red-600",
//           },
//           {
//             title: "Total Reports",
//             value: totalReports,
//             Icon: MessageSquare,
//             iconBg: "bg-yellow-100",
//             iconColor: "text-yellow-600",
//           },
//         ]}
//       />

//       <DataTable
//         title="Reported Reviews"
//         subtitle="Click 'View' to see review details and reporter reasons"
//         columns={[
//           { label: "Product", key: "productName", sortable: true },
//           { label: "User (name & id)", key: "userName", sortable: true },
//           { label: "User ID", key: "userId", sortable: true },
//           { label: "Rating", key: "rating", sortable: true },
//           { label: "Reports", key: "reportCount", sortable: true },
//         ]}
//         data={reviews}
//         searchableKeys={["productName", "userName", "userId", "comment"]}
//         itemsPerPage={8}
//         renderRow={(row) => (
//           <>
//             <td className="px-6 py-4">
//               <div className="flex items-center gap-3">
//                 {row.productImage ? (
//                   <img src={row.productImage} alt={row.productName} className="w-12 h-12 object-cover rounded" />
//                 ) : (
//                   <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400">No Image</div>
//                 )}
//                 <div>
//                   <div className="font-medium">{row.productName}</div>
//                   <div className="text-xs text-gray-500">{row.productCategory}</div>
//                 </div>
//               </div>
//             </td>

//             <td className="px-6 py-4">
//               <div className="font-medium">{row.userName}</div>
//             </td>

//             <td className="px-6 py-4">
//               <div className="text-xs text-gray-500">ID: {row.userId}</div>
//             </td>

//             <td className="px-6 py-4">
//               <span className="inline-flex items-center gap-1">
//                 <span className="font-semibold">{row.rating}</span> <span>⭐</span>
//               </span>
//               <div className="text-xs text-gray-500 mt-1">{new Date(row.createdAt).toLocaleDateString()}</div>
//             </td>

//             <td className="px-6 py-4 text-red-600 font-semibold">{row.reportCount}</td>
//           </>
//         )}
//         actions={(row) => (
//           <div className="flex gap-2 items-center justify-center">
//             <button
//               onClick={() => handleViewReports(row)}
//               className="text-emerald-600 hover:underline text-sm flex items-center gap-2"
//               title="View reports and review"
//             >
//               <Eye size={14} /> View
//             </button>

//             <button
//               onClick={() => handleViewProduct(row)}
//               className="text-gray-600 hover:underline text-sm flex items-center gap-2"
//               title="View product"
//             >
//               <Eye size={14} /> Product
//             </button>

//             <button
//               onClick={() => handleDeleteReview(row._id)}
//               className="text-red-600 hover:underline text-sm flex items-center gap-2"
//               title="Delete review"
//             >
//               <Trash2 size={14} /> Delete
//             </button>
//           </div>
//         )}
//       />

//       {selectedReview && (
//         <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
//           <div className="flex flex-col sm:flex-row items-start sm:items-start justify-between gap-6">
//             <div className="flex-1">
//               <h3 className="text-lg font-semibold mb-2">Review Details</h3>
//               <p className="text-sm text-gray-500 mb-3">
//                 Review by <strong>{selectedReview.reviewAuthor?.username}</strong> (ID: {selectedReview.reviewAuthor?.id}) •{" "}
//                 {new Date(selectedReview.createdAt).toLocaleString()}
//               </p>

//               <div className="mb-4">
//                 <div className="flex items-center gap-2">
//                   <div className="text-2xl font-bold">{selectedReview.rating} ⭐</div>
//                 </div>
//                 <p className="mt-2 text-gray-700 break-words">{selectedReview.comment}</p>
//               </div>

//               <h4 className="font-semibold mb-2 text-red-600">Reports ({reports.length})</h4>

//               {reports.length > 0 ? (
//                 <ul className="list-disc pl-6 space-y-3 text-sm text-gray-700">
//                   {reports.map((report, i) => (
//                     <li key={i}>
//                       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
//                         <div>
//                           <span className="font-medium">{report.reportedBy}</span>{" "}
//                           <span className="text-xs text-gray-500">· ID: {report.reportedById}</span>{" "}
//                           <span className="text-xs text-gray-500">· {new Date(report.reportedAt).toLocaleString()}</span>
//                         </div>
//                         <div className="text-sm text-gray-700 mt-1 sm:mt-0">{report.reason || "No reason provided"}</div>
//                       </div>
//                     </li>
//                   ))}
//                 </ul>
//               ) : (
//                 <p className="text-gray-500 text-sm">No detailed reports found for this review.</p>
//               )}
//             </div>

//             <div className="w-full sm:w-64">
//               <h4 className="text-sm text-gray-600 mb-3">Product</h4>

//               {productDetails ? (
//                 <div className="border rounded-lg overflow-hidden">
//                   <img src={productDetails.image1 || productDetails.image2 || productDetails.image3 || ""} alt={productDetails.name} className="w-full h-40 object-cover bg-gray-100" />
//                   <div className="p-3">
//                     <div className="font-medium">{productDetails.name}</div>
//                     <div className="text-xs text-gray-500">{productDetails.category}</div>
//                     <div className="mt-2 font-semibold">Rs {productDetails.price}</div>
//                     <div className="text-xs text-gray-500 mt-1">Stock: {productDetails.stock ?? "N/A"}</div>

//                     {productDetails.care && (
//                       <div className="mt-3 text-xs text-gray-600">
//                         <div>Care: {productDetails.care.level}</div>
//                         {productDetails.care.tips && productDetails.care.tips.length > 0 && (
//                           <ul className="list-disc pl-5 mt-1">
//                             {productDetails.care.tips.slice(0, 3).map((t, idx) => (
//                               <li key={idx} className="text-xs text-gray-600">{t}</li>
//                             ))}
//                           </ul>
//                         )}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               ) : (
//                 <div className="border rounded-lg p-4 text-sm text-gray-500">No product loaded. Click "Product" to view details.</div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }



import { useEffect, useState } from "react";
import { MessageSquare, Flag, Eye } from "lucide-react";
import StatCard from "../components/StatCard";
import DataTable from "../components/DataTable";

import {
  getReportedReviews,
  getReviewReports,
  getReviewProduct,
  deleteReview, // ✅ added
} from "../../services/ReportAPI";

export default function ContentManager() {
  const [reviews, setReviews] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null);
  const [reports, setReports] = useState([]);
  const [productDetails, setProductDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
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

  const handleViewReports = async (row) => {
    try {
      setDetailLoading(true);
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
    } finally {
      setDetailLoading(false);
    }
  };

  const handleViewProduct = async (row) => {
    try {
      setDetailLoading(true);
      const product = await getReviewProduct(row._id);
      setProductDetails(product);

      if (!selectedReview || selectedReview.id !== row._id) {
        setSelectedReview({
          id: row._id,
          rating: row.rating,
          comment: row.comment,
          createdAt: row.createdAt,
          reviewAuthor: { id: row.userId, username: row.userName },
          product: {
            id: row.productId,
            name: row.productName,
            image1: row.productImage,
            price: row.productPrice,
            category: row.productCategory,
          },
        });
      }
    } catch (error) {
      console.error(error.message);
    } finally {
      setDetailLoading(false);
    }
  };

  // ✅ DELETE HANDLER
  const handleDeleteReview = async (reviewId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to permanently delete this review?"
    );
    if (!confirmDelete) return;

    try {
      setDetailLoading(true);
      await deleteReview(reviewId);

      setReviews((prev) => prev.filter((r) => r._id !== reviewId));

      if (selectedReview?.id === reviewId) {
        setSelectedReview(null);
        setReports([]);
        setProductDetails(null);
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

  return (
    <div className="space-y-8">
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
        subtitle="Click 'View' to see review details and reporter reasons"
        columns={[
          { label: "Product", key: "productName", sortable: true },
          { label: "User (name & id)", key: "userName", sortable: true },
          { label: "User ID", key: "userId", sortable: true },
          { label: "Rating", key: "rating", sortable: true },
          { label: "Reports", key: "reportCount", sortable: true },
        ]}
        data={reviews}
        searchableKeys={[
          "productName",
          "userName",
          "userId",
          "comment",
        ]}
        itemsPerPage={8}
        loading={loading}
        renderRow={(row) => (
          <>
            <td className="px-6 py-4">
              <div className="flex items-center gap-3">
                {row.productImage ? (
                  <img
                    src={row.productImage}
                    alt={row.productName}
                    className="w-12 h-12 object-cover rounded"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400">
                    No Image
                  </div>
                )}
                <div>
                  <div className="font-medium">{row.productName}</div>
                  <div className="text-xs text-gray-500">
                    {row.productCategory}
                  </div>
                </div>
              </div>
            </td>

            <td className="px-6 py-4 font-medium">
              {row.userName}
            </td>

            <td className="px-6 py-4 text-xs text-gray-500">
              ID: {row.userId}
            </td>

            <td className="px-6 py-4">
              <div className="font-semibold">
                {row.rating} ⭐
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {new Date(row.createdAt).toLocaleDateString()}
              </div>
            </td>

            <td className="px-6 py-4 text-red-600 font-semibold">
              {row.reportCount}
            </td>
          </>
        )}
        actions={(row) => (
          <div className="flex gap-3 items-center justify-center">
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

            <button
              onClick={() => handleDeleteReview(row._id)}
              className="text-red-600 hover:underline text-sm font-semibold"
            >
              Delete
            </button>
          </div>
        )}
      />

      {selectedReview && (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex-1 pr-6">

              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">
                  Review Details
                </h3>

                <button
                  onClick={() =>
                    handleDeleteReview(selectedReview.id)
                  }
                  className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition"
                >
                  Delete Review
                </button>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  Review by{" "}
                  <strong>
                    {selectedReview.reviewAuthor?.username}
                  </strong>{" "}
                  (ID: {selectedReview.reviewAuthor?.id})
                </p>

                <p className="text-xs text-gray-500 mb-3">
                  {new Date(
                    selectedReview.createdAt
                  ).toLocaleString()}
                </p>

                <div className="text-3xl font-bold text-yellow-500 mb-3">
                  {selectedReview.rating} ⭐
                </div>

                <div className="bg-white p-4 rounded border text-gray-800 leading-relaxed">
                  {selectedReview.comment}
                </div>
              </div>

              <h4 className="font-semibold mb-2 text-red-600">
                Reports ({reports.length})
              </h4>

              {reports.length > 0 ? (
                <div className="space-y-3">
                  {reports.map((report, i) => (
                    <div
                      key={i}
                      className="border border-red-200 bg-red-50 rounded-lg p-3"
                    >
                      <div className="text-sm font-medium">
                        {report.reportedBy}
                        <span className="text-xs text-gray-500 ml-2">
                          ID: {report.reportedById}
                        </span>
                      </div>

                      <div className="text-xs text-gray-500">
                        {new Date(
                          report.reportedAt
                        ).toLocaleString()}
                      </div>

                      <div className="mt-2 text-sm text-gray-700">
                        {report.reason ||
                          "No reason provided"}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">
                  No detailed reports found.
                </p>
              )}
            </div>

            <div className="w-64 ml-6">
              <h4 className="text-sm text-gray-600 mb-3">
                Product
              </h4>

              {productDetails ? (
                <div className="border rounded-lg overflow-hidden">
                  <img
                    src={
                      productDetails.image1 ||
                      productDetails.image2 ||
                      productDetails.image3 ||
                      ""
                    }
                    alt={productDetails.name}
                    className="w-full h-40 object-cover bg-gray-100"
                  />
                  <div className="p-3">
                    <div className="font-medium">
                      {productDetails.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {productDetails.category}
                    </div>
                    <div className="mt-2 font-semibold">
                      Rs {productDetails.price}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Stock:{" "}
                      {productDetails.stock ?? "N/A"}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="border rounded-lg p-4 text-sm text-gray-500">
                  No product loaded.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
