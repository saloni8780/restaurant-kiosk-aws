const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});
router.get('/', (req, res) => {
  db.query('SELECT * FROM menu_items WHERE available = 1', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});
router.post('/', (req, res) => {
  const { name, description, price, category } = req.body;
  db.query('INSERT INTO menu_items (name, description, price, category) VALUES (?,?,?,?)',
    [name, description, price, category],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: result.insertId, message: 'Item added' });
    });
});
module.exports = router;
