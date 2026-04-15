import { useState } from "react";
const VARIANTS = {
  primary: {
    bg: "linear-gradient(135deg,#7c3aed,#4f46e5)",
    shadow: "rgba(124,58,237,0.4)",
    color: "#fff",
    border: "none",
  },
  green: {
    bg: "linear-gradient(135deg,#10b981,#059669)",
    shadow: "rgba(16,185,129,0.4)",
    color: "#fff",
    border: "none",
  },
  danger: {
    bg: "linear-gradient(135deg,#dc2626,#be123c)",
    shadow: "rgba(220,38,38,0.4)",
    color: "#fff",
    border: "none",
  },
  cyan: {
    bg: "linear-gradient(135deg,#06b6d4,#2563eb)",
    shadow: "rgba(6,182,212,0.4)",
    color: "#fff",
    border: "none",
  },
  orange: {
    bg: "linear-gradient(135deg,#f97316,#d97706)",
    shadow: "rgba(249,115,22,0.4)",
    color: "#fff",
    border: "none",
  },
  outline: {
    bg: "transparent",
    shadow: "none",
    color: "#fff",
    border: "1px solid rgba(255,255,255,0.18)",
  },
  ghost: { bg: "transparent", shadow: "none", color: "#fff", border: "none" },
};
export default function GradientBtn({
  children,
  onClick,
  variant = "primary",
  type = "button",
  disabled = false,
  style = {},
  className = "",
  fullWidth = false,
}) {
  const [h, setH] = useState(false);
  const variantStyle = VARIANTS[variant] || VARIANTS.primary;
  const isOutline = variant === "outline" || variant === "ghost";
  const background = disabled ? "#374151" : variantStyle.bg;
  const boxShadow = disabled
    ? "none"
    : variantStyle.shadow !== "none"
      ? `0 4px 16px ${variantStyle.shadow}`
      : undefined;
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={className}
      onMouseEnter={() => !disabled && setH(true)}
      onMouseLeave={() => setH(false)}
      onMouseDown={(e) =>
        !disabled && (e.currentTarget.style.transform = "scale(0.97)")
      }
      onMouseUp={(e) =>
        !disabled &&
        (e.currentTarget.style.transform = h ? "scale(1.02)" : "scale(1)")
      }
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        width: fullWidth ? "100%" : undefined,
        padding: "12px 22px",
        borderRadius: 10,
        border: variantStyle.border,
        cursor: disabled ? "not-allowed" : "pointer",
        fontWeight: 700,
        fontSize: 14,
        color: variantStyle.color,
        lineHeight: 1.4,
        background,
        boxShadow,
        transform: h && !disabled ? "scale(1.02)" : "scale(1)",
        filter: h && !disabled && !isOutline ? "brightness(1.1)" : "none",
        opacity: disabled ? 0.55 : 1,
        transition: "all 0.2s ease",
        fontFamily: "'Syne',sans-serif",
        letterSpacing: "0.01em",
        ...style,
      }}
    >
      {children}
    </button>
  );
}
