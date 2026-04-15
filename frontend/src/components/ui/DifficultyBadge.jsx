const S = {
  Beginner: {
    c: "#34d399",
    bg: "rgba(16,185,129,0.15)",
    b: "rgba(16,185,129,0.3)",
  },
  Intermediate: {
    c: "#fbbf24",
    bg: "rgba(245,158,11,0.15)",
    b: "rgba(245,158,11,0.3)",
  },
  Advanced: {
    c: "#f87171",
    bg: "rgba(239,68,68,0.15)",
    b: "rgba(239,68,68,0.3)",
  },
};
export default function DifficultyBadge({ level }) {
  const s = S[level] || S.Beginner;
  return (
    <span
      style={{
        fontSize: 11,
        padding: "4px 10px",
        borderRadius: 20,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.07em",
        lineHeight: 1.4,
        color: s.c,
        background: s.bg,
        border: `1px solid ${s.b}`,
        whiteSpace: "nowrap",
      }}
    >
      {level || "Beginner"}
    </span>
  );
}
