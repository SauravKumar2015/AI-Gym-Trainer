export function SkeletonCard({ h = 144 }) {
  return (
    <div
      style={{
        height: h,
        borderRadius: 16,
        border: "1px solid rgba(255,255,255,0.05)",
        backgroundImage:
          "linear-gradient(90deg,rgba(255,255,255,0.03) 25%,rgba(255,255,255,0.08) 50%,rgba(255,255,255,0.03) 75%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.8s infinite",
      }}
    />
  );
}
export function SkeletonGrid({ count = 6 }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))",
        gap: 16,
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
export default function LoadingSkeleton({ rows = 3 }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonCard key={i} h={72} />
      ))}
    </div>
  );
}
