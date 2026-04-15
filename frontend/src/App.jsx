import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./context/AuthContext";
import { ToastContext, useToastState } from "./hooks/useToast";
import Navbar from "./components/layout/Navbar";
import ToastContainer from "./components/ui/Toast";
import AppRouter from "./router/AppRouter";

const AppInner = () => {
  const { toasts, show, remove } = useToastState();
  return (
    <ToastContext.Provider value={show}>
      <div
        style={{
          minHeight: "100vh",
          background: "#060611",
          color: "#fff",
          fontFamily: "'Syne',system-ui,sans-serif",
        }}
      >
        <Navbar />
        <AppRouter />
        <ToastContainer toasts={toasts} onRemove={remove} />
      </div>
    </ToastContext.Provider>
  );
};

export default function App() {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  return (
    <BrowserRouter>
      <GoogleOAuthProvider clientId={googleClientId}>
        <AuthProvider>
          <AppInner />
        </AuthProvider>
      </GoogleOAuthProvider>
    </BrowserRouter>
  );
}
