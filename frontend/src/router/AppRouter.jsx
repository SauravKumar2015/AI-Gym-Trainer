import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import DashboardPage from "../pages/DashboardPage";
import WorkoutsPage from "../pages/WorkoutsPage";
import WorkoutDetailPage from "../pages/WorkoutDetailPage";
import DietPage from "../pages/DietPage";
import DietDetailPage from "../pages/DietDetailPage";
import ExercisesPage from "../pages/ExercisesPage";
import ExerciseDetailPage from "../pages/ExerciseDetailPage";
import MealsPage from "../pages/MealsPage";
import MealDetailPage from "../pages/MealDetailPage";
import ProgressPage from "../pages/ProgressPage";
import ProfilePage from "../pages/ProfilePage";

const Loading = () => (
  <div
    style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#060611",
    }}
  >
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          border: "3px solid rgba(124,58,237,0.2)",
          borderTopColor: "#7c3aed",
          animation: "spin 0.8s linear infinite",
          margin: "0 auto 12px",
        }}
      />
      <span style={{ color: "rgba(107,114,128,1)", fontSize: 13 }}>
        Loading session...
      </span>
    </div>
  </div>
);

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, loading } = useAuth();
  if (loading) return <Loading />;
  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

const GuestRoute = ({ children }) => {
  const { isLoggedIn, loading } = useAuth();
  if (loading) return null;
  return isLoggedIn ? <Navigate to="/dashboard" replace /> : children;
};

const P = ({ children }) => <ProtectedRoute>{children}</ProtectedRoute>;
const G = ({ children }) => <GuestRoute>{children}</GuestRoute>;

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/login"
        element={
          <G>
            <LoginPage />
          </G>
        }
      />
      <Route
        path="/register"
        element={
          <G>
            <RegisterPage />
          </G>
        }
      />
      <Route
        path="/dashboard"
        element={
          <P>
            <DashboardPage />
          </P>
        }
      />
      <Route
        path="/workouts"
        element={
          <P>
            <WorkoutsPage />
          </P>
        }
      />
      <Route
        path="/workouts/detail"
        element={
          <P>
            <WorkoutDetailPage />
          </P>
        }
      />
      <Route
        path="/diet"
        element={
          <P>
            <DietPage />
          </P>
        }
      />
      <Route
        path="/diet/detail"
        element={
          <P>
            <DietDetailPage />
          </P>
        }
      />
      <Route
        path="/exercises"
        element={
          <P>
            <ExercisesPage />
          </P>
        }
      />
      <Route
        path="/exercises/detail"
        element={
          <P>
            <ExerciseDetailPage />
          </P>
        }
      />
      <Route
        path="/meals"
        element={
          <P>
            <MealsPage />
          </P>
        }
      />
      <Route
        path="/meals/detail"
        element={
          <P>
            <MealDetailPage />
          </P>
        }
      />
      <Route
        path="/progress"
        element={
          <P>
            <ProgressPage />
          </P>
        }
      />
      <Route
        path="/profile"
        element={
          <P>
            <ProfilePage />
          </P>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
