import { useState, useEffect } from "react";
import axios from "axios";

const API = "http://3.238.56.134:5000";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  html, body {
    margin: 0 !important;
    padding: 0 !important;
    width: 100%;
    overflow-x: hidden;
    background: #f0ebe3;
  }

  #root {
    margin: 0 !important;
    padding: 0 !important;
    max-width: 100% !important;
    width: 100%;
  }

  .menu-root {
    font-family: 'DM Sans', sans-serif;
    color: #1a1612;
    min-height: 100vh;
    width: 100vw;
    position: relative;
    left: 50%;
    right: 50%;
    margin-left: -50vw;
    margin-right: -50vw;
    background: #f0ebe3;
    overflow-x: hidden;
  }

  .menu-header {
    padding: 28px 20px 0;
    background: #f0ebe3;
    border-bottom: 1px solid #d8d0c4;
    margin-bottom: 28px;
  }

  .menu-eyebrow {
    font-size: 10px;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: #c4a94d;
    margin-bottom: 6px;
  }

  .menu-heading {
    font-family: 'Playfair Display', serif;
    font-size: 2.2rem;
    font-weight: 600;
    color: #1a1612;
    line-height: 1;
    margin-bottom: 20px;
  }

  .cat-tabs {
    display: flex;
    gap: 0;
    overflow-x: auto;
    scrollbar-width: none;
  }

  .cat-tabs::-webkit-scrollbar { display: none; }

  .cat-tab {
    padding: 10px 18px;
    background: none;
    border: none;
    border-bottom: 2px solid transparent;
    font-family: 'DM Sans', sans-serif;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #9a9088;
    cursor: pointer;
    white-space: nowrap;
    transition: color 0.15s, border-color 0.15s;
  }

  .cat-tab.active {
    color: #1a1612;
    border-bottom-color: #c4a94d;
  }

  .cat-tab:hover:not(.active) { color: #4a4540; }

  .menu-body { padding: 0 16px; }

  .menu-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    margin-bottom: 28px;
  }

  .menu-card {
    background: #ffffff;
    border: 1px solid #cdc5b8;
    border-radius: 12px;
    padding: 16px;
    cursor: pointer;
    transition: box-shadow 0.2s, transform 0.15s, border-color 0.2s;
    position: relative;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  }

  .menu-card:hover {
    box-shadow: 0 6px 24px rgba(0,0,0,0.11);
    border-color: #b8ad9a;
    transform: translateY(-2px);
  }

  .menu-card:active { transform: scale(0.98); }

  .menu-card-name {
    font-weight: 600;
    font-size: 14px;
    color: #1a1612;
    margin-bottom: 4px;
    line-height: 1.3;
  }

  .menu-card-desc {
    font-size: 11px;
    color: #9a9088;
    line-height: 1.45;
    margin-bottom: 14px;
  }

  .menu-card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .menu-card-price {
    font-family: 'Playfair Display', serif;
    font-size: 18px;
    font-weight: 500;
    color: #1a1612;
  }

  .add-btn {
    width: 30px; height: 30px;
    background: #1a1612;
    color: #faf8f5;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    font-size: 18px;
    line-height: 1;
    display: flex; align-items: center; justify-content: center;
    transition: background 0.15s, transform 0.1s;
    flex-shrink: 0;
  }

  .add-btn:hover { background: #c4a94d; transform: scale(1.1); }

  .qty-badge {
    position: absolute;
    top: 10px; right: 10px;
    background: #c4a94d;
    color: #fff;
    font-size: 10px;
    font-weight: 700;
    width: 20px; height: 20px;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    letter-spacing: 0;
  }

  .cart-panel {
    margin: 0 16px 32px;
    background: #1a1612;
    border-radius: 16px;
    padding: 20px;
    color: #e8e0d5;
  }

  .cart-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 16px;
  }

  .cart-heading {
    font-family: 'Playfair Display', serif;
    font-size: 1.2rem;
    color: #f5f0e8;
  }

  .cart-count {
    font-size: 11px;
    color: #6b6560;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .cart-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 9px 0;
    border-bottom: 1px solid #2a2520;
  }

  .cart-row:last-of-type { border-bottom: none; }

  .cart-item-left { display: flex; align-items: center; gap: 10px; }

  .cart-qty-ctrl {
    display: flex;
    align-items: center;
    gap: 6px;
    background: #2a2520;
    border-radius: 20px;
    padding: 3px 8px;
  }

  .qty-btn {
    background: none;
    border: none;
    color: #c4a94d;
    cursor: pointer;
    font-size: 14px;
    line-height: 1;
    padding: 0 2px;
    transition: color 0.1s;
  }

  .qty-btn:hover { color: #f5c842; }

  .qty-num {
    font-size: 13px;
    color: #f0e8df;
    min-width: 14px;
    text-align: center;
    font-weight: 600;
  }

  .cart-item-name { font-size: 13px; color: #c8c0b5; }

  .cart-item-price {
    font-family: 'Playfair Display', serif;
    font-size: 14px;
    color: #f0e8df;
  }

  .cart-divider {
    border: none;
    border-top: 1px solid #2a2520;
    margin: 14px 0;
  }

  .cart-total-row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 18px;
  }

  .cart-total-label {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: #6b6560;
  }

  .cart-total-amount {
    font-family: 'Playfair Display', serif;
    font-size: 1.6rem;
    color: #c4a94d;
  }

  .cart-controls {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .table-wrap {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  .table-label {
    font-size: 9px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #6b6560;
  }

  .table-input {
    width: 52px;
    padding: 7px 10px;
    background: #2a2520;
    border: 1px solid #3a3530;
    border-radius: 7px;
    color: #f0e8df;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    text-align: center;
    outline: none;
    transition: border-color 0.15s;
  }

  .table-input:focus { border-color: #c4a94d; }

  .place-btn {
    flex: 1;
    padding: 11px 20px;
    background: #c4a94d;
    color: #1a1612;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    font-weight: 700;
    font-size: 13px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    transition: background 0.15s, transform 0.1s;
  }

  .place-btn:hover { background: #d4bc62; transform: translateY(-1px); }
  .place-btn:active { transform: translateY(0); }

  .success-toast {
    position: fixed;
    top: 24px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 9999;
    display: flex;
    align-items: center;
    gap: 12px;
    background: #fff;
    border: 1px solid #cdc5b8;
    border-radius: 14px;
    padding: 14px 20px;
    box-shadow: 0 12px 40px rgba(0,0,0,0.14);
    animation: toastIn 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards;
    white-space: nowrap;
  }

  .toast-icon {
    width: 34px; height: 34px;
    background: #16a34a;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 16px;
    flex-shrink: 0;
    color: #fff;
  }

  .toast-text-wrap {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .toast-title {
    font-weight: 700;
    font-size: 14px;
    color: #1a1612;
  }

  .toast-sub {
    font-size: 11px;
    color: #9a9088;
    letter-spacing: 0.03em;
  }

  .toast-dismiss {
    margin-left: 6px;
    background: none;
    border: none;
    color: #c4bdb5;
    cursor: pointer;
    font-size: 18px;
    line-height: 1;
    padding: 0;
    transition: color 0.15s;
    flex-shrink: 0;
  }

  .toast-dismiss:hover { color: #6b6560; }

  @keyframes toastIn {
    from { opacity: 0; transform: translateX(-50%) translateY(-14px) scale(0.95); }
    to   { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
  }
`;

export default function MenuPage() {
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [table, setTable] = useState(1);
  const [msg, setMsg] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    axios.get(`${API}/api/menu`).then(r => setMenu(r.data));
  }, []);

  const categories = ["All", ...Array.from(new Set(menu.map(i => i.category).filter(Boolean)))];

  const filtered = activeCategory === "All"
    ? menu
    : menu.filter(i => i.category === activeCategory);

  const getQty = (id) => cart.find(i => i.menu_item_id === id)?.quantity || 0;

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i.menu_item_id === item.id);
      if (existing)
        return prev.map(i => i.menu_item_id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { menu_item_id: item.id, name: item.name, price: item.price, quantity: 1 }];
    });
  };

  const changeQty = (id, delta) => {
    setCart(prev => {
      const updated = prev.map(i => i.menu_item_id === id ? { ...i, quantity: i.quantity + delta } : i);
      return updated.filter(i => i.quantity > 0);
    });
  };

  const placeOrder = async () => {
    if (!cart.length) return;
    await axios.post(`${API}/api/orders`, { table_number: table, items: cart });
    setCart([]);
    setMsg("Order sent to kitchen!");
    setTimeout(() => setMsg(""), 3000);
  };

  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const itemCount = cart.reduce((s, i) => s + i.quantity, 0);

  return (
    <div className="menu-root">
      <style>{styles}</style>

      <div className="menu-header">
        <p className="menu-eyebrow">Today's Selection</p>
        <h1 className="menu-heading">Our Menu</h1>
        <div className="cat-tabs">
          {categories.map(c => (
            <button key={c} className={`cat-tab${activeCategory === c ? " active" : ""}`}
              onClick={() => setActiveCategory(c)}>{c}</button>
          ))}
        </div>
      </div>

      <div className="menu-body">
        <div className="menu-grid">
          {filtered.map(item => {
            const qty = getQty(item.id);
            return (
              <div key={item.id} className="menu-card">
                {qty > 0 && <span className="qty-badge">{qty}</span>}
                <div className="menu-card-name">{item.name}</div>
                <p className="menu-card-desc">{item.description}</p>
                <div className="menu-card-footer">
                  <span className="menu-card-price">${parseFloat(item.price).toFixed(2)}</span>
                  <button className="add-btn" onClick={() => addToCart(item)}>+</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {cart.length > 0 && (
        <div className="cart-panel">
          <div className="cart-header">
            <p className="cart-heading">Your Order</p>
            <span className="cart-count">{itemCount} item{itemCount !== 1 ? "s" : ""}</span>
          </div>

          {cart.map(i => (
            <div key={i.menu_item_id} className="cart-row">
              <div className="cart-item-left">
                <div className="cart-qty-ctrl">
                  <button className="qty-btn" onClick={() => changeQty(i.menu_item_id, -1)}>−</button>
                  <span className="qty-num">{i.quantity}</span>
                  <button className="qty-btn" onClick={() => changeQty(i.menu_item_id, 1)}>+</button>
                </div>
                <span className="cart-item-name">{i.name}</span>
              </div>
              <span className="cart-item-price">${(i.price * i.quantity).toFixed(2)}</span>
            </div>
          ))}

          <hr className="cart-divider" />

          <div className="cart-total-row">
            <span className="cart-total-label">Total</span>
            <span className="cart-total-amount">${total.toFixed(2)}</span>
          </div>

          <div className="cart-controls">
            <div className="table-wrap">
              <span className="table-label">Table</span>
              <input className="table-input" type="number" value={table} min={1}
                onChange={e => setTable(e.target.value)} />
            </div>
            <button className="place-btn" onClick={placeOrder}>Place Order</button>
          </div>
        </div>
      )}

      {msg && (
        <div className="success-toast">
          <div className="toast-icon">✓</div>
          <div className="toast-text-wrap">
            <span className="toast-title">Order Placed!</span>
            <span className="toast-sub">Sent to the kitchen successfully</span>
          </div>
          <button className="toast-dismiss" onClick={() => setMsg("")}>×</button>
        </div>
      )}
    </div>
  );
}