// import React, { useEffect, useState, useRef } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { base64Decode } from "../utils/helpers";

// const Success = () => {
//   const [paymentStatus, setPaymentStatus] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [verificationError, setVerificationError] = useState(false);

//   const navigate = useNavigate();
//   const location = useLocation();
//   const queryParams = new URLSearchParams(location.search);

//   // ✅ Ref to prevent duplicate verification calls
//   const hasVerified = useRef(false);

//   const decodedToken = queryParams.get("data") ? base64Decode(queryParams.get("data")) : null;
//   const sessionTransactionId = sessionStorage.getItem("current_transaction_id");
//   const transactionId = sessionTransactionId || decodedToken?.transaction_uuid || null;

//   const pidx = queryParams.get("pidx") || null;
//   const rawAmount = decodedToken?.total_amount || queryParams.get("total_amount") || queryParams.get("amount");
//   const isKhalti = !!pidx;
//   const total_amount = isKhalti && rawAmount ? Number(rawAmount) / 100 : rawAmount;

//   useEffect(() => {
//     // ✅ Only verify once
//     if (!hasVerified.current) {
//       hasVerified.current = true;
//       verifyPaymentAndUpdateStatus();
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const verifyPaymentAndUpdateStatus = async () => {
//     if (!transactionId) {
//       setIsLoading(false);
//       setVerificationError(true);
//       return;
//     }

//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.post(
//         "http://localhost:5000/api/payment/payment-status",
//         {
//           transactionId,
//           pidx,
//         },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       setIsLoading(false);

//       if (response.data.status === "COMPLETED") {
//         setPaymentStatus("COMPLETED");

//         // clear client-side saved cart if present
//         try {
//           localStorage.removeItem("cart");
//         } catch (err) {
//           // ignore errors
//         }

//         // optional: remove session transaction id after short delay
//         setTimeout(() => sessionStorage.removeItem("current_transaction_id"), 1000);
//       } else {
//         navigate("/payment-failure", { search: `?transactionId=${transactionId}` });
//       }
//     } catch (error) {
//       console.error("Error confirming payment:", error.response?.data || error);
//       setIsLoading(false);
//       setVerificationError(true);
//       navigate("/payment-failure", { search: `?transactionId=${transactionId}` });
//     }
//   };

//   if (isLoading) return <div className="loading-container">Processing payment...</div>;

//   if (verificationError)
//     return (
//       <div className="error-container">
//         <h1>Oops! Error confirming payment</h1>
//         <p>Your transaction is being processed, but we couldn't verify its status.</p>
//         <p>Reference ID: {transactionId || "Unknown"}</p>
//         <button onClick={() => navigate("/")} className="go-home-button">
//           Go to Homepage
//         </button>
//       </div>
//     );

//   return (
//     <div className="success-container">
//       <h1>Payment Successful!</h1>
//       <p>Thank you — your transaction was processed.</p>

//       <div className="transaction-details">
//         <h3>Transaction Details</h3>
//         {total_amount && (
//           <p>
//             <strong>Amount Paid:</strong> NPR {total_amount}
//           </p>
//         )}
//         <p>
//           <strong>Transaction ID:</strong> {transactionId}
//         </p>
//         {paymentStatus === "COMPLETED" && (
//           <>
//             <p>
//               <strong>Payment Method:</strong> {isKhalti ? "Khalti" : "eSewa"}
//             </p>
//             <p>
//               <strong>Status:</strong> Completed
//             </p>
//           </>
//         )}
//       </div>

//       <button onClick={() => navigate("/")} className="go-home-button">
//         Go to Homepage
//       </button>
//     </div>
//   );
// };

// export default Success;

import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { base64Decode } from "../utils/helpers";

const Success = () => {
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [verificationError, setVerificationError] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const hasVerified = useRef(false);

  const decodedToken = queryParams.get("data") ? base64Decode(queryParams.get("data")) : null;
  const sessionTransactionId = sessionStorage.getItem("current_transaction_id");
  const transactionId = sessionTransactionId || decodedToken?.transaction_uuid || null;

  const pidx = queryParams.get("pidx") || null;
  const rawAmount = decodedToken?.total_amount || queryParams.get("total_amount") || queryParams.get("amount");
  const isKhalti = !!pidx;
  const total_amount = isKhalti && rawAmount ? Number(rawAmount) / 100 : rawAmount;

  useEffect(() => {
    if (!hasVerified.current) {
      hasVerified.current = true;
      verifyPaymentAndUpdateStatus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const verifyPaymentAndUpdateStatus = async () => {
    // ==============================
    // 🔍 DEBUG BLOCK 3 — SUCCESS PAGE
    // ==============================
    console.log("━━━━━━ SUCCESS PAGE DEBUG ━━━━━━");
    console.log("Full URL        :", window.location.href);
    console.log("transactionId   :", transactionId);
    console.log("pidx            :", pidx);
    console.log("decodedToken    :", decodedToken);
    console.log("sessionId       :", sessionTransactionId);
    console.log("rawAmount       :", rawAmount);
    console.log("All queryParams :", Object.fromEntries(queryParams.entries()));
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    if (!transactionId) {
      console.error("❌ No transactionId found — cannot verify payment");
      setIsLoading(false);
      setVerificationError(true);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/payment/payment-status",
        { transactionId, pidx },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("✅ Payment status response:", response.data);
      setIsLoading(false);

      if (response.data.status === "COMPLETED") {
        setPaymentStatus("COMPLETED");
        try { localStorage.removeItem("cart"); } catch (err) { /* ignore */ }
        setTimeout(() => sessionStorage.removeItem("current_transaction_id"), 1000);
      } else {
        console.warn("⚠️ Payment not COMPLETED, got:", response.data.status);
        navigate("/payment-failure", { search: `?transactionId=${transactionId}` });
      }
    } catch (error) {
      console.error("❌ Error confirming payment:", error.response?.data || error);
      setIsLoading(false);
      setVerificationError(true);
      navigate("/payment-failure", { search: `?transactionId=${transactionId}` });
    }
  };

  if (isLoading) return <div className="loading-container">Processing payment...</div>;

  if (verificationError)
    return (
      <div className="error-container">
        <h1>Oops! Error confirming payment</h1>
        <p>Your transaction is being processed, but we couldn't verify its status.</p>
        <p>Reference ID: {transactionId || "Unknown"}</p>
        <button onClick={() => navigate("/")} className="go-home-button">
          Go to Homepage
        </button>
      </div>
    );

  return (
    <div className="success-container">
      <h1>Payment Successful!</h1>
      <p>Thank you — your transaction was processed.</p>
      <div className="transaction-details">
        <h3>Transaction Details</h3>
        {total_amount && (
          <p><strong>Amount Paid:</strong> NPR {total_amount}</p>
        )}
        <p><strong>Transaction ID:</strong> {transactionId}</p>
        {paymentStatus === "COMPLETED" && (
          <>
            <p><strong>Payment Method:</strong> {isKhalti ? "Khalti" : "eSewa"}</p>
            <p><strong>Status:</strong> Completed</p>
          </>
        )}
      </div>
      <button onClick={() => navigate("/")} className="go-home-button">
        Go to Homepage
      </button>
    </div>
  );
};

export default Success;