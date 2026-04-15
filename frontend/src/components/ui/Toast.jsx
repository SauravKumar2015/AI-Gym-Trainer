import { useEffect } from "react";
import { CheckCircle, AlertCircle, X } from "lucide-react";
export function ToastItem({ id, message, type, onRemove }) {
  useEffect(() => {
    const t = setTimeout(() => onRemove(id), 3500);
    return () => clearTimeout(t);
  }, [id, onRemove]);
  const ok = type === "success";
  return (
    <div
      className="slideIn"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "12px 16px",
        borderRadius: 13,
        minWidth: 280,
        maxWidth: 360,
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        background: ok ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)",
        border: `1px solid ${ok ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)"}`,
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        animation: "slideInRight 0.35s cubic-bezier(0.34,1.56,0.64,1)",
      }}
    >
      {ok ? (
        <CheckCircle size={15} color="#34d399" />
      ) : (
        <AlertCircle size={15} color="#f87171" />
      )}
      <span style={{ fontSize: 13, fontWeight: 600, flex: 1, color: "#fff" }}>
        {message}
      </span>
      <button
        onClick={() => onRemove(id)}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "rgba(255,255,255,0.5)",
          padding: 2,
          display: "flex",
        }}
      >
        <X size={13} />
      </button>
    </div>
  );
}
export default function ToastContainer({ toasts, onRemove }) {
  return (
    <div
      style={{
        position: "fixed",
        top: 20,
        right: 20,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      {toasts.map((t) => (
        <ToastItem key={t.id} {...t} onRemove={onRemove} />
      ))}
    </div>
  );
}
