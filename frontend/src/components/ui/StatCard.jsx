import GlassCard from "./GlassCard";

const getGrad = (color = "") => {
  if (color.includes("orange"))
    return "linear-gradient(135deg,#f97316,#dc2626)";
  if (color.includes("cyan")) return "linear-gradient(135deg,#06b6d4,#2563eb)";
  if (color.includes("emerald"))
    return "linear-gradient(135deg,#10b981,#059669)";
  if (color.includes("rose")) return "linear-gradient(135deg,#f43f5e,#e11d48)";
  return "linear-gradient(135deg,#7c3aed,#5b21b6)";
};

export default function StatCard({
  icon: Icon,
  label,
  value,
  unit,
  color = "from-violet",
  trend,
  loading,
}) {
  return (
    <GlassCard style={{ padding: 20 }}>
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: 14,
        }}
      >
        <div
          style={{
            padding: 10,
            borderRadius: 12,
            background: getGrad(color),
            boxShadow: "0 4px 14px rgba(0,0,0,0.3)",
            display: "flex",
          }}
        >
          <Icon size={20} color="#fff" />
        </div>
        {trend !== undefined && (
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              padding: "4px 9px",
              borderRadius: 20,
              lineHeight: 1.4,
              background:
                trend > 0 ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)",
              color: trend > 0 ? "#34d399" : "#f87171",
              border: `1px solid ${trend > 0 ? "rgba(16,185,129,0.25)" : "rgba(239,68,68,0.25)"}`,
            }}
          >
            {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}%
          </span>
        )}
      </div>

      {loading ? (
        <div
          style={{
            height: 30,
            width: 100,
            background: "rgba(255,255,255,0.07)",
            borderRadius: 8,
            animation: "shimmer 1.8s infinite",
            backgroundImage:
              "linear-gradient(90deg,rgba(255,255,255,0.03) 25%,rgba(255,255,255,0.1) 50%,rgba(255,255,255,0.03) 75%)",
            backgroundSize: "200% 100%",
          }}
        />
      ) : (
        <div
          style={{
            fontSize: 24,
            fontWeight: 900,
            color: "#fff",
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
          }}
        >
          {value}
          {unit && (
            <span
              style={{
                fontSize: 14,
                color: "rgba(107,114,128,1)",
                fontWeight: 400,
                marginLeft: 5,
                lineHeight: 1.4,
              }}
            >
              {unit}
            </span>
          )}
        </div>
      )}
      <div
        style={{
          fontSize: 12,
          color: "rgba(107,114,128,1)",
          marginTop: 6,
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.07em",
          lineHeight: 1.4,
        }}
      >
        {label}
      </div>
    </GlassCard>
  );
}
