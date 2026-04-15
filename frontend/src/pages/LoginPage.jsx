import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, AlertCircle, Dumbbell } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../hooks/useToast";
import GlassCard from "../components/ui/GlassCard";
import GradientBtn from "../components/ui/GradientBtn";
import InputField from "../components/ui/InputField";
import PasswordResetModal from "../components/PasswordResetModal_NEW";
import Spinner from "../components/ui/Spinner";
import { authService } from "../services/authService";
import "./LoginPage.css";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showResetModal, setShowResetModal] = useState(false);
  const { login, updateUser } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!form.email || !form.password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const profile = await login(form.email, form.password);
      toast(
        `Welcome back, ${profile.name?.split(" ")[0] || "Athlete"}! 👋`,
        "success",
      );
      navigate("/dashboard");
    } catch {
      setError("Invalid credentials. Check your email and password.");
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError("");
    try {
      const res = await authService.loginWithGoogle(
        credentialResponse.credential,
      );
      if (res.token) {
        localStorage.setItem("fitai_token", res.token);
        updateUser(res.user, res.token);
        toast(
          `Welcome, ${res.user.name?.split(" ")[0] || "Athlete"}! 🎉`,
          "success",
        );
        navigate("/dashboard");
      }
    } catch (e) {
      setError(e.message || "Google login failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-bg-blur-1" />
      <div className="login-bg-blur-2" />

      <GlassCard className="login-card" hover={false}>
        <div className="login-header">
          <div className="login-icon">
            <Dumbbell size={23} color="#fff" />
          </div>
          <h1>Welcome Back</h1>
          <p>Sign in to FitAI Pro</p>
        </div>

        {error && (
          <div className="login-error">
            <AlertCircle size={13} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <InputField
            label="Email"
            icon={Mail}
            type="email"
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            placeholder="you@example.com"
          />
          <InputField
            label="Password"
            icon={Lock}
            type={showPass ? "text" : "password"}
            value={form.password}
            onChange={(e) =>
              setForm((p) => ({ ...p, password: e.target.value }))
            }
            placeholder="••••••••"
            rightEl={
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "rgba(107,114,128,1)",
                  display: "flex",
                  padding: 0,
                }}
              >
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            }
          />
          <GradientBtn
            type="submit"
            disabled={loading}
            fullWidth
            className="login-submit"
            style={{ padding: "14px 16px" }}
          >
            {loading ? (
              <>
                <Spinner size={14} />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </GradientBtn>
        </form>

        <div className="login-divider">
          <div className="login-divider-line" />
          <span className="login-divider-text">OR</span>
          <div className="login-divider-line" />
        </div>

        <div className="login-google">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError("Google login failed")}
          />
        </div>

        <p className="login-footer">
          No account? <Link to="/register">Create one</Link>
        </p>

        <div className="login-forgot">
          <button onClick={() => setShowResetModal(true)}>
            Forgot password?
          </button>
        </div>
      </GlassCard>

      <PasswordResetModal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
      />
    </div>
  );
}
