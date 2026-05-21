import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { base64Decode } from "../utils/helpers";
import Header from "../../Components/Header/Header.jsx";

const serif = { fontFamily: "'Cormorant Garamond', serif" };
const sans = { fontFamily: "'DM Sans', sans-serif" };

const Failure = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const sessionTransactionId = sessionStorage.getItem("current_transaction_id");
  const decoded = queryParams.get("data")
    ? base64Decode(queryParams.get("data"))
    : null;
  const transactionId =
    sessionTransactionId ||
    decoded?.transaction_uuid ||
    queryParams.get("purchase_order_id") ||
    null;

  useEffect(() => {
    console.log("━━━━━━ FAILURE PAGE DEBUG ━━━━━━");
    console.log("Full URL        :", window.location.href);
    console.log("transactionId   :", transactionId);
    console.log("decoded         :", decoded);
    console.log("sessionId       :", sessionTransactionId);
    console.log("All queryParams :", Object.fromEntries(queryParams.entries()));
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    if (transactionId) {
      markPaymentAsFailed(transactionId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactionId]);

  const markPaymentAsFailed = async (transactionIdToSend) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/payment/payment-status",
        { transactionId: transactionIdToSend, status: "FAILED" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("✅ Marked as FAILED:", response.data);
    } catch (error) {
      console.error(
        "❌ Error updating payment status:",
        error.response?.data || error
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfcf8] flex flex-col">
      <Header />

      <div className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="max-w-md w-full text-center flex flex-col items-center gap-6">

          {/* Icon */}
          <div className="w-20 h-20 rounded-full bg-[#c4704a]/10 flex items-center justify-center">
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#c4704a"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          </div>

          {/* Heading */}
          <div>
            <p
              className="text-[11px] tracking-[0.2em] uppercase text-[#c4704a]/70 mb-2"
              style={sans}
            >
              ✦ Payment failed
            </p>
            <h1
              className="font-light text-[#1a3320] leading-tight mb-3"
              style={{ ...serif, fontSize: "clamp(28px, 4vw, 40px)" }}
            >
              Payment Failed
            </h1>
            <p
              className="text-[13.5px] text-[#8c8880] font-light leading-relaxed"
              style={sans}
            >
              There was an issue processing your payment.
              <br />
              Please try again or use a different payment method.
            </p>
          </div>

          {/* Transaction ID */}
          <div className="w-full bg-[#f7f4ee] border border-[#2d4a2d]/12 rounded-sm px-5 py-4 text-left">
            <p
              className="text-[10px] tracking-[0.12em] uppercase text-[#8c8880] mb-1"
              style={sans}
            >
              Transaction ID
            </p>
            <p
              className="text-[13px] text-[#1a3320] font-medium break-all"
              style={sans}
            >
              {transactionId || "Not available"}
            </p>
          </div>

          {/* Refund notice */}
          <div className="w-full bg-[#c4704a]/5 border border-[#c4704a]/15 rounded-sm px-5 py-4 text-left">
            <p
              className="text-[12px] text-[#c4704a] font-light leading-relaxed"
              style={sans}
            >
              If any amount was deducted from your account, it will be
              refunded within{" "}
              <span className="font-medium">3–5 business days</span>.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 w-full">
            <button
              onClick={() => navigate("/payment")}
              className="flex-1 py-3.5 bg-[#1a3320] text-[#f7f4ee] text-[12px] font-medium tracking-[0.14em] uppercase border-none cursor-pointer rounded-sm hover:bg-[#2d4a2d] hover:-translate-y-px transition-all duration-200"
              style={sans}
            >
              Try Again
            </button>
            <button
              onClick={() => navigate("/")}
              className="flex-1 py-3.5 bg-transparent text-[#1a3320] text-[12px] font-medium tracking-[0.14em] uppercase border border-[#2d4a2d]/25 cursor-pointer rounded-sm hover:border-[#2d4a2d] transition-all duration-200"
              style={sans}
            >
              Go Home
            </button>
          </div>

          <p className="text-[11px] text-[#8c8880] font-light" style={sans}>
            Need help?{" "}
            <span
              className="text-[#2d4a2d] underline underline-offset-2 cursor-pointer hover:text-[#1a3320] transition-colors"
              onClick={() => navigate("/contact")}
            >
              Contact support
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Failure;