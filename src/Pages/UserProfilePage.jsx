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

  // Inline edit state
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

  // Save username + phone
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

  // Handle saving new address
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

  // Handle deleting an address
  const handleDeleteAddress = async (addressId) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:5000/api/user/addresses/${addressId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
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

  // Handle setting default address
  const handleSetDefaultAddress = async (addressId) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:5000/api/user/addresses/${addressId}/default`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
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

  // Helper function to format address
  const formatAddress = (addr) => {
    const parts = [addr.street, addr.city, addr.state, addr.postalCode, addr.country].filter(Boolean);
    return parts.join(", ");
  };

  return (
    <>
      <UserProfileHeader />

      <div className="px-[195px] mx-auto p-6 space-y-6">
        {/* Profile Header */}
        <div className="bg-white shadow rounded-lg p-6 flex flex-col items-center">
          {loading ? (
            <p className="text-gray-500">Loading profile...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <>
              <div className="relative">
                <img
                  src={user?.profilePic || "https://via.placeholder.com/100"}
                  alt="Profile"
                  className="w-24 h-24 rounded-full border-2 border-green-600 object-cover"
                />
                <button className="absolute bottom-0 right-0 bg-green-600 text-white p-1 rounded-full border border-white hover:bg-green-700">
                  <Edit2 size={14} />
                </button>
              </div>

              {/* INLINE EDIT SECTION */}
              <div className="mt-4 w-full space-y-3">
                {/* Username */}
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Name</span>
                  {!isEditingProfile && (
                    <Edit2
                      className="text-green-600 cursor-pointer"
                      size={16}
                      onClick={() => setIsEditingProfile(true)}
                    />
                  )}
                </div>

                {isEditingProfile ? (
                  <input
                    value={editedUsername}
                    onChange={(e) => setEditedUsername(e.target.value)}
                    className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter username"
                  />
                ) : (
                  <div className="text-gray-800 font-medium">{user?.username || "N/A"}</div>
                )}

                {/* Email */}
                <div className="text-gray-600">Email</div>
                <div className="text-gray-800 font-medium">{user?.email || "N/A"}</div>

                {/* Phone */}
                <div className="text-gray-600 flex items-center gap-1">
                  <Phone size={14} />
                  Phone
                </div>

                {isEditingProfile ? (
                  <input
                    value={editedPhone}
                    onChange={(e) => setEditedPhone(e.target.value)}
                    className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter phone number"
                  />
                ) : (
                  <div className="text-gray-800 font-medium">{user?.phoneNumber || "Not added"}</div>
                )}

                {/* Action Buttons */}
                {isEditingProfile && (
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => {
                        setEditedUsername(user.username || "");
                        setEditedPhone(user.phoneNumber || "");
                        setIsEditingProfile(false);
                      }}
                      className="flex-1 px-4 py-2 border rounded-md hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      disabled={savingProfile}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                    >
                      {savingProfile ? "Saving..." : "Save"}
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* ADDRESSES SECTION */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-lg">Delivery Addresses</h3>
              <p className="text-sm text-gray-500 mt-1">
                {user?.addresses?.length || 0} of 3 addresses used
              </p>
            </div>
            <button
              onClick={() => setShowAddressModal(true)}
              disabled={user?.addresses?.length >= 3}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                user?.addresses?.length >= 3
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-green-600 text-white hover:bg-green-700"
              }`}
            >
              <MapPin size={16} />
              Add Address
            </button>
          </div>

          {!user?.addresses || user.addresses.length === 0 ? (
            <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg text-center">
              <MapPin className="mx-auto mb-3 text-gray-400" size={32} />
              <p className="text-gray-600 font-medium mb-1">No addresses added</p>
              <p className="text-gray-500 text-sm">Add a delivery address to get started</p>
            </div>
          ) : (
            <div className="space-y-3">
              {user.addresses.map((addr) => (
                <div
                  key={addr._id}
                  className={`border rounded-lg p-4 transition-all ${
                    addr.isDefault
                      ? "border-green-600 bg-green-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <MapPin
                        size={20}
                        className={addr.isDefault ? "text-green-600" : "text-gray-600"}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-gray-800">{addr.label}</span>
                          {addr.isDefault && (
                            <span className="px-2 py-0.5 bg-green-600 text-white text-xs rounded-full">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed">{formatAddress(addr)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      {!addr.isDefault && (
                        <button
                          onClick={() => handleSetDefaultAddress(addr._id)}
                          className="text-xs text-green-600 hover:text-green-700 font-medium px-2 py-1 hover:bg-green-50 rounded"
                        >
                          Set Default
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteAddress(addr._id)}
                        className="text-gray-400 hover:text-red-600 p-1"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Payment + Security */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">Payment methods</h3>
            <button className="text-green-600 font-medium">+ Add</button>
          </div>
          <div className="bg-gray-100 p-4 rounded-md text-gray-500 flex items-center">
            <Info className="mr-2" size={16} />
            No payment methods added
          </div>
        </div>

        {/* Security */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="font-semibold mb-4">Security</h3>

          {user?.authProvider === "local" ? (
            <button
              onClick={() => setShowPasswordModal(true)}
              className="flex items-center text-green-600 font-medium hover:text-green-700"
            >
              <Lock className="mr-2" size={16} />
              Change Password
            </button>
          ) : (
            <div className="text-sm text-gray-500 flex items-center gap-2">
              <Info size={14} />
              Password is managed by Google and cannot be changed here
            </div>
          )}
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
