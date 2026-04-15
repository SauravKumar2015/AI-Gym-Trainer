import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, AlertCircle, ChevronRight } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../hooks/useToast";
import GlassCard from "../components/ui/GlassCard";
import GradientBtn from "../components/ui/GradientBtn";
import InputField from "../components/ui/InputField";
import Spinner from "../components/ui/Spinner";
import {
  GOAL_OPTIONS,
  EXPERIENCE_OPTIONS,
  GENDER_OPTIONS,
} from "../data/mockData";
import { authService } from "../services/authService";
import "./RegisterPage.css";

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    age: "",
    gender: "Male",
    height: "",
    weight: "",
    fitnessGoal: "Muscle Gain",
    experienceLevel: "Beginner",
  });
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  const { register, updateUser } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const validate1 = () => {
    if (!form.name || !form.email || !form.password) {
      setError("Fill all required fields.");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      await register({
        ...form,
        age: parseInt(form.age) || 0,
        height: parseFloat(form.height) || 0,
        weight: parseFloat(form.weight) || 0,
      });
      toast("Account created! Welcome 🎉", "success");
      navigate("/dashboard");
    } catch (e) {
      setError("Registration failed: " + (e.message || "Email may exist."));
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError("");
    try {
      const res = await authService.registerWithGoogle(
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
      setError(e.message || "Google signup failed. Please try again.");
      setLoading(false);
    }
  };

  const S = {
    label: {
      display: "block",
      fontSize: 11,
      fontWeight: 700,
      color: "rgba(156,163,175,1)",
      marginBottom: 6,
      textTransform: "uppercase",
      letterSpacing: "0.08em",
    },
  };

  const ToggleGroup = ({ options, value, onChange, color = "violet" }) => {
    return (
      <div className="register-toggle-group">
        {options.map((o) => (
          <button
            key={o}
            type="button"
            onClick={() => onChange(o)}
            className={`register-toggle-btn ${value === o ? "active" : ""} ${value === o && color === "cyan" ? "active cyan" : ""}`}
          >
            {o}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="register-container">
      <div className="register-bg-1" />
      <div className="register-bg-2" />

      <GlassCard className="register-card" hover={false}>
        <div className="register-header">
          <div>
            <h1 className="register-title">Create Account</h1>
            <p className="register-subtitle">Step {step} of 2</p>
          </div>
          <div className="register-progress">
            {[1, 2].map((s) => (
              <div
                key={s}
                className={`register-progress-bar ${s <= step ? "active" : ""}`}
              />
            ))}
          </div>
        </div>

        {error && (
          <div className="register-error">
            <AlertCircle size={13} />
            {error}
          </div>
        )}

        {step === 1 ? (
          <div className="register-form-step-1">
            <InputField
              label="Full Name *"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="Alex Johnson"
            />
            <InputField
              label="Email *"
              icon={Mail}
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="you@example.com"
            />
            <InputField
              label="Password *"
              icon={Lock}
              type="password"
              value={form.password}
              onChange={(e) => set("password", e.target.value)}
              placeholder="Min. 8 characters"
            />
            <InputField
              label="Phone"
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              placeholder="9876543210"
            />
            <GradientBtn
              onClick={() => {
                setError("");
                if (validate1()) setStep(2);
              }}
              className="register-continue"
            >
              Continue <ChevronRight size={15} />
            </GradientBtn>
          </div>
        ) : (
          <div className="register-form-step-2">
            <div className="register-personal-info">
              <InputField
                label="Age"
                type="number"
                value={form.age}
                onChange={(e) => set("age", e.target.value)}
                placeholder="25"
              />
              <InputField
                label="Height (ft)"
                type="number"
                value={form.height}
                onChange={(e) => set("height", e.target.value)}
                placeholder="5.9"
              />
              <InputField
                label="Weight (kg)"
                type="number"
                value={form.weight}
                onChange={(e) => set("weight", e.target.value)}
                placeholder="70"
              />
            </div>
            <div>
              <label style={S.label}>Gender</label>
              <select
                value={form.gender}
                onChange={(e) => set("gender", e.target.value)}
                className="register-select"
              >
                {GENDER_OPTIONS.map((g) => (
                  <option key={g} value={g} style={{ background: "#0f0f1a" }}>
                    {g}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={S.label}>Fitness Goal</label>
              <ToggleGroup
                options={GOAL_OPTIONS}
                value={form.fitnessGoal}
                onChange={(v) => set("fitnessGoal", v)}
              />
            </div>
            <div>
              <label style={S.label}>Experience Level</label>
              <ToggleGroup
                options={EXPERIENCE_OPTIONS}
                value={form.experienceLevel}
                onChange={(v) => set("experienceLevel", v)}
                color="cyan"
              />
            </div>
            <div className="register-actions">
              <button onClick={() => setStep(1)} className="register-back">
                Back
              </button>
              <GradientBtn
                onClick={handleSubmit}
                disabled={loading}
                className="register-submit"
              >
                {loading ? (
                  <>
                    <Spinner size={14} />
                    Creating...
                  </>
                ) : (
                  "Create Account"
                )}
              </GradientBtn>
            </div>
          </div>
        )}

        <p className="register-signin">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>

        <div className="register-divider">
          <div className="register-divider-line" />
          <span className="register-divider-text">OR</span>
          <div className="register-divider-line" />
        </div>

        <div className="register-google">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError("Google signup failed")}
          />
        </div>
      </GlassCard>
    </div>
  );
}
