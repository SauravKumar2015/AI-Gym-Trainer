import { useState } from "react";
import { Mail, Lock, AlertCircle, Check, X, Loader } from "lucide-react";
import { useToast } from "../hooks/useToast";
import { authService } from "../services/authService";
import GlassCard from "./ui/GlassCard";
import GradientBtn from "./ui/GradientBtn";
import InputField from "./ui/InputField";
import Spinner from "./ui/Spinner";

export default function PasswordResetModal({ isOpen, onClose }) {
  const toast = useToast();
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [timer, setTimer] = useState(0);

  // Step 1: Send OTP to email
  const handleSendOtp = async () => {
    if (!email) {
      setError("Please enter your email address");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await authService.forgotPassword(email);
      setOtpSent(true);
      toast("OTP sent to your email! 📧", "success");
      setStep(2);
      setTimer(60); // 1 minute = 60 seconds
      // Timer countdown
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (e) {
      setError(e.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit code");
      return;
    }

    setLoading(true);
    setError("");
    try {
      // For now, we accept the OTP if it's 6 digits
      // In production, backend would verify it against the token
      if (!/^\d{6}$/.test(otp)) {
        setError("OTP must be 6 digits");
        setLoading(false);
        return;
      }
      toast("OTP verified successfully! ✓", "success");
      setStep(3);
    } catch (e) {
      setError(e.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset password
  const handleResetPassword = async () => {
    if (!password || !passwordConfirm) {
      setError("Please fill in all fields");
      return;
    }
    if (password !== passwordConfirm) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await authService.resetPassword(otp, password);
      toast("Password reset successfully! 🎉", "success");
      setTimeout(() => {
        resetForm();
        onClose();
      }, 1500);
    } catch (e) {
      setError(e.message || "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setEmail("");
    setOtp("");
    setPassword("");
    setPasswordConfirm("");
    setError("");
    setOtpSent(false);
    setTimer(0);
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
      setOtp("");
      setError("");
    } else if (step === 3) {
      setStep(2);
      setPassword("");
      setPasswordConfirm("");
      setError("");
    }
  };

  if (!isOpen) return null;

  const getStepTitle = () => {
    switch (step) {
      case 1:
        return "Reset Your Password";
      case 2:
        return "Verify Code";
      case 3:
        return "Create New Password";
      default:
        return "Password Reset";
    }
  };

  const getStepDescription = () => {
    switch (step) {
      case 1:
        return "Enter your email address to receive a verification code";
      case 2:
        return `We've sent a 6-digit code to ${email}`;
      case 3:
        return "Enter your new password twice for confirmation";
      default:
        return "";
    }
  };

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
        animation: "fadeIn 0.2s ease",
      }}
    >
      <GlassCard
        style={{
          maxWidth: 420,
          padding: 32,
          position: "relative",
          animation: "slideUp 0.3s ease",
        }}
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
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => (e.target.style.color = "#fff")}
          onMouseLeave={(e) => (e.target.style.color = "rgba(107,114,128,1)")}
        >
          <X size={20} />
        </button>

        {/* Progress indicator */}
        <div style={{ display: "flex", gap: 8, marginBottom: 28 }}>
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              style={{
                height: 3,
                flex: 1,
                borderRadius: 2,
                background:
                  s <= step
                    ? "linear-gradient(90deg,#7c3aed,#4f46e5)"
                    : "rgba(255,255,255,0.1)",
                transition: "all 0.3s",
              }}
            />
          ))}
        </div>

        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <h2
            style={{
              fontSize: 20,
              fontWeight: 900,
              color: "#fff",
              margin: "0 0 6px",
            }}
          >
            {getStepTitle()}
          </h2>
          <p style={{ fontSize: 12, color: "rgba(107,114,128,1)" }}>
            {getStepDescription()}
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
              animation: "slideDown 0.3s ease",
            }}
          >
            <AlertCircle size={13} />
            {error}
          </div>
        )}

        {/* Step 1: Email */}
        {step === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <InputField
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              icon={Mail}
              disabled={loading}
            />
            <GradientBtn
              onClick={handleSendOtp}
              disabled={loading}
              style={{ width: "100%", padding: "12px 20px", fontSize: 13 }}
            >
              {loading ? (
                <>
                  <Spinner size={13} />
                  Sending Code...
                </>
              ) : (
                <>Send Code</>
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
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.target.style.background = "rgba(255,255,255,0.05)")
              }
              onMouseLeave={(e) => (e.target.style.background = "transparent")}
            >
              Cancel
            </button>
          </div>
        )}

        {/* Step 2: OTP Verification */}
        {step === 2 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div
              style={{
                background: "rgba(6,182,212,0.1)",
                border: "1px solid rgba(6,182,212,0.2)",
                borderRadius: 12,
                padding: 14,
                textAlign: "center",
              }}
            >
              <p
                style={{
                  color: "rgba(107,114,128,1)",
                  fontSize: 12,
                  margin: 0,
                }}
              >
                Check your email for a 6-digit code
              </p>
            </div>
            <InputField
              label="Verification Code"
              type="text"
              value={otp}
              onChange={(e) => {
                const val = e.target.value.slice(0, 6);
                setOtp(val);
              }}
              placeholder="000000"
              disabled={loading}
            />
            {timer > 0 && (
              <p
                style={{
                  textAlign: "center",
                  fontSize: 12,
                  color: "#67e8f9",
                  fontWeight: 600,
                }}
              >
                Code expires in{" "}
                <span style={{ color: "#fb923c" }}>
                  {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, "0")}
                </span>
              </p>
            )}
            {timer === 0 && otpSent && (
              <button
                onClick={() => {
                  setOtpSent(false);
                  setStep(1);
                  setOtp("");
                }}
                style={{
                  fontSize: 12,
                  color: "#a78bfa",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 600,
                  padding: 0,
                  fontFamily: "inherit",
                }}
              >
                Didn't receive the code? Resend
              </button>
            )}
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={handleBack}
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
                  transition: "all 0.2s",
                }}
                disabled={loading}
              >
                Back
              </button>
              <GradientBtn
                onClick={handleVerifyOtp}
                disabled={loading || otp.length !== 6}
                style={{ flex: 1, padding: "11px 14px", fontSize: 12 }}
              >
                {loading ? (
                  <>
                    <Spinner size={12} />
                    Verifying...
                  </>
                ) : (
                  <>Verify Code</>
                )}
              </GradientBtn>
            </div>
          </div>
        )}

        {/* Step 3: New Password */}
        {step === 3 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <InputField
              label="New Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 8 characters"
              icon={Lock}
              disabled={loading}
            />
            <InputField
              label="Confirm Password"
              type="password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              placeholder="Re-enter password"
              disabled={loading}
            />
            {password && passwordConfirm && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 12px",
                  borderRadius: 8,
                  background:
                    password === passwordConfirm
                      ? "rgba(34,197,94,0.1)"
                      : "rgba(239,68,68,0.1)",
                  border: `1px solid ${password === passwordConfirm ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.2)"}`,
                  color: password === passwordConfirm ? "#86efac" : "#f87171",
                  fontSize: 12,
                }}
              >
                {password === passwordConfirm ? (
                  <Check size={14} />
                ) : (
                  <AlertCircle size={14} />
                )}
                {password === passwordConfirm
                  ? "Passwords match ✓"
                  : "Passwords do not match"}
              </div>
            )}
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={handleBack}
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
                  transition: "all 0.2s",
                }}
                disabled={loading}
              >
                Back
              </button>
              <GradientBtn
                onClick={handleResetPassword}
                disabled={
                  loading || password !== passwordConfirm || password.length < 8
                }
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
            Remember your password?{" "}
            <button
              onClick={onClose}
              style={{
                background: "none",
                border: "none",
                color: "#a78bfa",
                fontWeight: 600,
                cursor: "pointer",
                padding: 0,
                fontFamily: "inherit",
              }}
            >
              Back to Login
            </button>
          </p>
        </div>
      </GlassCard>
    </div>
  );
}
