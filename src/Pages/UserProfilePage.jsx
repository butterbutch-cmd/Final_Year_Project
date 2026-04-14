// import { useState, useEffect } from "react";
// import UserProfileHeader from "../Components/UserProfilePageComponent/UserProfileHeader";
// import {
//   Edit2,
//   Info,
//   Lock,
//   Phone,
//   MapPin,
//   X,
// } from "lucide-react";
// import ChangePasswordModal from "../Components/UserProfilePageComponent/ChangePasswordModal";
// import AddressModal from "../Components/UserProfilePageComponent/AddressModal";

// export default function UserProfilePage() {
//   const [showPasswordModal, setShowPasswordModal] = useState(false);
//   const [showAddressModal, setShowAddressModal] = useState(false);
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   // Inline edit state
//   const [isEditingProfile, setIsEditingProfile] = useState(false);
//   const [editedUsername, setEditedUsername] = useState("");
//   const [editedPhone, setEditedPhone] = useState("");
//   const [savingProfile, setSavingProfile] = useState(false);

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const res = await fetch("http://localhost:5000/api/auth/me", {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (!res.ok) throw new Error("Failed to fetch user data");

//         const data = await res.json();
//         setUser(data);

//         setEditedUsername(data.username || "");
//         setEditedPhone(data.phoneNumber || "");
//       } catch (err) {
//         console.error(err);
//         setError("Could not load profile data");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUser();
//   }, []);

//   // Save username + phone
//   const handleSaveProfile = async () => {
//     try {
//       setSavingProfile(true);
//       const token = localStorage.getItem("token");

//       const res = await fetch("http://localhost:5000/api/auth/me", {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           username: editedUsername,
//           phoneNumber: editedPhone,
//         }),
//       });

//       if (!res.ok) throw new Error("Failed to update profile");

//       const data = await res.json();

//       setUser((prev) => ({
//         ...prev,
//         username: data.username,
//         phoneNumber: data.phoneNumber,
//       }));

//       setIsEditingProfile(false);
//     } catch (err) {
//       console.error(err);
//       alert("Could not save profile changes");
//     } finally {
//       setSavingProfile(false);
//     }
//   };

//   // Handle saving new address
//   const handleSaveAddress = async (addressForm) => {
//     try {
//       const token = localStorage.getItem("token");

//       const newAddress = {
//         label: addressForm.label,
//         fullName: user.username,
//         phoneNumber: user.phoneNumber || "N/A",
//         street: addressForm.street,
//         city: addressForm.city,
//         state: addressForm.state,
//         postalCode: addressForm.postalCode,
//         country: addressForm.country,
//         isDefault: addressForm.isDefault,
//       };

//       const res = await fetch("http://localhost:5000/api/user/addresses", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(newAddress),
//       });

//       if (!res.ok) {
//         const errorData = await res.json();
//         throw new Error(errorData.message || "Failed to save address");
//       }

//       const savedAddress = await res.json();

//       setUser((prev) => ({
//         ...prev,
//         addresses: savedAddress.isDefault
//           ? [
//               ...(prev.addresses || []).map((a) => ({ ...a, isDefault: false })),
//               savedAddress,
//             ]
//           : [...(prev.addresses || []), savedAddress],
//       }));

//       setShowAddressModal(false);
//     } catch (err) {
//       console.error("Error adding address:", err);
//       alert(err.message || "Failed to save address");
//     }
//   };

//   // Handle deleting an address
//   const handleDeleteAddress = async (addressId) => {
//     try {
//       const token = localStorage.getItem("token");

//       const res = await fetch(
//         `http://localhost:5000/api/user/addresses/${addressId}`,
//         {
//           method: "DELETE",
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (!res.ok) throw new Error("Failed to delete address");

//       setUser((prev) => ({
//         ...prev,
//         addresses: (prev?.addresses || []).filter((addr) => addr._id !== addressId),
//       }));
//     } catch (err) {
//       console.error("Error deleting address:", err);
//     }
//   };

//   // Handle setting default address
//   const handleSetDefaultAddress = async (addressId) => {
//     try {
//       const token = localStorage.getItem("token");

//       const res = await fetch(
//         `http://localhost:5000/api/user/addresses/${addressId}/default`,
//         {
//           method: "PATCH",
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (!res.ok) throw new Error("Failed to set default");

//       setUser((prev) => ({
//         ...prev,
//         addresses: (prev?.addresses || []).map((addr) => ({
//           ...addr,
//           isDefault: addr._id === addressId,
//         })),
//       }));
//     } catch (err) {
//       console.error("Error setting default address:", err);
//     }
//   };

//   // Helper function to format address
//   const formatAddress = (addr) => {
//     const parts = [addr.street, addr.city, addr.state, addr.postalCode, addr.country].filter(Boolean);
//     return parts.join(", ");
//   };

//   return (
//     <>
//       <UserProfileHeader />

//       <div className="px-[195px] mx-auto p-6 space-y-6">
//         {/* Profile Header */}
//         <div className="bg-white shadow rounded-lg p-6 flex flex-col items-center">
//           {loading ? (
//             <p className="text-gray-500">Loading profile...</p>
//           ) : error ? (
//             <p className="text-red-500">{error}</p>
//           ) : (
//             <>
//               <div className="relative">
//                 <img
//                   src={user?.profilePic || "https://via.placeholder.com/100"}
//                   alt="Profile"
//                   className="w-24 h-24 rounded-full border-2 border-green-600 object-cover"
//                 />
//                 <button className="absolute bottom-0 right-0 bg-green-600 text-white p-1 rounded-full border border-white hover:bg-green-700">
//                   <Edit2 size={14} />
//                 </button>
//               </div>

//               {/* INLINE EDIT SECTION */}
//               <div className="mt-4 w-full space-y-3">
//                 {/* Username */}
//                 <div className="flex items-center justify-between">
//                   <span className="text-gray-600">Name</span>
//                   {!isEditingProfile && (
//                     <Edit2
//                       className="text-green-600 cursor-pointer"
//                       size={16}
//                       onClick={() => setIsEditingProfile(true)}
//                     />
//                   )}
//                 </div>

//                 {isEditingProfile ? (
//                   <input
//                     value={editedUsername}
//                     onChange={(e) => setEditedUsername(e.target.value)}
//                     className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
//                     placeholder="Enter username"
//                   />
//                 ) : (
//                   <div className="text-gray-800 font-medium">{user?.username || "N/A"}</div>
//                 )}

//                 {/* Email */}
//                 <div className="text-gray-600">Email</div>
//                 <div className="text-gray-800 font-medium">{user?.email || "N/A"}</div>

//                 {/* Phone */}
//                 <div className="text-gray-600 flex items-center gap-1">
//                   <Phone size={14} />
//                   Phone
//                 </div>

//                 {isEditingProfile ? (
//                   <input
//                     value={editedPhone}
//                     onChange={(e) => setEditedPhone(e.target.value)}
//                     className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
//                     placeholder="Enter phone number"
//                   />
//                 ) : (
//                   <div className="text-gray-800 font-medium">{user?.phoneNumber || "Not added"}</div>
//                 )}

//                 {/* Action Buttons */}
//                 {isEditingProfile && (
//                   <div className="flex gap-3 pt-2">
//                     <button
//                       onClick={() => {
//                         setEditedUsername(user.username || "");
//                         setEditedPhone(user.phoneNumber || "");
//                         setIsEditingProfile(false);
//                       }}
//                       className="flex-1 px-4 py-2 border rounded-md hover:bg-gray-100"
//                     >
//                       Cancel
//                     </button>
//                     <button
//                       onClick={handleSaveProfile}
//                       disabled={savingProfile}
//                       className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
//                     >
//                       {savingProfile ? "Saving..." : "Save"}
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </>
//           )}
//         </div>

//         {/* ADDRESSES SECTION */}
//         <div className="bg-white shadow rounded-lg p-6">
//           <div className="flex items-center justify-between mb-4">
//             <div>
//               <h3 className="font-semibold text-lg">Delivery Addresses</h3>
//               <p className="text-sm text-gray-500 mt-1">
//                 {user?.addresses?.length || 0} of 3 addresses used
//               </p>
//             </div>
//             <button
//               onClick={() => setShowAddressModal(true)}
//               disabled={user?.addresses?.length >= 3}
//               className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
//                 user?.addresses?.length >= 3
//                   ? "bg-gray-300 text-gray-500 cursor-not-allowed"
//                   : "bg-green-600 text-white hover:bg-green-700"
//               }`}
//             >
//               <MapPin size={16} />
//               Add Address
//             </button>
//           </div>

//           {!user?.addresses || user.addresses.length === 0 ? (
//             <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg text-center">
//               <MapPin className="mx-auto mb-3 text-gray-400" size={32} />
//               <p className="text-gray-600 font-medium mb-1">No addresses added</p>
//               <p className="text-gray-500 text-sm">Add a delivery address to get started</p>
//             </div>
//           ) : (
//             <div className="space-y-3">
//               {user.addresses.map((addr) => (
//                 <div
//                   key={addr._id}
//                   className={`border rounded-lg p-4 transition-all ${
//                     addr.isDefault
//                       ? "border-green-600 bg-green-50"
//                       : "border-gray-200 hover:border-gray-300"
//                   }`}
//                 >
//                   <div className="flex items-start justify-between">
//                     <div className="flex items-start gap-3 flex-1">
//                       <MapPin
//                         size={20}
//                         className={addr.isDefault ? "text-green-600" : "text-gray-600"}
//                       />
//                       <div className="flex-1">
//                         <div className="flex items-center gap-2 mb-1">
//                           <span className="font-semibold text-gray-800">{addr.label}</span>
//                           {addr.isDefault && (
//                             <span className="px-2 py-0.5 bg-green-600 text-white text-xs rounded-full">
//                               Default
//                             </span>
//                           )}
//                         </div>
//                         <p className="text-gray-700 text-sm leading-relaxed">{formatAddress(addr)}</p>
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-2 ml-4">
//                       {!addr.isDefault && (
//                         <button
//                           onClick={() => handleSetDefaultAddress(addr._id)}
//                           className="text-xs text-green-600 hover:text-green-700 font-medium px-2 py-1 hover:bg-green-50 rounded"
//                         >
//                           Set Default
//                         </button>
//                       )}
//                       <button
//                         onClick={() => handleDeleteAddress(addr._id)}
//                         className="text-gray-400 hover:text-red-600 p-1"
//                       >
//                         <X size={16} />
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Payment + Security */}
//         <div className="bg-white shadow rounded-lg p-6">
//           <div className="flex items-center justify-between mb-2">
//             <h3 className="font-semibold">Payment methods</h3>
//             <button className="text-green-600 font-medium">+ Add</button>
//           </div>
//           <div className="bg-gray-100 p-4 rounded-md text-gray-500 flex items-center">
//             <Info className="mr-2" size={16} />
//             No payment methods added
//           </div>
//         </div>

//         {/* Security */}
//         <div className="bg-white shadow rounded-lg p-6">
//           <h3 className="font-semibold mb-4">Security</h3>

//           {user?.authProvider === "local" ? (
//             <button
//               onClick={() => setShowPasswordModal(true)}
//               className="flex items-center text-green-600 font-medium hover:text-green-700"
//             >
//               <Lock className="mr-2" size={16} />
//               Change Password
//             </button>
//           ) : (
//             <div className="text-sm text-gray-500 flex items-center gap-2">
//               <Info size={14} />
//               Password is managed by Google and cannot be changed here
//             </div>
//           )}
//         </div>

//       </div>

//       <AddressModal
//         isOpen={showAddressModal}
//         onClose={() => setShowAddressModal(false)}
//         onSave={handleSaveAddress}
//       />

//       <ChangePasswordModal
//         isOpen={showPasswordModal}
//         onClose={() => setShowPasswordModal(false)}
//         authProvider={user?.authProvider}
//       />

//     </>
//   );
// }

import { useState, useEffect } from "react";
import UserProfileHeader from "../Components/UserProfilePageComponent/UserProfileHeader";
import {
  Edit2,
  Info,
  Lock,
  Phone,
  MapPin,
  X,
} from "lucide-react";
import ChangePasswordModal from "../Components/UserProfilePageComponent/ChangePasswordModal";
import AddressModal from "../Components/UserProfilePageComponent/AddressModal";

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
      setSavingProfile(true);
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/auth/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: editedUsername,
          phoneNumber: editedPhone,
        }),
      });

      if (!res.ok) throw new Error("Failed to update profile");

      const data = await res.json();

      setUser((prev) => ({
        ...prev,
        username: data.username,
        phoneNumber: data.phoneNumber,
      }));

      setIsEditingProfile(false);
    } catch (err) {
      console.error(err);
      alert("Could not save profile changes");
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
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
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
          ? [
              ...(prev.addresses || []).map((a) => ({ ...a, isDefault: false })),
              savedAddress,
            ]
          : [...(prev.addresses || []), savedAddress],
      }));

      setShowAddressModal(false);
    } catch (err) {
      console.error("Error adding address:", err);
      alert(err.message || "Failed to save address");
    }
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:5000/api/user/addresses/${addressId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

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

      const res = await fetch(
        `http://localhost:5000/api/user/addresses/${addressId}/default`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

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

  const formatAddress = (addr) => {
    const parts = [addr.street, addr.city, addr.state, addr.postalCode, addr.country].filter(Boolean);
    return parts.join(", ");
  };

  return (
    <>
      <UserProfileHeader />

      {/* Page background */}
      <div className="min-h-screen bg-[#f5f8f2] py-10 px-4 font-sans">
        <div className="max-w-2xl mx-auto space-y-5">

          {/* ── Profile Card ── */}
          <div className="bg-white/80 backdrop-blur-sm border border-[#d6ecd0] rounded-3xl shadow-lg shadow-green-900/10 overflow-hidden">
            <div className="h-1 w-full bg-gradient-to-r from-[#6aaa5e] via-[#a8d5a2] to-[#6aaa5e]" />
            <div className="p-7">

              {loading ? (
                <div className="flex flex-col items-center py-8 gap-3">
                  <span className="w-8 h-8 border-2 border-[#c8e6c2] border-t-[#2d5a27] rounded-full animate-spin" />
                  <p className="text-sm text-[#7aab6e]">Loading profile…</p>
                </div>
              ) : error ? (
                <p className="text-red-600 text-sm text-center py-4">{error}</p>
              ) : (
                <>
                  {/* Avatar */}
                  <div className="flex flex-col items-center mb-6">
                    <div className="relative">
                      <img
                        src={user?.profilePic || "https://via.placeholder.com/100"}
                        alt="Profile"
                        className="w-24 h-24 rounded-full border-4 border-[#c8e6c2] object-cover shadow-md"
                      />
                      <button className="absolute bottom-0 right-0 bg-[#2d5a27] hover:bg-[#1e3d18] text-white p-1.5 rounded-full border-2 border-white shadow transition-colors">
                        <Edit2 size={12} />
                      </button>
                    </div>
                    {!isEditingProfile && (
                      <p className="mt-3 text-lg font-semibold text-[#1e3d18] tracking-tight font-serif">
                        {user?.username || "—"}
                      </p>
                    )}
                  </div>

                  {/* Fields */}
                  <div className="space-y-4">

                    {/* Name row */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#5a8a50] tracking-widest uppercase">Name</span>
                      {!isEditingProfile && (
                        <button
                          onClick={() => setIsEditingProfile(true)}
                          className="text-[#6aaa5e] hover:text-[#2d5a27] transition-colors p-1 rounded-lg hover:bg-[#eef7ec]"
                        >
                          <Edit2 size={14} />
                        </button>
                      )}
                    </div>

                    {isEditingProfile ? (
                      <input
                        value={editedUsername}
                        onChange={(e) => setEditedUsername(e.target.value)}
                        className="w-full border border-[#c8e6c2] bg-[#f8fdf6] rounded-xl px-4 py-2.5 text-sm text-[#1e3d18] placeholder-[#b0ccab] focus:outline-none focus:ring-2 focus:ring-[#6aaa5e] focus:border-transparent transition-all"
                        placeholder="Enter username"
                      />
                    ) : (
                      <div className="text-[#2d5a27] font-medium text-sm">{user?.username || "—"}</div>
                    )}

                    {/* Divider */}
                    <div className="border-t border-[#eaf5e7]" />

                    {/* Email */}
                    <span className="text-xs font-semibold text-[#5a8a50] tracking-widest uppercase block">Email</span>
                    <div className="text-[#2d5a27] font-medium text-sm -mt-2">{user?.email || "—"}</div>

                    <div className="border-t border-[#eaf5e7]" />

                    {/* Phone */}
                    <div className="flex items-center gap-1.5">
                      <Phone size={13} className="text-[#7aab6e]" />
                      <span className="text-xs font-semibold text-[#5a8a50] tracking-widest uppercase">Phone</span>
                    </div>

                    {isEditingProfile ? (
                      <input
                        value={editedPhone}
                        onChange={(e) => setEditedPhone(e.target.value)}
                        className="w-full border border-[#c8e6c2] bg-[#f8fdf6] rounded-xl px-4 py-2.5 text-sm text-[#1e3d18] placeholder-[#b0ccab] focus:outline-none focus:ring-2 focus:ring-[#6aaa5e] focus:border-transparent transition-all"
                        placeholder="Enter phone number"
                      />
                    ) : (
                      <div className="text-[#2d5a27] font-medium text-sm -mt-2">
                        {user?.phoneNumber || <span className="text-[#b0ccab] italic">Not added</span>}
                      </div>
                    )}

                    {/* Edit action buttons */}
                    {isEditingProfile && (
                      <div className="flex gap-3 pt-1">
                        <button
                          onClick={() => {
                            setEditedUsername(user.username || "");
                            setEditedPhone(user.phoneNumber || "");
                            setIsEditingProfile(false);
                          }}
                          className="flex-1 px-4 py-2.5 border border-[#c8e6c2] text-[#2d5a27] text-sm font-medium rounded-xl hover:bg-[#eef7ec] transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSaveProfile}
                          disabled={savingProfile}
                          className="flex-1 px-4 py-2.5 bg-[#2d5a27] hover:bg-[#1e3d18] text-white text-sm font-semibold rounded-xl disabled:opacity-50 transition-all shadow-md shadow-green-900/20 flex items-center justify-center gap-2"
                        >
                          {savingProfile ? (
                            <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving…</>
                          ) : "Save Changes"}
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* ── Delivery Addresses ── */}
          <div className="bg-white/80 backdrop-blur-sm border border-[#d6ecd0] rounded-3xl shadow-lg shadow-green-900/10 overflow-hidden">
            <div className="h-1 w-full bg-gradient-to-r from-[#6aaa5e] via-[#a8d5a2] to-[#6aaa5e]" />
            <div className="p-7">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-base font-semibold text-[#1e3d18] font-serif">Delivery Addresses</h3>
                  <p className="text-xs text-[#9abf92] mt-0.5">{user?.addresses?.length || 0} of 3 addresses used</p>
                </div>
                <button
                  onClick={() => setShowAddressModal(true)}
                  disabled={user?.addresses?.length >= 3}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl transition-all ${
                    user?.addresses?.length >= 3
                      ? "bg-[#e0edd9] text-[#a0c99a] cursor-not-allowed"
                      : "bg-[#2d5a27] hover:bg-[#1e3d18] text-white shadow-md shadow-green-900/20"
                  }`}
                >
                  <MapPin size={14} />
                  Add Address
                </button>
              </div>

              {!user?.addresses || user.addresses.length === 0 ? (
                <div className="bg-[#f8fdf6] border border-[#d6ecd0] border-dashed p-8 rounded-2xl text-center">
                  <MapPin className="mx-auto mb-3 text-[#a8d5a2]" size={28} />
                  <p className="text-[#2d5a27] font-medium text-sm">No addresses yet</p>
                  <p className="text-[#9abf92] text-xs mt-1">Add a delivery address to get started</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {user.addresses.map((addr) => (
                    <div
                      key={addr._id}
                      className={`rounded-2xl p-4 border transition-all ${
                        addr.isDefault
                          ? "border-[#6aaa5e] bg-[#f0f9ee]"
                          : "border-[#d6ecd0] bg-[#fafdf8] hover:border-[#a8d5a2]"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div className={`mt-0.5 p-1.5 rounded-lg ${addr.isDefault ? "bg-[#2d5a27]" : "bg-[#eaf5e7]"}`}>
                            <MapPin size={14} className={addr.isDefault ? "text-white" : "text-[#6aaa5e]"} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-[#1e3d18] text-sm">{addr.label}</span>
                              {addr.isDefault && (
                                <span className="px-2 py-0.5 bg-[#2d5a27] text-white text-[10px] font-semibold rounded-full tracking-wide">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-[#5a7a52] text-xs leading-relaxed">{formatAddress(addr)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 ml-3 shrink-0">
                          {!addr.isDefault && (
                            <button
                              onClick={() => handleSetDefaultAddress(addr._id)}
                              className="text-xs text-[#2d5a27] hover:text-[#1e3d18] font-semibold px-2.5 py-1 hover:bg-[#eef7ec] rounded-lg transition-colors"
                            >
                              Set Default
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteAddress(addr._id)}
                            className="text-[#b0ccab] hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-all"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── Payment Methods ── */}
          <div className="bg-white/80 backdrop-blur-sm border border-[#d6ecd0] rounded-3xl shadow-lg shadow-green-900/10 overflow-hidden">
            <div className="h-1 w-full bg-gradient-to-r from-[#6aaa5e] via-[#a8d5a2] to-[#6aaa5e]" />
            <div className="p-7">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-[#1e3d18] font-serif">Payment Methods</h3>
                <button className="text-sm font-semibold text-[#2d5a27] hover:text-[#1e3d18] hover:bg-[#eef7ec] px-3 py-1.5 rounded-xl transition-colors">
                  + Add
                </button>
              </div>
              <div className="bg-[#f8fdf6] border border-[#d6ecd0] border-dashed p-5 rounded-2xl flex items-center gap-3 text-[#9abf92]">
                <Info size={16} className="shrink-0" />
                <span className="text-sm">No payment methods added yet</span>
              </div>
            </div>
          </div>

          {/* ── Security ── */}
          <div className="bg-white/80 backdrop-blur-sm border border-[#d6ecd0] rounded-3xl shadow-lg shadow-green-900/10 overflow-hidden">
            <div className="h-1 w-full bg-gradient-to-r from-[#6aaa5e] via-[#a8d5a2] to-[#6aaa5e]" />
            <div className="p-7">
              <h3 className="text-base font-semibold text-[#1e3d18] font-serif mb-4">Security</h3>

              {user?.authProvider === "local" ? (
                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-[#c8e6c2] text-[#2d5a27] text-sm font-semibold hover:bg-[#eef7ec] hover:border-[#6aaa5e] transition-all"
                >
                  <Lock size={15} />
                  Change Password
                </button>
              ) : (
                <div className="flex items-start gap-2.5 bg-[#f8fdf6] border border-[#d6ecd0] border-dashed rounded-2xl px-4 py-3 text-[#9abf92] text-sm">
                  <Info size={14} className="mt-0.5 shrink-0" />
                  <span>Password is managed by Google and cannot be changed here.</span>
                </div>
              )}
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