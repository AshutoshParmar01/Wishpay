const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017/paytm";
mongoose
  .connect(MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Database Schemas
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  balance: { type: Number, default: 5000 },
  createdAt: { type: Date, default: Date.now },
});

const transactionSchema = new mongoose.Schema({
  senderId: mongoose.Schema.Types.ObjectId,
  senderEmail: String,
  receiverId: mongoose.Schema.Types.ObjectId,
  receiverEmail: String,
  amount: Number,
  status: { type: String, default: "completed" },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);
const Transaction = mongoose.model("Transaction", transactionSchema);

// Routes

// Register
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const user = new User({ name, email, password });
    await user.save();

    res.json({
      message: "User registered successfully",
      userId: user._id,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, password });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.json({
      message: "Login successful",
      userId: user._id,
      email: user.email,
      name: user.name,
      balance: user.balance,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get User Balance
app.get("/api/users/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      name: user.name,
      email: user.email,
      balance: user.balance,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Send Money
app.post("/api/transactions/send", async (req, res) => {
  try {
    const { senderId, receiverEmail, amount } = req.body;

    const sender = await User.findById(senderId);
    const receiver = await User.findOne({ email: receiverEmail });

    if (!sender || !receiver) {
      return res.status(404).json({ error: "User not found" });
    }

    if (sender.balance < amount) {
      return res.status(400).json({ error: "Insufficient balance" });
    }

    if (amount <= 0) {
      return res.status(400).json({ error: "Amount must be greater than 0" });
    }

    // Deduct from sender, add to receiver
    sender.balance -= amount;
    receiver.balance += amount;

    await sender.save();
    await receiver.save();

    // Create transaction record
    const transaction = new Transaction({
      senderId: sender._id,
      senderEmail: sender.email,
      receiverId: receiver._id,
      receiverEmail: receiver.email,
      amount,
    });

    await transaction.save();

    res.json({
      message: "Transaction successful",
      transaction: {
        id: transaction._id,
        amount,
        receiver: receiver.email,
        timestamp: transaction.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Transaction History
app.get("/api/transactions/:userId", async (req, res) => {
  try {
    const transactions = await Transaction.find({
      $or: [
        { senderId: req.params.userId },
        { receiverId: req.params.userId },
      ],
    }).sort({ createdAt: -1 });

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health Check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

