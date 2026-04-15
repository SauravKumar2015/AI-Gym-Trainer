import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Dumbbell, Zap, Trash2 } from "lucide-react";
import { useToast } from "../hooks/useToast";
import { workoutService } from "../services/workoutService";
import { aiService } from "../services/aiService";
import GradientBtn from "../components/ui/GradientBtn";
import Spinner from "../components/ui/Spinner";

export default function WorkoutDetailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const workoutId = searchParams.get("id");

  const toast = useToast();
  const [workout, setWorkout] = useState(null);
  const [tips, setTips] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tipsLoading, setTipsLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const dayExercises = {
    Monday: [
      "Bench Press (3x8-10)",
      "Overhead Press (3x8-10)",
      "Incline Dumbbell Press (3x8-10)",
      "Lateral Raises (3x12)",
      "Tricep Dips (3x8-10)",
    ],
    Tuesday: [
      "Deadlifts (3x8-10)",
      "Pull-ups / Lat Pulldown (3x8-10)",
      "Barbell Rows (3x8-10)",
      "Face Pulls (3x12)",
      "Barbell Curls (3x10)",
    ],
    Wednesday: [
      "Squats (3x8-10)",
      "Romanian Deadlifts (3x8-10)",
      "Leg Press (3x10)",
      "Leg Curls (3x12)",
      "Calf Raises (4x15)",
    ],
    Thursday: [
      "Rest & Recovery",
      "Stretching & Hydration",
      "Light mobility work",
    ],
    Friday: [
      "Dumbbell Bench Press (3x10-12)",
      "Arnold Press (3x10)",
      "Cable Flyes (3x12)",
      "Skull Crushers (3x10)",
    ],
    Saturday: [
      "T-Bar Rows (3x10)",
      "Seated Cable Rows (3x12)",
      "Hammer Curls (3x10)",
      "Reverse Curls (3x12)",
    ],
    Sunday: [
      "Rest & Recovery",
      "Stretching & Hydration",
      "Light mobility work",
    ],
  };

  useEffect(() => {
    const loadWorkout = async () => {
      try {
        const allWorkouts = await workoutService.getAll();
        const found = allWorkouts.find((w) => w.id === workoutId);
        setWorkout(found || null);
      } catch (e) {
        console.error("Failed to load workout:", e);
      } finally {
        setLoading(false);
      }
    };

    loadWorkout();
  }, [workoutId]);

  useEffect(() => {
    if (workout) {
      const loadTips = async () => {
        try {
          const response = await fetch(
            `/api/ai/tips/workout?title=${encodeURIComponent(workout.title)}`,
            { method: "POST" },
          );
          const data = await response.json();
          console.log("Workout tips response:", response.status, data);
          if (!response.ok) {
            console.error("Error response:", data);
            setTips({
              tips: [
                "Focus on proper form",
                "Rest between sets",
                "Track progress",
                "Progressive overload is key",
                "Warm up properly",
              ],
            });
          } else {
            setTips(data);
          }
        } catch (e) {
          console.error("Failed to load tips:", e);
          setTips({
            tips: [
              "Focus on proper form",
              "Rest between sets",
              "Track progress",
              "Progressive overload is key",
              "Warm up properly",
            ],
          });
        } finally {
          setTipsLoading(false);
        }
      };
      loadTips();
    }
  }, [workout]);

  const handleDelete = async () => {
    if (!window.confirm("Delete this workout? This cannot be undone.")) {
      return;
    }

    setDeleting(true);
    try {
      await workoutService.deleteWorkout(workoutId);
      toast("Workout deleted successfully", "success");
      navigate("/workouts");
    } catch (e) {
      toast("Failed to delete workout: " + e.message, "error");
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

  if (!workout) {
    return (
      <div
        style={{
          minHeight: "100vh",
          padding: "76px 24px",
          background: "#060611",
          color: "#fff",
        }}
      >
        Workout not found
      </div>
    );
  }

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
            onClick={() => navigate("/workouts")}
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
              {workout.title}
            </h1>
            <p
              style={{
                color: "#a78bfa",
                fontSize: 14,
                fontWeight: 700,
                margin: "4px 0 0",
              }}
            >
              {workout.goal}
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
              Duration
            </div>
            <div style={{ color: "#a78bfa", fontSize: 28, fontWeight: 900 }}>
              {workout.durationWeeks} weeks
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
              Difficulty
            </div>
            <div style={{ color: "#c4b5fd", fontSize: 28, fontWeight: 900 }}>
              {workout.difficulty}
            </div>
          </div>
        </div>

        {/* Description */}
        {workout.description && (
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
              {workout.description}
            </p>
          </div>
        )}

        {/* Weekly Schedule */}
        <div style={{ marginBottom: 32 }}>
          <h2
            style={{
              color: "#c4b5fd",
              fontSize: 20,
              fontWeight: 700,
              marginBottom: 16,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            📅 Weekly Schedule
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 16,
            }}
          >
            {days.map((day) => (
              <div
                key={day}
                style={{
                  background: "rgba(255,255,255,0.06)",
                  borderRadius: 12,
                  padding: 20,
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <h3
                  style={{
                    color: "#a78bfa",
                    fontSize: 14,
                    fontWeight: 700,
                    marginBottom: 12,
                    textTransform: "uppercase",
                  }}
                >
                  {day}
                </h3>
                <ul
                  style={{
                    margin: 0,
                    padding: "0 0 0 16px",
                    color: "rgba(209,213,219,1)",
                    fontSize: 13,
                    lineHeight: 2,
                  }}
                >
                  {dayExercises[day].map((ex, i) => (
                    <li key={i}>{ex}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* AI Tips */}
        <div style={{ marginBottom: 32 }}>
          <h2
            style={{
              color: "#c4b5fd",
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
                background: "rgba(124,58,237,0.1)",
                borderRadius: 12,
                padding: 20,
                border: "1px solid rgba(124,58,237,0.3)",
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
                    color: "rgba(209,213,128,1)",
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
                <Trash2 size={13} /> Delete Workout
              </>
            )}
          </GradientBtn>
        </div>
      </div>
    </div>
  );
}
