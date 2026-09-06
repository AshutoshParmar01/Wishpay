import { useState } from "react";

export default function SendMoney({ userId, onSuccess }) {
  const [receiverEmail, setReceiverEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!receiverEmail || !amount) {
      setError("Please fill in all fields");
      return;
    }

    if (isNaN(amount) || amount <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/transactions/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderId: userId,
          receiverEmail,
          amount: parseFloat(amount),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Transaction failed");
        return;
      }

      onSuccess(amount, receiverEmail);
      setReceiverEmail("");
      setAmount("");
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="send-form">
      {error && <div className="error">{error}</div>}

      <div className="form-group">
        <label>Recipient Email</label>
        <input
          type="email"
          value={receiverEmail}
          onChange={(e) => setReceiverEmail(e.target.value)}
          placeholder="recipient@example.com"
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label>Amount (₹)</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          min="1"
          step="0.01"
          disabled={loading}
        />
      </div>

      <button
        type="submit"
        className="btn btn-primary"
        disabled={loading}
      >
        {loading ? "Sending..." : "Send Money"}
      </button>
    </form>
  );
}
