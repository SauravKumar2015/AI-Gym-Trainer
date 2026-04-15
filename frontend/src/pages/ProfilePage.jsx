import { useState } from "react";
import {
  User,
  Save,
  Key,
  Trash2,
  Check,
  AlertCircle,
  Eye,
  EyeOff,
  Scale,
  Activity,
  Target,
  Calendar,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../hooks/useToast";
import { authService } from "../services/authService";
import GlassCard from "../components/ui/GlassCard";
import GradientBtn from "../components/ui/GradientBtn";
import InputField from "../components/ui/InputField";
import Spinner from "../components/ui/Spinner";
import { GOAL_OPTIONS, GENDER_OPTIONS } from "../data/mockData";

export default function ProfilePage() {
  const { user, logout, updateUser } = useAuth();
  const toast = useToast();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    age: user?.age || "",
    height: user?.height || "",
    weight: user?.weight || "",
    gender: user?.gender || "Male",
    fitnessGoal: user?.fitnessGoal || "Muscle Gain",
  });
  const [pwForm, setPwForm] = useState({ old: "", new_: "", confirm: "" });
  const [showPw, setShowPw] = useState(false);
  const [savingPw, setSavingPw] = useState(false);
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  const bmi =
    user?.weight && user?.height
      ? (
          parseFloat(user.weight) /
          (parseFloat(user.height) / 100) ** 2
        ).toFixed(1)
      : "—";

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await authService.update({
        ...form,
        age: parseInt(form.age) || 0,
        height: parseFloat(form.height) || 0,
        weight: parseFloat(form.weight) || 0,
      });
      updateUser(res.user, res.token);
      toast("Profile updated! ✓", "success");
      setEditing(false);
    } catch (e) {
      toast("Failed: " + e.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const handlePwChange = async () => {
    if (!pwForm.old || !pwForm.new_) {
      toast("Fill all password fields", "error");
      return;
    }
    if (pwForm.new_ !== pwForm.confirm) {
      toast("Passwords do not match", "error");
      return;
    }
    setSavingPw(true);
    try {
      await authService.changePassword(pwForm.old, pwForm.new_);
      toast("Password changed! 🔒", "success");
      setPwForm({ old: "", new_: "", confirm: "" });
    } catch (e) {
      toast("Failed: " + e.message, "error");
    } finally {
      setSavingPw(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeletingAccount(true);
    try {
      await authService.deleteAccount();
      toast("Account deleted successfully. Logging out...", "success");
      setTimeout(() => {
        logout();
        window.location.href = "/login";
      }, 1500);
    } catch (e) {
      toast("Failed to delete account: " + e.message, "error");
      setShowDeleteConfirm(false);
    } finally {
      setDeletingAccount(false);
    }
  };

  const S = {
    page: {
      minHeight: "100vh",
      padding: "76px 24px 48px",
      background: "#060611",
      animation: "fadeUp 0.4s ease both",
    },
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

  const initials =
    (user?.name || "")
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "?";

  return (
    <div style={S.page}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 24,
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "clamp(20px,3vw,28px)",
                fontWeight: 900,
                color: "#fff",
                margin: "0 0 4px",
              }}
            >
              My <span style={{ color: "#fb923c" }}>Profile</span>
            </h1>
            <p
              style={{
                fontSize: 11,
                color: "rgba(107,114,128,1)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Account & settings
            </p>
          </div>
          {!editing ? (
            <GradientBtn
              onClick={() => setEditing(true)}
              variant="orange"
              style={{ fontSize: 12, padding: "9px 16px" }}
            >
              <User size={13} />
              Edit Profile
            </GradientBtn>
          ) : (
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setEditing(false)}
                style={{
                  padding: "9px 16px",
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
              <GradientBtn
                onClick={handleSave}
                disabled={saving}
                variant="green"
                style={{ fontSize: 12, padding: "9px 16px" }}
              >
                {saving ? (
                  <>
                    <Spinner size={13} />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check size={13} />
                    Save
                  </>
                )}
              </GradientBtn>
            </div>
          )}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
            gap: 16,
            alignItems: "start",
          }}
        >
          {/* Avatar card */}
          <GlassCard style={{ padding: 28, textAlign: "center" }} hover={false}>
            <div
              style={{
                width: 76,
                height: 76,
                borderRadius: "50%",
                background: "linear-gradient(135deg,#7c3aed,#4f46e5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 14px",
                boxShadow: "0 8px 28px rgba(124,58,237,0.4)",
                fontSize: 26,
                fontWeight: 900,
                color: "#fff",
              }}
            >
              {initials}
            </div>
            <div style={{ color: "#fff", fontWeight: 900, fontSize: 18 }}>
              {user?.name || "—"}
            </div>
            <div
              style={{
                color: "rgba(107,114,128,1)",
                fontSize: 12,
                marginTop: 4,
              }}
            >
              {user?.email || "—"}
            </div>
            <div
              style={{
                display: "inline-block",
                marginTop: 12,
                padding: "4px 14px",
                borderRadius: 20,
                background: "rgba(124,58,237,0.15)",
                border: "1px solid rgba(124,58,237,0.3)",
                color: "#a78bfa",
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              {user?.fitnessGoal || "Muscle Gain"}
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 10,
                marginTop: 20,
              }}
            >
              {[
                ["BMI", bmi],
                ["Age", user?.age || "—"],
                ["Wt.", user?.weight ? user.weight + "kg" : "—"],
              ].map(([l, v]) => (
                <div
                  key={l}
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    borderRadius: 12,
                    padding: "10px 6px",
                    textAlign: "center",
                  }}
                >
                  <div style={{ color: "#fff", fontWeight: 900, fontSize: 16 }}>
                    {v}
                  </div>
                  <div
                    style={{
                      color: "rgba(107,114,128,1)",
                      fontSize: 10,
                      marginTop: 2,
                      textTransform: "uppercase",
                      letterSpacing: "0.07em",
                    }}
                  >
                    {l}
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Edit form */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <GlassCard style={{ padding: 24 }} hover={false}>
              <div
                style={{
                  color: "#fff",
                  fontWeight: 800,
                  fontSize: 14,
                  marginBottom: 18,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <User size={14} color="#a78bfa" />
                Personal Info
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 14,
                }}
              >
                <div style={{ gridColumn: "1/-1" }}>
                  <InputField
                    label="Full Name"
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                    disabled={!editing}
                    placeholder="Alex Johnson"
                  />
                </div>
                <div style={{ gridColumn: "1/-1" }}>
                  <InputField
                    label="Email"
                    type="email"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    disabled={!editing}
                    placeholder="you@example.com"
                  />
                </div>
                <InputField
                  label="Age"
                  type="number"
                  value={form.age}
                  onChange={(e) => set("age", e.target.value)}
                  disabled={!editing}
                  placeholder="25"
                />
                <InputField
                  label="Height (ft)"
                  type="number"
                  value={form.height}
                  onChange={(e) => set("height", e.target.value)}
                  disabled={!editing}
                  placeholder="5.9"
                />
                <InputField
                  label="Weight (kg)"
                  type="number"
                  value={form.weight}
                  onChange={(e) => set("weight", e.target.value)}
                  disabled={!editing}
                  placeholder="70"
                />
                <div>
                  <label style={S.label}>Gender</label>
                  <select
                    value={form.gender}
                    onChange={(e) => set("gender", e.target.value)}
                    disabled={!editing}
                    style={{
                      width: "100%",
                      padding: "11px 14px",
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.09)",
                      borderRadius: 10,
                      color: "#fff",
                      fontSize: 13,
                      outline: "none",
                      opacity: editing ? 1 : 0.6,
                    }}
                  >
                    {GENDER_OPTIONS.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>
                <div style={{ gridColumn: "1/-1" }}>
                  <label style={S.label}>Fitness Goal</label>
                  <div style={{ display: "flex", gap: 8 }}>
                    {GOAL_OPTIONS.map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => editing && set("fitnessGoal", g)}
                        style={{
                          flex: 1,
                          padding: "9px 6px",
                          borderRadius: 10,
                          fontSize: 11,
                          fontWeight: 700,
                          fontFamily: "inherit",
                          cursor: editing ? "pointer" : "default",
                          transition: "all .2s",
                          border: `1px solid ${form.fitnessGoal === g ? "rgba(249,115,22,0.45)" : "rgba(255,255,255,0.09)"}`,
                          background:
                            form.fitnessGoal === g
                              ? "rgba(249,115,22,0.15)"
                              : "rgba(255,255,255,0.04)",
                          color:
                            form.fitnessGoal === g
                              ? "#fb923c"
                              : "rgba(107,114,128,1)",
                          opacity: editing || form.fitnessGoal === g ? 1 : 0.6,
                        }}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Change password */}
            <GlassCard style={{ padding: 24 }} hover={false}>
              <div
                style={{
                  color: "#fff",
                  fontWeight: 800,
                  fontSize: 14,
                  marginBottom: 18,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <Key size={14} color="#67e8f9" />
                Change Password
              </div>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 12 }}
              >
                <InputField
                  label="Current Password"
                  type={showPw ? "text" : "password"}
                  value={pwForm.old}
                  onChange={(e) =>
                    setPwForm((p) => ({ ...p, old: e.target.value }))
                  }
                  placeholder="••••••••"
                  rightEl={
                    <button
                      type="button"
                      onClick={() => setShowPw(!showPw)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "rgba(107,114,128,1)",
                        display: "flex",
                        padding: 0,
                      }}
                    >
                      {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  }
                />
                <InputField
                  label="New Password"
                  type="password"
                  value={pwForm.new_}
                  onChange={(e) =>
                    setPwForm((p) => ({ ...p, new_: e.target.value }))
                  }
                  placeholder="Min. 8 characters"
                />
                <InputField
                  label="Confirm New Password"
                  type="password"
                  value={pwForm.confirm}
                  onChange={(e) =>
                    setPwForm((p) => ({ ...p, confirm: e.target.value }))
                  }
                  placeholder="Repeat new password"
                />
                <GradientBtn
                  onClick={handlePwChange}
                  disabled={savingPw}
                  variant="cyan"
                  style={{ fontSize: 12, padding: "10px 16px" }}
                >
                  {savingPw ? (
                    <>
                      <Spinner size={13} />
                      Changing...
                    </>
                  ) : (
                    <>
                      <Key size={13} />
                      Change Password
                    </>
                  )}
                </GradientBtn>
              </div>
            </GlassCard>

            {/* Delete Account */}
            <GlassCard
              style={{
                padding: 24,
                border: "1px solid rgba(239,68,68,0.2)",
                background: "rgba(239,68,68,0.05)",
              }}
              hover={false}
            >
              <div
                style={{
                  color: "#fca5a5",
                  fontWeight: 800,
                  fontSize: 14,
                  marginBottom: 18,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <Trash2 size={14} />
                Danger Zone
              </div>
              <p
                style={{
                  color: "rgba(156,163,175,1)",
                  fontSize: 12,
                  marginBottom: 14,
                }}
              >
                Permanently delete your account and all associated data. This
                action cannot be undone.
              </p>
              <GradientBtn
                onClick={() => setShowDeleteConfirm(true)}
                variant="red"
                style={{
                  fontSize: 12,
                  padding: "10px 16px",
                  background: "rgba(239,68,68,0.2)",
                  border: "1px solid rgba(239,68,68,0.4)",
                }}
              >
                <Trash2 size={13} />
                Delete Account
              </GradientBtn>
            </GlassCard>
          </div>
        </div>

        {showDeleteConfirm && (
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
              style={{ maxWidth: 400, padding: 32, textAlign: "center" }}
              hover={false}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  background: "rgba(239,68,68,0.15)",
                  border: "2px solid rgba(239,68,68,0.3)",
                  borderRadius: 12,
                  margin: "0 auto 16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <AlertCircle size={28} color="#f87171" />
              </div>
              <div
                style={{
                  color: "#fff",
                  fontWeight: 900,
                  fontSize: 18,
                  marginBottom: 8,
                }}
              >
                Delete Account?
              </div>
              <p
                style={{
                  color: "rgba(156,163,175,1)",
                  fontSize: 13,
                  marginBottom: 22,
                }}
              >
                This will permanently delete your account and all associated
                data including workouts, diet plans, and progress tracking.
              </p>
              <div style={{ display: "flex", gap: 12 }}>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  style={{
                    flex: 1,
                    padding: "11px 16px",
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
                <GradientBtn
                  onClick={handleDeleteAccount}
                  disabled={deletingAccount}
                  style={{
                    flex: 1,
                    fontSize: 12,
                    padding: "11px 16px",
                    background: "rgba(239,68,68,0.2)",
                    border: "1px solid rgba(239,68,68,0.4)",
                  }}
                >
                  {deletingAccount ? (
                    <>
                      <Spinner size={13} />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 size={13} />
                      Delete
                    </>
                  )}
                </GradientBtn>
              </div>
            </GlassCard>
          </div>
        )}
      </div>
    </div>
  );
}
