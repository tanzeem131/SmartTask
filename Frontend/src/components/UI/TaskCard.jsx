import { Edit2, Trash2 } from "lucide-react";

const TaskCard = ({
  task,
  getStatusIcon,
  getPriorityColor,
  openEditModal,
  handleDeleteTask,
}) => {
  return (
    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition border border-gray-200">
      <div className="flex-shrink-0">{getStatusIcon(task.status)}</div>

      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-gray-900 truncate">{task.title}</h3>
        <p className="text-sm text-gray-600 truncate">{task.description}</p>

        <div className="flex items-center gap-4 mt-2">
          <span
            className={`text-xs font-medium ${getPriorityColor(task.priority)}`}
          >
            {task.priority} Priority
          </span>
          <span className="text-xs text-gray-500">
            Due: {new Date(task.dueDate).toLocaleDateString()}
          </span>
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              task.status === "Completed"
                ? "bg-green-100 text-green-700"
                : task.status === "In Progress"
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {task.status}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => openEditModal(task)}
          className="hover:cursor-pointer p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
        >
          <Edit2 size={18} />
        </button>
        <button
          onClick={() => handleDeleteTask(task._id)}
          className="hover:cursor-pointer p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
