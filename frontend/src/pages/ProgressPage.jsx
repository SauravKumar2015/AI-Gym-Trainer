import { useState, useEffect, useCallback } from "react";
import {
  TrendingUp,
  Scale,
  Activity,
  Calendar,
  Plus,
  Check,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../hooks/useToast";
import { dietService } from "../services/dietService";
import GlassCard from "../components/ui/GlassCard";
import GradientBtn from "../components/ui/GradientBtn";
import StatCard from "../components/ui/StatCard";
import InputField from "../components/ui/InputField";
import Spinner from "../components/ui/Spinner";

const INIT = { weight: "", bodyFatPercentage: "", muscleGain: "", notes: "" };
export default function ProgressPage() {
  const { user } = useAuth();
  const toast = useToast();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [logging, setLogging] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(INIT);
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await dietService.getProgressHistory(user.id);
      setHistory(data);
      if (data.length === 0) setShowForm(true);
    } catch (e) {
      setHistory([]);
      setShowForm(true);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);
  useEffect(() => {
    if (user) load();
  }, [user, load]);
  const handleLog = async () => {
    if (!form.weight) {
      toast("Weight required", "error");
      return;
    }
    setLogging(true);
    try {
      await dietService.logProgress({
        userId: user.id,
        weight: parseFloat(form.weight),
        bodyFatPercentage: parseFloat(form.bodyFatPercentage) || 0,
        muscleGain: parseFloat(form.muscleGain) || 0,
        notes: form.notes,
      });
      toast("Progress logged! 📊", "success");
      setShowForm(false);
      setForm(INIT);
      load();
    } catch (e) {
      toast("Failed: " + e.message, "error");
    } finally {
      setLogging(false);
    }
  };
  const latest = history[history.length - 1];
  const chart = history.map((h, i) => ({
    date: h.recordDate || `#${i + 1}`,
    weight: h.weight,
    fat: h.bodyFatPercentage,
  }));
  const S = {
    page: {
      minHeight: "100vh",
      padding: "76px 24px 48px",
      background: "#060611",
      animation: "fadeUp 0.4s ease both",
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
              Progress <span style={{ color: "#67e8f9" }}>Tracking</span>
            </h1>
            <p
              style={{
                fontSize: 11,
                color: "rgba(107,114,128,1)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Your fitness journey
            </p>
          </div>
          <GradientBtn
            onClick={() => setShowForm(!showForm)}
            variant="cyan"
            style={{ fontSize: 12, padding: "9px 16px" }}
          >
            <Plus size={13} />
            {showForm
              ? "Cancel"
              : history.length > 0
                ? "Log Progress"
                : "Start Logging"}
          </GradientBtn>
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
              Log Today's Progress
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
                gap: 14,
              }}
            >
              <InputField
                label="Weight (kg) *"
                type="number"
                value={form.weight}
                onChange={(e) => set("weight", e.target.value)}
                placeholder="75.5"
              />
              <InputField
                label="Body Fat %"
                type="number"
                value={form.bodyFatPercentage}
                onChange={(e) => set("bodyFatPercentage", e.target.value)}
                placeholder="18.5"
              />
              <InputField
                label="Muscle Gain (kg)"
                type="number"
                value={form.muscleGain}
                onChange={(e) => set("muscleGain", e.target.value)}
                placeholder="2.5"
              />
              <InputField
                label="Notes"
                value={form.notes}
                onChange={(e) => set("notes", e.target.value)}
                placeholder="Good progress!"
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
                onClick={handleLog}
                disabled={logging}
                variant="cyan"
                style={{ fontSize: 12, padding: "9px 18px" }}
              >
                {logging ? (
                  <>
                    <Spinner size={13} />
                    Logging...
                  </>
                ) : (
                  <>
                    <Check size={13} />
                    Log Progress
                  </>
                )}
              </GradientBtn>
            </div>
          </GlassCard>
        )}
        {history.length > 0 && latest && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
              gap: 14,
              marginBottom: 20,
            }}
          >
            <StatCard
              icon={Scale}
              label="Latest Weight"
              value={latest.weight}
              unit="kg"
              color="from-violet-500 to-purple-600"
            />
            <StatCard
              icon={TrendingUp}
              label="Body Fat"
              value={latest.bodyFatPercentage || "—"}
              unit="%"
              color="from-cyan-500 to-blue-600"
            />
            <StatCard
              icon={Activity}
              label="Muscle Gain"
              value={latest.muscleGain || "—"}
              unit="kg"
              color="from-emerald-500 to-green-600"
            />
            <StatCard
              icon={Calendar}
              label="Total Entries"
              value={history.length}
              unit=""
              color="from-orange-500 to-red-500"
            />
          </div>
        )}
        {loading ? (
          <div
            style={{
              height: 240,
              borderRadius: 16,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.06)",
              animation: "shimmer 1.8s infinite",
            }}
          />
        ) : history.length === 0 ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 16,
              padding: "48px 24px",
              borderRadius: 16,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.06)",
              textAlign: "center",
            }}
          >
            <TrendingUp size={48} color="#67e8f9" style={{ opacity: 0.6 }} />
            <div>
              <div
                style={{
                  color: "#fff",
                  fontWeight: 800,
                  fontSize: 16,
                  marginBottom: 8,
                }}
              >
                No Progress Yet
              </div>
              <div style={{ color: "rgba(107,114,128,1)", fontSize: 13 }}>
                Log your first entry to start tracking your fitness journey!
              </div>
            </div>
          </div>
        ) : (
          <>
            {chart.length > 1 && (
              <GlassCard
                style={{ padding: 24, marginBottom: 16 }}
                hover={false}
              >
                <div
                  style={{
                    color: "#fff",
                    fontWeight: 800,
                    fontSize: 14,
                    marginBottom: 16,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <TrendingUp size={15} color="#67e8f9" />
                  Weight Progress
                </div>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={chart}>
                    <defs>
                      <linearGradient id="pg" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="#06b6d4"
                          stopOpacity={0.25}
                        />
                        <stop
                          offset="95%"
                          stopColor="#06b6d4"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff07" />
                    <XAxis
                      dataKey="date"
                      stroke="#4b5563"
                      tick={{ fill: "#4b5563", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      stroke="#4b5563"
                      tick={{ fill: "#4b5563", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                      domain={["dataMin-1", "dataMax+1"]}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "#0a0a15",
                        border: "1px solid #ffffff15",
                        borderRadius: 12,
                        color: "#fff",
                        fontSize: 12,
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="weight"
                      stroke="#06b6d4"
                      strokeWidth={2}
                      fill="url(#pg)"
                      dot={{ fill: "#06b6d4", r: 3, strokeWidth: 0 }}
                      name="Weight (kg)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </GlassCard>
            )}
            <GlassCard style={{ padding: 24 }} hover={false}>
              <div
                style={{
                  color: "#fff",
                  fontWeight: 800,
                  fontSize: 14,
                  marginBottom: 16,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <Calendar size={15} color="#a78bfa" />
                Progress History
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  maxHeight: 360,
                  overflowY: "auto",
                  paddingRight: 4,
                }}
              >
                {[...history].reverse().map((e, i) => (
                  <div
                    key={e.id || i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "12px 14px",
                      borderRadius: 12,
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        background: "rgba(6,182,212,0.15)",
                        border: "1px solid rgba(6,182,212,0.2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 11,
                        fontWeight: 900,
                        color: "#67e8f9",
                        flexShrink: 0,
                      }}
                    >
                      {history.length - i}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{ color: "#fff", fontWeight: 700, fontSize: 12 }}
                      >
                        {e.recordDate || "—"}
                      </div>
                      {e.notes && (
                        <div
                          style={{
                            color: "rgba(107,114,128,1)",
                            fontSize: 11,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {e.notes}
                        </div>
                      )}
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div
                        style={{ color: "#fff", fontWeight: 900, fontSize: 15 }}
                      >
                        {e.weight} kg
                      </div>
                      {e.bodyFatPercentage > 0 && (
                        <div
                          style={{ color: "rgba(107,114,128,1)", fontSize: 11 }}
                        >
                          {e.bodyFatPercentage}% fat
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </>
        )}
      </div>
    </div>
  );
}
