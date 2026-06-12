const Database = require('better-sqlite3');
const db = new Database('restaurant.db');
db.exec(`
  CREATE TABLE IF NOT EXISTS menu_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    category TEXT,
    available INTEGER DEFAULT 1
  );
  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    table_number INTEGER,
    status TEXT DEFAULT 'pending',
    total REAL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER,
    menu_item_id INTEGER,
    quantity INTEGER,
    price REAL
  );
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT UNIQUE,
    password_hash TEXT,
    role TEXT DEFAULT 'customer'
  );
`);
const count = db.prepare('SELECT COUNT(*) as c FROM menu_items').get();
if (count.c === 0) {
  const insert = db.prepare('INSERT INTO menu_items (name, description, price, category) VALUES (?, ?, ?, ?)');
  insert.run('Burger', 'Classic beef burger', 8.99, 'mains');
  insert.run('Pizza', 'Margherita pizza', 11.99, 'mains');
  insert.run('Fries', 'Crispy french fries', 3.99, 'sides');
  insert.run('Coke', 'Cold cola drink', 1.99, 'drinks');
  console.log('Menu seeded!');
}
module.exports = db;
