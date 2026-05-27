import { createContext, useContext, useState } from "react";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = ({
    message,
    type = "info",
    duration = 3000,
  }) => {
    const id = Date.now();

    const newToast = {
      id,
      message,
      type,
    };

    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      removeToast(id);
    }, duration);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider
      value={{
        showToast,
      }}
    >
      {children}

      <div className="fixed top-5 right-5 z-50 space-y-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`min-w-[250px] rounded-xl px-4 py-3 text-white shadow-lg transition-all
              ${
                toast.type === "success"
                  ? "bg-green-500"
                  : toast.type === "error"
                  ? "bg-red-500"
                  : toast.type === "warning"
                  ? "bg-yellow-500"
                  : "bg-gray-800"
              }`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);