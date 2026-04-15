import { createContext, useContext, useState, useCallback } from "react";

export const ToastContext = createContext(null);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
};

let idCounter = 0;

export const useToastState = () => {
  const [toasts, setToasts] = useState([]);

  const show = useCallback((message, type = "success") => {
    const id = ++idCounter;
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  }, []);

  const remove = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  return { toasts, show, remove };
};
