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
  Slash,
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

  // Permissions
  const [permissions, setPermissions] = useState({});

  // Per-transaction action loading flags
  const [actionLoading, setActionLoading] = useState({});

  const setTxnLoading = (id, val) =>
    setActionLoading((s) => ({ ...s, [id]: !!val }));

  /* =========================
     FETCH ADMIN PROFILE
  ========================== */
  const fetchProfile = async () => {
    try {
      const data = await getMyAdminProfile();
      setPermissions(data.permissions || {});
    } catch (err) {
      console.error("Failed to fetch admin profile:", err?.message || err);
    }
  };

  /* =========================
     LOAD PAYMENTS
  ========================== */
  const loadPayments = async () => {
    if (!permissions.payments?.view) return;
    setLoading(true);
    try {
      const data = await getPayments();
      setTransactions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load payments:", err?.message || err);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadPayments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshToken, permissions]);

  /* =========================
     ACTION HANDLERS
  ========================== */
  const handlePaymentStatusChange = async (id, status) => {
    if (!permissions.payments?.edit) return;
    setTxnLoading(id, true);
    try {
      const normalized = String(status).toUpperCase();
      await updatePaymentStatus(id, normalized);
      setTransactions((prev) =>
        prev.map((t) => (t._id === id ? { ...t, status: normalized } : t))
      );
    } catch (err) {
      alert(err?.message || "Failed to update payment status");
    } finally {
      setTxnLoading(id, false);
    }
  };

  const handleDeliveryStatusChange = async (id, deliveryStatus) => {
    if (!permissions.payments?.edit) return;
    setTxnLoading(id, true);
    try {
      const normalized = String(deliveryStatus).toUpperCase();
      await updateDeliveryStatus(id, normalized);
      // backend updates txn.status for some transitions (DELIVERED => COMPLETED, CANCELLED => CANCELLED)
      setTransactions((prev) =>
        prev.map((t) =>
          t._id === id
            ? {
                ...t,
                deliveryStatus: normalized,
                status:
                  normalized === "DELIVERED"
                    ? "COMPLETED"
                    : normalized === "CANCELLED"
                    ? "CANCELLED"
                    : t.status,
              }
            : t
        )
      );
    } catch (err) {
      alert(err?.message || "Failed to update delivery status");
    } finally {
      setTxnLoading(id, false);
    }
  };

  const handleRefund = async (id) => {
    if (!permissions.payments?.edit) return;
    if (!window.confirm("Refund this payment?")) return;

    setTxnLoading(id, true);
    try {
      await refundPayment(id);
      // refresh list to ensure all denormalized fields update
      setRefreshToken((t) => t + 1);
    } catch (err) {
      alert(err?.message || "Refund failed");
    } finally {
      setTxnLoading(id, false);
    }
  };

  /**
   * INACTIVE HANDLER (completed)
   * Mark a transaction inactive by:
   *  - setting payment status => CANCELLED
   *  - setting deliveryStatus => CANCELLED
   *
   * This keeps backend calls straightforward (2 endpoints) and updates UI optimistically.
   */
  const handleMarkInactive = async (id) => {
    if (!permissions.payments?.edit) return;
    if (!window.confirm("Mark this transaction as inactive (cancel)?")) return;

    setTxnLoading(id, true);
    try {
      // set payment status to CANCELLED
      await updatePaymentStatus(id, "CANCELLED");
      // set delivery status to CANCELLED (this endpoint also locks delivered orders)
      await updateDeliveryStatus(id, "CANCELLED");

      // update UI optimistically
      setTransactions((prev) =>
        prev.map((t) =>
          t._id === id
            ? { ...t, status: "CANCELLED", deliveryStatus: "CANCELLED" }
            : t
        )
      );
    } catch (err) {
      alert(err?.message || "Failed to mark inactive");
    } finally {
      setTxnLoading(id, false);
    }
  };

  const openDetails = async (id) => {
    if (!permissions.payments?.view) return;
    try {
      const fresh = await getPaymentById(id);
      setSelectedTxn(fresh);
    } catch (err) {
      const local = transactions.find((t) => t._id === id);
      setSelectedTxn(local || null);
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
     TABLE CONFIG & RENDERER
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

  const renderRow = (txn) => {
    const isBusy = !!actionLoading[txn._id];
    const localStatus = txn.status || "PENDING";
    const localDelivery = txn.deliveryStatus || "PENDING";

    return (
      <>
        <td className="px-6 py-4">{txn._id?.slice?.(-8) ?? txn._id}</td>

        <td className="px-6 py-4">
          <div className="font-medium">{txn.customerDetails?.name || "—"}</div>
          <div className="text-xs text-gray-500">{txn.customerDetails?.email}</div>
        </td>

        <td className="px-6 py-4 font-semibold">{formatCurrency(txn.amount)}</td>

        <td className="px-6 py-4 uppercase">{txn.payment_gateway}</td>

        <td className="px-6 py-4">
          {/* display badge when not editable; select when editable */}
          {permissions.payments?.edit ? (
            <div className="flex items-center gap-2">
              <select
                value={localStatus}
                onChange={(e) => handlePaymentStatusChange(txn._id, e.target.value)}
                disabled={isBusy}
                className="border rounded px-2 py-1 text-sm"
              >
                <option>PENDING</option>
                <option>COMPLETED</option>
                <option>FAILED</option>
                <option>REFUNDED</option>
                <option>CANCELLED</option>
              </select>
              <span className="text-xs text-gray-500">{localStatus}</span>
            </div>
          ) : (
            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-100">
              {localStatus}
            </span>
          )}
        </td>

        <td className="px-6 py-4 space-y-1">
          <div className="flex items-center gap-2">
            <DeliveryStatusBadge status={localDelivery} />
            {permissions.payments?.edit && (
              <select
                value={localDelivery}
                onChange={(e) => handleDeliveryStatusChange(txn._id, e.target.value)}
                disabled={isBusy}
                className="border rounded px-2 py-1 text-sm"
              >
                <option>PENDING</option>
                <option>SHIPPED</option>
                <option>DELIVERED</option>
                <option>CANCELLED</option>
              </select>
            )}
          </div>
        </td>

        <td className="px-6 py-4 text-xs">{new Date(txn.createdAt).toLocaleString()}</td>
      </>
    );
  };

  const actions = (txn) =>
    permissions.payments?.edit ? (
      <div className="flex gap-2 justify-center items-center">
        <button
          onClick={() => openDetails(txn._id)}
          className="p-2 border rounded hover:bg-gray-50"
          title="Details"
          disabled={!!actionLoading[txn._id]}
        >
          <Eye size={16} />
        </button>

        <button
          disabled={txn.status === "REFUNDED" || !!actionLoading[txn._id]}
          onClick={() => handleRefund(txn._id)}
          className="p-2 border rounded disabled:opacity-50"
          title="Refund"
        >
          <CreditCard size={16} />
        </button>

        <button
          onClick={() => handleMarkInactive(txn._id)}
          disabled={txn.status === "CANCELLED" || !!actionLoading[txn._id]}
          className="p-2 border rounded disabled:opacity-50"
          title="Mark Inactive / Cancel"
        >
          <Slash size={16} />
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
            <div className="flex justify-between items-start">
              <h2 className="text-xl font-bold mb-4">Transaction Details</h2>
              <button
                onClick={closeModal}
                className="ml-4 p-1 rounded hover:bg-gray-100"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <pre className="text-sm bg-gray-100 p-4 rounded overflow-auto max-h-96">
              {JSON.stringify(selectedTxn, null, 2)}
            </pre>

            <div className="mt-4 flex gap-2 justify-end">
              <button
                onClick={() => {
                  // copy Txn JSON to clipboard
                  navigator.clipboard?.writeText(JSON.stringify(selectedTxn, null, 2));
                  alert("Copied details to clipboard");
                }}
                className="px-3 py-2 border rounded"
              >
                Copy
              </button>

              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-800 text-white rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Payment;
