// import { useState } from "react";
// import { X, Eye, EyeOff, Lock } from "lucide-react";

// const sans = { fontFamily: "'DM Sans', sans-serif" };
// const serif = { fontFamily: "'Cormorant Garamond', serif" };

// const inputCls =
//   "w-full px-4 py-3 bg-transparent border border-[#2d4a2d]/20 rounded-sm text-[13.5px] text-[#2c2c2c] placeholder-[#c8c4bc] outline-none focus:border-[#2d4a2d] transition-colors duration-200";

// export default function ChangePasswordModal({ isOpen, onClose, authProvider }) {
//   const [form, setForm] = useState({
//     currentPassword: "",
//     newPassword: "",
//     confirmPassword: "",
//   });

//   const [show, setShow] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
  

//   if (!isOpen || authProvider !== "local") return null;

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//     setError("");
//   };

//   const handleSubmit = async () => {
//     if (form.newPassword !== form.confirmPassword) {
//       return setError("Passwords do not match");
//     }

//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");

//       const res = await fetch(
//         "http://localhost:5000/api/auth/change-password",
//         {
//           method: "PATCH",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({
//             currentPassword: form.currentPassword,
//             newPassword: form.newPassword,
//           }),
//         }
//       );

//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message);

//       setSuccess("Password updated successfully");
//       setForm({
//         currentPassword: "",
//         newPassword: "",
//         confirmPassword: "",
//       });

//       setTimeout(onClose, 1200);
//     } catch (err) {
//       setError(err.message || "Failed to change password");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
      
//       {/* Modal Card */}
//       <div className="w-full max-w-md bg-[#fdfcf8] border border-[#2d4a2d]/15 rounded-sm shadow-lg relative p-6">

//         {/* Close button */}
//         <button
//           onClick={onClose}
//           className="absolute top-3 right-3 text-[#8c8880] hover:text-[#1a3320] transition"
//         >
//           <X size={16} />
//         </button>

//         {/* Header */}
//         <div className="mb-5">
//           <div className="flex items-center gap-2 mb-2">
//             <Lock size={14} className="text-[#7a9e7e]" />
//             <span
//               className="text-[10px] uppercase tracking-[0.15em] text-[#8c8880]"
//               style={sans}
//             >
//               Security
//             </span>
//           </div>

//           <h2
//             className="text-[18px] font-light text-[#1a3320]"
//             style={serif}
//           >
//             Change Password
//           </h2>
//         </div>

//         {/* Messages */}
//         {error && (
//           <p className="text-[12px] text-[#c4704a] mb-3" style={sans}>
//             {error}
//           </p>
//         )}
//         {success && (
//           <p className="text-[12px] text-[#2d4a2d] mb-3" style={sans}>
//             {success}
//           </p>
//         )}

//         {/* Inputs */}
//         <div className="flex flex-col gap-3">
//           {["currentPassword", "newPassword", "confirmPassword"].map((field) => (
//             <div key={field} className="relative">
//               <input
//                 type={show ? "text" : "password"}
//                 name={field}
//                 value={form[field]}
//                 onChange={handleChange}
//                 placeholder={field.replace(/([A-Z])/g, " $1")}
//                 className={inputCls}
//                 style={sans}
//               />

//               <button
//                 type="button"
//                 onClick={() => setShow(!show)}
//                 className="absolute right-3 top-3 text-[#c8c4bc] hover:text-[#1a3320]"
//               >
//                 {show ? <EyeOff size={14} /> : <Eye size={14} />}
//               </button>
//             </div>
//           ))}
//         </div>

//         {/* Action */}
//         <button
//           onClick={handleSubmit}
//           disabled={loading}
//           className="w-full mt-5 flex items-center justify-center gap-2 py-3 bg-[#1a3320] text-[#f7f4ee] text-[11.5px] uppercase tracking-[0.12em] rounded-sm hover:bg-[#2d4a2d] transition disabled:opacity-60"
//           style={sans}
//         >
//           {loading ? (
//             <>
//               <span className="w-3 h-3 border border-[#f7f4ee]/30 border-t-[#f7f4ee] rounded-full animate-spin" />
//               Updating...
//             </>
//           ) : (
//             "Update Password"
//           )}
//         </button>
//       </div>
//     </div>
//   );
// }


import { useState } from "react";
import { X, Eye, EyeOff, Lock } from "lucide-react";

const sans = { fontFamily: "'DM Sans', sans-serif" };
const serif = { fontFamily: "'Cormorant Garamond', serif" };

const inputCls =
  "w-full px-4 py-3 bg-transparent border border-[#2d4a2d]/20 rounded-sm text-[13.5px] text-[#2c2c2c] placeholder-[#c8c4bc] outline-none focus:border-[#2d4a2d] transition-colors duration-200";

export default function ChangePasswordModal({
  isOpen,
  onClose,
  authProvider,
}) {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ─────────────────────────────────────────────
  // Strong password regex
  // Must contain:
  // uppercase + lowercase + number + special char + 8 chars
  // ─────────────────────────────────────────────
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

  // ─────────────────────────────────────────────
  // Live password checks
  // ─────────────────────────────────────────────
  const passwordChecks = {
    length: form.newPassword.length >= 8,
    uppercase: /[A-Z]/.test(form.newPassword),
    lowercase: /[a-z]/.test(form.newPassword),
    number: /\d/.test(form.newPassword),
    special: /[@$!%*?&]/.test(form.newPassword),
  };

  const isStrongPassword =
    passwordChecks.length &&
    passwordChecks.uppercase &&
    passwordChecks.lowercase &&
    passwordChecks.number &&
    passwordChecks.special;

  if (!isOpen || authProvider !== "local") return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async () => {
    // passwords match check
    if (form.newPassword !== form.confirmPassword) {
      return setError("Passwords do not match");
    }

    // strong password validation
    if (!passwordRegex.test(form.newPassword)) {
      return setError(
        "Password must contain uppercase, lowercase, number, special character and be at least 8 characters long"
      );
    }

    // same password prevention
    if (form.currentPassword === form.newPassword) {
      return setError(
        "New password cannot be same as current password"
      );
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await fetch(
        "http://localhost:5000/api/auth/change-password",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentPassword: form.currentPassword,
            newPassword: form.newPassword,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setSuccess("Password updated successfully");

      setForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setTimeout(onClose, 1200);

    } catch (err) {
      setError(err.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">

      {/* Modal Card */}
      <div className="w-full max-w-md bg-[#fdfcf8] border border-[#2d4a2d]/15 rounded-sm shadow-lg relative p-6">

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-[#8c8880] hover:text-[#1a3320] transition"
        >
          <X size={16} />
        </button>

        {/* Header */}
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-2">
            <Lock size={14} className="text-[#7a9e7e]" />

            <span
              className="text-[10px] uppercase tracking-[0.15em] text-[#8c8880]"
              style={sans}
            >
              Security
            </span>
          </div>

          <h2
            className="text-[18px] font-light text-[#1a3320]"
            style={serif}
          >
            Change Password
          </h2>
        </div>

        {/* Messages */}
        {error && (
          <p
            className="text-[12px] text-[#c4704a] mb-3"
            style={sans}
          >
            {error}
          </p>
        )}

        {success && (
          <p
            className="text-[12px] text-[#2d4a2d] mb-3"
            style={sans}
          >
            {success}
          </p>
        )}

        {/* Inputs */}
        <div className="flex flex-col gap-3">

          {[
            "currentPassword",
            "newPassword",
            "confirmPassword",
          ].map((field) => (
            <div key={field} className="relative">

              <input
                type={show ? "text" : "password"}
                name={field}
                value={form[field]}
                onChange={handleChange}
                placeholder={field.replace(/([A-Z])/g, " $1")}
                className={inputCls}
                style={sans}
              />

              <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute right-3 top-3 text-[#c8c4bc] hover:text-[#1a3320]"
              >
                {show ? (
                  <EyeOff size={14} />
                ) : (
                  <Eye size={14} />
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Password Requirements */}
        <div className="mt-4 border border-[#2d4a2d]/10 rounded-sm p-3 bg-[#2d4a2d]/[0.02]">

          <p
            className="text-[10px] uppercase tracking-[0.12em] text-[#8c8880] mb-2"
            style={sans}
          >
            Password Requirements
          </p>

          <div
            className="flex flex-col gap-1.5 text-[11.5px]"
            style={sans}
          >

            <div
              className={`flex items-center gap-2 ${
                passwordChecks.length
                  ? "text-[#2d4a2d]"
                  : "text-[#c8c4bc]"
              }`}
            >
              <span>
                {passwordChecks.length ? "✓" : "•"}
              </span>
              At least 8 characters
            </div>

            <div
              className={`flex items-center gap-2 ${
                passwordChecks.uppercase
                  ? "text-[#2d4a2d]"
                  : "text-[#c8c4bc]"
              }`}
            >
              <span>
                {passwordChecks.uppercase ? "✓" : "•"}
              </span>
              One uppercase letter
            </div>

            <div
              className={`flex items-center gap-2 ${
                passwordChecks.lowercase
                  ? "text-[#2d4a2d]"
                  : "text-[#c8c4bc]"
              }`}
            >
              <span>
                {passwordChecks.lowercase ? "✓" : "•"}
              </span>
              One lowercase letter
            </div>

            <div
              className={`flex items-center gap-2 ${
                passwordChecks.number
                  ? "text-[#2d4a2d]"
                  : "text-[#c8c4bc]"
              }`}
            >
              <span>
                {passwordChecks.number ? "✓" : "•"}
              </span>
              One number
            </div>

            <div
              className={`flex items-center gap-2 ${
                passwordChecks.special
                  ? "text-[#2d4a2d]"
                  : "text-[#c8c4bc]"
              }`}
            >
              <span>
                {passwordChecks.special ? "✓" : "•"}
              </span>
              One special character
            </div>
          </div>
        </div>

        {/* Action */}
        <button
          onClick={handleSubmit}
          disabled={
            loading ||
            !form.currentPassword ||
            !form.newPassword ||
            !form.confirmPassword ||
            !isStrongPassword
          }
          className="w-full mt-5 flex items-center justify-center gap-2 py-3 bg-[#1a3320] text-[#f7f4ee] text-[11.5px] uppercase tracking-[0.12em] rounded-sm hover:bg-[#2d4a2d] transition disabled:opacity-50 disabled:cursor-not-allowed"
          style={sans}
        >
          {loading ? (
            <>
              <span className="w-3 h-3 border border-[#f7f4ee]/30 border-t-[#f7f4ee] rounded-full animate-spin" />
              Updating...
            </>
          ) : (
            "Update Password"
          )}
        </button>
      </div>
    </div>
  );
}