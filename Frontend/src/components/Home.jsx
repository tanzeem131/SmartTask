import { useState, useEffect } from "react";
import {
  CheckCircle,
  Circle,
  Clock,
  AlertCircle,
  Plus,
  Filter,
} from "lucide-react";
import Navbar from "./Navbar";
import Label from "./UI/Label";
import Login from "./Login";
import TaskModal from "./TaskModal";
import StatsCard from "./UI/StatsCard";
import TaskCard from "./UI/TaskCard";
import SelectField from "./UI/SelectField";
import { API_URL } from "../utils/constant";

export default function SmartTaskApp() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [authMode, setAuthMode] = useState("login");
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    sort: "dueDate",
  });
  const [showFilters, setShowFilters] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    title: "",
    description: "",
    status: "Pending",
    priority: "Medium",
    dueDate: "",
  });

  const stats = {
    Pending: tasks.filter((task) => task.status === "Pending").length,
    "In Progress": tasks.filter((task) => task.status === "In Progress").length,
    Completed: tasks.filter((task) => task.status === "Completed").length,
  };

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchTasks();
    }
  }, [token, filters]);

  const fetchTasks = async () => {
    console.log("Token:", token);
    try {
      const res = await fetch(`${API_URL}/tasks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setTasks(data.tasks || []);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    const endpoint = authMode === "login" ? "/login" : "/register";

    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        if (authMode === "login") {
          setToken(data.token);
          setUser(data.user);
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
        } else {
          alert("Registration successful! Please login.");
          setAuthMode("login");
        }
        setFormData({ ...formData, name: "", email: "", password: "" });
      } else {
        alert(data.error || "Authentication failed");
      }
    } catch (err) {
      alert("Network error. Please try again.");
    }
  };

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    const method = editingTask ? "PATCH" : "POST";
    const endpoint = editingTask
      ? `${API_URL}/tasks/${editingTask._id}`
      : `${API_URL}/tasks`;

    try {
      const res = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          status: formData.status,
          priority: formData.priority,
          dueDate: formData.dueDate,
        }),
      });

      if (res.ok) {
        fetchTasks();
        setShowModal(false);
        setEditingTask(null);
        setFormData({
          ...formData,
          title: "",
          description: "",
          status: "Pending",
          priority: "Medium",
          dueDate: "",
        });
      }
    } catch (err) {
      alert("Error saving task");
    }
  };

  const handleDeleteTask = async (id) => {
    if (!confirm("Delete this task?")) return;

    try {
      await fetch(`${API_URL}/tasks/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTasks();
    } catch (err) {
      alert("Error deleting task");
    }
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setFormData({
      ...formData,
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate.split("T")[0],
    });
    setShowModal(true);
  };

  const getFilteredAndSortedTasks = () => {
    let filtered = [...tasks];

    if (filters.status) {
      filtered = filtered.filter((task) => task.status === filters.status);
    }

    if (filters.priority) {
      filtered = filtered.filter((task) => task.priority === filters.priority);
    }

    if (filters.sort === "dueDate") {
      filtered.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    } else if (filters.sort === "priority") {
      const priorityOrder = { High: 1, Medium: 2, Low: 3 };
      filtered.sort(
        (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
      );
    }

    return filtered;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const getPriorityColor = (priority) => {
    return priority === "High"
      ? "text-red-600"
      : priority === "Medium"
      ? "text-yellow-600"
      : "text-green-600";
  };

  const getStatusIcon = (status) => {
    if (status === "Completed")
      return <CheckCircle className="text-green-500" size={20} />;
    if (status === "In Progress")
      return <Clock className="text-blue-500" size={20} />;
    return <Circle className="text-gray-400" size={20} />;
  };

  if (!token) {
    return (
      <Login
        handleAuth={handleAuth}
        authMode={authMode}
        setAuthMode={setAuthMode}
        formData={formData}
        setFormData={setFormData}
      />
    );
  }

  const totalTasks = stats.Pending + stats["In Progress"] + stats.Completed;
  const completionRate =
    totalTasks > 0 ? ((stats.Completed / totalTasks) * 100).toFixed(0) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <Navbar user={user} logout={logout} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Tasks"
            value={totalTasks}
            icon={AlertCircle}
          />
          <StatsCard title="Pending" value={stats.Pending} icon={Circle} />
          <StatsCard
            title="In Progress"
            value={stats["In Progress"]}
            icon={Clock}
          />
          <StatsCard
            title="Completed"
            value={stats.Completed}
            icon={CheckCircle}
            subtitle={`${completionRate}% completion`}
          />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">My Tasks</h2>
            <div className="flex gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="hover:cursor-pointer flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
              >
                <Filter size={18} />
                Filters
              </button>
              <button
                onClick={() => {
                  setEditingTask(null);
                  setFormData({
                    ...formData,
                    title: "",
                    description: "",
                    status: "Pending",
                    priority: "Medium",
                    dueDate: "",
                  });
                  setShowModal(true);
                }}
                className="hover:cursor-pointer flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                <Plus size={18} />
                Add Task
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label label="Status" />
                <SelectField
                  value={filters.status}
                  onChange={(e) =>
                    setFilters({ ...filters, status: e.target.value })
                  }
                  options={[
                    { value: "", label: "All" },
                    { value: "Pending", label: "Pending" },
                    { value: "In Progress", label: "In Progress" },
                    { value: "Completed", label: "Completed" },
                  ]}
                />
              </div>
              <div>
                <Label label="Priority" />
                <SelectField
                  value={filters.priority}
                  onChange={(e) =>
                    setFilters({ ...filters, priority: e.target.value })
                  }
                  options={[
                    { value: "", label: "All" },
                    { value: "Low", label: "Low" },
                    { value: "Medium", label: "Medium" },
                    { value: "High", label: "High" },
                  ]}
                />
              </div>
              <div>
                <Label label="Sort By" />
                <SelectField
                  value={filters.sort}
                  onChange={(e) =>
                    setFilters({ ...filters, sort: e.target.value })
                  }
                  options={[
                    { value: "dueDate", label: "Due Date" },
                    { value: "priority", label: "Priority" },
                  ]}
                />
              </div>
            </div>
          )}

          {getFilteredAndSortedTasks().length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-500">
                No tasks found. Create one to get started!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {getFilteredAndSortedTasks().map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  getStatusIcon={getStatusIcon}
                  getPriorityColor={getPriorityColor}
                  openEditModal={openEditModal}
                  handleDeleteTask={handleDeleteTask}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <TaskModal
          setShowModal={setShowModal}
          editingTask={editingTask}
          setEditingTask={setEditingTask}
          formData={formData}
          setFormData={setFormData}
          handleTaskSubmit={handleTaskSubmit}
        />
      )}
    </div>
  );
}
