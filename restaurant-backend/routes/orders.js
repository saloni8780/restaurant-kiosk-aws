const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

// Public — customer can place order
router.post('/', (req, res) => {
  const { table_number, items } = req.body;
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const order = db.prepare(
    'INSERT INTO orders (table_number, total) VALUES (?, ?)'
  ).run(table_number, total);
  const insertItem = db.prepare(
    'INSERT INTO order_items (order_id, menu_item_id, quantity, price) VALUES (?, ?, ?, ?)'
  );
  for (const item of items) {
    insertItem.run(order.lastInsertRowid, item.menu_item_id, item.quantity, item.price);
  }
  res.json({ id: order.lastInsertRowid, message: 'Order placed', total });
});

// Protected — only kitchen/admin can view orders
router.get('/', auth, (req, res) => {
  const orders = db.prepare(`
    SELECT o.*, GROUP_CONCAT(m.name, ', ') AS items
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    LEFT JOIN menu_items m ON oi.menu_item_id = m.id
    GROUP BY o.id
    ORDER BY o.created_at DESC
  `).all();
  res.json(orders);
});

// Protected — only kitchen/admin can update status
router.put('/:id/status', auth, (req, res) => {
  const { status } = req.body;
  db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, req.params.id);
  res.json({ message: 'Status updated' });
});

module.exports = router;
