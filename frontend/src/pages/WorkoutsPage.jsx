import { useState, useEffect, useCallback } from "react";
import { Dumbbell, Plus, Check, Clock, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../hooks/useToast";
import { workoutService } from "../services/workoutService";
import { aiService } from "../services/aiService";
import { DIFFICULTY_OPTIONS } from "../data/mockData";
import GlassCard from "../components/ui/GlassCard";
import GradientBtn from "../components/ui/GradientBtn";
import DifficultyBadge from "../components/ui/DifficultyBadge";
import InputField from "../components/ui/InputField";
import ApiError from "../components/ui/ApiError";
import EmptyState from "../components/ui/EmptyState";
import Spinner from "../components/ui/Spinner";
import { SkeletonGrid } from "../components/ui/LoadingSkeleton";

const INIT = {
  title: "",
  goal: "",
  durationWeeks: "",
  difficulty: "Intermediate",
  description: "",
};

export default function WorkoutsPage() {
  const toast = useToast();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [filt, setFilt] = useState("All");
  const [form, setForm] = useState(INIT);
  const [aiGenerating, setAiGenerating] = useState(false);
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const load = useCallback(async () => {
    setLoading(true);
    setErr(null);
    try {
      setItems(await workoutService.getAll());
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    load();
  }, [load]);

  const handleCreate = async () => {
    if (!form.title || !form.goal) {
      toast("Title & goal required", "error");
      return;
    }
    setCreating(true);
    try {
      await workoutService.create({
        ...form,
        durationWeeks: Number(form.durationWeeks) || 8,
      });
      toast("Workout created!", "success");
      setShowForm(false);
      setForm(INIT);
      load();
    } catch (e) {
      toast("Failed: " + e.message, "error");
    } finally {
      setCreating(false);
    }
  };

  const handleAIGenerate = async () => {
    setAiGenerating(true);
    try {
      const newWorkout = await aiService.generateWorkout();
      toast("Workout generated with AI!", "success");
      load();
    } catch (e) {
      toast("AI generation failed: " + e.message, "error");
    } finally {
      setAiGenerating(false);
    }
  };

  const filtered =
    filt === "All" ? items : items.filter((w) => w.difficulty === filt);
  const S = {
    page: {
      minHeight: "100vh",
      paddingTop: 76,
      paddingBottom: 48,
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

  return (
    <div style={S.page}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
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
              Workout <span style={{ color: "#a78bfa" }}>Plans</span>
            </h1>
            <p
              style={{
                fontSize: 11,
                color: "rgba(107,114,128,1)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Your training programs
            </p>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <GradientBtn
              onClick={handleAIGenerate}
              disabled={aiGenerating}
              style={{ fontSize: 12, padding: "9px 16px" }}
            >
              <Zap size={13} />
              {aiGenerating ? "Generating..." : "AI Generate"}
            </GradientBtn>
            <GradientBtn
              onClick={() => setShowForm(!showForm)}
              style={{ fontSize: 12, padding: "9px 16px" }}
            >
              <Plus size={13} />
              {showForm ? "Cancel" : "New Workout"}
            </GradientBtn>
          </div>
        </div>

        {/* Create form */}
        {showForm && (
          <GlassCard style={{ padding: 24, marginBottom: 20 }} hover={false}>
            <div
              style={{
                color: "#fff",
                fontWeight: 800,
                fontSize: 15,
                marginBottom: 16,
              }}
            >
              Create Workout Plan
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
                gap: 14,
              }}
            >
              <InputField
                label="Title *"
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                placeholder="Full Body Strength"
              />
              <InputField
                label="Goal *"
                value={form.goal}
                onChange={(e) => set("goal", e.target.value)}
                placeholder="Muscle Gain"
              />
              <InputField
                label="Duration (weeks)"
                type="number"
                value={form.durationWeeks}
                onChange={(e) => set("durationWeeks", e.target.value)}
                placeholder="8"
              />
              <div>
                <label style={S.label}>Difficulty</label>
                <div style={{ display: "flex", gap: 8 }}>
                  {DIFFICULTY_OPTIONS.map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => set("difficulty", d)}
                      style={{
                        flex: 1,
                        padding: "9px 6px",
                        borderRadius: 10,
                        border: `1px solid ${form.difficulty === d ? "rgba(124,58,237,0.45)" : "rgba(255,255,255,0.09)"}`,
                        background:
                          form.difficulty === d
                            ? "rgba(124,58,237,0.18)"
                            : "rgba(255,255,255,0.04)",
                        color:
                          form.difficulty === d
                            ? "#c4b5fd"
                            : "rgba(107,114,128,1)",
                        fontSize: 11,
                        fontWeight: 700,
                        cursor: "pointer",
                        transition: "all 0.2s",
                        fontFamily: "inherit",
                      }}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ gridColumn: "1/-1" }}>
                <label style={S.label}>Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  placeholder="Describe this workout plan..."
                  rows={2}
                  style={{
                    width: "100%",
                    padding: "11px 14px",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.09)",
                    borderRadius: 10,
                    color: "#fff",
                    fontSize: 13,
                    outline: "none",
                    resize: "none",
                    fontFamily: "inherit",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: 14,
              }}
            >
              <GradientBtn
                onClick={handleCreate}
                disabled={creating}
                style={{ fontSize: 12, padding: "9px 18px" }}
              >
                {creating ? (
                  <>
                    <Spinner size={13} />
                    Creating...
                  </>
                ) : (
                  <>
                    <Check size={13} />
                    Create
                  </>
                )}
              </GradientBtn>
            </div>
          </GlassCard>
        )}

        {/* Filters */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            marginBottom: 20,
          }}
        >
          {["All", ...DIFFICULTY_OPTIONS].map((d) => (
            <button
              key={d}
              onClick={() => setFilt(d)}
              style={{
                padding: "6px 14px",
                borderRadius: 20,
                fontSize: 11,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.07em",
                border: `1px solid ${filt === d ? "rgba(124,58,237,0.45)" : "rgba(255,255,255,0.09)"}`,
                background:
                  filt === d
                    ? "rgba(124,58,237,0.15)"
                    : "rgba(255,255,255,0.04)",
                color: filt === d ? "#c4b5fd" : "rgba(107,114,128,1)",
                cursor: "pointer",
                transition: "all 0.2s",
                fontFamily: "inherit",
              }}
            >
              {d}
            </button>
          ))}
        </div>

        {loading ? (
          <SkeletonGrid count={6} />
        ) : err ? (
          <ApiError message={err} onRetry={load} />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={Dumbbell}
            message="No workout plans found. Create one or generate with AI!"
          />
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))",
              gap: 16,
            }}
          >
            {filtered.map((w) => (
              <GlassCard
                key={w.id}
                style={{
                  padding: 20,
                  display: "flex",
                  flexDirection: "column",
                  cursor: "pointer",
                }}
                onClick={() => navigate(`/workouts/detail?id=${w.id}`)}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    marginBottom: 12,
                  }}
                >
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 11,
                      background: "rgba(124,58,237,0.15)",
                      border: "1px solid rgba(124,58,237,0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Dumbbell size={15} color="#a78bfa" />
                  </div>
                  <DifficultyBadge level={w.difficulty} />
                </div>
                <h3
                  style={{
                    color: "#fff",
                    fontWeight: 800,
                    fontSize: 14,
                    margin: "0 0 4px",
                  }}
                >
                  {w.title}
                </h3>
                <div
                  style={{
                    color: "#a78bfa",
                    fontSize: 12,
                    fontWeight: 700,
                    marginBottom: 8,
                  }}
                >
                  {w.goal}
                </div>
                {w.description && (
                  <p
                    style={{
                      color: "rgba(107,114,128,1)",
                      fontSize: 12,
                      lineHeight: 1.6,
                      marginBottom: 10,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {w.description}
                  </p>
                )}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    marginTop: "auto",
                    paddingTop: 10,
                    borderTop: "1px solid rgba(255,255,255,0.06)",
                    color: "rgba(107,114,128,1)",
                    fontSize: 11,
                  }}
                >
                  <Clock size={11} />
                  {w.durationWeeks} weeks
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
