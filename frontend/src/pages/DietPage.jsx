import { useState, useEffect, useCallback } from "react";
import { Apple, Plus, Check, Flame, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../hooks/useToast";
import { dietService } from "../services/dietService";
import { aiService } from "../services/aiService";
import GlassCard from "../components/ui/GlassCard";
import GradientBtn from "../components/ui/GradientBtn";
import InputField from "../components/ui/InputField";
import ApiError from "../components/ui/ApiError";
import EmptyState from "../components/ui/EmptyState";
import Spinner from "../components/ui/Spinner";
import { SkeletonGrid } from "../components/ui/LoadingSkeleton";

const INIT = {
  title: "",
  goal: "",
  dailyCalories: "",
  dietType: "",
  description: "",
};
const typeStyle = (t = "") => {
  const s = t.toLowerCase();
  if (s.includes("veg") && !s.includes("non"))
    return {
      bg: "rgba(16,185,129,0.15)",
      c: "#34d399",
      b: "rgba(16,185,129,0.3)",
    };
  if (s.includes("high protein"))
    return {
      bg: "rgba(6,182,212,0.15)",
      c: "#67e8f9",
      b: "rgba(6,182,212,0.3)",
    };
  if (s.includes("keto"))
    return {
      bg: "rgba(124,58,237,0.15)",
      c: "#a78bfa",
      b: "rgba(124,58,237,0.3)",
    };
  return {
    bg: "rgba(249,115,22,0.15)",
    c: "#fb923c",
    b: "rgba(249,115,22,0.3)",
  };
};

export default function DietPage() {
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
      setItems(await dietService.getAllDiets());
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
      await dietService.createDiet({
        ...form,
        dailyCalories: Number(form.dailyCalories) || 2000,
      });
      toast("Diet created!", "success");
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
      const newDiet = await aiService.generateDiet();
      toast("Diet generated with AI!", "success");
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
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
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
              Diet <span style={{ color: "#34d399" }}>Plans</span>
            </h1>
            <p
              style={{
                fontSize: 11,
                color: "rgba(107,114,128,1)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Your nutrition programs
            </p>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <GradientBtn
              onClick={handleAIGenerate}
              disabled={aiGenerating}
              variant="green"
              style={{ fontSize: 12, padding: "9px 16px" }}
            >
              <Zap size={13} />
              {aiGenerating ? "Generating..." : "AI Generate"}
            </GradientBtn>
            <GradientBtn
              onClick={() => setShowForm(!showForm)}
              variant="green"
              style={{ fontSize: 12, padding: "9px 16px" }}
            >
              <Plus size={13} />
              {showForm ? "Cancel" : "New Diet Plan"}
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
              Create Diet Plan
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
                placeholder="High Protein Plan"
              />
              <InputField
                label="Goal *"
                value={form.goal}
                onChange={(e) => set("goal", e.target.value)}
                placeholder="Muscle Gain"
              />
              <InputField
                label="Daily Calories"
                type="number"
                value={form.dailyCalories}
                onChange={(e) => set("dailyCalories", e.target.value)}
                placeholder="2200"
              />
              <InputField
                label="Diet Type"
                value={form.dietType}
                onChange={(e) => set("dietType", e.target.value)}
                placeholder="veg / non-veg / keto"
              />
              <div style={{ gridColumn: "1/-1" }}>
                <label style={S.label}>Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  placeholder="Describe this plan..."
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
                variant="green"
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
        {loading ? (
          <SkeletonGrid count={3} />
        ) : err ? (
          <ApiError message={err} onRetry={load} />
        ) : items.length === 0 ? (
          <EmptyState
            icon={Apple}
            message="No diet plans yet. Create one or generate with AI!"
          />
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))",
              gap: 16,
            }}
          >
            {items.map((d) => {
              const ts = typeStyle(d.dietType);
              return (
                <GlassCard
                  key={d.id}
                  style={{
                    padding: 20,
                    display: "flex",
                    flexDirection: "column",
                    cursor: "pointer",
                  }}
                  onClick={() => navigate(`/diet/detail?id=${d.id}`)}
                >
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 11,
                      background: ts.bg,
                      border: "1px solid " + ts.b,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 12,
                    }}
                  >
                    <Apple size={15} color={ts.c} />
                  </div>
                  <h3
                    style={{
                      color: "#fff",
                      fontWeight: 800,
                      fontSize: 14,
                      margin: "0 0 4px",
                    }}
                  >
                    {d.title}
                  </h3>
                  <div
                    style={{
                      color: ts.c,
                      fontSize: 12,
                      fontWeight: 700,
                      marginBottom: 8,
                    }}
                  >
                    {d.goal}
                  </div>
                  {d.description && (
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
                      {d.description}
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
                    <Flame size={11} />
                    {d.dailyCalories} kcal/day
                  </div>
                </GlassCard>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
