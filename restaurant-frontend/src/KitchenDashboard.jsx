import { useState, useEffect } from "react";
import axios from "axios";

const API = "http://3.238.56.134:5000";

const STATUS = {
  pending:   { bg: "#fffbf0", border: "#f5c842", dot: "#f5c842", text: "#92700a", badge: "#fef3c7" },
  preparing: { bg: "#f0f7ff", border: "#60a5fa", dot: "#3b82f6", text: "#1d4ed8", badge: "#dbeafe" },
  ready:     { bg: "#f0fdf4", border: "#4ade80", dot: "#16a34a", text: "#15803d", badge: "#dcfce7" },
  delivered: { bg: "#fafaf9", border: "#d6d3d1", dot: "#a8a29e", text: "#78716c", badge: "#f5f5f4" },
};
const NEXT_STATUS = { pending: "preparing", preparing: "ready", ready: "delivered" };
const NEXT_LABEL  = { pending: "Start Preparing", preparing: "Mark Ready", ready: "Mark Delivered" };

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600&family=DM+Sans:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { margin: 0 !important; padding: 0 !important; width: 100%; overflow-x: hidden; background: #f0ebe3; }
  #root { margin: 0 !important; padding: 0 !important; max-width: 100% !important; width: 100%; }
  .k-root { font-family: 'DM Sans', sans-serif; color: #1a1612; min-height: 100vh; width: 100vw; position: relative; left: 50%; right: 50%; margin-left: -50vw; margin-right: -50vw; background: #f0ebe3; overflow-x: hidden; }
  .login-outer { min-height: 100vh; background: #f0ebe3; display: flex; align-items: center; justify-content: center; padding: 24px; }
  .login-card { width: 100%; max-width: 340px; background: #fff; border: 1px solid #cdc5b8; border-radius: 18px; padding: 36px 32px 32px; box-shadow: 0 8px 40px rgba(0,0,0,0.09); animation: fadeUp 0.35s ease; }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
  .login-icon { width: 44px; height: 44px; background: #1a1612; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 20px; margin-bottom: 20px; }
  .login-title { font-family: 'Playfair Display', serif; font-size: 1.6rem; color: #1a1612; margin-bottom: 4px; }
  .login-sub { font-size: 12px; color: #9a9088; letter-spacing: 0.08em; margin-bottom: 28px; }
  .login-label { display: block; font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em; color: #9a9088; margin-bottom: 6px; }
  .login-input { width: 100%; padding: 11px 14px; background: #f0ebe3; border: 1px solid #cdc5b8; border-radius: 9px; color: #1a1612; font-family: 'DM Sans', sans-serif; font-size: 14px; outline: none; margin-bottom: 16px; transition: border-color 0.15s, box-shadow 0.15s; }
  .login-input:focus { border-color: #c4a94d; box-shadow: 0 0 0 3px rgba(196,169,77,0.12); }
  .login-input.err { border-color: #ef4444; animation: shake 0.28s ease; }
  @keyframes shake { 0%,100% { transform: translateX(0); } 30% { transform: translateX(-5px); } 70% { transform: translateX(5px); } }
  .login-error { font-size: 12px; color: #ef4444; margin: -8px 0 14px; }
  .login-btn { width: 100%; padding: 12px; background: #1a1612; color: #faf8f5; border: none; border-radius: 10px; cursor: pointer; font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: 14px; letter-spacing: 0.06em; text-transform: uppercase; transition: background 0.15s, transform 0.1s; margin-top: 4px; }
  .login-btn:hover { background: #2e2820; transform: translateY(-1px); }
  .k-header { padding: 24px 20px 0; background: #f0ebe3; border-bottom: 1px solid #d8d0c4; margin-bottom: 20px; }
  .k-header-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 18px; }
  .k-eyebrow { font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase; color: #c4a94d; margin-bottom: 5px; }
  .k-title { font-family: 'Playfair Display', serif; font-size: 2rem; color: #1a1612; line-height: 1; }
  .k-live { display: flex; align-items: center; gap: 5px; font-size: 10px; color: #16a34a; text-transform: uppercase; letter-spacing: 0.2em; margin-top: 4px; }
  .live-dot { width: 6px; height: 6px; background: #16a34a; border-radius: 50%; animation: pulse 1.5s infinite; }
  @keyframes pulse { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(0.7); } }
  .logout-btn { background: none; border: 1px solid #ede8e1; color: #9a9088; padding: 7px 14px; border-radius: 8px; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; transition: border-color 0.15s, color 0.15s; }
  .logout-btn:hover { border-color: #ef4444; color: #ef4444; }
  .k-stats { display: flex; gap: 8px; overflow-x: auto; scrollbar-width: none; padding-bottom: 16px; }
  .k-stats::-webkit-scrollbar { display: none; }
  .stat-chip { display: flex; align-items: center; gap: 7px; padding: 7px 14px; background: #fff; border: 1px solid #cdc5b8; border-radius: 20px; white-space: nowrap; font-size: 12px; color: #6b6560; letter-spacing: 0.06em; box-shadow: 0 1px 4px rgba(0,0,0,0.05); }
  .stat-chip strong { font-size: 15px; font-weight: 700; color: #1a1612; }
  .stat-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
  .k-body { padding: 0 20px; }
  .orders-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 12px; margin-bottom: 28px; }
  .order-card { background: #fff; border: 1px solid; border-radius: 14px; padding: 18px; transition: box-shadow 0.2s, transform 0.15s; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
  .order-card:hover { box-shadow: 0 6px 24px rgba(0,0,0,0.1); transform: translateY(-2px); }
  .card-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; }
  .card-id { font-family: 'Playfair Display', serif; font-size: 1.15rem; color: #1a1612; }
  .card-table { font-size: 11px; color: #9a9088; text-transform: uppercase; letter-spacing: 0.15em; margin-top: 2px; }
  .status-pill { display: flex; align-items: center; gap: 5px; padding: 4px 10px; border-radius: 20px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; }
  .pill-dot { width: 5px; height: 5px; border-radius: 50%; }
  .card-items { font-size: 13px; color: #6b6560; line-height: 1.5; margin-bottom: 10px; }
  .card-total { font-family: 'Playfair Display', serif; font-size: 1.3rem; color: #1a1612; margin-bottom: 14px; }
  .next-btn { width: 100%; padding: 9px 0; background: #1a1612; color: #faf8f5; border: none; border-radius: 8px; cursor: pointer; font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; transition: background 0.15s, transform 0.1s; }
  .next-btn:hover { background: #2e2820; transform: scale(1.01); }
  .empty-state { text-align: center; padding: 60px 20px; color: #c4bdb5; }
  .empty-icon { font-size: 42px; display: block; margin-bottom: 12px; }
  .empty-text { font-family: 'Playfair Display', serif; font-size: 1.1rem; color: #9a9088; }
  .delivered-section { padding: 0 20px 32px; }
  .delivered-toggle { background: none; border: 1px solid #ede8e1; color: #9a9088; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; transition: border-color 0.15s, color 0.15s; }
  .delivered-toggle:hover { border-color: #c4a94d; color: #1a1612; }
  .delivered-table { margin-top: 12px; background: #fff; border: 1px solid #cdc5b8; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
  .delivered-row { display: flex; justify-content: space-between; padding: 10px 16px; border-bottom: 1px solid #f5f0ea; font-size: 13px; color: #9a9088; }
  .delivered-row:last-child { border-bottom: none; }
`;

function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [shake, setShake] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setErr(""); setLoading(true);
    try {
      const r = await axios.post(`${API}/api/auth/login`, { email, password });
      if (r.data.role !== "kitchen" && r.data.role !== "admin") {
        setErr("Access denied. Kitchen staff only.");
        setShake(true);
        setTimeout(() => setShake(false), 350);
        setLoading(false);
        return;
      }
      localStorage.setItem("token", r.data.token);
      localStorage.setItem("role", r.data.role);
      localStorage.setItem("name", r.data.name);
      onLogin();
    } catch (e) {
      setErr("Incorrect email or password.");
      setShake(true);
      setTimeout(() => setShake(false), 350);
    }
    setLoading(false);
  };

  return (
    <div className="login-outer">
      <div className="login-card">
        <div className="login-icon">🍳</div>
        <h1 className="login-title">Kitchen</h1>
        <p className="login-sub">Staff access only</p>
        <label className="login-label">Email</label>
        <input className={`login-input${shake ? " err" : ""}`} type="email"
          placeholder="staff@restaurant.com" value={email}
          onChange={e => { setEmail(e.target.value); setErr(""); }}
          onKeyDown={e => e.key === "Enter" && submit()} autoFocus />
        <label className="login-label">Password</label>
        <input className={`login-input${shake ? " err" : ""}`} type="password"
          placeholder="••••••••" value={password}
          onChange={e => { setPassword(e.target.value); setErr(""); }}
          onKeyDown={e => e.key === "Enter" && submit()} />
        {err && <p className="login-error">{err}</p>}
        <button className="login-btn" onClick={submit} disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </div>
    </div>
  );
}

function Dashboard({ onLogout }) {
  const [orders, setOrders] = useState([]);
  const [showDelivered, setShowDelivered] = useState(false);

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const load = () => axios.get(`${API}/api/orders`, { headers })
    .then(r => setOrders(r.data))
    .catch(() => {});

  useEffect(() => {
    load();
    const t = setInterval(load, 5000);
    return () => clearInterval(t);
  }, []);

  const updateStatus = async (id, status) => {
    await axios.put(`${API}/api/orders/${id}/status`, { status }, { headers });
    load();
  };

  const active    = orders.filter(o => o.status !== "delivered");
  const delivered = orders.filter(o => o.status === "delivered");
  const counts    = { pending: 0, preparing: 0, ready: 0 };
  active.forEach(o => { if (counts[o.status] !== undefined) counts[o.status]++; });

  const statItems = [
    { label: "Pending",   count: counts.pending,   color: "#f5c842" },
    { label: "Preparing", count: counts.preparing, color: "#3b82f6" },
    { label: "Ready",     count: counts.ready,     color: "#16a34a" },
    { label: "Delivered", count: delivered.length, color: "#a8a29e" },
  ];

  return (
    <>
      <div className="k-header">
        <div className="k-header-top">
          <div>
            <p className="k-eyebrow">Order Management</p>
            <h1 className="k-title">Kitchen</h1>
            <div className="k-live"><span className="live-dot" />Live</div>
          </div>
          <button className="logout-btn" onClick={onLogout}>Logout</button>
        </div>
        <div className="k-stats">
          {statItems.map(s => (
            <div key={s.label} className="stat-chip">
              <span className="stat-dot" style={{ background: s.color }} />
              <strong>{s.count}</strong>{s.label}
            </div>
          ))}
        </div>
      </div>

      <div className="k-body">
        {active.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">🍽️</span>
            <p className="empty-text">All clear — no active orders</p>
          </div>
        ) : (
          <div className="orders-grid">
            {active.map(order => {
              const s = STATUS[order.status] || STATUS.pending;
              return (
                <div key={order.id} className="order-card" style={{ borderColor: s.border, background: s.bg }}>
                  <div className="card-top">
                    <div>
                      <div className="card-id">Order #{order.id}</div>
                      <div className="card-table">Table {order.table_number}</div>
                    </div>
                    <div className="status-pill" style={{ background: s.badge, color: s.text }}>
                      <span className="pill-dot" style={{ background: s.dot }} />
                      {order.status}
                    </div>
                  </div>
                  <p className="card-items">{order.items}</p>
                  <div className="card-total">${parseFloat(order.total).toFixed(2)}</div>
                  {NEXT_STATUS[order.status] && (
                    <button className="next-btn" onClick={() => updateStatus(order.id, NEXT_STATUS[order.status])}>
                      {NEXT_LABEL[order.status]}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {delivered.length > 0 && (
        <div className="delivered-section">
          <button className="delivered-toggle" onClick={() => setShowDelivered(!showDelivered)}>
            {showDelivered ? "Hide" : "Show"} Delivered ({delivered.length})
          </button>
          {showDelivered && (
            <div className="delivered-table">
              {delivered.map(o => (
                <div key={o.id} className="delivered-row">
                  <span>#{o.id} · Table {o.table_number}</span>
                  <span>{o.items}</span>
                  <span>${parseFloat(o.total).toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default function KitchenDashboard() {
  const [authed, setAuthed] = useState(!!localStorage.getItem("token"));
  return (
    <div className="k-root">
      <style>{styles}</style>
      {authed
        ? <Dashboard onLogout={() => { localStorage.clear(); setAuthed(false); }} />
        : <LoginScreen onLogin={() => setAuthed(true)} />}
    </div>
  );
}