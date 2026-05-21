import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { base64Decode } from "../utils/helpers";
import Header from "/FYP/Final_Year_Project/src/Components/Header/Header";
import { Check } from "lucide-react";

const serif = { fontFamily: "'Cormorant Garamond', serif" };
const sans = { fontFamily: "'DM Sans', sans-serif" };

const Success = () => {
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [verificationError, setVerificationError] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const hasVerified = useRef(false);

  const decodedToken = queryParams.get("data")
    ? base64Decode(queryParams.get("data"))
    : null;
  const sessionTransactionId = sessionStorage.getItem("current_transaction_id");
  const transactionId =
    sessionTransactionId || decodedToken?.transaction_uuid || null;

  const pidx = queryParams.get("pidx") || null;
  const rawAmount =
    decodedToken?.total_amount ||
    queryParams.get("total_amount") ||
    queryParams.get("amount");
  const isKhalti = !!pidx;
  const total_amount =
    isKhalti && rawAmount ? Number(rawAmount) / 100 : rawAmount;

  useEffect(() => {
    if (!hasVerified.current) {
      hasVerified.current = true;
      verifyPaymentAndUpdateStatus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const verifyPaymentAndUpdateStatus = async () => {
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
        try {
          localStorage.removeItem("cart");
        } catch (err) {
          /* ignore */
        }
        setTimeout(
          () => sessionStorage.removeItem("current_transaction_id"),
          1000
        );
      } else {
        console.warn("⚠️ Payment not COMPLETED, got:", response.data.status);
        navigate("/payment-failure", {
          search: `?transactionId=${transactionId}`,
        });
      }
    } catch (error) {
      console.error(
        "❌ Error confirming payment:",
        error.response?.data || error
      );
      setIsLoading(false);
      setVerificationError(true);
      navigate("/payment-failure", {
        search: `?transactionId=${transactionId}`,
      });
    }
  };

  // ─── Loading ──────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fdfcf8] flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center px-6 py-20">
          <div className="text-center flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full border-2 border-[#2d4a2d]/20 border-t-[#2d4a2d] animate-spin" />
            <p
              className="text-[13px] text-[#8c8880] font-light tracking-wide"
              style={sans}
            >
              Verifying your payment…
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ─── Verification Error ───────────────────────────────────────────────────
  if (verificationError) {
    return (
      <div className="min-h-screen bg-[#fdfcf8] flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center px-6 py-20">
          <div className="max-w-md w-full text-center flex flex-col items-center gap-6">
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
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>

            <div>
              <p
                className="text-[11px] tracking-[0.2em] uppercase text-[#c4704a]/70 mb-2"
                style={sans}
              >
                ✦ Verification issue
              </p>
              <h1
                className="font-light text-[#1a3320] leading-tight mb-3"
                style={{ ...serif, fontSize: "clamp(28px, 4vw, 40px)" }}
              >
                Couldn't Verify Payment
              </h1>
              <p
                className="text-[13.5px] text-[#8c8880] font-light leading-relaxed"
                style={sans}
              >
                Your transaction is being processed, but we couldn't confirm its
                status right now.
              </p>
            </div>

            <div className="w-full bg-[#f7f4ee] border border-[#2d4a2d]/12 rounded-sm px-5 py-4 text-left">
              <p
                className="text-[10px] tracking-[0.12em] uppercase text-[#8c8880] mb-1"
                style={sans}
              >
                Reference ID
              </p>
              <p
                className="text-[13px] text-[#1a3320] font-medium break-all"
                style={sans}
              >
                {transactionId || "Unknown"}
              </p>
            </div>

            <div className="w-full bg-[#c4704a]/5 border border-[#c4704a]/15 rounded-sm px-5 py-4 text-left">
              <p
                className="text-[12px] text-[#c4704a] font-light leading-relaxed"
                style={sans}
              >
                Please save your Reference ID and contact our support team if
                the issue persists.
              </p>
            </div>

            <button
              onClick={() => navigate("/")}
              className="w-full py-3.5 bg-[#1a3320] text-[#f7f4ee] text-[12px] font-medium tracking-[0.14em] uppercase border-none cursor-pointer rounded-sm hover:bg-[#2d4a2d] hover:-translate-y-px transition-all duration-200"
              style={sans}
            >
              Go to Homepage
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Success ──────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#fdfcf8] flex flex-col">
      <Header />

      <div className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="max-w-md w-full text-center flex flex-col items-center gap-6">

          {/* Icon */}
          <div className="w-20 h-20 rounded-full bg-[#2d4a2d]/10 flex items-center justify-center">
            <Check size={36} className="text-[#2d4a2d]" strokeWidth={1.8} />
          </div>

          {/* Heading */}
          <div>
            <p
              className="text-[11px] tracking-[0.2em] uppercase text-[#7a9e7e] mb-2"
              style={sans}
            >
              ✦ Payment confirmed
            </p>
            <h1
              className="font-light text-[#1a3320] leading-tight mb-3"
              style={{ ...serif, fontSize: "clamp(28px, 4vw, 40px)" }}
            >
              Payment Successful!
            </h1>
            <p
              className="text-[13.5px] text-[#8c8880] font-light leading-relaxed"
              style={sans}
            >
              Thank you — your transaction was processed successfully.
              <br />
              A confirmation email is on its way to you.
            </p>
          </div>

          {/* Transaction Details Card */}
          <div className="w-full bg-[#f7f4ee] border border-[#2d4a2d]/12 rounded-sm px-5 py-5 text-left flex flex-col gap-3">
            <p
              className="text-[10px] tracking-[0.12em] uppercase text-[#8c8880]"
              style={sans}
            >
              Transaction Details
            </p>

            {total_amount && (
              <div className="flex items-center justify-between border-b border-[#2d4a2d]/8 pb-3">
                <span
                  className="text-[12.5px] font-light text-[#8c8880]"
                  style={sans}
                >
                  Amount Paid
                </span>
                <span
                  className="text-[18px] font-light text-[#1a3320]"
                  style={serif}
                >
                  NPR {total_amount}
                </span>
              </div>
            )}

            <div className="flex items-start justify-between border-b border-[#2d4a2d]/8 pb-3">
              <span
                className="text-[12.5px] font-light text-[#8c8880]"
                style={sans}
              >
                Transaction ID
              </span>
              <span
                className="text-[12px] text-[#1a3320] font-medium break-all text-right max-w-[60%]"
                style={sans}
              >
                {transactionId}
              </span>
            </div>

            {paymentStatus === "COMPLETED" && (
              <>
                <div className="flex items-center justify-between border-b border-[#2d4a2d]/8 pb-3">
                  <span
                    className="text-[12.5px] font-light text-[#8c8880]"
                    style={sans}
                  >
                    Payment Method
                  </span>
                  <span
                    className="text-[12.5px] text-[#1a3320] font-light"
                    style={sans}
                  >
                    {isKhalti ? "Khalti 💜" : "eSewa 💚"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span
                    className="text-[12.5px] font-light text-[#8c8880]"
                    style={sans}
                  >
                    Status
                  </span>
                  <span
                    className="text-[11px] px-2.5 py-1 bg-[#2d4a2d] text-[#f7f4ee] rounded-sm tracking-[0.08em] uppercase"
                    style={sans}
                  >
                    Completed
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 w-full">
            <button
              onClick={() => navigate("/orders")}
              className="flex-1 py-3.5 bg-[#1a3320] text-[#f7f4ee] text-[12px] font-medium tracking-[0.14em] uppercase border-none cursor-pointer rounded-sm hover:bg-[#2d4a2d] hover:-translate-y-px transition-all duration-200"
              style={sans}
            >
              View Orders
            </button>
            <button
              onClick={() => navigate("/")}
              className="flex-1 py-3.5 bg-transparent text-[#1a3320] text-[12px] font-medium tracking-[0.14em] uppercase border border-[#2d4a2d]/25 cursor-pointer rounded-sm hover:border-[#2d4a2d] transition-all duration-200"
              style={sans}
            >
              Continue Shopping
            </button>
          </div>

          <p className="text-[11px] text-[#8c8880] font-light" style={sans}>
            🔒 Your payment is secured · Free returns within 30 days
          </p>
        </div>
      </div>
    </div>
  );
};

export default Success;