// Failure.jsx
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { base64Decode } from "../utils/helpers";

const Failure = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  // try to read transaction id from sessionStorage first; fallback to query params / eSewa data
  const sessionTransactionId = sessionStorage.getItem("current_transaction_id");
  const decoded = queryParams.get("data") ? base64Decode(queryParams.get("data")) : null;
  const transactionId = sessionTransactionId || decoded?.transaction_uuid || queryParams.get("purchase_order_id") || null;

  useEffect(() => {
    if (transactionId) {
      markPaymentAsFailed(transactionId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactionId]);

  const markPaymentAsFailed = async (transactionIdToSend) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/payment/payment-status",
        {
          transactionId: transactionIdToSend,
          status: "FAILED",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error("Error updating payment status:", error.response?.data || error);
      // don't block user on failure to update status
    }
  };

  return (
    <div className="failure-container">
      <div className="status-icon error">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="15" y1="9" x2="9" y2="15"></line>
          <line x1="9" y1="9" x2="15" y2="15"></line>
        </svg>
      </div>

      <h1>Payment Failed!</h1>
      <p className="failure-message">There was an issue processing your payment.</p>

      <div className="failure-details">
        <p>
          <strong>Transaction ID:</strong> {transactionId || "Not available"}
        </p>
        <p>If the amount was deducted from your account, it will be refunded within 3-5 business days.</p>
      </div>

      <div className="action-buttons">
        <button onClick={() => navigate("/")} className="go-home-button">
          Return to Home
        </button>
      </div>
    </div>
  );
};

export default Failure;
