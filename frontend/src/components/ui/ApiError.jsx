import { AlertCircle, RefreshCw } from "lucide-react";
import GradientBtn from "./GradientBtn";
export default function ApiError({ message, onRetry }) {
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
          background: "rgba(239,68,68,0.1)",
          border: "1px solid rgba(239,68,68,0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 14,
        }}
      >
        <AlertCircle size={22} color="#f87171" />
      </div>
      <p
        style={{
          color: "rgba(156,163,175,1)",
          fontSize: 13,
          marginBottom: 16,
          maxWidth: 300,
          lineHeight: 1.6,
        }}
      >
        {message ||
          "Backend offline? Make sure Spring Boot is running on :8080"}
      </p>
      {onRetry && (
        <GradientBtn
          onClick={onRetry}
          style={{ fontSize: 12, padding: "8px 16px" }}
        >
          <RefreshCw size={13} />
          Retry
        </GradientBtn>
      )}
    </div>
  );
}
