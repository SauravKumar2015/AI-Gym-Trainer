import { useState } from "react";
import { Mail, Lock, AlertCircle, Check, X } from "lucide-react";
import { useToast } from "../hooks/useToast";
import { authService } from "../services/authService";
import GlassCard from "./ui/GlassCard";
import GradientBtn from "./ui/GradientBtn";
import InputField from "./ui/InputField";
import Spinner from "./ui/Spinner";

export default function PasswordResetModal({ isOpen, onClose }) {
  const toast = useToast();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Please enter your email address");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await authService.forgotPassword(email);
      setResetToken(res.resetToken || "");
      if (res.resetToken) {
        toast("Reset token generated! Proceed to next step.", "success");
        setStep(2);
      } else {
        setError("Failed to generate reset token");
      }
    } catch (e) {
      setError(e.message || "Failed to process forgot password request");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!resetToken || !newPassword) {
      setError("Please fill in all fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await authService.resetPassword(resetToken, newPassword);
      toast(
        "Password reset successfully! Please login with your new password.",
        "success",
      );
      setTimeout(() => {
        setStep(1);
        setEmail("");
        setResetToken("");
        setNewPassword("");
        setConfirmPassword("");
        onClose();
      }, 1500);
    } catch (e) {
      setError(
        e.message || "Failed to reset password. Token may have expired.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: 20,
      }}
    >
      <GlassCard
        style={{ maxWidth: 420, padding: 32, position: "relative" }}
        hover={false}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "rgba(107,114,128,1)",
            display: "flex",
            padding: 0,
          }}
        >
          <X size={20} />
        </button>

        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <h2
            style={{
              fontSize: 20,
              fontWeight: 900,
              color: "#fff",
              margin: "0 0 6px",
            }}
          >
            {step === 1 ? "Reset Password" : "Set New Password"}
          </h2>
          <p style={{ fontSize: 12, color: "rgba(107,114,128,1)" }}>
            {step === 1
              ? "Enter your email to receive a reset token"
              : "Enter your reset token and new password"}
          </p>
        </div>

        {error && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 14px",
              marginBottom: 18,
              borderRadius: 10,
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.25)",
              color: "#f87171",
              fontSize: 12,
            }}
          >
            <AlertCircle size={13} />
            {error}
          </div>
        )}

        {step === 1 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <InputField
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              icon={Mail}
            />
            <GradientBtn
              onClick={handleForgotPassword}
              disabled={loading}
              style={{ width: "100%", padding: "12px 20px", fontSize: 13 }}
            >
              {loading ? (
                <>
                  <Spinner size={13} />
                  Sending...
                </>
              ) : (
                <>Send Reset Code</>
              )}
            </GradientBtn>
            <button
              onClick={onClose}
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(156,163,175,1)",
                background: "transparent",
                cursor: "pointer",
                fontSize: 12,
                fontWeight: 700,
                fontFamily: "inherit",
              }}
            >
              Cancel
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <InputField
              label="Reset Token"
              value={resetToken}
              onChange={(e) => setResetToken(e.target.value)}
              placeholder="Your reset token"
              disabled
              style={{ opacity: 0.7 }}
            />
            <InputField
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Min. 8 characters"
              icon={Lock}
            />
            <InputField
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
            />
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => {
                  setStep(1);
                  setError("");
                }}
                style={{
                  flex: 1,
                  padding: "11px 14px",
                  borderRadius: 10,
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "rgba(156,163,175,1)",
                  background: "transparent",
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: 700,
                  fontFamily: "inherit",
                }}
              >
                Back
              </button>
              <GradientBtn
                onClick={handleResetPassword}
                disabled={loading}
                style={{ flex: 1, padding: "11px 14px", fontSize: 12 }}
              >
                {loading ? (
                  <>
                    <Spinner size={12} />
                    Resetting...
                  </>
                ) : (
                  <>Reset Password</>
                )}
              </GradientBtn>
            </div>
          </div>
        )}

        <div
          style={{
            marginTop: 20,
            paddingTop: 16,
            borderTop: "1px solid rgba(255,255,255,0.06)",
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: 11, color: "rgba(107,114,128,1)" }}>
            <span style={{ color: "#67e8f9", fontWeight: 600 }}>Tip:</span>{" "}
            Check your email for the reset token if you requested one
          </p>
        </div>
      </GlassCard>
    </div>
  );
}
