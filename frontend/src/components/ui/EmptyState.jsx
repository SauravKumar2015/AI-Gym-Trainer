export default function EmptyState({ icon: Icon, message, action }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "60px 20px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: 14,
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 14,
        }}
      >
        <Icon size={22} color="rgba(75,85,99,1)" />
      </div>
      <p
        style={{
          color: "rgba(107,114,128,1)",
          fontSize: 13,
          maxWidth: 280,
          lineHeight: 1.6,
        }}
      >
        {message}
      </p>
      {action && <div style={{ marginTop: 16 }}>{action}</div>}
    </div>
  );
}
