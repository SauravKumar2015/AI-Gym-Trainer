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
import "./ExercisesPage.css";

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

  useEffect(() => { load(); }, [load]);

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
      await aiService.generateExercise();
      toast("Exercise generated with AI!", "success");
      load();
    } catch (e) {
      toast("AI generation failed: " + e.message, "error");
    } finally {
      setAiGenerating(false);
    }
  };

  return (
    <div className="exercises-page">
      <div className="exercises-inner">

        {/* ── Header ── */}
        <div className="exercises-header">
          <div className="exercises-title-group">
            <h1 className="exercises-title">
              Exercise <span className="exercises-title-accent">Library</span>
            </h1>
            <p className="exercises-subtitle">Your movement database</p>
          </div>
          <div className="exercises-actions">
            <GradientBtn
              onClick={handleAIGenerate}
              disabled={aiGenerating}
              variant="cyan"
            >
              <Zap size={14} />
              {aiGenerating ? "Generating..." : "AI Generate"}
            </GradientBtn>
            <GradientBtn
              onClick={() => setShowForm(!showForm)}
              variant="cyan"
            >
              <Plus size={14} />
              {showForm ? "Cancel" : "Add Exercise"}
            </GradientBtn>
          </div>
        </div>

        {/* ── Add Form ── */}
        {showForm && (
          <GlassCard className="exercises-form-card" hover={false}>
            <div className="exercises-form-title">Add Exercise</div>
            <div className="exercises-form-grid">
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
                <label className="exercises-form-label">Difficulty</label>
                <div className="exercises-difficulty-group">
                  {DIFFICULTY_OPTIONS.map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => set("difficulty", d)}
                      className={`exercises-difficulty-btn${
                        form.difficulty === d ? " active" : ""
                      }`}
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
              <div className="exercises-form-full">
                <label className="exercises-form-label">Instructions</label>
                <textarea
                  value={form.instructions}
                  onChange={(e) => set("instructions", e.target.value)}
                  placeholder="Step-by-step..."
                  rows={2}
                  className="exercises-form-textarea"
                />
              </div>
            </div>
            <div className="exercises-form-actions">
              <GradientBtn onClick={handleCreate} disabled={creating} variant="cyan">
                {creating ? (
                  <><Spinner size={13} /> Adding...</>
                ) : (
                  <><Check size={13} /> Add Exercise</>
                )}
              </GradientBtn>
            </div>
          </GlassCard>
        )}

        {/* ── Content ── */}
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
          <div className="exercises-grid">
            {items.map((ex, i) => (
              <GlassCard
                key={ex.id || i}
                className="exercises-card"
                onClick={() => navigate(`/exercises/detail?id=${ex.id}`)}
              >
                {/* Top row: icon + badge */}
                <div className="exercises-card-top">
                  <div className="exercises-card-icon">
                    <Activity size={15} color="#67e8f9" />
                  </div>
                  <DifficultyBadge level={ex.difficulty} />
                </div>

                {/* Name */}
                <h3 className="exercises-card-name">{ex.name}</h3>

                {/* Muscle group */}
                <div className="exercises-card-muscle">{ex.muscleGroup}</div>

                {/* Equipment (optional) */}
                {ex.equipment && (
                  <div className="exercises-card-equipment">
                    🔧 {ex.equipment}
                  </div>
                )}

                {/* Footer */}
                <div className="exercises-card-footer">
                  <Activity size={11} />
                  <span>{ex.difficulty}</span>
                </div>
              </GlassCard>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}