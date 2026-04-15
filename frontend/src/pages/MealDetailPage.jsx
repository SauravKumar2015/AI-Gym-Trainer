import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Utensils,
  Flame,
  Activity,
  Zap,
  Trash2,
} from "lucide-react";
import { useToast } from "../hooks/useToast";
import { dietService } from "../services/dietService";
import GradientBtn from "../components/ui/GradientBtn";
import Spinner from "../components/ui/Spinner";

export default function MealDetailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const mealId = searchParams.get("id");

  const toast = useToast();
  const [meal, setMeal] = useState(null);
  const [tips, setTips] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tipsLoading, setTipsLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const loadMeal = async () => {
      try {
        const allMeals = await dietService.getAllMeals();
        const found = allMeals.find((m) => m.id === mealId);
        setMeal(found || null);
      } catch (e) {
        console.error("Failed to load meal:", e);
      } finally {
        setLoading(false);
      }
    };

    loadMeal();
  }, [mealId]);

  useEffect(() => {
    if (meal) {
      const loadTips = async () => {
        try {
          const protein = meal.protein || 20;
          const carbs = meal.carbs || 40;
          const fats = meal.fats || 15;
          const url = `/api/ai/tips/meal?name=${encodeURIComponent(meal.name)}&protein=${protein}&carbs=${carbs}&fats=${fats}`;
          const response = await fetch(url, { method: "POST" });
          if (response.ok) {
            const data = await response.json();
            setTips(
              data.tips || [
                "Eat mindfully and chew thoroughly for better digestion",
                "Pair this meal with adequate water intake",
                "Consider the timing - meals closer to workouts provide better energy",
                "Balance this meal with vegetables for fiber and micronutrients",
                "Track your intake consistently for best results",
              ],
            );
          }
        } catch (e) {
          console.error("Failed to load tips:", e);
          setTips([
            "Eat mindfully and chew thoroughly for better digestion",
            "Pair this meal with adequate water intake",
            "Consider the timing - meals closer to workouts provide better energy",
            "Balance this meal with vegetables for fiber and micronutrients",
            "Track your intake consistently for best results",
          ]);
        } finally {
          setTipsLoading(false);
        }
      };

      loadTips();
    }
  }, [meal]);

  const handleDelete = async () => {
    if (!window.confirm("Delete this meal? This cannot be undone.")) {
      return;
    }

    setDeleting(true);
    try {
      await dietService.deleteMeal(mealId);
      toast("Meal deleted successfully", "success");
      navigate("/meals");
    } catch (e) {
      toast("Failed to delete meal: " + e.message, "error");
    } finally {
      setDeleting(false);
    }
  };

  const S = {
    page: {
      minHeight: "100vh",
      padding: "76px 24px 48px",
      background: "#060611",
      animation: "fadeUp 0.4s ease both",
    },
    section: {
      marginBottom: 24,
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.09)",
      borderRadius: 12,
      padding: 20,
    },
    title: { color: "#fff", fontWeight: 900, fontSize: 24, marginBottom: 8 },
    label: {
      color: "rgba(156,163,175,1)",
      fontSize: 11,
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: "0.08em",
      marginBottom: 8,
    },
    value: { color: "rgba(107,114,128,1)", fontSize: 14, lineHeight: 1.6 },
  };

  if (loading) {
    return (
      <div style={S.page}>
        <div
          style={{
            maxWidth: 800,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 400,
          }}
        >
          <Spinner size={32} />
        </div>
      </div>
    );
  }

  if (!meal) {
    return (
      <div style={S.page}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <button
            onClick={() => navigate("/meals")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              color: "#fb923c",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 700,
              marginBottom: 24,
            }}
          >
            <ArrowLeft size={16} /> Back to Meals
          </button>
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <p style={{ color: "rgba(107,114,128,1)", fontSize: 16 }}>
              Meal not found
            </p>
          </div>
        </div>
      </div>
    );
  }

  const isVeg = meal.mealType === "veg";
  const caloriesFromProtein = meal.protein * 4;
  const caloriesFromCarbs = meal.carbs * 4;
  const caloriesFromFats = meal.fats * 9;
  const totalCalcCals =
    caloriesFromProtein + caloriesFromCarbs + caloriesFromFats;

  return (
    <div style={S.page}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 24,
          }}
        >
          <button
            onClick={() => navigate("/meals")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              color: "#fb923c",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 700,
            }}
          >
            <ArrowLeft size={16} /> Back to Meals
          </button>
        </div>

        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 16,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              width: 50,
              height: 50,
              borderRadius: 12,
              background: "rgba(249,115,22,0.15)",
              border: "1px solid rgba(249,115,22,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Utensils size={24} color="#fb923c" />
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={{ ...S.title, margin: 0 }}>{meal.name}</h1>
            <div
              style={{
                display: "flex",
                gap: 12,
                alignItems: "center",
                marginTop: 8,
              }}
            >
              <div
                style={{
                  background: isVeg
                    ? "rgba(52,211,153,0.15)"
                    : "rgba(248,113,113,0.15)",
                  color: isVeg ? "#34d399" : "#f87171",
                  padding: "4px 12px",
                  borderRadius: 20,
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: "capitalize",
                }}
              >
                {meal.mealType}
              </div>
              <span style={{ color: "#fb923c", fontSize: 14, fontWeight: 700 }}>
                {meal.calories} kcal
              </span>
            </div>
          </div>
        </div>

        {/* Macro Nutrients */}
        <div
          style={{
            ...S.section,
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(249,115,22,0.2)",
          }}
        >
          <div style={S.label}>📊 Macronutrients</div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 12,
            }}
          >
            <div
              style={{
                background: "rgba(102,187,249,0.15)",
                borderRadius: 10,
                padding: 16,
                textAlign: "center",
              }}
            >
              <div style={{ color: "#67e8f9", fontWeight: 900, fontSize: 20 }}>
                {meal.protein}g
              </div>
              <div
                style={{
                  color: "rgba(107,114,128,1)",
                  fontSize: 11,
                  marginTop: 4,
                }}
              >
                Protein
              </div>
              <div
                style={{
                  color: "#67e8f9",
                  fontSize: 10,
                  marginTop: 8,
                  opacity: 0.8,
                }}
              >
                {Math.round((caloriesFromProtein / (totalCalcCals || 1)) * 100)}
                %
              </div>
            </div>
            <div
              style={{
                background: "rgba(251,191,36,0.15)",
                borderRadius: 10,
                padding: 16,
                textAlign: "center",
              }}
            >
              <div style={{ color: "#fbbf24", fontWeight: 900, fontSize: 20 }}>
                {meal.carbs}g
              </div>
              <div
                style={{
                  color: "rgba(107,114,128,1)",
                  fontSize: 11,
                  marginTop: 4,
                }}
              >
                Carbs
              </div>
              <div
                style={{
                  color: "#fbbf24",
                  fontSize: 10,
                  marginTop: 8,
                  opacity: 0.8,
                }}
              >
                {Math.round((caloriesFromCarbs / (totalCalcCals || 1)) * 100)}%
              </div>
            </div>
            <div
              style={{
                background: "rgba(167,139,250,0.15)",
                borderRadius: 10,
                padding: 16,
                textAlign: "center",
              }}
            >
              <div style={{ color: "#a78bfa", fontWeight: 900, fontSize: 20 }}>
                {meal.fats}g
              </div>
              <div
                style={{
                  color: "rgba(107,114,128,1)",
                  fontSize: 11,
                  marginTop: 4,
                }}
              >
                Fats
              </div>
              <div
                style={{
                  color: "#a78bfa",
                  fontSize: 10,
                  marginTop: 8,
                  opacity: 0.8,
                }}
              >
                {Math.round((caloriesFromFats / (totalCalcCals || 1)) * 100)}%
              </div>
            </div>
          </div>
        </div>

        {/* Calorie Breakdown */}
        <div style={S.section}>
          <div style={S.label}>🔥 Calorie Breakdown</div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 16,
            }}
          >
            <div style={{ flex: 1 }}>
              <div
                style={{
                  color: "rgba(107,114,128,1)",
                  fontSize: 12,
                  marginBottom: 6,
                }}
              >
                Total Calories
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <div
                  style={{
                    background: "rgba(102,187,249,0.2)",
                    borderRadius: 8,
                    padding: "8px 12px",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{ color: "#67e8f9", fontSize: 11, fontWeight: 700 }}
                  >
                    Protein: {Math.round(caloriesFromProtein)}
                  </div>
                </div>
                <div
                  style={{
                    background: "rgba(251,191,36,0.2)",
                    borderRadius: 8,
                    padding: "8px 12px",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{ color: "#fbbf24", fontSize: 11, fontWeight: 700 }}
                  >
                    Carbs: {Math.round(caloriesFromCarbs)}
                  </div>
                </div>
                <div
                  style={{
                    background: "rgba(167,139,250,0.2)",
                    borderRadius: 8,
                    padding: "8px 12px",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{ color: "#a78bfa", fontSize: 11, fontWeight: 700 }}
                  >
                    Fats: {Math.round(caloriesFromFats)}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            style={{
              background: "rgba(249,115,22,0.1)",
              border: "1px solid rgba(249,115,22,0.2)",
              borderRadius: 8,
              padding: 12,
            }}
          >
            <div style={{ color: "#fb923c", fontWeight: 900, fontSize: 18 }}>
              {meal.calories} kcal
            </div>
            <div
              style={{
                color: "rgba(107,114,128,1)",
                fontSize: 11,
                marginTop: 4,
              }}
            >
              Reported Calories
            </div>
          </div>
        </div>

        {/* Meal Type & Category */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
            marginBottom: 24,
          }}
        >
          <div style={S.section}>
            <div style={S.label}>Type</div>
            <div
              style={{
                color: isVeg ? "#34d399" : "#f87171",
                fontSize: 16,
                fontWeight: 900,
                textTransform: "capitalize",
              }}
            >
              {meal.mealType}
            </div>
          </div>
          {meal.type && (
            <div style={S.section}>
              <div style={S.label}>Category</div>
              <div
                style={{
                  color: "#fb923c",
                  fontSize: 16,
                  fontWeight: 900,
                  textTransform: "capitalize",
                }}
              >
                {meal.type}
              </div>
            </div>
          )}
        </div>

        {/* AI Tips */}
        <div style={S.section}>
          <div style={S.label}>🎯 General Tips</div>
          {tipsLoading ? (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Spinner size={16} />
              <span style={{ color: "rgba(107,114,128,1)", fontSize: 13 }}>
                Loading AI tips...
              </span>
            </div>
          ) : tips && Array.isArray(tips) ? (
            <ul
              style={{
                color: "rgba(107,114,128,1)",
                fontSize: 14,
                lineHeight: 1.8,
                margin: 0,
                paddingLeft: 20,
              }}
            >
              {tips.map((tip, i) => (
                <li key={i} style={{ marginBottom: 6 }}>
                  {tip}
                </li>
              ))}
            </ul>
          ) : tips ? (
            <p style={{ ...S.value, margin: 0, whiteSpace: "pre-wrap" }}>
              {tips}
            </p>
          ) : (
            <ul
              style={{
                color: "rgba(107,114,128,1)",
                fontSize: 14,
                lineHeight: 1.8,
                margin: 0,
                paddingLeft: 20,
              }}
            >
              <li>Eat mindfully and chew thoroughly for better digestion</li>
              <li>Pair this meal with adequate water intake</li>
              <li>
                Consider the timing - meals closer to workouts provide better
                energy
              </li>
              <li>
                Balance this meal with vegetables for fiber and micronutrients
              </li>
              <li>Track your intake consistently for best results</li>
            </ul>
          )}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            marginTop: 20,
          }}
        >
          <GradientBtn
            onClick={handleDelete}
            disabled={deleting}
            variant="red"
            style={{ fontSize: 12, padding: "9px 14px" }}
          >
            {deleting ? (
              "Deleting..."
            ) : (
              <>
                <Trash2 size={13} /> Delete Meal
              </>
            )}
          </GradientBtn>
        </div>
      </div>
    </div>
  );
}
