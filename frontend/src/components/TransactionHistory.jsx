export default function TransactionHistory({ transactions, userEmail }) {
  if (transactions.length === 0) {
    return (
      <div className="empty-state">
        <p>No transactions yet</p>
      </div>
    );
  }

  return (
    <div className="transaction-list">
      {transactions.map((transaction) => {
        const isSent = transaction.senderEmail === userEmail;
        const otherParty = isSent
          ? transaction.receiverEmail
          : transaction.senderEmail;
        const transactionType = isSent ? "Sent to" : "Received from";

        return (
          <div
            key={transaction._id}
            className={`transaction-item ${isSent ? "sent" : "received"}`}
          >
            <div className="transaction-info">
              <div className="transaction-type">{transactionType}</div>
              <div className="transaction-email">{otherParty}</div>
              <div className="transaction-date">
                {new Date(transaction.createdAt).toLocaleString()}
              </div>
            </div>
            <div
              className={`transaction-amount ${isSent ? "sent" : "received"}`}
            >
              {isSent ? "-" : "+"} ₹{transaction.amount.toFixed(2)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
