import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import UserProfileHeader from "../Components/UserProfilePageComponent/UserProfileHeader";
import { Edit2, Info, Lock, Phone, MapPin, X, Check, User } from "lucide-react";
import ChangePasswordModal from "../Components/UserProfilePageComponent/ChangePasswordModal";
import AddressModal from "../Components/UserProfilePageComponent/AddressModal";

const serif = { fontFamily: "'Cormorant Garamond', serif" };
const sans = { fontFamily: "'DM Sans', sans-serif" };

const inputCls =
  "w-full px-4 py-3 bg-transparent border border-[#2d4a2d]/20 rounded-sm text-[13.5px] text-[#2c2c2c] placeholder-[#c8c4bc] outline-none focus:border-[#2d4a2d] transition-colors duration-200";

const FieldLabel = ({ icon: Icon, label }) => (
  <div className="flex items-center gap-1.5">
    {Icon && <Icon size={12} className="text-[#7a9e7e]" />}
    <span className="text-[10px] tracking-[0.12em] uppercase text-[#8c8880]" style={sans}>
      {label}
    </span>
  </div>
);

const SectionTitle = ({ icon: Icon, title }) => (
  <div className="flex items-center gap-2.5 mb-5">
    {Icon
      ? <Icon size={14} className="text-[#7a9e7e]" />
      : <span className="text-[#7a9e7e] text-sm">✦</span>
    }
    <h2 className="text-[13px] font-medium tracking-[0.08em] uppercase text-[#1a3320] m-0" style={sans}>
      {title}
    </h2>
  </div>
);

export default function UserProfilePage() {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedUsername, setEditedUsername] = useState("");
  const [editedPhone, setEditedPhone] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/auth/me", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch user data");
        const data = await res.json();
        setUser(data);
        setEditedUsername(data.username || "");
        setEditedPhone(data.phoneNumber || "");
      } catch (err) {
        console.error(err);
        setError("Could not load profile data");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleSaveProfile = async () => {
    try {
      setSavingProfile(true);///this keeps the track of profile being saved or not, if true then it shows the loading spinner and disables the save button to prevent multiple submissions.
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/auth/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ username: editedUsername, phoneNumber: editedPhone }),
      });
      if (!res.ok) throw new Error("Failed to update profile");
      const data = await res.json();
      setUser((prev) => ({ ...prev, username: data.username, phoneNumber: data.phoneNumber }));
      setIsEditingProfile(false);
    } catch (err) {
      console.error(err);
      toast.error("Could not save profile changes");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSaveAddress = async (addressForm) => {
    try {
      const token = localStorage.getItem("token");
      const newAddress = {
        label: addressForm.label,
        fullName: user.username,
        phoneNumber: user.phoneNumber || "N/A",
        street: addressForm.street,
        city: addressForm.city,
        state: addressForm.state,
        postalCode: addressForm.postalCode,
        country: addressForm.country,
        isDefault: addressForm.isDefault,
      };
      const res = await fetch("http://localhost:5000/api/user/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(newAddress),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to save address");
      }
      const savedAddress = await res.json();
      setUser((prev) => ({
        ...prev,
        addresses: savedAddress.isDefault
          ? [...(prev.addresses || []).map((a) => ({ ...a, isDefault: false })), savedAddress]
          : [...(prev.addresses || []), savedAddress],
      }));
      setShowAddressModal(false);
    } catch (err) {
      console.error("Error adding address:", err);
      toast.error(err.message || "Failed to save address");
    }
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/user/addresses/${addressId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete address");
      setUser((prev) => ({
        ...prev,
        addresses: (prev?.addresses || []).filter((addr) => addr._id !== addressId),
      }));
    } catch (err) {
      console.error("Error deleting address:", err);
    }
  };

  const handleSetDefaultAddress = async (addressId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/user/addresses/${addressId}/default`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to set default");
      setUser((prev) => ({
        ...prev,
        addresses: (prev?.addresses || []).map((addr) => ({
          ...addr,
          isDefault: addr._id === addressId,
        })),
      }));
    } catch (err) {
      console.error("Error setting default address:", err);
    }
  };

  const formatAddress = (addr) =>
    [addr.street, addr.city, addr.state, addr.postalCode, addr.country]
      .filter(Boolean)
      .join(", ");

  return (
    <>
      <UserProfileHeader />

      <div className="min-h-screen bg-[#eee9e0]">

        {/* ── Top banner ── */}
        <div className="bg-[#1a3320] px-6 lg:px-14 pt-10 pb-16">
          <p className="text-[11px] tracking-[0.2em] uppercase text-[#7a9e7e] mb-2" style={sans}>
            ✦ Your account
          </p>
          <h1
            className="font-light text-[#f7f4ee] m-0 leading-tight"
            style={{ ...serif, fontSize: "clamp(32px, 4vw, 48px)" }}
          >
            My Profile
          </h1>
        </div>

        {/* ── Main layout: pulled up over banner ── */}
        <div className="max-w-[1100px] mx-auto px-6 lg:px-14 -mt-8 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 items-start">

            {/* ══ LEFT: Identity panel ══ */}
            <div className="flex flex-col gap-4">

              {/* Avatar card */}
              <div className="bg-[#fdfcf8] border border-[#2d4a2d]/12 rounded-sm p-6 flex flex-col items-center text-center gap-3">
                {loading ? (
                  <div className="w-5 h-5 rounded-full border-2 border-[#2d4a2d]/20 border-t-[#2d4a2d] animate-spin my-6" />
                ) : (
                  <>
                    <div className="relative mt-1">
                      <img
                        src={user?.profilePic || "https://via.placeholder.com/100"}
                        alt="Profile"
                        className="w-24 h-24 rounded-full border-4 border-[#f7f4ee] object-cover bg-[#e8e4dc] shadow-md"
                      />
                      <button className="absolute bottom-0 right-0 bg-[#1a3320] hover:bg-[#2d4a2d] text-[#f7f4ee] p-1.5 rounded-full border-2 border-[#fdfcf8] transition-colors">
                        <Edit2 size={11} />
                      </button>
                    </div>
                    <div>
                      <p className="text-[22px] font-light text-[#1a3320] leading-tight" style={serif}>
                        {user?.username || "—"}
                      </p>
                      <p className="text-[12px] text-[#8c8880] font-light mt-0.5" style={sans}>
                        {user?.email || ""}
                      </p>
                    </div>

                    {/* Quick stats */}
                    <div className="w-full mt-1 grid grid-cols-2 gap-px bg-[#2d4a2d]/10 rounded-sm overflow-hidden border border-[#2d4a2d]/10">
                      <div className="bg-[#fdfcf8] px-3 py-3 text-center">
                        <p className="text-[18px] font-light text-[#1a3320]" style={serif}>
                          {user?.addresses?.length || 0}
                        </p>
                        <p className="text-[10px] tracking-[0.1em] uppercase text-[#8c8880]" style={sans}>
                          Addresses
                        </p>
                      </div>
                      <div className="bg-[#fdfcf8] px-3 py-3 text-center">
                        <p className="text-[18px] font-light text-[#1a3320]" style={serif}>
                          {user?.orders?.length || 0}
                        </p>
                        <p className="text-[10px] tracking-[0.1em] uppercase text-[#8c8880]" style={sans}>
                          Orders
                        </p>
                      </div>
                    </div>

                    {/* Auth provider badge */}
                    <div className="w-full bg-[#2d4a2d]/[0.05] border border-[#2d4a2d]/10 rounded-sm px-4 py-2.5">
                      <p className="text-[11.5px] text-[#2d4a2d] font-light text-center" style={sans}>
                        {user?.authProvider === "google"
                          ? "🔗 Signed in with Google"
                          : "🔒 Local account"}
                      </p>
                    </div>
                  </>
                )}
              </div>

              {/* Security card — lives in sidebar on desktop */}
              <div className="bg-[#fdfcf8] border border-[#2d4a2d]/12 rounded-sm p-5">
                <SectionTitle icon={Lock} title="Security" />
                {user?.authProvider === "local" ? (
                  <button
                    onClick={() => setShowPasswordModal(true)}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-transparent text-[#1a3320] text-[12px] font-medium tracking-[0.12em] uppercase border border-[#2d4a2d]/25 cursor-pointer rounded-sm hover:border-[#2d4a2d] hover:bg-[#2d4a2d]/[0.03] transition-all duration-200"
                    style={sans}
                  >
                    <Lock size={12} />
                    Change Password
                  </button>
                ) : (
                  <div className="border border-dashed border-[#2d4a2d]/20 rounded-sm px-4 py-3 flex items-start gap-2.5">
                    <Info size={13} className="text-[#c8c4bc] flex-shrink-0 mt-0.5" />
                    <span className="text-[12px] font-light text-[#8c8880] leading-relaxed" style={sans}>
                      Password managed by Google.
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* ══ RIGHT: Detail cards ══ */}
            <div className="flex flex-col gap-4">

              {/* ── Personal Details ── */}
              <div className="bg-[#fdfcf8] border border-[#2d4a2d]/12 rounded-sm p-6">
                <div className="flex items-center justify-between mb-5">
                  <SectionTitle icon={User} title="Personal Details" />
                  {!isEditingProfile && !loading && (
                    <button
                      onClick={() => setIsEditingProfile(true)}
                      className="flex items-center gap-1.5 text-[11px] text-[#2d4a2d] underline underline-offset-2 hover:text-[#1a3320] transition-colors"
                      style={sans}
                    >
                      <Edit2 size={11} /> Edit
                    </button>
                  )}
                </div>

                {loading ? (
                  <div className="flex items-center gap-3 py-6">
                    <div className="w-4 h-4 rounded-full border-2 border-[#2d4a2d]/20 border-t-[#2d4a2d] animate-spin" />
                    <p className="text-[13px] text-[#8c8880] font-light" style={sans}>Loading…</p>
                  </div>
                ) : error ? (
                  <p className="text-[13px] text-[#c4704a] font-light" style={sans}>{error}</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">

                    {/* Name */}
                    <div className="flex flex-col gap-1.5">
                      <FieldLabel label="Full Name" />
                      {isEditingProfile ? (
                        <input value={editedUsername} onChange={(e) => setEditedUsername(e.target.value)}
                          className={inputCls} placeholder="Enter username" style={sans} />
                      ) : (
                        <p className="text-[13.5px] font-light text-[#2c2c2c]" style={sans}>
                          {user?.username || "—"}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div className="flex flex-col gap-1.5">
                      <FieldLabel label="Email" />
                      <p className="text-[13.5px] font-light text-[#2c2c2c]" style={sans}>
                        {user?.email || "—"}
                      </p>
                    </div>

                    {/* Phone */}
                    <div className="flex flex-col gap-1.5">
                      <FieldLabel icon={Phone} label="Phone" />
                      {isEditingProfile ? (
                        <input value={editedPhone} onChange={(e) => setEditedPhone(e.target.value)}
                          className={inputCls} placeholder="+977 98XXXXXXXX" style={sans} />
                      ) : (
                        <p className="text-[13.5px] font-light text-[#2c2c2c]" style={sans}>
                          {user?.phoneNumber || (
                            <span className="italic text-[#c8c4bc]">Not added</span>
                          )}
                        </p>
                      )}
                    </div>

                    {/* Auth provider */}
                    <div className="flex flex-col gap-1.5">
                      <FieldLabel label="Account Type" />
                      <p className="text-[13.5px] font-light text-[#2c2c2c] capitalize" style={sans}>
                        {user?.authProvider || "Local"}
                      </p>
                    </div>

                    {/* Save/Cancel — spans full width */}
                    {isEditingProfile && (
                      <div className="sm:col-span-2 flex gap-3 pt-2 border-t border-[#2d4a2d]/8">
                        <button
                          onClick={() => {
                            setEditedUsername(user.username || "");
                            setEditedPhone(user.phoneNumber || "");
                            setIsEditingProfile(false);
                          }}
                          className="flex-1 py-3 bg-transparent text-[#1a3320] text-[12px] font-medium tracking-[0.12em] uppercase border border-[#2d4a2d]/25 cursor-pointer rounded-sm hover:border-[#2d4a2d] transition-all duration-200"
                          style={sans}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSaveProfile}
                          disabled={savingProfile}
                          className="flex-1 py-3 bg-[#1a3320] text-[#f7f4ee] text-[12px] font-medium tracking-[0.12em] uppercase border-none cursor-pointer rounded-sm hover:bg-[#2d4a2d] transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
                          style={sans}
                        >
                          {savingProfile ? (
                            <><span className="w-3 h-3 border border-[#f7f4ee]/30 border-t-[#f7f4ee] rounded-full animate-spin" />Saving…</>
                          ) : (
                            <><Check size={12} /> Save Changes</>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* ── Delivery Addresses ── */}
              <div className="bg-[#fdfcf8] border border-[#2d4a2d]/12 rounded-sm p-6">
                <div className="flex items-center justify-between mb-5">
                  <SectionTitle icon={MapPin} title="Delivery Addresses" />
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-[#8c8880] font-light" style={sans}>
                      {user?.addresses?.length || 0}/3
                    </span>
                    <button
                      onClick={() => setShowAddressModal(true)}
                      disabled={user?.addresses?.length >= 3}
                      className={`flex items-center gap-1.5 px-4 py-2 text-[11.5px] font-medium tracking-[0.1em] uppercase rounded-sm transition-all duration-200 ${
                        user?.addresses?.length >= 3
                          ? "bg-[#f7f4ee] text-[#c8c4bc] cursor-not-allowed"
                          : "bg-[#1a3320] text-[#f7f4ee] border-none cursor-pointer hover:bg-[#2d4a2d]"
                      }`}
                      style={sans}
                    >
                      <MapPin size={12} /> Add
                    </button>
                  </div>
                </div>

                {!user?.addresses || user.addresses.length === 0 ? (
                  <div className="border border-dashed border-[#2d4a2d]/20 rounded-sm px-6 py-10 text-center flex flex-col items-center gap-2">
                    <MapPin size={20} className="text-[#c8c4bc]" />
                    <p className="text-[13px] font-light text-[#8c8880]" style={sans}>No addresses yet</p>
                    <p className="text-[11.5px] font-light text-[#c8c4bc]" style={sans}>
                      Add a delivery address to get started
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2.5">
                    {user.addresses.map((addr) => (
                      <div
                        key={addr._id}
                        className={`flex items-start gap-4 px-5 py-4 border rounded-sm transition-all duration-200 ${
                          addr.isDefault
                            ? "border-[#2d4a2d] bg-[#2d4a2d]/[0.03]"
                            : "border-[#2d4a2d]/15 hover:border-[#2d4a2d]/35"
                        }`}
                      >
                        <div
                          className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                            addr.isDefault ? "border-[#2d4a2d]" : "border-[#8c8880]/40"
                          }`}
                        >
                          {addr.isDefault && <div className="w-2 h-2 bg-[#2d4a2d] rounded-full" />}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[13px] font-medium text-[#1a3320]" style={sans}>
                              {addr.label}
                            </span>
                            {addr.isDefault && (
                              <span
                                className="text-[10px] px-2 py-0.5 bg-[#2d4a2d] text-[#f7f4ee] rounded-sm tracking-[0.08em] uppercase"
                                style={sans}
                              >
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-[12.5px] font-light text-[#8c8880] leading-relaxed" style={sans}>
                            {formatAddress(addr)}
                          </p>
                        </div>

                        <div className="flex items-center gap-1 flex-shrink-0">
                          {!addr.isDefault && (
                            <button
                              onClick={() => handleSetDefaultAddress(addr._id)}
                              className="text-[11px] text-[#2d4a2d] underline underline-offset-2 hover:text-[#1a3320] transition-colors px-1"
                              style={sans}
                            >
                              Set Default
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteAddress(addr._id)}
                            className="p-1.5 text-[#c8c4bc] hover:text-[#c4704a] hover:bg-[#c4704a]/5 rounded-sm transition-all duration-200"
                          >
                            <X size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <AddressModal
        isOpen={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        onSave={handleSaveAddress}
      />
      <ChangePasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        authProvider={user?.authProvider}
      />
    </>
  );
}