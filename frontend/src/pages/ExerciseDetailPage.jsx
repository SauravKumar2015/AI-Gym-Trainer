import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Activity, Zap, Trash2 } from "lucide-react";
import { useToast } from "../hooks/useToast";
import { workoutService } from "../services/workoutService";
import Spinner from "../components/ui/Spinner";
import GradientBtn from "../components/ui/GradientBtn";

export default function ExerciseDetailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const exerciseId = searchParams.get("id");

  const toast = useToast();
  const [exercise, setExercise] = useState(null);
  const [tips, setTips] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tipsLoading, setTipsLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const loadExercise = async () => {
      try {
        const allExercises = await workoutService.getAllExercises();
        const found = allExercises.find((e) => e.id === exerciseId);
        setExercise(found || null);
      } catch (e) {
        console.error("Failed to load exercise:", e);
      } finally {
        setLoading(false);
      }
    };

    loadExercise();
  }, [exerciseId]);

  useEffect(() => {
    if (exercise) {
      const loadTips = async () => {
        try {
          const url = `/api/ai/tips/exercise?name=${encodeURIComponent(exercise.name)}&muscleGroup=${encodeURIComponent(exercise.muscleGroup || "General")}`;
          const response = await fetch(url, { method: "POST" });
          if (response.ok) {
            const data = await response.json();
            setTips(
              data.tips || [
                "Control the movement - avoid swinging",
                "Full range of motion for maximum benefit",
                "Rest 60-90 seconds between sets",
                "Maintain strict form before increasing weight",
                "Breathe properly - exhale on exertion",
              ],
            );
          }
        } catch (e) {
          console.error("Failed to load tips:", e);
          setTips([
            "Control the movement - avoid swinging",
            "Full range of motion for maximum benefit",
            "Rest 60-90 seconds between sets",
            "Maintain strict form before increasing weight",
            "Breathe properly - exhale on exertion",
          ]);
        } finally {
          setTipsLoading(false);
        }
      };

      loadTips();
    }
  }, [exercise]);

  const handleDelete = async () => {
    if (
      !window.confirm("Delete this exercise? This action cannot be undone.")
    ) {
      return;
    }

    setDeleting(true);
    try {
      await workoutService.deleteExercise(exerciseId);
      toast("Exercise deleted successfully", "success");
      navigate("/exercises");
    } catch (e) {
      toast("Failed to delete exercise: " + e.message, "error");
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

  if (!exercise) {
    return (
      <div style={S.page}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <button
            onClick={() => navigate("/exercises")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              color: "#67e8f9",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 700,
              marginBottom: 24,
            }}
          >
            <ArrowLeft size={16} /> Back to Exercises
          </button>
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <p style={{ color: "rgba(107,114,128,1)", fontSize: 16 }}>
              Exercise not found
            </p>
          </div>
        </div>
      </div>
    );
  }

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
            onClick={() => navigate("/exercises")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              color: "#67e8f9",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 700,
            }}
          >
            <ArrowLeft size={16} /> Back to Exercises
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
              background: "rgba(6,182,212,0.15)",
              border: "1px solid rgba(6,182,212,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Activity size={24} color="#67e8f9" />
          </div>
          <div>
            <h1 style={{ ...S.title, margin: 0 }}>{exercise.name}</h1>
            <p
              style={{
                color: "#67e8f9",
                fontSize: 14,
                fontWeight: 700,
                marginBottom: 8,
              }}
            >
              {exercise.muscleGroup}
            </p>
          </div>
        </div>

        {/* Quick Info */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
            marginBottom: 24,
          }}
        >
          <div style={S.section}>
            <div style={S.label}>Difficulty</div>
            <div style={{ color: "#67e8f9", fontSize: 18, fontWeight: 900 }}>
              {exercise.difficulty}
            </div>
          </div>
          {exercise.equipment && (
            <div style={S.section}>
              <div style={S.label}>Equipment</div>
              <div style={{ color: "#67e8f9", fontSize: 18, fontWeight: 900 }}>
                {exercise.equipment}
              </div>
            </div>
          )}
        </div>

        {/* Instructions */}
        {exercise.instructions && (
          <div style={S.section}>
            <div style={S.label}>📋 Instructions</div>
            <p style={{ ...S.value, margin: 0, whiteSpace: "pre-wrap" }}>
              {exercise.instructions}
            </p>
          </div>
        )}

        {/* Video URL */}
        {exercise.videoUrl && (
          <div style={S.section}>
            <div style={S.label}>🎥 Video Tutorial</div>
            <a
              href={exercise.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "#67e8f9",
                textDecoration: "underline",
                fontSize: 14,
                fontWeight: 700,
              }}
            >
              Watch Video
            </a>
          </div>
        )}

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
              <li>Always warm up before performing this exercise</li>
              <li>Focus on proper form over heavy weight</li>
              <li>Control both the concentric and eccentric phases</li>
              <li>Rest adequately between sets for optimal performance</li>
              <li>Consult a trainer if this is your first time</li>
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
                <Trash2 size={13} /> Delete Exercise
              </>
            )}
          </GradientBtn>
        </div>
      </div>
    </div>
  );
}
