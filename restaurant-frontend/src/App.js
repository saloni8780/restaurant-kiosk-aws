import { useState, useEffect } from "react";
import MenuPage from "./MenuPage";
import KitchenDashboard from "./KitchenDashboard";

export default function App() {
  const [view, setView] = useState("menu");
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFadeOut(true), 2800);
    const doneTimer = setTimeout(() => setLoading(false), 3400);
    return () => { clearTimeout(fadeTimer); clearTimeout(doneTimer); };
  }, []);

  if (loading) return <LoadingScreen fading={fadeOut} />;

  return (
    <div style={{
      fontFamily: "sans-serif",
      margin: 0,
      padding: 0,
      minHeight: "100vh",
      background: "#f0ebe3",
      animation: "appFadeIn 0.6s ease",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600&family=DM+Sans:wght@300;400;500;600&display=swap');
        @keyframes appFadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>

      <nav style={{
        display: "flex",
        gap: 12,
        padding: "16px 20px",
        background: "#1a1612",
        borderBottom: "1px solid #2e2820",
      }}>
        <NavBtn label="🍽️ Menu & Order"       active={view === "menu"}    onClick={() => setView("menu")}    activeColor="#c4a94d" />
        <NavBtn label="🍳 Kitchen Dashboard"  active={view === "kitchen"} onClick={() => setView("kitchen")} activeColor="#3b82f6" />
      </nav>

      <div style={{ margin: 0, padding: 0 }}>
        {view === "menu" ? <MenuPage /> : <KitchenDashboard />}
      </div>
    </div>
  );
}

function LoadingScreen({ fading }) {
  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "#1a1612",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 0,
      opacity: fading ? 0 : 1,
      transition: "opacity 0.6s ease",
      zIndex: 9999,
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600&family=DM+Sans:wght@300;400;500;600&display=swap');

        @keyframes logoIn {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes lineGrow {
          from { width: 0; }
          to   { width: 60px; }
        }
        @keyframes subIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes barFill {
          from { width: 0%; }
          to   { width: 100%; }
        }
        @keyframes dotPulse {
          0%,100% { opacity: 0.2; transform: scale(0.8); }
          50%      { opacity: 1;   transform: scale(1.2); }
        }
      `}</style>

      {/* Icon */}
      <div style={{
        width: 72, height: 72,
        background: "#c4a94d",
        borderRadius: 20,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 34,
        marginBottom: 28,
        animation: "logoIn 0.7s cubic-bezier(0.34,1.56,0.64,1) 0.2s both",
      }}>
        🍽️
      </div>

      {/* Welcome text */}
      <p style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 11,
        letterSpacing: "0.35em",
        textTransform: "uppercase",
        color: "#c4a94d",
        marginBottom: 10,
        animation: "subIn 0.6s ease 0.6s both",
      }}>
        Welcome to
      </p>

      {/* Restaurant name */}
      <h1 style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: "2.6rem",
        fontWeight: 600,
        color: "#f5f0e8",
        margin: 0,
        lineHeight: 1,
        animation: "logoIn 0.7s ease 0.7s both",
      }}>
        The Restaurant
      </h1>

      {/* Decorative line */}
      <div style={{
        height: 1,
        background: "#c4a94d",
        marginTop: 18,
        marginBottom: 18,
        animation: "lineGrow 0.6s ease 1s both",
      }} />

      {/* Tagline */}
      <p style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 12,
        color: "#6b6560",
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        animation: "subIn 0.6s ease 1.2s both",
        marginBottom: 48,
      }}>
        Fine dining · Order system
      </p>

      {/* Progress bar */}
      <div style={{
        width: 180,
        height: 2,
        background: "#2e2820",
        borderRadius: 2,
        overflow: "hidden",
        marginBottom: 20,
      }}>
        <div style={{
          height: "100%",
          background: "#c4a94d",
          borderRadius: 2,
          animation: "barFill 2.4s cubic-bezier(0.4,0,0.2,1) 0.4s both",
        }} />
      </div>

      {/* Dots */}
      <div style={{ display: "flex", gap: 6 }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: 5, height: 5,
            background: "#c4a94d",
            borderRadius: "50%",
            animation: `dotPulse 1s ease ${0.4 + i * 0.2}s infinite`,
          }} />
        ))}
      </div>
    </div>
  );
}

function NavBtn({ label, active, onClick, activeColor }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "12px 28px",
        cursor: "pointer",
        background: active ? activeColor : "transparent",
        color: active ? "#1a1612" : "#9a9088",
        border: active ? `2px solid ${activeColor}` : "2px solid #2e2820",
        borderRadius: 10,
        fontFamily: "'DM Sans', sans-serif",
        fontWeight: 700,
        fontSize: 14,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        transition: "all 0.15s ease",
      }}
      onMouseEnter={e => {
        if (!active) {
          e.target.style.borderColor = activeColor;
          e.target.style.color = activeColor;
        }
      }}
      onMouseLeave={e => {
        if (!active) {
          e.target.style.borderColor = "#2e2820";
          e.target.style.color = "#9a9088";
        }
      }}
    >
      {label}
    </button>
  );
}