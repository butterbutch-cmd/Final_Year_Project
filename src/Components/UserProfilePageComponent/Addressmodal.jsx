import { useState } from "react";
import { X, Save, MapPin } from "lucide-react";

export default function AddressModal({ isOpen, onClose, onSave }) {
  const [addressForm, setAddressForm] = useState({
    label: "Home", // Fixed label
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "Nepal",
    isDefault: false,
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!addressForm.street.trim()) errs.street = "Street is required";
    if (!addressForm.city.trim()) errs.city = "City is required";
    if (!addressForm.postalCode.trim()) errs.postalCode = "Postal code is required";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSave(addressForm);

    setAddressForm({
      label: "Home",
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "Nepal",
      isDefault: false,
    });
    setErrors({});
  };

  const handleClose = () => {
    setAddressForm({
      label: "Home",
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "Nepal",
      isDefault: false,
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      ></div>

      <div className="relative bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
          <h3 className="font-semibold text-xl text-gray-800">Add New Address</h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-all duration-200"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-5">
          {/* Fixed MapPin Icon */}
          <div className="flex items-center gap-2 text-gray-700 font-medium mb-2">
            <MapPin size={18} /> Address
          </div>

          {/* Street */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Street Address <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter street address"
              value={addressForm.street}
              onChange={(e) =>
                setAddressForm({ ...addressForm, street: e.target.value })
              }
              className={`w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 transition-all duration-200 ${
                errors.street
                  ? "border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:ring-green-200 focus:border-green-500"
              }`}
            />
            {errors.street && (
              <p className="text-red-500 text-xs mt-1.5">{errors.street}</p>
            )}
          </div>

          {/* City / State */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter city"
                value={addressForm.city}
                onChange={(e) =>
                  setAddressForm({ ...addressForm, city: e.target.value })
                }
                className={`w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 transition-all duration-200 ${
                  errors.city
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:ring-green-200 focus:border-green-500"
                }`}
              />
              {errors.city && (
                <p className="text-red-500 text-xs mt-1.5">{errors.city}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State/Province
              </label>
              <input
                type="text"
                placeholder="Enter state (optional)"
                value={addressForm.state}
                onChange={(e) =>
                  setAddressForm({ ...addressForm, state: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-500 transition-all duration-200"
              />
            </div>
          </div>

          {/* Postal Code / Country */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Postal Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter postal code"
                value={addressForm.postalCode}
                onChange={(e) =>
                  setAddressForm({ ...addressForm, postalCode: e.target.value })
                }
                className={`w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 transition-all duration-200 ${
                  errors.postalCode
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:ring-green-200 focus:border-green-500"
                }`}
              />
              {errors.postalCode && (
                <p className="text-red-500 text-xs mt-1.5">{errors.postalCode}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country
              </label>
              <input
                type="text"
                value={addressForm.country}
                disabled
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-gray-50 text-gray-500 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Default checkbox */}
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <input
              type="checkbox"
              id="defaultAddress"
              checked={addressForm.isDefault}
              onChange={(e) =>
                setAddressForm({ ...addressForm, isDefault: e.target.checked })
              }
              className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-2 focus:ring-green-200 cursor-pointer"
            />
            <label
              htmlFor="defaultAddress"
              className="text-sm font-medium text-gray-700 cursor-pointer"
            >
              Set as default delivery address
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleClose}
            className="px-5 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-all duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2.5 bg-green-600 text-white rounded-lg font-medium flex items-center gap-2 hover:bg-green-700 active:bg-green-800 transition-all duration-200 shadow-sm hover:shadow"
          >
            <Save size={16} />
            Save Address
          </button>
        </div>
      </div>
    </div>
  );
}
