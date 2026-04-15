import { useState } from "react";
export default function GlassCard({
  children,
  onClick,
  hover = true,
  glow = false,
  style = {},
  className = "",
}) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={onClick}
      className={className}
      onMouseEnter={() => hover && setHov(true)}
      onMouseLeave={() => hover && setHov(false)}
      style={{
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        background: hov ? "rgba(255,255,255,0.075)" : "rgba(255,255,255,0.04)",
        border: `1px solid ${hov ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.08)"}`,
        borderRadius: 16,
        transition: hover ? "all 0.28s ease" : undefined,
        transform: hov && hover ? "translateY(-2px)" : "translateY(0)",
        boxShadow: hov
          ? "0 8px 32px rgba(0,0,0,0.35)"
          : glow
            ? "0 4px 24px rgba(124,58,237,0.1)"
            : undefined,
        cursor: onClick ? "pointer" : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
