import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Brain,
  Target,
  Activity,
  Shield,
  Zap,
  ArrowRight,
  ChevronDown,
  Dumbbell,
  Star,
  TrendingUp,
  Cpu,
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
import GlassCard from "../components/ui/GlassCard";
import GradientBtn from "../components/ui/GradientBtn";
import { demoWeightData, testimonials } from "../data/mockData";
import "./LandingPage.css";

const FEATURES = [
  {
    icon: Brain,
    title: "AI-Generated Plans",
    desc: "Workout & diet plans built from your real body metrics.",
    color: "linear-gradient(135deg,#7c3aed,#4f46e5)",
  },
  {
    icon: Target,
    title: "Goal Tracking",
    desc: "Log weight, body fat, and muscle gain over time.",
    color: "linear-gradient(135deg,#06b6d4,#2563eb)",
  },
  {
    icon: Activity,
    title: "Smart Analytics",
    desc: "Visual charts for trends, calories, and performance.",
    color: "linear-gradient(135deg,#10b981,#059669)",
  },
  {
    icon: Shield,
    title: "Science-Backed",
    desc: "BMR, TDEE, and BMI calculations power every plan.",
    color: "linear-gradient(135deg,#f97316,#d97706)",
  },
];

export default function LandingPage() {
  const [vis, setVis] = useState(false);
  useEffect(() => {
    setTimeout(() => setVis(true), 80);
  }, []);

  return (
    <div className="landing-wrapper">
      {/* ── HERO ── */}
      <section className="landing-hero">
        <div className="landing-hero-bg-1" />
        <div className="landing-hero-bg-2" />

        <div className={`landing-hero-content ${vis ? "" : "fade-out"}`}>
          <div className="landing-hero-badge">
            <Cpu size={11} /> AI-Powered Fitness System
          </div>

          <h1 className="landing-hero-title">
            Train Smarter.
            <br />
            <span className="landing-hero-title-gradient">Live Stronger.</span>
          </h1>
          <p className="landing-hero-subtitle">
            Your personal AI trainer and nutritionist. Personalized workout
            plans, diet strategies, and real-time progress analytics.
          </p>
          <div className="landing-hero-buttons">
            <Link to="/register">
              <GradientBtn
                className="landing-hero-btn-primary"
                style={{ padding: "14px 32px", fontSize: 14 }}
              >
                Start Free Today <ArrowRight size={16} />
              </GradientBtn>
            </Link>
            <Link to="/login">
              <GradientBtn
                variant="outline"
                className="landing-hero-btn-secondary"
                style={{ padding: "14px 32px", fontSize: 14 }}
              >
                Sign In
              </GradientBtn>
            </Link>
          </div>
          <div className="landing-hero-stats">
            {[
              ["AI Plans", "Personalized"],
              ["BMI + TDEE", "Health Metrics"],
              ["Real API", "Live Backend"],
            ].map(([v, l]) => (
              <div key={l} className="landing-hero-stat">
                <div className="landing-hero-stat-value">{v}</div>
                <div className="landing-hero-stat-label">{l}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="landing-hero-scroll-hint">
          <ChevronDown size={22} />
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="landing-features">
        <div className="landing-features-wrapper">
          <div className="landing-features-header">
            <h2 className="landing-features-title">
              Everything You Need to{" "}
              <span className="landing-features-title-accent">Transform</span>
            </h2>
            <p className="landing-features-subtitle">
              One platform integrating AI, real APIs, and science-backed fitness
              planning.
            </p>
          </div>
          <div className="landing-features-grid">
            {FEATURES.map((f, i) => (
              <GlassCard key={i} className="landing-feature-card">
                <div
                  className="landing-feature-icon"
                  style={{ background: f.color }}
                >
                  <f.icon size={20} color="#fff" />
                </div>
                <h3 className="landing-feature-title">{f.title}</h3>
                <p className="landing-feature-desc">{f.desc}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY / CHART ── */}
      <section className="landing-why">
        <div className="landing-why-wrapper">
          <div>
            <h2>
              Why <span className="landing-why-accent">FitAI Pro</span> Works
            </h2>
            {[
              [
                "Personalized to YOU",
                "AI uses your body metrics, goals, and level for truly custom plans.",
              ],
              [
                "Adaptive Learning",
                "Generate new AI plans anytime as you progress and improve.",
              ],
              [
                "Complete Ecosystem",
                "Workouts, diet, meals, exercises, and progress — one dashboard.",
              ],
              [
                "Expert Validated",
                "Every recommendation grounded in BMR, TDEE, and BMI science.",
              ],
            ].map(([t, d]) => (
              <div key={t} className="landing-why-point">
                <div className="landing-why-bullet" />
                <div>
                  <div className="landing-why-title">{t}</div>
                  <div className="landing-why-desc">{d}</div>
                </div>
              </div>
            ))}
            <Link to="/register" className="landing-why-cta">
              <GradientBtn variant="green" style={{ fontSize: 13 }}>
                Start Your Journey <ArrowRight size={15} />
              </GradientBtn>
            </Link>
          </div>
          <GlassCard className="landing-chart-card" hover={false}>
            <div className="landing-chart-header">
              <TrendingUp size={16} color="#34d399" /> Sample Weight Progress
            </div>
            <div className="landing-chart-container">
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={demoWeightData}>
                  <defs>
                    <linearGradient id="wg" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="#10b981"
                        stopOpacity={0.25}
                      />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
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
                    stroke="#10b981"
                    strokeWidth={2}
                    fill="url(#wg)"
                    dot={{ fill: "#10b981", r: 3, strokeWidth: 0 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <p className="landing-chart-footer">
              <TrendingUp size={12} /> Down 4.8 kg in 8 weeks
            </p>
          </GlassCard>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="landing-testimonials">
        <div className="landing-testimonials-wrapper">
          <h2 className="landing-testimonials-title">
            Loved by{" "}
            <span className="landing-testimonials-accent">Athletes</span>
          </h2>
          <div className="landing-testimonials-grid">
            {testimonials.map((t, i) => (
              <GlassCard key={i} className="landing-testimonial-card">
                <div className="landing-testimonial-stars">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <Star
                      key={j}
                      size={13}
                      style={{ fill: "#fbbf24", color: "#fbbf24" }}
                    />
                  ))}
                </div>
                <p className="landing-testimonial-text">"{t.text}"</p>
                <div className="landing-testimonial-author">
                  <div className="landing-testimonial-avatar">{t.avatar}</div>
                  <div>
                    <div className="landing-testimonial-name">{t.name}</div>
                    <div className="landing-testimonial-role">{t.role}</div>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="landing-cta">
        <GlassCard className="landing-cta-wrapper" hover={false}>
          <div className="landing-cta-icon">
            <Zap size={24} color="#fff" />
          </div>
          <h2 className="landing-cta-title">Ready to Transform?</h2>
          <p className="landing-cta-subtitle">
            Get your AI-generated workout and diet plan in seconds.
          </p>
          <Link to="/register">
            <GradientBtn style={{ padding: "13px 32px", fontSize: 14 }}>
              Create Free Account <ArrowRight size={15} />
            </GradientBtn>
          </Link>
        </GlassCard>
      </section>

      {/* ── FOOTER ── */}
      <footer
        style={{
          padding: "26px 24px",
          borderTop: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                background: "linear-gradient(135deg,#7c3aed,#4f46e5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Dumbbell size={13} color="#fff" />
            </div>
            <span style={{ fontWeight: 900, color: "#fff", fontSize: 14 }}>
              FitAI Pro
            </span>
          </div>
          <div style={{ color: "rgba(75,85,99,1)", fontSize: 12 }}>
            © 2025 FitAI Pro · AI Gym Trainer & Diet Planner
          </div>
        </div>
      </footer>
    </div>
  );
}
