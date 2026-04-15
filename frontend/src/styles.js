// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
export const C = {
  bg: "#060611",
  bgCard: "rgba(255,255,255,0.04)",
  bgCardHover: "rgba(255,255,255,0.075)",
  border: "rgba(255,255,255,0.08)",
  borderHover: "rgba(255,255,255,0.16)",
  violet: "#7c3aed",
  violetLight: "#a78bfa",
  cyan: "#06b6d4",
  emerald: "#10b981",
  orange: "#f97316",
  rose: "#ef4444",
  amber: "#f59e0b",
  text: "#ffffff",
  textMuted: "rgba(156,163,175,1)",
  textDim: "rgba(107,114,128,1)",
};

export const GRADIENTS = {
  violet: "linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)",
  cyan: "linear-gradient(135deg, #06b6d4 0%, #2563eb 100%)",
  green: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
  orange: "linear-gradient(135deg, #f97316 0%, #d97706 100%)",
  rose: "linear-gradient(135deg, #ef4444 0%, #be123c 100%)",
  amber: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
  hero: "linear-gradient(135deg, #a78bfa 0%, #22d3ee 50%, #34d399 100%)",
};

export const glass = (extra = {}) => ({
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  background: C.bgCard,
  border: `1px solid ${C.border}`,
  borderRadius: 16,
  ...extra,
});

export const card = (extra = {}) => ({
  ...glass(),
  padding: 20,
  ...extra,
});

export const btn = (variant = "violet", extra = {}) => ({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  padding: "10px 20px",
  borderRadius: 10,
  border: "none",
  cursor: "pointer",
  fontWeight: 700,
  fontSize: 13,
  color: "#fff",
  fontFamily: "'Syne', sans-serif",
  background: GRADIENTS[variant] || GRADIENTS.violet,
  boxShadow: `0 4px 16px ${C[variant] || C.violet}44`,
  transition: "all 0.2s ease",
  letterSpacing: "0.01em",
  ...extra,
});

export const input = (focused = false, extra = {}) => ({
  width: "100%",
  padding: "11px 14px",
  background: focused ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.04)",
  border: `1px solid ${focused ? "rgba(124,58,237,0.55)" : C.border}`,
  borderRadius: 10,
  color: "#fff",
  fontSize: 13,
  outline: "none",
  transition: "all 0.2s",
  fontFamily: "'Syne', sans-serif",
  boxSizing: "border-box",
  ...extra,
});

export const label = {
  display: "block",
  fontSize: 11,
  fontWeight: 700,
  color: C.textMuted,
  marginBottom: 6,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
};

export const section = (extra = {}) => ({
  padding: "88px 24px",
  ...extra,
});

export const container = (extra = {}) => ({
  maxWidth: 1200,
  margin: "0 auto",
  ...extra,
});

export const grid = (
  cols = "repeat(auto-fit,minmax(260px,1fr))",
  extra = {},
) => ({
  display: "grid",
  gridTemplateColumns: cols,
  gap: 20,
  ...extra,
});

export const flex = (extra = {}) => ({
  display: "flex",
  alignItems: "center",
  ...extra,
});

export const pageWrap = {
  minHeight: "100vh",
  paddingTop: 76,
  paddingBottom: 48,
  paddingLeft: 24,
  paddingRight: 24,
  background: C.bg,
  animation: "fadeUp 0.4s cubic-bezier(0.22,1,0.36,1) both",
};

export const pageTitle = (accent = GRADIENTS.violet) => ({
  fontSize: "clamp(22px,3.5vw,30px)",
  fontWeight: 900,
  color: "#fff",
  margin: "0 0 4px",
});

export const badge = (color, bg, border) => ({
  fontSize: 10,
  padding: "3px 9px",
  borderRadius: 20,
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color,
  background: bg,
  border: `1px solid ${border}`,
  whiteSpace: "nowrap",
});

export const DIFF_BADGE = {
  Beginner: badge("#34d399", "rgba(16,185,129,0.15)", "rgba(16,185,129,0.3)"),
  Intermediate: badge(
    "#fbbf24",
    "rgba(245,158,11,0.15)",
    "rgba(245,158,11,0.3)",
  ),
  Advanced: badge("#f87171", "rgba(239,68,68,0.15)", "rgba(239,68,68,0.3)"),
};
