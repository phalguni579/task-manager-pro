import api from "../api/axios";

function TaskList({ tasks, onStatusChange }) {
  const handleStatusUpdate = async (id, status) => {
    try {
      await api.patch(`/tasks/${id}/status`, { status });
      onStatusChange();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  if (!tasks.length) {
    return <p>No tasks yet.</p>;
  }

  return (
    <ul>
      {tasks.map((task) => (
        <li key={task._id} style={{ marginBottom: "10px" }}>
          <strong>{task.title}</strong>
          <p>{task.description}</p>

          <select
            value={task.status}
            onChange={(e) =>
              handleStatusUpdate(task._id, e.target.value)
            }
          >
            <option value="todo">Todo</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </li>
      ))}
    </ul>
  );
}

export default TaskList;
