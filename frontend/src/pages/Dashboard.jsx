import { useEffect, useState } from "react";
import api from "../api/axios";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";

function Dashboard({ setToken }) {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
  try {
    const res = await api.get("/tasks/my");
    setTasks(res.data.tasks);
  } catch (err) {
    console.error(err);
  }
};


  useEffect(() => {
    fetchTasks();
  }, []);

  const logout = () => {
    localStorage.clear();
    setToken(null);
  };

  return (
    <div style={{ padding: 30 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>My Tasks</h2>
        <button onClick={logout}>Logout</button>
      </div>

      <TaskForm onTaskCreated={fetchTasks} />
      <TaskList tasks={tasks} onStatusChange={fetchTasks} />
    </div>
  );
}

export default Dashboard;   // ⭐⭐⭐ THIS LINE IS MUST

