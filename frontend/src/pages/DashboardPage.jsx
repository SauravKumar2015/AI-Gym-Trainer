import { useState, useEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Dumbbell, Apple, Flame, Target, Activity, TrendingUp, ChevronRight, Brain, Sparkles, Clock, RefreshCw, Zap } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../hooks/useToast'
import { dietService } from '../services/dietService'
import { workoutService } from '../services/workoutService'
import GlassCard from '../components/ui/GlassCard'
import GradientBtn from '../components/ui/GradientBtn'
import StatCard from '../components/ui/StatCard'
import DifficultyBadge from '../components/ui/DifficultyBadge'
import Spinner from '../components/ui/Spinner'
import { SkeletonCard } from '../components/ui/LoadingSkeleton'
import './DashboardPage.css'

// ── Premium Animated Hero Metric ──────────────────────────────────────────────────
const HeroMetric = ({ label, value, unit, loading, icon: Icon, gradient, gradientClass }) => {
  const displayValue = value ?? '—'
  const isNumeric = typeof displayValue === 'number'
  const progress = isNumeric ? Math.min((displayValue / 2500) * 100, 100) : 0

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className={`hero-metric ${gradientClass || 'gradient-orange'}`}>
        <div className="hero-metric-content">
          <div className="hero-metric-flex">
            <div className="hero-metric-text">
              <div className="hero-metric-label">{label}</div>
              {loading ? (
                <SkeletonCard h={44} />
              ) : (
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className="hero-metric-value"
                >
                  {displayValue}
                  {unit && <span className="unit">{unit}</span>}
                </motion.div>
              )}
              <p className="hero-metric-description">Your daily energy requirement</p>
            </div>

            {/* ┊ Animated icon */}
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              className="hero-metric-icon"
              style={{ background: gradient }}
            >
              {Icon && <Icon size={28} color="#fff" />}
            </motion.div>
          </div>

          {/* ┊ Animated progress bar */}
          {isNumeric && (
            <div className="hero-metric-progress">
              <div className="progress-bar">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
                  className="progress-fill"
                  style={{ background: gradient }}
                />
              </div>
              <span className="progress-percent">
                {Math.min(progress, 100).toFixed(0)}%
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// ── Premium Secondary Metrics Grid ───────────────────────────────────────────────
const PremiumMetricCard = ({ label, value, unit, loading, color = 'violet' }) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <div className={`metric-card color-${color}`}>
        <div className="metric-card-label">{label}</div>
        {loading ? (
          <SkeletonCard h={24} />
        ) : (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="metric-card-value"
          >
            {value ?? '—'}
            {unit && <span className="unit">{unit}</span>}
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

// ── Enhanced Workout Row ──────────────────────────────────────────────────────────
const WorkoutRow = ({ w }) => (
  <motion.div 
    whileHover={{ scale: 1.02 }}
    transition={{ duration: 0.2 }}
    className="row-item"
  >
    <div className="row-icon">
      <Dumbbell size={15} color="#a78bfa" />
    </div>
    <div className="row-text">
      <div className="row-label">{w.title}</div>
      <div className="row-description">
        {w.goal}{w.durationWeeks ? ` · ${w.durationWeeks}w` : ''}
      </div>
    </div>
    <DifficultyBadge level={w.difficulty} />
  </motion.div>
)

// ── Enhanced Diet Row ────────────────────────────────────────────────────────────
const DietRow = ({ d }) => (
  <motion.div 
    whileHover={{ scale: 1.02 }}
    transition={{ duration: 0.2 }}
    className="row-item diet"
  >
    <div className="row-icon">
      <Apple size={15} color="#34d399" />
    </div>
    <div className="row-text">
      <div className="row-label">{d.title}</div>
      <div className="row-description">
        {d.goal}{d.dailyCalories ? ` · ${d.dailyCalories} kcal/day` : ''}
      </div>
    </div>
    {d.dietType && (
      <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: 20, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', background: 'rgba(16,185,129,0.15)', color: '#34d399', border: '1px solid rgba(16,185,129,0.3)', whiteSpace: 'nowrap' }}>
        {d.dietType}
      </span>
    )}
  </motion.div>
)

// ── Premium Recommendation Card ───────────────────────────────────────────────────
const RecCard = ({ r, index }) => {
  const isW = r.recommendationType === 'WORKOUT'
  const text = r.workoutSuggestion || r.dietSuggestion || r.content || r.suggestion || r.message || JSON.stringify(r)
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      whileHover={{ x: 4 }}
    >
      <div className={`recommendation-card ${!isW ? 'diet' : ''}`}>
        <div className="recommendation-type">
          {r.recommendationType || 'Recommendation'}
        </div>
        <div className="recommendation-text">{text}</div>
      </div>
    </motion.div>
  )
}

// ── Main Dashboard ─────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { user } = useAuth()
  const toast = useToast()

  const [metrics,  setMetrics]  = useState(null)
  const [recs,     setRecs]     = useState([])
  const [workouts, setWorkouts] = useState([])
  const [diets,    setDiets]    = useState([])

  const [loadM, setLoadM] = useState(true)
  const [loadW, setLoadW] = useState(true)
  const [loadD, setLoadD] = useState(true)
  const [loadR, setLoadR] = useState(true)
  const [errM,  setErrM]  = useState(null)

  const [genW, setGenW] = useState(false)
  const [genD, setGenD] = useState(false)

  // ── Individual loaders (so failures are independent) ──
  const loadMetrics = useCallback(async () => {
    setLoadM(true); setErrM(null)
    try { setMetrics(await dietService.getHealthMetrics()) }
    catch (e) { setErrM(e.message) }
    finally { setLoadM(false) }
  }, [])

  const loadWorkouts = useCallback(async () => {
    setLoadW(true)
    try { setWorkouts(await workoutService.getAll()) }
    catch { setWorkouts([]) }
    finally { setLoadW(false) }
  }, [])

  const loadDiets = useCallback(async () => {
    setLoadD(true)
    try { setDiets(await dietService.getAllDiets()) }
    catch { setDiets([]) }
    finally { setLoadD(false) }
  }, [])

  // FIX 2: Recommendations — gracefully handle 404 / missing endpoint
  const loadRecs = useCallback(async () => {
    if (!user?.id) return
    setLoadR(true)
    try {
      const data = await dietService.getRecommendations(user.id)
      setRecs(Array.isArray(data) ? data : [])
    } catch {
      // Endpoint may not exist yet — silently hide section
      setRecs([])
    } finally {
      setLoadR(false)
    }
  }, [user?.id])

  // Initial load
  useEffect(() => {
    if (!user) return
    loadMetrics()
    loadWorkouts()
    loadDiets()
    loadRecs()
  }, [user, loadMetrics, loadWorkouts, loadDiets, loadRecs])

  // FIX 3: After AI generate — reload both workouts & diets list immediately
  const genWorkout = async () => {
    setGenW(true)
    try {
      await dietService.generateWorkout()
      toast('AI workout generated! 💪', 'success')
      // Reload workouts list AND recs right after
      await loadWorkouts()
      loadRecs()
    } catch (e) {
      toast('Generate failed: ' + (e.response?.data?.message || e.message), 'error')
    } finally {
      setGenW(false)
    }
  }

  const genDiet = async () => {
    setGenD(true)
    try {
      await dietService.generateDiet()
      toast('AI diet generated! 🥗', 'success')
      await loadDiets()
      loadRecs()
    } catch (e) {
      toast('Generate failed: ' + (e.response?.data?.message || e.message), 'error')
    } finally {
      setGenD(false)
    }
  }

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  // ── Metric mini card ──
  const MetaCard = ({ label, value, unit, loading }) => (
    <PremiumMetricCard label={label} value={value} unit={unit} loading={loading} />
  )

  return (
    <div className="dashboard-container">
      <div className="dashboard-bg-mesh" />
      <div className="dashboard-content">

        {/* ── Premium Header ────────────────────────────────────────────────────────────*/}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="dashboard-header"
        >
          <div>
            <h1>
              Good morning, <span className="name-accent">{user?.name?.split(' ')[0] || 'Athlete'}</span> 👋
            </h1>
            <p className="date">{today}</p>
          </div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="dashboard-header-actions"
          >
            <Link to="/workouts"><GradientBtn style={{ fontSize: 13, padding: '9px 16px' }}><Dumbbell size={14} />Workouts</GradientBtn></Link>
            <Link to="/progress"><GradientBtn variant="cyan" style={{ fontSize: 13, padding: '9px 16px' }}><TrendingUp size={14} />Progress</GradientBtn></Link>
          </motion.div>
        </motion.div>

        {/* ── HERO METRIC SECTION (Main Focus) ──────────────────────────────────────────*/}
        <div className="dashboard-hero-section">
          <HeroMetric 
            label="Daily Calorie Goal (TDEE)" 
            value={metrics?.tdee} 
            unit="kcal"
            loading={loadM}
            icon={Flame}
            gradient="linear-gradient(135deg, #f97316 0%, #d97706 100%)"
            gradientClass="gradient-orange"
          />
        </div>

        {/* ── Primary Metrics Tier (3 most important with animation) ─────────────────────*/}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="metrics-section"
        >
          <div className="metrics-label">Your Health Profile</div>
          <div className="metrics-grid">
            <PremiumMetricCard label="BMI Category"  value={metrics?.bmiCategory || '—'}              unit=""     color="violet"  loading={loadM} />
            <PremiumMetricCard label="Maintain Cals" value={metrics?.targetCaloriesMaintain || '—'}   unit="kcal" color="cyan"    loading={loadM} />
            <PremiumMetricCard label="Weight Loss"   value={metrics?.targetCaloriesLoss || '—'}       unit="kcal" color="emerald" loading={loadM} />
          </div>
        </motion.div>

        {/* ── Secondary Metrics Tier (support info) ────────────────────────────────────*/}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="metrics-section"
        >
          <div className="metrics-grid secondary">
            <PremiumMetricCard label="BMR"         value={metrics?.bmr}                   unit="kcal" loading={loadM} color="violet" />
            <PremiumMetricCard label="Gain Target" value={metrics?.targetCaloriesGain}    unit="kcal" loading={loadM} color="orange" />
            <PremiumMetricCard label="Age"         value={user?.age}                      unit="yrs"  loading={false} color="cyan" />
            <PremiumMetricCard label="Weight"      value={user?.weight}                   unit="kg"   loading={false} color="emerald" />
          </div>
        </motion.div>

        {/* ── Premium AI Generator Section ──────────────────────────────────────────────*/}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="ai-generator-section"
        >
          <div className="ai-generator-card">
            <div className="ai-generator-glow" />
            <div className="ai-generator-border" />
            
            <div className="ai-generator-content">
              <div className="ai-generator-header">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 6, ease: 'linear' }}
                  className="ai-generator-icon"
                >
                  <Brain size={18} color="#fff" />
                </motion.div>
                <div className="ai-generator-text">
                  <h3>Generate AI Plans</h3>
                  <p>Create personalized ✨ fitness & nutrition strategies using advanced AI</p>
                </div>
              </div>
              <div className="ai-generator-buttons">
                <GradientBtn onClick={genWorkout} disabled={genW} style={{ flex: '1 1 180px', padding: '11px 18px', fontSize: 13 }}>
                  {genW ? <><Spinner size={14} />Generating...</> : <><Dumbbell size={14} />Generate Workout</>}
                </GradientBtn>
                <GradientBtn onClick={genDiet} disabled={genD} variant="green" style={{ flex: '1 1 180px', padding: '11px 18px', fontSize: 13 }}>
                  {genD ? <><Spinner size={14} />Generating...</> : <><Apple size={14} />Generate Diet</>}
                </GradientBtn>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── AI Recommendations ────────────────────────────────────────────────────────*/}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: recs.length > 0 ? 1 : 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="recommendations-section"
          style={{ display: recs.length > 0 ? 'block' : 'none' }}
        >
          {!loadR && recs.length > 0 && (
            <GlassCard style={{ padding: 22 }} hover={false}>
              <div className="recommendations-header">
                <motion.div 
                  animate={{ scale: [1, 1.1, 1] }} 
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="recommendations-sparkle"
                >
                  <Sparkles size={16} color="#a78bfa" />
                </motion.div> 
                AI Recommendations
                <span className="recommendations-count">({recs.length})</span>
              </div>
              <div className="recommendations-list">
                {recs.slice(0, 4).map((r, i) => <RecCard key={r.id || i} r={r} index={i} />)}
              </div>
            </GlassCard>
          )}
        </motion.div>

        {/* ── My Workouts + My Diet Plans (Tier 2 Cards) ────────────────────────────────*/}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.4 }}
          className="cards-grid"
        >

          {/* Workouts Card */}
          <div className="content-card">
            <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
              <GlassCard style={{ padding: 22 }} hover={false}>
                <div className="card-header">
                  <div className="card-title">
                    <Dumbbell size={15} color="#a78bfa" /> My Workouts
                    {workouts.length > 0 && (
                      <span className="card-count">{workouts.length}</span>
                    )}
                  </div>
                  <Link to="/workouts" className="card-view-all">
                    View All <ChevronRight size={13} />
                  </Link>
                </div>

                {loadW ? (
                  <div className="card-content">
                    {[1, 2, 3].map(i => <SkeletonCard key={i} h={60} />)}
                  </div>
                ) : workouts.length === 0 ? (
                  <div className="card-empty">
                    <div className="empty-icon">
                      <Dumbbell size={20} color="rgba(124,58,237,0.5)" />
                    </div>
                    <p className="empty-text">No workout plans yet.</p>
                    <button onClick={genWorkout} disabled={genW} className="empty-button">
                      {genW ? 'Generating...' : '✦ Generate with AI'}
                    </button>
                  </div>
                ) : (
                  <div className="card-content">
                    {workouts.slice(0, 4).map((w, i) => <WorkoutRow key={w.id || i} w={w} />)}
                    {workouts.length > 4 && (
                      <div className="row-more">
                        +{workouts.length - 4} more — <Link to="/workouts" className="row-more-link">view all</Link>
                      </div>
                    )}
                  </div>
                )}
              </GlassCard>
            </motion.div>
          </div>

          {/* Diet Plans Card */}
          <div className="content-card">
            <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
              <GlassCard style={{ padding: 22 }} hover={false}>
                <div className="card-header">
                  <div className="card-title">
                    <Apple size={15} color="#34d399" /> My Diet Plans
                    {diets.length > 0 && (
                      <span className="card-count card-diet">{diets.length}</span>
                    )}
                  </div>
                  <Link to="/diet" className="card-view-all card-diet">
                    View All <ChevronRight size={13} />
                  </Link>
                </div>

                {loadD ? (
                  <div className="card-content">
                    {[1, 2, 3].map(i => <SkeletonCard key={i} h={60} />)}
                  </div>
                ) : diets.length === 0 ? (
                  <div className="card-empty">
                    <div className="empty-icon">
                      <Apple size={20} color="rgba(16,185,129,0.5)" />
                    </div>
                    <p className="empty-text">No diet plans yet.</p>
                    <button onClick={genDiet} disabled={genD} className="empty-button">
                      {genD ? 'Generating...' : '✦ Generate with AI'}
                    </button>
                  </div>
                ) : (
                  <div className="card-content">
                    {diets.slice(0, 4).map((d, i) => <DietRow key={d.id || i} d={d} />)}
                    {diets.length > 4 && (
                      <div className="row-more">
                        +{diets.length - 4} more — <Link to="/diet" className="row-more-link">view all</Link>
                      </div>
                    )}
                  </div>
                )}
              </GlassCard>
            </motion.div>
          </div>
        </motion.div>

        {/* ── Quick Actions (Premium) ───────────────────────────────────────────────────*/}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.4 }}
          className="quick-actions-grid"
        >
          {[
            { label: 'Log Workout', icon: Dumbbell,    bg: 'linear-gradient(135deg,#7c3aed,#4f46e5)', to: '/workouts' },
            { label: 'Track Meal',  icon: Apple,       bg: 'linear-gradient(135deg,#10b981,#059669)', to: '/meals'    },
            { label: 'Progress',    icon: TrendingUp,  bg: 'linear-gradient(135deg,#06b6d4,#2563eb)', to: '/progress' },
            { label: 'Profile',     icon: Activity,    bg: 'linear-gradient(135deg,#f97316,#d97706)', to: '/profile'  },
          ].map(({ label, icon: Icon, bg, to }, idx) => (
            <Link key={label} to={to}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + idx * 0.05, duration: 0.3 }}
                whileHover={{ scale: 1.05, y: -4 }}
                className="action-card"
              >
                <GlassCard style={{ padding: '20px 14px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, textAlign: 'center' }}>
                  <motion.div whileHover={{ rotate: 10 }} className="action-icon" style={{ background: bg }}>
                    <Icon size={20} color="#fff" />
                  </motion.div>
                  <span className="action-label">{label}</span>
                </GlassCard>
              </motion.div>
            </Link>
          ))}
        </motion.div>

      </div>
    </div>
  )
}
