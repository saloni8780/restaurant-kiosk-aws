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
| Auth | JWT + bcrypt |
| Cloud | AWS VPC, EC2, RDS, S3, CloudFront |
| Networking | Custom VPC, Security Groups, Bastion Host |

---

## 👥 Features

### Customer
- Browse menu by category
- Add items to cart
- Place order with table number

### Kitchen Staff
- Secure login (JWT authenticated)
- View all incoming orders in real time
- Update order status (pending → preparing → ready → delivered)
- Auto-refreshes every 5 seconds

### Security
- Orders API protected with JWT — only authenticated kitchen staff can view
- Passwords hashed with bcrypt
- Backend in private subnet — not directly accessible from internet
- Database in isolated subnet — only reachable from app server

---

## 📁 Project Structure

```
restaurant-kiosk-aws/
├── restaurant-backend/
│   ├── routes/
│   │   ├── auth.js        # Register & login (JWT)
│   │   ├── menu.js        # Menu API routes
│   │   └── orders.js      # Order API (protected)
│   ├── middleware/
│   │   └── auth.js        # JWT verification middleware
│   ├── db.js              # Database connection
│   └── index.js           # Express server entry point
│
└── restaurant-frontend/
    └── src/
        ├── App.js               # Main app
        ├── MenuPage.jsx         # Customer menu & cart
        └── KitchenDashboard.jsx # Kitchen order view (login required)
```

---

## 🚀 Run Locally

**Backend**
```bash
cd restaurant-backend
npm install
cp .env.example .env
# Fill in your DB details in .env
node index.js
```

**Frontend**
```bash
cd restaurant-frontend
npm install
npm start
```

---

## 🔧 Deploy Your Own

### 1. AWS Infrastructure
```bash
# Create VPC
VPC_ID=$(aws ec2 create-vpc --cidr-block 10.0.0.0/16 --query 'Vpc.VpcId' --output text)

# Create subnets (public, private, DB x2)
# Create Internet Gateway and attach
# Create Security Groups (Bastion, App, DB)
# Launch Bastion EC2 in public subnet
# Launch App EC2 in private subnet
# Create RDS MySQL in DB subnet
```

### 2. Backend on EC2
```bash
# SSH via Bastion
ssh -i YourKey.pem ec2-user@BASTION_IP
ssh -i YourKey.pem ec2-user@APP_PRIVATE_IP

# Install Node.js and clone repo
curl -fsSL https://rpm.nodesource.com/setup_16.x | sudo bash -
sudo yum install -y nodejs git
git clone https://github.com/YOUR_USERNAME/restaurant-kiosk-aws
cd restaurant-kiosk-aws/restaurant-backend
npm install
cp .env.example .env
# Edit .env with your RDS endpoint and secrets
node index.js
```

### 3. Frontend on S3
```bash
cd restaurant-frontend
# Update API URL in src/MenuPage.jsx and src/KitchenDashboard.jsx
# const API = "http://YOUR_EC2_IP:5000"
npm run build
aws s3 mb s3://your-bucket-name
aws s3 website s3://your-bucket-name --index-document index.html --error-document index.html
aws s3api put-public-access-block --bucket your-bucket-name \
  --public-access-block-configuration "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"
aws s3api put-bucket-policy --bucket your-bucket-name --policy \
  '{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":"*","Action":"s3:GetObject","Resource":"arn:aws:s3:::your-bucket-name/*"}]}'
aws s3 sync build/ s3://your-bucket-name
```

### 4. Create DB Tables
```sql
USE restaurant_db;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password_hash VARCHAR(255),
  role ENUM('admin','kitchen','customer') DEFAULT 'customer'
);

CREATE TABLE menu_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category VARCHAR(50),
  available BOOLEAN DEFAULT TRUE
);

CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  table_number INT,
  status ENUM('pending','preparing','ready','delivered') DEFAULT 'pending',
  total DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT,
  menu_item_id INT,
  quantity INT,
  price DECIMAL(10,2),
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (menu_item_id) REFERENCES menu_items(id)
);

INSERT INTO menu_items (name, description, price, category) VALUES
('Burger', 'Classic beef burger', 8.99, 'mains'),
('Pizza', 'Margherita pizza', 11.99, 'mains'),
('Fries', 'Crispy french fries', 3.99, 'sides'),
('Coke', 'Cold cola drink', 1.99, 'drinks');
```

---

## 🗄️ Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```
DB_HOST=your-rds-endpoint.amazonaws.com
DB_USER=admin
DB_PASSWORD=yourpassword
DB_NAME=restaurant_db
PORT=5000
JWT_SECRET=your_secret_key_here
```

---

## 📌 Notes
- Frontend is intentionally simple — the focus was on cloud infrastructure
- Backend runs on a private EC2 instance not directly exposed to the internet
- Database is in an isolated subnet with no public access
- Orders API requires JWT token — unauthenticated access returns 401

---

