import { useState, useEffect } from "react";
import "./App.css";
import Auth from "./components/Auth";
import Dashboard from "./components/Dashboard";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="app">
      {user ? (
        <Dashboard user={user} setUser={setUser} onLogout={handleLogout} />
      ) : (
        <Auth setUser={setUser} />
      )}
    </div>
  );
}

export default App;

