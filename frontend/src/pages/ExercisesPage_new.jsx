import { useState, useEffect, useCallback } from "react";
import { Activity, Plus, Check, Zap } from "lucide-react";
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
  name: "",
  muscleGroup: "",
  equipment: "",
  difficulty: "Beginner",
  instructions: "",
  videoUrl: "",
};
export default function ExercisesPage() {
  const toast = useToast();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(INIT);
  const [aiGenerating, setAiGenerating] = useState(false);
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  const load = useCallback(async () => {
    setLoading(true);
    setErr(null);
    try {
      setItems(await workoutService.getAllExercises());
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
    if (!form.name || !form.muscleGroup) {
      toast("Name & muscle group required", "error");
      return;
    }
    setCreating(true);
    try {
      await workoutService.createExercise(form);
      toast("Exercise added!", "success");
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
      const newExercise = await aiService.generateExercise();
      toast("Exercise generated with AI!", "success");
      load();
    } catch (e) {
      toast("AI generation failed: " + e.message, "error");
    } finally {
      setAiGenerating(false);
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
              Exercise <span style={{ color: "#67e8f9" }}>Library</span>
            </h1>
            <p
              style={{
                fontSize: 11,
                color: "rgba(107,114,128,1)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Movement database
            </p>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <GradientBtn
              onClick={handleAIGenerate}
              disabled={aiGenerating}
              variant="cyan"
              style={{ fontSize: 12, padding: "9px 16px" }}
            >
              <Zap size={13} />
              {aiGenerating ? "Generating..." : "AI Generate"}
            </GradientBtn>
            <GradientBtn
              onClick={() => setShowForm(!showForm)}
              variant="cyan"
              style={{ fontSize: 12, padding: "9px 16px" }}
            >
              <Plus size={13} />
              {showForm ? "Cancel" : "Add Exercise"}
            </GradientBtn>
          </div>
        </div>
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
              Add Exercise
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
                gap: 14,
              }}
            >
              <InputField
                label="Name *"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="Bench Press"
              />
              <InputField
                label="Muscle Group *"
                value={form.muscleGroup}
                onChange={(e) => set("muscleGroup", e.target.value)}
                placeholder="chest"
              />
              <InputField
                label="Equipment"
                value={form.equipment}
                onChange={(e) => set("equipment", e.target.value)}
                placeholder="Barbell"
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
                        border: `1px solid ${form.difficulty === d ? "rgba(6,182,212,0.45)" : "rgba(255,255,255,0.09)"}`,
                        background:
                          form.difficulty === d
                            ? "rgba(6,182,212,0.15)"
                            : "rgba(255,255,255,0.04)",
                        color:
                          form.difficulty === d
                            ? "#67e8f9"
                            : "rgba(107,114,128,1)",
                        fontSize: 11,
                        fontWeight: 700,
                        cursor: "pointer",
                        fontFamily: "inherit",
                      }}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
              <InputField
                label="Video URL"
                value={form.videoUrl}
                onChange={(e) => set("videoUrl", e.target.value)}
                placeholder="https://..."
              />
              <div style={{ gridColumn: "1/-1" }}>
                <label style={S.label}>Instructions</label>
                <textarea
                  value={form.instructions}
                  onChange={(e) => set("instructions", e.target.value)}
                  placeholder="Step-by-step..."
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
                variant="cyan"
                style={{ fontSize: 12, padding: "9px 18px" }}
              >
                {creating ? (
                  <>
                    <Spinner size={13} />
                    Adding...
                  </>
                ) : (
                  <>
                    <Check size={13} />
                    Add Exercise
                  </>
                )}
              </GradientBtn>
            </div>
          </GlassCard>
        )}
        {loading ? (
          <SkeletonGrid count={4} />
        ) : err ? (
          <ApiError message={err} onRetry={load} />
        ) : items.length === 0 ? (
          <EmptyState
            icon={Activity}
            message="No exercises yet. Add some or generate with AI!"
          />
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))",
              gap: 16,
            }}
          >
            {items.map((ex, i) => (
              <GlassCard
                key={ex.id || i}
                style={{
                  padding: 20,
                  display: "flex",
                  flexDirection: "column",
                  cursor: "pointer",
                }}
                onClick={() => navigate(`/exercises/detail?id=${ex.id}`)}
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
                      background: "rgba(6,182,212,0.15)",
                      border: "1px solid rgba(6,182,212,0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Activity size={15} color="#67e8f9" />
                  </div>
                  <DifficultyBadge level={ex.difficulty} />
                </div>
                <h3
                  style={{
                    color: "#fff",
                    fontWeight: 800,
                    fontSize: 14,
                    margin: "0 0 4px",
                  }}
                >
                  {ex.name}
                </h3>
                <div
                  style={{
                    color: "#67e8f9",
                    fontSize: 12,
                    fontWeight: 700,
                    marginBottom: 8,
                  }}
                >
                  {ex.muscleGroup}
                </div>
                {ex.equipment && (
                  <div
                    style={{
                      color: "rgba(107,114,128,1)",
                      fontSize: 12,
                      lineHeight: 1.6,
                      marginBottom: 10,
                    }}
                  >
                    🔧 {ex.equipment}
                  </div>
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
                  <Activity size={11} />
                  {ex.difficulty}
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
