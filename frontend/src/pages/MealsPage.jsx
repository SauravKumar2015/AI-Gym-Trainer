import { useState, useEffect, useCallback } from "react";
import {
  Utensils,
  Plus,
  Check,
  Flame,
  Zap,
  Activity,
  Droplets,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../hooks/useToast";
import { dietService } from "../services/dietService";
import { aiService } from "../services/aiService";
import GlassCard from "../components/ui/GlassCard";
import GradientBtn from "../components/ui/GradientBtn";
import StatCard from "../components/ui/StatCard";
import InputField from "../components/ui/InputField";
import ApiError from "../components/ui/ApiError";
import EmptyState from "../components/ui/EmptyState";
import Spinner from "../components/ui/Spinner";
import { SkeletonGrid } from "../components/ui/LoadingSkeleton";

const INIT = {
  name: "",
  mealType: "veg",
  calories: "",
  protein: "",
  carbs: "",
  fats: "",
  type: "",
};
const sum = (arr, f) => arr.reduce((a, i) => a + (parseFloat(i[f]) || 0), 0);

export default function MealsPage() {
  const { user } = useAuth();
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
      setItems(await dietService.getAllMeals());
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
    if (!form.name) {
      toast("Meal name required", "error");
      return;
    }
    setCreating(true);
    try {
      await dietService.createMeal({
        ...form,
        calories: Number(form.calories) || 0,
        protein: parseFloat(form.protein) || 0,
        carbs: parseFloat(form.carbs) || 0,
        fats: parseFloat(form.fats) || 0,
      });
      toast("Meal logged!", "success");
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
      const newMeal = await aiService.generateMeal();
      toast("Meal generated with AI!", "success");
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
              Meal <span style={{ color: "#fb923c" }}>Tracker</span>
            </h1>
            <p
              style={{
                fontSize: 11,
                color: "rgba(107,114,128,1)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Log your meals & macros
            </p>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <GradientBtn
              onClick={handleAIGenerate}
              disabled={aiGenerating}
              variant="orange"
              style={{ fontSize: 12, padding: "9px 16px" }}
            >
              <Zap size={13} />
              {aiGenerating ? "Generating..." : "AI Generate"}
            </GradientBtn>
            <GradientBtn
              onClick={() => setShowForm(!showForm)}
              variant="orange"
              style={{ fontSize: 12, padding: "9px 16px" }}
            >
              <Plus size={13} />
              {showForm ? "Cancel" : "Log Meal"}
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
              Log a Meal
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
                gap: 14,
              }}
            >
              <InputField
                label="Meal Name *"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="Grilled Chicken"
              />
              <div>
                <label style={S.label}>Type</label>
                <div style={{ display: "flex", gap: 8 }}>
                  {["veg", "non-veg"].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => set("mealType", t)}
                      style={{
                        flex: 1,
                        padding: "9px 6px",
                        borderRadius: 10,
                        border: `1px solid ${form.mealType === t ? "rgba(249,115,22,0.45)" : "rgba(255,255,255,0.09)"}`,
                        background:
                          form.mealType === t
                            ? "rgba(249,115,22,0.15)"
                            : "rgba(255,255,255,0.04)",
                        color:
                          form.mealType === t
                            ? "#fb923c"
                            : "rgba(107,114,128,1)",
                        fontSize: 11,
                        fontWeight: 700,
                        cursor: "pointer",
                        fontFamily: "inherit",
                        textTransform: "capitalize",
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <InputField
                label="Calories (kcal)"
                type="number"
                value={form.calories}
                onChange={(e) => set("calories", e.target.value)}
                placeholder="500"
              />
              <InputField
                label="Category"
                value={form.type}
                onChange={(e) => set("type", e.target.value)}
                placeholder="protein/carbs/fat"
              />
              <InputField
                label="Protein (g)"
                type="number"
                value={form.protein}
                onChange={(e) => set("protein", e.target.value)}
                placeholder="30"
              />
              <InputField
                label="Carbs (g)"
                type="number"
                value={form.carbs}
                onChange={(e) => set("carbs", e.target.value)}
                placeholder="50"
              />
              <InputField
                label="Fats (g)"
                type="number"
                value={form.fats}
                onChange={(e) => set("fats", e.target.value)}
                placeholder="10"
              />
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
                    Logging...
                  </>
                ) : (
                  <>
                    <Check size={13} />
                    Log Meal
                  </>
                )}
              </GradientBtn>
            </div>
          </GlassCard>
        )}
        {items.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
              gap: 14,
              marginBottom: 20,
            }}
          >
            <StatCard
              icon={Flame}
              label="Total Calories"
              value={Math.round(sum(items, "calories")).toLocaleString()}
              unit="kcal"
              color="from-orange-500 to-red-500"
            />
            <StatCard
              icon={Zap}
              label="Protein"
              value={sum(items, "protein").toFixed(1)}
              unit="g"
              color="from-cyan-500 to-blue-600"
            />
            <StatCard
              icon={Activity}
              label="Carbs"
              value={sum(items, "carbs").toFixed(1)}
              unit="g"
              color="from-amber-500"
            />
            <StatCard
              icon={Droplets}
              label="Fats"
              value={sum(items, "fats").toFixed(1)}
              unit="g"
              color="from-violet-500 to-purple-600"
            />
          </div>
        )}
        {loading ? (
          <SkeletonGrid count={3} />
        ) : err ? (
          <ApiError message={err} onRetry={load} />
        ) : items.length === 0 ? (
          <EmptyState
            icon={Utensils}
            message="No meals logged yet. Start tracking your nutrition!"
          />
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))",
              gap: 16,
            }}
          >
            {items.map((m, i) => (
              <GlassCard
                key={m.id || i}
                style={{
                  padding: 20,
                  display: "flex",
                  flexDirection: "column",
                  cursor: "pointer",
                }}
                onClick={() => navigate(`/meals/detail?id=${m.id}`)}
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
                      background: "rgba(249,115,22,0.15)",
                      border: "1px solid rgba(249,115,22,0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Utensils size={15} color="#fb923c" />
                  </div>
                  <div
                    style={{
                      background:
                        m.mealType === "veg"
                          ? "rgba(52,211,153,0.15)"
                          : "rgba(248,113,113,0.15)",
                      color: m.mealType === "veg" ? "#34d399" : "#f87171",
                      padding: "4px 12px",
                      borderRadius: 20,
                      fontSize: 10,
                      fontWeight: 700,
                      textTransform: "capitalize",
                    }}
                  >
                    {m.mealType}
                  </div>
                </div>
                <h3
                  style={{
                    color: "#fff",
                    fontWeight: 800,
                    fontSize: 14,
                    margin: "0 0 4px",
                  }}
                >
                  {m.name}
                </h3>
                <div
                  style={{
                    color: "#fb923c",
                    fontSize: 12,
                    fontWeight: 700,
                    marginBottom: 8,
                  }}
                >
                  {m.calories} kcal
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 8,
                    marginBottom: 10,
                    fontSize: 11,
                  }}
                >
                  <div
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      borderRadius: 8,
                      padding: 8,
                    }}
                  >
                    <div style={{ color: "rgba(107,114,128,1)", fontSize: 10 }}>
                      Protein
                    </div>
                    <div
                      style={{
                        color: "#67e8f9",
                        fontWeight: 700,
                        marginTop: 2,
                      }}
                    >
                      {m.protein}g
                    </div>
                  </div>
                  <div
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      borderRadius: 8,
                      padding: 8,
                    }}
                  >
                    <div style={{ color: "rgba(107,114,128,1)", fontSize: 10 }}>
                      Carbs
                    </div>
                    <div
                      style={{
                        color: "#fbbf24",
                        fontWeight: 700,
                        marginTop: 2,
                      }}
                    >
                      {m.carbs}g
                    </div>
                  </div>
                </div>
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
                  High protein meal
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
