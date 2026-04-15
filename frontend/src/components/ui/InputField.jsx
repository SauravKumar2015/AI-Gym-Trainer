import { useState } from "react";
export default function InputField({
  label,
  icon: Icon,
  type = "text",
  value,
  onChange,
  placeholder,
  disabled,
  rightEl,
  error,
  style = {},
}) {
  const [f, setF] = useState(false);
  return (
    <div style={style}>
      {label && (
        <label
          style={{
            display: "block",
            fontSize: 12,
            fontWeight: 700,
            color: "rgba(156,163,175,1)",
            marginBottom: 7,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            lineHeight: 1.4,
          }}
        >
          {label}
        </label>
      )}
      <div style={{ position: "relative" }}>
        {Icon && (
          <Icon
            size={15}
            color="rgba(107,114,128,1)"
            style={{
              position: "absolute",
              left: 14,
              top: "50%",
              transform: "translateY(-50%)",
              pointerEvents: "none",
            }}
          />
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          onFocus={() => setF(true)}
          onBlur={() => setF(false)}
          style={{
            width: "100%",
            padding: "12px 14px",
            paddingLeft: Icon ? 42 : 14,
            paddingRight: rightEl ? 42 : 14,
            background: f ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.04)",
            border: `1px solid ${error ? "rgba(239,68,68,0.5)" : f ? "rgba(124,58,237,0.55)" : "rgba(255,255,255,0.09)"}`,
            borderRadius: 10,
            color: "#fff",
            fontSize: 14,
            outline: "none",
            lineHeight: 1.5,
            transition: "all 0.2s",
            opacity: disabled ? 0.5 : 1,
            cursor: disabled ? "default" : "text",
            fontFamily: "'Syne',sans-serif",
            boxSizing: "border-box",
          }}
        />
        {rightEl && (
          <div
            style={{
              position: "absolute",
              right: 14,
              top: "50%",
              transform: "translateY(-50%)",
            }}
          >
            {rightEl}
          </div>
        )}
      </div>
      {error && (
        <p
          style={{
            color: "#f87171",
            fontSize: 12,
            marginTop: 5,
            lineHeight: 1.5,
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
}
