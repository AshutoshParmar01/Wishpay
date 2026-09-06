# PayTM clone- Simple Transaction Processing Application

A basic payment application built with Node.js/Express backend and React frontend with MongoDB database.

## Features

- **User Authentication**: Register and login functionality
- **Balance Management**: View current account balance
- **Send Money**: Transfer funds to other users via email
- **Transaction History**: View all sent and received transactions
- **Responsive Design**: Simple, clean UI that works on desktop and mobile

## Project Structure

```
paytm/
├── backend/              # Node.js/Express API
│   ├── index.js         # Main server file with routes
│   ├── package.json     # Backend dependencies
│   ├── Dockerfile       # Docker configuration
│   └── .env            # Environment variables
├── frontend/            # React application
│   ├── src/
│   │   ├── App.jsx     # Main app component
│   │   ├── App.css     # Styling
│   │   ├── components/
│   │   │   ├── Auth.jsx              # Login/Register component
│   │   │   ├── Dashboard.jsx         # Main dashboard component
│   │   │   ├── SendMoney.jsx         # Send money form
│   │   │   └── TransactionHistory.jsx # Transaction list
│   │   └── main.jsx
│   ├── package.json     # Frontend dependencies
│   ├── vite.config.js   # Vite configuration
│   ├── Dockerfile       # Docker configuration
│   └── .env            # Environment variables
├── docker-compose.yml   # Docker compose configuration
└── README.md           # This file
```

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Docker)
- npm or yarn

## Installation & Setup

### Option 1: Local Development

1. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   cd ..
   ```

2. **Install Frontend Dependencies**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

3. **Start MongoDB** (if running locally)
   ```bash
   mongod
   ```

4. **Run Backend**
   ```bash
   cd backend
   npm start
   # or: node index.js
   ```
   Backend will run on `http://localhost:5000`

5. **Run Frontend** (in a new terminal)
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend will run on `http://localhost:5173`

### Option 2: Using Docker Compose

Make sure Docker and Docker Compose are installed, then:

```bash
docker-compose up
```

This will start:
- Backend API on `http://localhost:5000`
- Frontend on `http://localhost:5173`
- MongoDB on `mongodb://localhost:27017`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
  - Body: `{ name, email, password }`
  - Response: `{ message, userId }`

- `POST /api/auth/login` - Login user
  - Body: `{ email, password }`
  - Response: `{ message, userId, email, name, balance }`

### User
- `GET /api/users/:userId` - Get user details
  - Response: `{ name, email, balance }`

### Transactions
- `POST /api/transactions/send` - Send money
  - Body: `{ senderId, receiverEmail, amount }`
  - Response: `{ message, transaction }`

- `GET /api/transactions/:userId` - Get transaction history
  - Response: Array of transactions

## Default Test Credentials

When you first start the application, you can use the test account:
- **Email**: test@example.com
- **Password**: password123

Or create your own account through the registration form.

## Features Overview

### Authentication
- Users can register with name, email, and password
- Simple login without token-based auth (for simplicity)
- Session stored in localStorage

### Dashboard
- Displays user's current balance (starts with ₹5000)
- Quick send money form
- Complete transaction history

### Send Money
- Enter recipient's email and amount
- Automatic balance validation
- Real-time transaction processing
- Updated balance immediately after transaction

### Transaction History
- Shows all sent and received transactions
- Color-coded (red for sent, green for received)
- Displays timestamp and transaction details
- Scrollable list with max-height

## Security Notes

This is a basic educational application. For production use:
- Implement JWT authentication
- Hash passwords with bcrypt
- Add input validation with zod (already in dependencies)
- Implement HTTPS
- Add rate limiting
- Use proper error handling
- Add CSRF protection
- Implement transaction signing/verification

## Styling

The application uses a modern gradient purple theme with:
- Responsive grid layout
- Mobile-first design
- Smooth animations and transitions
- Clear visual hierarchy
- Accessible color contrast

## Environment Variables

### Backend (.env)
```
MONGO_URL=mongodb://localhost:27017/paytm
PORT=5000
NODE_ENV=development
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000
```

## Troubleshooting

**MongoDB Connection Error**
- Ensure MongoDB is running
- Check MONGO_URL in backend .env

**Frontend Cannot Reach Backend**
- Verify backend is running on port 5000
- Check VITE_API_URL in frontend .env
- Check browser console for CORS errors

**Port Already in Use**
- Change PORT in .env files to an available port
- Update docker-compose.yml if using Docker

## Future Enhancements

- User profile management
- Transaction search and filtering
- Money request feature
- Payment confirmation emails
- Two-factor authentication
- Admin dashboard
- Analytics and reporting
- Multiple currency support
- Transaction scheduling
