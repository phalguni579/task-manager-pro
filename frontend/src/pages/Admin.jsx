import { useEffect, useState } from "react";
import api from "../api/axios";

function Admin({ setToken }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllTasks = async () => {
    try {
      const res = await api.get("/tasks/all");
      setTasks(res.data.tasks);
    } catch (e) {
      alert("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllTasks();
  }, []);

  const logout = () => {
    localStorage.clear();
    setToken(null);
  };

  return (
    <div style={{ padding: 30 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Admin – All Tasks</h2>
        <button onClick={logout}>Logout</button>
      </div>

      {loading && <p>Loading...</p>}

      <ul>
        {tasks.map((t) => (
          <li key={t._id} style={{ marginBottom: 10 }}>
            <strong>{t.title}</strong> — {t.status}
            <div style={{ fontSize: 12, color: "#555" }}>
              Created by: {t.createdBy?.email}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Admin;
