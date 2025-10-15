const express = require("express");
const taskRouter = express.Router();
const Task = require("../models/task");
const { authenticateToken } = require("../middlewares/auth");

taskRouter.get("/api/tasks", authenticateToken, async (req, res) => {
  try {
    const query = { userId: req.user._id };
    const tasks = await Task.find(query);
    res.json({ tasks });
  } catch (err) {
    res.status(500).json({ error: "Error fetching tasks." });
  }
});

taskRouter.post("/api/tasks", authenticateToken, async (req, res) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;

    if (!title || !dueDate) {
      return res
        .status(400)
        .json({ error: "Title and due date are required." });
    }

    const task = new Task({
      userId: req.user._id,
      title,
      description,
      status: status,
      priority: priority,
      dueDate: new Date(dueDate),
    });

    await task.save();
    res.status(201).json({ message: "Task created successfully.", task });
  } catch (err) {
    console.error("TASK CREATION ERROR:", err);
    res.status(500).json({ error: "Error creating task." });
  }
});

taskRouter.patch("/api/tasks/:id", authenticateToken, async (req, res) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;

    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!task) {
      return res.status(404).json({ error: "Task not found." });
    }

    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (status) task.status = status;
    if (priority) task.priority = priority;
    if (dueDate) task.dueDate = new Date(dueDate);

    await task.save();
    res.json({ message: "Task updated successfully.", task });
  } catch (err) {
    res.status(500).json({ error: "Error updating task." });
  }
});

taskRouter.delete("/api/tasks/:id", authenticateToken, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!task) {
      return res.status(404).json({ error: "Task not found." });
    }

    res.json({ message: "Task deleted successfully." });
  } catch (err) {
    res.status(500).json({ error: "Error deleting task." });
  }
});

module.exports = taskRouter;
