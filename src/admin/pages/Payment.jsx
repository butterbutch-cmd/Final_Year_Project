// import React, { useEffect, useMemo, useState } from "react";
// import DataTable from "../components/DataTable";
// import {
//   Eye,
//   CreditCard,
//   RefreshCw,
//   Truck,
//   Package,
//   CheckCircle,
//   XCircle,
//   X,
// } from "lucide-react";

// import {
//   getPayments,
//   getPaymentById,
//   updatePaymentStatus,
//   refundPayment,
//   updateDeliveryStatus,
// } from "../../services/paymentAPI";

// const Payment = () => {
//   const [transactions, setTransactions] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [selectedTxn, setSelectedTxn] = useState(null);
//   const [showDetailModal, setShowDetailModal] = useState(false);
//   const [refreshToken, setRefreshToken] = useState(0);

//   useEffect(() => {
//     loadPayments();
//   }, [refreshToken]);

//   /* =========================
//      API HANDLERS
//   ========================== */
//   const loadPayments = async () => {
//     setLoading(true);
//     try {
//       const data = await getPayments();
//       setTransactions(Array.isArray(data) ? data : []);
//     } catch (err) {
//       console.error(err);
//       setTransactions([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePaymentStatusChange = async (id, status) => {
//     try {
//       const normalized = status.toUpperCase();
//       await updatePaymentStatus(id, normalized);
//       setTransactions((prev) =>
//         prev.map((t) =>
//           t._id === id ? { ...t, status: normalized } : t
//         )
//       );
//     } catch (err) {
//       alert(err.message);
//     }
//   };

//   const handleDeliveryStatusChange = async (id, deliveryStatus) => {
//     try {
//       const normalized = deliveryStatus.toUpperCase();
//       await updateDeliveryStatus(id, normalized);
//       setTransactions((prev) =>
//         prev.map((t) =>
//           t._id === id ? { ...t, deliveryStatus: normalized } : t
//         )
//       );
//     } catch (err) {
//       alert(err.message);
//     }
//   };

//   const handleRefund = async (id) => {
//     if (!confirm("Refund this payment?")) return;
//     try {
//       await refundPayment(id);
//       setRefreshToken((t) => t + 1);
//     } catch (err) {
//       alert(err.message);
//     }
//   };

//   const openDetails = async (id) => {
//     try {
//       const fresh = await getPaymentById(id);
//       setSelectedTxn(fresh);
//     } catch (err) {
//       console.error(err);
//       // Fallback to finding from local state
//       const local = transactions.find(t => t._id === id);
//       setSelectedTxn(local);
//     }
//     setShowDetailModal(true);
//   };

//   const closeModal = () => {
//     setShowDetailModal(false);
//     setSelectedTxn(null);
//   };

//   const formatCurrency = (n) => `Rs ${Number(n || 0).toFixed(2)}`;

//   /* =========================
//      DELIVERY BADGE
//   ========================== */
//   const DeliveryStatusBadge = ({ status }) => {
//     const map = {
//       PENDING: { cls: "bg-yellow-100 text-yellow-700", icon: <Package size={12} /> },
//       SHIPPED: { cls: "bg-blue-100 text-blue-700", icon: <Truck size={12} /> },
//       DELIVERED: { cls: "bg-emerald-100 text-emerald-700", icon: <CheckCircle size={12} /> },
//       CANCELLED: { cls: "bg-red-100 text-red-700", icon: <XCircle size={12} /> },
//     };
//     const c = map[status] || map.PENDING;
//     return (
//       <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${c.cls}`}>
//         {c.icon} {status}
//       </span>
//     );
//   };

//   /* =========================
//      TABLE CONFIG
//   ========================== */
//   const columns = [
//     "Txn ID",
//     "Customer",
//     "Amount",
//     "Gateway",
//     "Payment Status",
//     "Delivery Status",
//     "Date",
//   ];

//   const renderRow = (txn) => (
//     <>
//       <td className="px-6 py-4">{txn._id.slice(-8)}</td>
//       <td className="px-6 py-4">
//         <div className="font-medium">{txn.customerDetails?.name || "—"}</div>
//         <div className="text-xs text-gray-500">{txn.customerDetails?.email}</div>
//       </td>
//       <td className="px-6 py-4 font-semibold">{formatCurrency(txn.amount)}</td>
//       <td className="px-6 py-4 uppercase">{txn.payment_gateway}</td>

//       <td className="px-6 py-4">
//         <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-100">
//           {txn.status}
//         </span>
//       </td>

//       <td className="px-6 py-4 space-y-1">
//         <DeliveryStatusBadge status={txn.deliveryStatus} />
//         <select
//           value={txn.deliveryStatus}
//           disabled={txn.deliveryStatus === "DELIVERED"}
//           onChange={(e) => handleDeliveryStatusChange(txn._id, e.target.value)}
//           className="border rounded px-2 py-1 text-xs w-full"
//         >
//           <option value="PENDING">PENDING</option>
//           <option value="SHIPPED">SHIPPED</option>
//           <option value="DELIVERED">DELIVERED</option>
//           <option value="CANCELLED">CANCELLED</option>
//         </select>
//       </td>

//       <td className="px-6 py-4 text-xs">
//         {new Date(txn.createdAt).toLocaleString()}
//       </td>
//     </>
//   );

//   const actions = (txn) => (
//     <div className="flex gap-2 justify-center">
//       <button 
//         onClick={() => openDetails(txn._id)} 
//         className="p-2 border rounded hover:bg-gray-50 transition-colors"
//         title="View Details"
//       >
//         <Eye size={16} />
//       </button>

//       <button
//         disabled={txn.status === "REFUNDED"}
//         onClick={() => handleRefund(txn._id)}
//         className="p-2 border rounded disabled:opacity-50 hover:bg-gray-50 transition-colors"
//         title="Refund Payment"
//       >
//         <CreditCard size={16} />
//       </button>

//       <select
//         value={txn.status}
//         disabled={txn.deliveryStatus === "DELIVERED"}
//         onChange={(e) => handlePaymentStatusChange(txn._id, e.target.value)}
//         className="border rounded px-2 py-1 text-sm"
//       >
//         <option value="PENDING">PENDING</option>
//         <option value="COMPLETED">COMPLETED</option>
//         <option value="FAILED">FAILED</option>
//         <option value="REFUNDED">REFUNDED</option>
//         <option value="CANCELLED">CANCELLED</option>
//       </select>
//     </div>
//   );

//   const data = useMemo(
//     () =>
//       transactions.map((t) => ({
//         ...t,
//         deliveryStatus: t.deliveryStatus || "PENDING",
//         status: t.status || "PENDING",
//       })),
//     [transactions]
//   );

//   return (
//     <>
//       <DataTable
//         title="Order Management"
//         subtitle={loading ? "Loading..." : `${data.length} orders`}
//         columns={columns}
//         data={data}
//         renderRow={renderRow}
//         actions={actions}
//         searchableKeys={["_id", "customerDetails.name", "customerDetails.email"]}
//         itemsPerPage={8}
//       />

//       {/* DETAIL MODAL */}
//       {showDetailModal && selectedTxn && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
//             {/* Header */}
//             <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
//               <h2 className="text-2xl font-bold">Transaction Details</h2>
//               <button
//                 onClick={closeModal}
//                 className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//               >
//                 <X size={24} />
//               </button>
//             </div>

//             {/* Content */}
//             <div className="p-6 space-y-6">
//               {/* Transaction Info */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <h3 className="font-semibold text-gray-700 mb-2">Transaction ID</h3>
//                   <p className="text-sm bg-gray-50 p-2 rounded font-mono">{selectedTxn._id}</p>
//                 </div>
//                 <div>
//                   <h3 className="font-semibold text-gray-700 mb-2">Date</h3>
//                   <p className="text-sm bg-gray-50 p-2 rounded">
//                     {new Date(selectedTxn.createdAt).toLocaleString()}
//                   </p>
//                 </div>
//                 <div>
//                   <h3 className="font-semibold text-gray-700 mb-2">Payment Gateway</h3>
//                   <p className="text-sm bg-gray-50 p-2 rounded uppercase">{selectedTxn.payment_gateway}</p>
//                 </div>
//                 <div>
//                   <h3 className="font-semibold text-gray-700 mb-2">Amount</h3>
//                   <p className="text-sm bg-gray-50 p-2 rounded font-semibold text-green-600">
//                     {formatCurrency(selectedTxn.amount)}
//                   </p>
//                 </div>
//                 <div>
//                   <h3 className="font-semibold text-gray-700 mb-2">Payment Status</h3>
//                   <p className="text-sm">
//                     <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100">
//                       {selectedTxn.status}
//                     </span>
//                   </p>
//                 </div>
//                 <div>
//                   <h3 className="font-semibold text-gray-700 mb-2">Delivery Status</h3>
//                   <DeliveryStatusBadge status={selectedTxn.deliveryStatus || "PENDING"} />
//                 </div>
//               </div>

//               {/* Customer Details */}
//               <div className="border-t pt-4">
//                 <h3 className="font-semibold text-gray-700 mb-3 text-lg">Customer Details</h3>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <h4 className="text-sm font-semibold text-gray-600 mb-1">Name</h4>
//                     <p className="text-sm bg-gray-50 p-2 rounded">
//                       {selectedTxn.customerDetails?.name || "—"}
//                     </p>
//                   </div>
//                   <div>
//                     <h4 className="text-sm font-semibold text-gray-600 mb-1">Email</h4>
//                     <p className="text-sm bg-gray-50 p-2 rounded">
//                       {selectedTxn.customerDetails?.email || "—"}
//                     </p>
//                   </div>
//                   <div>
//                     <h4 className="text-sm font-semibold text-gray-600 mb-1">Phone</h4>
//                     <p className="text-sm bg-gray-50 p-2 rounded">
//                       {selectedTxn.customerDetails?.phone || "—"}
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {/* Delivery Address */}
//               <div className="border-t pt-4">
//                 <h3 className="font-semibold text-gray-700 mb-3 text-lg">Delivery Address</h3>
//                 <div className="bg-gray-50 p-4 rounded">
//                   {selectedTxn.deliveryAddress ? (
//                     <div className="space-y-1 text-sm">
//                       {selectedTxn.deliveryAddress.label && (
//                         <p className="font-semibold">{selectedTxn.deliveryAddress.label}</p>
//                       )}
//                       <p>{selectedTxn.deliveryAddress.street}</p>
//                       <p>
//                         {selectedTxn.deliveryAddress.city}
//                         {selectedTxn.deliveryAddress.state && `, ${selectedTxn.deliveryAddress.state}`}
//                         {selectedTxn.deliveryAddress.postalCode && ` - ${selectedTxn.deliveryAddress.postalCode}`}
//                       </p>
//                       <p>{selectedTxn.deliveryAddress.country || "Nepal"}</p>
//                     </div>
//                   ) : (
//                     <p className="text-sm text-gray-500">No address provided</p>
//                   )}
//                 </div>
//               </div>

//               {/* Cart Items */}
//               <div className="border-t pt-4">
//                 <h3 className="font-semibold text-gray-700 mb-3 text-lg">Order Items</h3>
//                 <div className="space-y-2">
//                   {selectedTxn.cartItems && selectedTxn.cartItems.length > 0 ? (
//                     selectedTxn.cartItems.map((item, idx) => (
//                       <div
//                         key={idx}
//                         className="bg-gray-50 p-4 rounded flex justify-between items-center"
//                       >
//                         <div>
//                           <p className="font-medium">{item.name}</p>
//                           <p className="text-sm text-gray-600">
//                             Quantity: {item.quantity} × {formatCurrency(item.price)}
//                           </p>
//                         </div>
//                         <div className="font-semibold">
//                           {formatCurrency(item.quantity * item.price)}
//                         </div>
//                       </div>
//                     ))
//                   ) : (
//                     <p className="text-sm text-gray-500">No items found</p>
//                   )}
//                 </div>
//               </div>

//               {/* Cancellation Info (if applicable) */}
//               {selectedTxn.cancellation && selectedTxn.cancellation.reason && (
//                 <div className="border-t pt-4">
//                   <h3 className="font-semibold text-gray-700 mb-3 text-lg text-red-600">
//                     Cancellation Information
//                   </h3>
//                   <div className="bg-red-50 p-4 rounded space-y-2">
//                     <div>
//                       <h4 className="text-sm font-semibold text-gray-600 mb-1">Reason</h4>
//                       <p className="text-sm">{selectedTxn.cancellation.reason}</p>
//                     </div>
//                     {selectedTxn.cancellation.cancelledAt && (
//                       <div>
//                         <h4 className="text-sm font-semibold text-gray-600 mb-1">Cancelled At</h4>
//                         <p className="text-sm">
//                           {new Date(selectedTxn.cancellation.cancelledAt).toLocaleString()}
//                         </p>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Footer */}
//             <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-4 flex justify-end">
//               <button
//                 onClick={closeModal}
//                 className="px-6 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default Payment;

import React, { useEffect, useMemo, useState } from "react";
import DataTable from "../components/DataTable";
import {
  Eye,
  CreditCard,
  Truck,
  Package,
  CheckCircle,
  XCircle,
  X,
} from "lucide-react";

import {
  getPayments,
  getPaymentById,
  updatePaymentStatus,
  refundPayment,
  updateDeliveryStatus,
} from "../../services/paymentAPI";

import { getMyAdminProfile } from "../../services/adminAPI";

const Payment = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTxn, setSelectedTxn] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [refreshToken, setRefreshToken] = useState(0);

  // ✅ Permissions State
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
     LOAD PAYMENTS
  ========================== */
  const loadPayments = async () => {
    // ❌ Block if no view permission
    if (!permissions.payments?.view) return;

    setLoading(true);
    try {
      const data = await getPayments();
      setTransactions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setTransactions([]);
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
    loadPayments();
  }, [refreshToken, permissions]);

  /* =========================
     ACTION HANDLERS
  ========================== */
  const handlePaymentStatusChange = async (id, status) => {
    if (!permissions.payments?.edit) return;

    try {
      const normalized = status.toUpperCase();
      await updatePaymentStatus(id, normalized);
      setTransactions((prev) =>
        prev.map((t) =>
          t._id === id ? { ...t, status: normalized } : t
        )
      );
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeliveryStatusChange = async (id, deliveryStatus) => {
    if (!permissions.payments?.edit) return;

    try {
      const normalized = deliveryStatus.toUpperCase();
      await updateDeliveryStatus(id, normalized);
      setTransactions((prev) =>
        prev.map((t) =>
          t._id === id ? { ...t, deliveryStatus: normalized } : t
        )
      );
    } catch (err) {
      alert(err.message);
    }
  };

  const handleRefund = async (id) => {
    if (!permissions.payments?.edit) return;
    if (!window.confirm("Refund this payment?")) return;

    try {
      await refundPayment(id);
      setRefreshToken((t) => t + 1);
    } catch (err) {
      alert(err.message);
    }
  };

  const openDetails = async (id) => {
    if (!permissions.payments?.view) return;

    try {
      const fresh = await getPaymentById(id);
      setSelectedTxn(fresh);
    } catch (err) {
      const local = transactions.find((t) => t._id === id);
      setSelectedTxn(local);
    }
    setShowDetailModal(true);
  };

  const closeModal = () => {
    setShowDetailModal(false);
    setSelectedTxn(null);
  };

  const formatCurrency = (n) => `Rs ${Number(n || 0).toFixed(2)}`;

  /* =========================
     DELIVERY BADGE
  ========================== */
  const DeliveryStatusBadge = ({ status }) => {
    const map = {
      PENDING: { cls: "bg-yellow-100 text-yellow-700", icon: <Package size={12} /> },
      SHIPPED: { cls: "bg-blue-100 text-blue-700", icon: <Truck size={12} /> },
      DELIVERED: { cls: "bg-emerald-100 text-emerald-700", icon: <CheckCircle size={12} /> },
      CANCELLED: { cls: "bg-red-100 text-red-700", icon: <XCircle size={12} /> },
    };
    const c = map[status] || map.PENDING;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${c.cls}`}>
        {c.icon} {status}
      </span>
    );
  };

  /* =========================
     TABLE CONFIG
  ========================== */
  const columns = [
    "Txn ID",
    "Customer",
    "Amount",
    "Gateway",
    "Payment Status",
    "Delivery Status",
    "Date",
  ];

  const renderRow = (txn) => (
    <>
      <td className="px-6 py-4">{txn._id.slice(-8)}</td>
      <td className="px-6 py-4">
        <div className="font-medium">{txn.customerDetails?.name || "—"}</div>
        <div className="text-xs text-gray-500">{txn.customerDetails?.email}</div>
      </td>
      <td className="px-6 py-4 font-semibold">{formatCurrency(txn.amount)}</td>
      <td className="px-6 py-4 uppercase">{txn.payment_gateway}</td>
      <td className="px-6 py-4">
        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-100">
          {txn.status}
        </span>
      </td>
      <td className="px-6 py-4 space-y-1">
        <DeliveryStatusBadge status={txn.deliveryStatus} />
      </td>
      <td className="px-6 py-4 text-xs">
        {new Date(txn.createdAt).toLocaleString()}
      </td>
    </>
  );

  const actions = (txn) =>
    permissions.payments?.edit ? (
      <div className="flex gap-2 justify-center">
        <button
          onClick={() => openDetails(txn._id)}
          className="p-2 border rounded hover:bg-gray-50"
        >
          <Eye size={16} />
        </button>

        <button
          disabled={txn.status === "REFUNDED"}
          onClick={() => handleRefund(txn._id)}
          className="p-2 border rounded disabled:opacity-50"
        >
          <CreditCard size={16} />
        </button>
      </div>
    ) : null;

  const data = useMemo(
    () =>
      transactions.map((t) => ({
        ...t,
        deliveryStatus: t.deliveryStatus || "PENDING",
        status: t.status || "PENDING",
      })),
    [transactions]
  );

  /* =========================
     RENDER
  ========================== */
  return (
    <>
      {/* ❌ If no view permission */}
      {!permissions.payments?.view ? (
        <div className="bg-white p-6 rounded-lg text-center text-red-600">
          You do not have permission to view payments.
        </div>
      ) : (
        <DataTable
          title="Order Management"
          subtitle={loading ? "Loading..." : `${data.length} orders`}
          columns={columns}
          data={data}
          renderRow={renderRow}
          actions={actions}
          searchableKeys={["_id", "customerDetails.name", "customerDetails.email"]}
          itemsPerPage={8}
        />
      )}

      {/* MODAL */}
      {showDetailModal && selectedTxn && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-3xl">
            <h2 className="text-xl font-bold mb-4">Transaction Details</h2>
            <pre className="text-sm bg-gray-100 p-4 rounded overflow-auto">
              {JSON.stringify(selectedTxn, null, 2)}
            </pre>
            <button
              onClick={closeModal}
              className="mt-4 px-4 py-2 bg-gray-800 text-white rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Payment;
