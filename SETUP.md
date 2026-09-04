# Quick Start Guide

## What's Included

✅ **Backend (Express + MongoDB)**
- User registration and login
- Send money transactions
- Transaction history
- Balance management
- MongoDB models for User and Transaction

✅ **Frontend (React + Vite)**
- Auth component (login/register)
- Dashboard with balance display
- Send money form
- Transaction history display
- Responsive design with gradient UI

✅ **Database**
- MongoDB schemas for User and Transaction
- Automatic balance updates
- Transaction logging

## Quick Start

### 1. Install Dependencies
```bash
# Backend
cd backend && npm install && cd ..

# Frontend  
cd frontend && npm install && cd ..
```

### 2. Start MongoDB
```bash
# Using Docker (recommended)
docker run -d -p 27017:27017 --name mongodb mongo

# Or locally if you have MongoDB installed
mongod
```

### 3. Run Backend & Frontend

**Terminal 1 - Backend:**
```bash
cd backend
npm start
# Runs on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# Runs on http://localhost:5173
```

### 4. Test the App
1. Open http://localhost:5173
2. Register a new account or use test credentials
3. Send money to another user
4. View transaction history

## File Structure Summary

```
backend/
├── index.js (170+ lines) - All API routes and models
├── package.json - Express, MongoDB, CORS
└── .env - Configuration

frontend/src/
├── App.jsx - Main app component
├── App.css - Complete styling
└── components/
    ├── Auth.jsx - Login/Register form
    ├── Dashboard.jsx - Main dashboard
    ├── SendMoney.jsx - Send money form
    └── TransactionHistory.jsx - Transaction list
```

## What You Can Do

1. ✅ Register & Login
2. ✅ View Balance (starts with ₹5000)
3. ✅ Send Money to Other Users
4. ✅ View All Transactions
5. ✅ Track Money In/Out
6. ✅ Responsive Mobile UI

Enjoy!
