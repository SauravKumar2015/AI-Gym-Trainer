const COLS = {
  violet: "linear-gradient(90deg,#7c3aed,#6d28d9)",
  cyan: "linear-gradient(90deg,#06b6d4,#2563eb)",
  emerald: "linear-gradient(90deg,#10b981,#059669)",
  orange: "linear-gradient(90deg,#f97316,#d97706)",
  rose: "linear-gradient(90deg,#f43f5e,#e11d48)",
};
export default function ProgressBar({
  value = 0,
  max = 100,
  color = "violet",
  label,
  showValue = true,
}) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div>
      {label && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 12,
            marginBottom: 5,
          }}
        >
          <span style={{ color: "rgba(156,163,175,1)" }}>{label}</span>
          {showValue && (
            <span style={{ color: "rgba(107,114,128,1)" }}>
              {Math.round(pct)}%
            </span>
          )}
        </div>
      )}
      <div
        style={{
          height: 6,
          background: "rgba(255,255,255,0.07)",
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            background: COLS[color] || COLS.violet,
            borderRadius: 3,
            width: `${pct}%`,
            transition: "width 1s ease",
          }}
        />
      </div>
    </div>
  );
}
