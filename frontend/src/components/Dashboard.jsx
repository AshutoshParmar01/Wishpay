import { useState, useEffect } from "react";
import SendMoney from "./SendMoney";
import TransactionHistory from "./TransactionHistory";

export default function Dashboard({ user, setUser, onLogout }) {
  const [balance, setBalance] = useState(user.balance);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    fetchUserData();
    fetchTransactions();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch(`${API_URL}/api/users/${user.userId}`);
      const data = await response.json();
      setBalance(data.balance);
      setUser((prev) => ({ ...prev, balance: data.balance }));
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_URL}/api/transactions/${user.userId}`
      );
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendSuccess = (amount, receiver) => {
    setBalance(balance - amount);
    setMessage(`Successfully sent ₹${amount} to ${receiver}`);
    setTimeout(() => setMessage(""), 3000);
    fetchTransactions();
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="dashboard-user-info">
          <h2>Welcome, {user.name}!</h2>
          <p>{user.email}</p>
        </div>
        <button className="btn btn-secondary btn-logout" onClick={onLogout}>
          Logout
        </button>
      </div>

      {message && <div className="success">{message}</div>}

      <div className="dashboard-content">
        <div className="card">
          <div className="balance-display">
            <div className="label">Current Balance</div>
            <div>
              <span className="currency">₹</span>
              <span className="amount">{balance.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3>Send Money</h3>
          <SendMoney
            userId={user.userId}
            onSuccess={handleSendSuccess}
          />
        </div>

        <div className="card transactions">
          <h3>Transaction History</h3>
          {loading ? (
            <div className="empty-state">
              <p>Loading transactions...</p>
            </div>
          ) : (
            <TransactionHistory
              transactions={transactions}
              userEmail={user.email}
            />
          )}
        </div>
      </div>
    </div>
  );
}
