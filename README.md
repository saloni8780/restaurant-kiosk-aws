# 🍽️ Restaurant Kiosk — AWS Deployed

A full-stack restaurant ordering system with a React frontend, Node.js backend, and MySQL database — deployed on AWS using a custom VPC and 3-tier architecture.

---

## 🌐 Live Demo
- **Frontend:** http://restaurant-frontend-1780451992.s3-website-us-east-1.amazonaws.com
- **API:** http://3.238.56.134:5000/api/menu

---

## ☁️ AWS Architecture

```
User → CloudFront → S3 (React Frontend)
                         ↓
              EC2 (Node.js API — Private Subnet)
                         ↓
              RDS MySQL (Isolated DB Subnet)
```

### What was set up on AWS:
- **Custom VPC** with CIDR `10.0.0.0/16`
- **Public Subnet** — Bastion host for secure SSH access
- **Private Subnet** — App server (EC2), not directly accessible
- **Isolated DB Subnets** — RDS MySQL across 2 availability zones (Multi-AZ)
- **Security Groups** — Port-level access control per tier
- **S3 + CloudFront** — Static frontend hosting with CDN
- **Internet Gateway + Route Tables** — Public internet access for frontend only

### Network flow:
```
Internet → IGW → Public Subnet (Bastion)
                      ↓ SSH only
               Private Subnet (EC2 App)
                      ↓ Port 3306 only
               DB Subnet (RDS MySQL)
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React.js |
| Backend | Node.js, Express.js |
| Database | MySQL (AWS RDS) |
| Cloud | AWS VPC, EC2, RDS, S3, CloudFront |
| Networking | Custom VPC, Security Groups, Bastion Host |

---

## 👥 Features

### Customer
- Browse menu by category
- Add items to cart
- Place order with table number

### Kitchen Staff
- View all incoming orders in real time
- Update order status (pending → preparing → ready → delivered)
- Auto-refreshes every 5 seconds

---

## 📁 Project Structure

```
restaurant-kiosk-aws/
├── restaurant-backend/
│   ├── routes/
│   │   ├── menu.js        # Menu API routes
│   │   └── orders.js      # Order API routes
│   ├── db.js              # Database connection
│   └── index.js           # Express server entry point
│
└── restaurant-frontend/
    └── src/
        ├── App.js               # Main app
        ├── MenuPage.jsx         # Customer menu & cart
        └── KitchenDashboard.jsx # Kitchen order view
```

---

## 🚀 Run Locally

**Backend**
```bash
cd restaurant-backend
npm install
# Create .env file:
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=yourpassword
# DB_NAME=restaurant_db
# PORT=5000
node index.js
```

**Frontend**
```bash
cd restaurant-frontend
npm install
npm start
```

---

## 🗄️ Database Schema

```sql
menu_items   — id, name, description, price, category, available
orders       — id, table_number, status, total, created_at
order_items  — id, order_id, menu_item_id, quantity, price
```

---

## 📌 Notes
- This is a college project built to learn AWS networking and cloud deployment
- Frontend is intentionally simple — the focus was on cloud infrastructure
- Backend runs on a private EC2 instance not directly exposed to the internet
- Database is in an isolated subnet with no public access

---

