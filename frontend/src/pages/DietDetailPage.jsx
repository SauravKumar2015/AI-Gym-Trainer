import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Apple, Trash2 } from "lucide-react";
import { useToast } from "../hooks/useToast";
import { dietService } from "../services/dietService";
import GradientBtn from "../components/ui/GradientBtn";
import Spinner from "../components/ui/Spinner";

export default function DietDetailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dietId = searchParams.get("id");

  const toast = useToast();
  const [diet, setDiet] = useState(null);
  const [tips, setTips] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tipsLoading, setTipsLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

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

  const mealBreakdown = (dailyCalories) => ({
    breakfast: {
      name: "Breakfast",
      calories: Math.floor(dailyCalories * 0.25),
      emoji: "🟠",
      items: ["Oats with fruits", "Eggs & toast", "Greek yogurt", "Milk"],
    },
    lunch: {
      name: "Lunch",
      calories: Math.floor(dailyCalories * 0.35),
      emoji: "🟡",
      items: ["Grilled chicken", "Brown rice", "Vegetables", "Olive oil"],
    },
    dinner: {
      name: "Dinner",
      calories: Math.floor(dailyCalories * 0.3),
      emoji: "🌙",
      items: ["Salmon/Fish", "Sweet potato", "Broccoli", "Salad"],
    },
    snacks: {
      name: "Snacks",
      calories: Math.floor(dailyCalories * 0.1),
      emoji: "🍎",
      items: ["Almonds", "Protein shake", "Banana", "Peanut butter"],
    },
  });

  useEffect(() => {
    const loadDiet = async () => {
      try {
        const allDiets = await dietService.getAllDiets();
        const found = allDiets.find((d) => d.id === dietId);
        setDiet(found || null);
      } catch (e) {
        console.error("Failed to load diet:", e);
      } finally {
        setLoading(false);
      }
    };

    loadDiet();
  }, [dietId]);

  useEffect(() => {
    if (diet) {
      const loadTips = async () => {
        try {
          const response = await fetch(
            `/api/ai/tips/diet?title=${encodeURIComponent(diet.title)}`,
            { method: "POST" },
          );
          const data = await response.json();
          console.log("Diet tips response:", response.status, data);
          if (!response.ok) {
            console.error("Error response:", data);
            setTips({
              tips: [
                "Prepare meals in advance",
                "Stay hydrated throughout the day",
                "Track macros weekly",
                "Balance carbs and protein",
                "Plan meals around workouts",
              ],
            });
          } else {
            setTips(data);
          }
        } catch (e) {
          console.error("Failed to load tips:", e);
          setTips({
            tips: [
              "Prepare meals in advance",
              "Stay hydrated throughout the day",
              "Track macros weekly",
              "Balance carbs and protein",
              "Plan meals around workouts",
            ],
          });
        } finally {
          setTipsLoading(false);
        }
      };
      loadTips();
    }
  }, [diet]);

  const handleDelete = async () => {
    if (
      !window.confirm("Delete this diet plan? This action cannot be undone.")
    ) {
      return;
    }

    setDeleting(true);
    try {
      await dietService.deleteDiet(dietId);
      toast("Diet deleted successfully", "success");
      navigate("/diet");
    } catch (e) {
      toast("Failed to delete diet: " + e.message, "error");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Spinner size={24} />
      </div>
    );
  }

  if (!diet) {
    return (
      <div
        style={{
          minHeight: "100vh",
          padding: "76px 24px",
          background: "#060611",
          color: "#fff",
        }}
      >
        Diet not found
      </div>
    );
  }

  const ts = typeStyle(diet.dietType);
  const meals = mealBreakdown(diet.dailyCalories);

  return (
    <div
      style={{
        minHeight: "100vh",
        paddingTop: 76,
        paddingBottom: 48,
        background: "#060611",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 32,
          }}
        >
          <button
            onClick={() => navigate("/diet")}
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "none",
              borderRadius: 10,
              width: 40,
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#fff",
            }}
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1
              style={{
                fontSize: 32,
                fontWeight: 900,
                color: "#fff",
                margin: 0,
              }}
            >
              {diet.title}
            </h1>
            <p
              style={{
                color: ts.c,
                fontSize: 14,
                fontWeight: 700,
                margin: "4px 0 0",
              }}
            >
              {diet.goal}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 16,
            marginBottom: 32,
          }}
        >
          <div
            style={{
              background: "rgba(255,255,255,0.06)",
              borderRadius: 12,
              padding: 20,
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <div
              style={{
                color: "rgba(107,114,128,1)",
                fontSize: 11,
                fontWeight: 700,
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              Daily Calories
            </div>
            <div style={{ color: "#fb923c", fontSize: 28, fontWeight: 900 }}>
              {diet.dailyCalories}
            </div>
          </div>
          <div
            style={{
              background: "rgba(255,255,255,0.06)",
              borderRadius: 12,
              padding: 20,
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <div
              style={{
                color: "rgba(107,114,128,1)",
                fontSize: 11,
                fontWeight: 700,
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              Diet Type
            </div>
            <div style={{ color: ts.c, fontSize: 28, fontWeight: 900 }}>
              {diet.dietType || "Custom"}
            </div>
          </div>
        </div>

        {/* Description */}
        {diet.description && (
          <div
            style={{
              background: "rgba(255,255,255,0.06)",
              borderRadius: 12,
              padding: 20,
              marginBottom: 32,
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <p
              style={{
                color: "rgba(209,213,219,1)",
                fontSize: 14,
                lineHeight: 1.8,
                margin: 0,
              }}
            >
              {diet.description}
            </p>
          </div>
        )}

        {/* Daily Meal Plan */}
        <div style={{ marginBottom: 32 }}>
          <h2
            style={{
              color: "#34d399",
              fontSize: 20,
              fontWeight: 700,
              marginBottom: 16,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            🍽️ Daily Meal Plan
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 16,
            }}
          >
            {["breakfast", "lunch", "dinner", "snacks"].map((mealKey) => {
              const meal = meals[mealKey];
              return (
                <div
                  key={mealKey}
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    borderRadius: 12,
                    padding: 20,
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 12,
                    }}
                  >
                    <div
                      style={{
                        color: "#34d399",
                        fontWeight: 700,
                        fontSize: 14,
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <span style={{ fontSize: 18 }}>{meal.emoji}</span>
                      {meal.name}
                    </div>
                    <div
                      style={{
                        color: "#fb923c",
                        fontWeight: 700,
                        fontSize: 13,
                      }}
                    >
                      {meal.calories} kcal
                    </div>
                  </div>
                  <ul
                    style={{
                      margin: 0,
                      padding: "0 0 0 16px",
                      color: "rgba(209,213,219,1)",
                      fontSize: 13,
                      lineHeight: 1.8,
                    }}
                  >
                    {meal.items.map((item, i) => (
                      <li key={i}>• {item}</li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Tips */}
        <div>
          <h2
            style={{
              color: "#34d399",
              fontSize: 20,
              fontWeight: 700,
              marginBottom: 16,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            🎯 General Tips
          </h2>
          {tipsLoading ? (
            <div style={{ textAlign: "center", padding: "40px" }}>
              <Spinner size={20} />
            </div>
          ) : (
            <div
              style={{
                background: "rgba(16,185,129,0.1)",
                borderRadius: 12,
                padding: 20,
                border: "1px solid rgba(16,185,129,0.3)",
              }}
            >
              {tips && Array.isArray(tips.tips) && tips.tips.length > 0 ? (
                <ul
                  style={{
                    margin: 0,
                    padding: "0 0 0 24px",
                    color: "rgba(209,213,219,1)",
                    fontSize: 13,
                    lineHeight: 1.8,
                  }}
                >
                  {tips.tips.map((tip, i) => (
                    <li key={i} style={{ marginBottom: 8 }}>
                      {tip}
                    </li>
                  ))}
                </ul>
              ) : (
                <p
                  style={{
                    color: "rgba(107,114,128,1)",
                    fontSize: 13,
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  No tips available
                </p>
              )}
            </div>
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
                <Trash2 size={13} /> Delete Diet
              </>
            )}
          </GradientBtn>
        </div>
      </div>
    </div>
  );
}
