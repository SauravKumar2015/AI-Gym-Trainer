import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Dumbbell, LogOut, Menu, X, WifiOff } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const LINKS_GUEST = [["/", "Home"]];
const LINKS_AUTH = [
  ["/", "Home"],
  ["/dashboard", "Dashboard"],
  ["/workouts", "Workouts"],
  ["/diet", "Diet"],
  ["/exercises", "Exercises"],
  ["/meals", "Meals"],
  ["/progress", "Progress"],
  ["/profile", "Profile"],
];

export default function Navbar() {
  const { isLoggedIn, logout, healthOk } = useAuth();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const links = isLoggedIn ? LINKS_AUTH : LINKS_GUEST;
  const active = (p) => pathname === p;

  return (
    <>
      <style>{`
        .nb-link { transition: color .2s, background .2s; }
        .nb-link:hover { color: #fff !important; background: rgba(255,255,255,0.08) !important; }
        .nb-cta:hover  { filter: brightness(1.12); transform: translateY(-1px); }
        .nb-auth:hover { color: #fff !important; }
        @media(max-width:900px){ .nb-desktop{display:none!important} .nb-burger{display:flex!important} }
        @media(min-width:901px){ .nb-mobile {display:none!important} .nb-burger{display:none!important} }
        @keyframes pulse{ 0%,100%{opacity:1} 50%{opacity:.3} }
      `}</style>

      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          height: 64,
          background: scrolled ? "rgba(5,5,14,0.97)" : "rgba(6,6,17,0.88)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderBottom: `1px solid ${scrolled ? "rgba(255,255,255,0.09)" : "rgba(255,255,255,0.05)"}`,
          boxShadow: scrolled ? "0 2px 40px rgba(0,0,0,0.55)" : "none",
          transition: "all .3s ease",
        }}
      >
        <div
          style={{
            maxWidth: 1300,
            margin: "0 auto",
            padding: "0 24px",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          {/* Logo */}
          <Link
            to="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "linear-gradient(135deg,#7c3aed,#4f46e5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 16px rgba(124,58,237,0.5)",
                flexShrink: 0,
              }}
            >
              <Dumbbell size={17} color="#fff" />
            </div>
            <span
              style={{
                fontWeight: 900,
                fontSize: 18,
                color: "#fff",
                letterSpacing: "-0.02em",
                lineHeight: 1.2,
              }}
            >
              FitAI<span style={{ color: "#a78bfa" }}> Pro</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <div
            className="nb-desktop"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              flex: 1,
              justifyContent: "center",
            }}
          >
            {links.map(([path, label]) => (
              <Link
                key={path}
                to={path}
                className="nb-link"
                style={{
                  padding: "7px 13px",
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.07em",
                  lineHeight: 1.4,
                  color: active(path) ? "#fff" : "rgba(156,163,175,1)",
                  background: active(path)
                    ? "rgba(124,58,237,0.2)"
                    : "transparent",
                  border: active(path)
                    ? "1px solid rgba(124,58,237,0.4)"
                    : "1px solid transparent",
                  transition: "all .2s",
                }}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Desktop right */}
          <div
            className="nb-desktop"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              flexShrink: 0,
            }}
          >
            {/* Health pill */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 12px",
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 700,
                lineHeight: 1.4,
                background:
                  healthOk === true
                    ? "rgba(16,185,129,0.1)"
                    : healthOk === false
                      ? "rgba(239,68,68,0.1)"
                      : "rgba(255,255,255,0.04)",
                border: `1px solid ${
                  healthOk === true
                    ? "rgba(16,185,129,0.35)"
                    : healthOk === false
                      ? "rgba(239,68,68,0.35)"
                      : "rgba(75,85,99,0.4)"
                }`,
                color:
                  healthOk === true
                    ? "#34d399"
                    : healthOk === false
                      ? "#f87171"
                      : "#6b7280",
              }}
            >
              {healthOk === true ? (
                <>
                  <span
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: "#34d399",
                      display: "inline-block",
                      animation: "pulse 2s infinite",
                    }}
                  />
                  API Live
                </>
              ) : healthOk === false ? (
                <>
                  <WifiOff size={12} />
                  Offline
                </>
              ) : (
                <>···</>
              )}
            </div>

            {isLoggedIn ? (
              <button
                onClick={logout}
                className="nb-cta"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  padding: "8px 16px",
                  borderRadius: 9,
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 700,
                  fontSize: 13,
                  color: "#fff",
                  lineHeight: 1.4,
                  fontFamily: "inherit",
                  letterSpacing: "0.04em",
                  background: "linear-gradient(135deg,#dc2626,#be123c)",
                  boxShadow: "0 2px 12px rgba(220,38,38,0.35)",
                  transition: "all .2s",
                }}
              >
                <LogOut size={14} /> Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="nb-auth"
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "rgba(156,163,175,1)",
                    padding: "7px 13px",
                    borderRadius: 9,
                    transition: "color .2s",
                    lineHeight: 1.4,
                  }}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="nb-cta"
                  style={{
                    padding: "8px 18px",
                    borderRadius: 9,
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#fff",
                    background: "linear-gradient(135deg,#7c3aed,#4f46e5)",
                    boxShadow: "0 2px 14px rgba(124,58,237,0.45)",
                    transition: "all .2s",
                    lineHeight: 1.4,
                  }}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Burger */}
          <button
            className="nb-burger"
            onClick={() => setOpen((o) => !o)}
            style={{
              display: "none",
              alignItems: "center",
              justifyContent: "center",
              width: 40,
              height: 40,
              borderRadius: 9,
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(255,255,255,0.05)",
              cursor: "pointer",
              color: "#fff",
              flexShrink: 0,
            }}
          >
            {open ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div
          className="nb-mobile"
          style={{
            position: "fixed",
            top: 64,
            left: 0,
            right: 0,
            zIndex: 999,
            background: "rgba(4,4,14,0.98)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            padding: "10px 18px 20px",
          }}
        >
          {links.map(([path, label]) => (
            <Link
              key={path}
              to={path}
              style={{
                display: "block",
                padding: "13px 16px",
                borderRadius: 10,
                marginBottom: 3,
                fontSize: 14,
                fontWeight: 700,
                lineHeight: 1.4,
                color: active(path) ? "#fff" : "rgba(156,163,175,1)",
                background: active(path)
                  ? "rgba(124,58,237,0.18)"
                  : "transparent",
                border: active(path)
                  ? "1px solid rgba(124,58,237,0.35)"
                  : "1px solid transparent",
              }}
            >
              {label}
            </Link>
          ))}
          <div
            style={{
              borderTop: "1px solid rgba(255,255,255,0.08)",
              marginTop: 10,
              paddingTop: 12,
            }}
          >
            {isLoggedIn ? (
              <button
                onClick={() => {
                  logout();
                  setOpen(false);
                }}
                style={{
                  width: "100%",
                  padding: "13px 16px",
                  borderRadius: 10,
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  color: "#f87171",
                  background: "rgba(239,68,68,0.1)",
                  fontSize: 14,
                  fontWeight: 700,
                  textAlign: "left",
                  lineHeight: 1.4,
                }}
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  style={{
                    display: "block",
                    padding: "13px 16px",
                    borderRadius: 10,
                    fontSize: 14,
                    fontWeight: 700,
                    color: "rgba(156,163,175,1)",
                    marginBottom: 6,
                    lineHeight: 1.4,
                  }}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  style={{
                    display: "block",
                    padding: "13px 16px",
                    borderRadius: 10,
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#fff",
                    textAlign: "center",
                    background: "linear-gradient(135deg,#7c3aed,#4f46e5)",
                    lineHeight: 1.4,
                  }}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
