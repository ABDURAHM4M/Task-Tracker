import asyncHandler from "express-async-handler";
import TaskModel from "../../models/tasks/TaskModel.js";

// Create Task
export const createTask = asyncHandler(async (req, res) => {
  const { title, description, dueDate, priority, status } = req.body;

  if (!title || title.trim() === "") {
    return res.status(400).json({ message: "Title is required!" });
  }

  if (!description || description.trim() === "") {
    return res.status(400).json({ message: "Description is required!" });
  }

  const task = new TaskModel({
    title,
    description,
    dueDate,
    priority,
    status,
    user: req.user._id,
  });

  await task.save();
  return res.status(201).json(task);
});

// Get All Tasks for User
export const getTasks = asyncHandler(async (req, res) => {
  const tasks = await TaskModel.find({ user: req.user._id });
  return res.status(200).json({ length: tasks.length, tasks });
});

// Get Single Task
export const getTask = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Please provide a task ID" });
  }

  const task = await TaskModel.findById(id);
  if (!task) {
    return res.status(404).json({ message: "Task not found!" });
  }

  if (!task.user.equals(req.user._id)) {
    return res.status(403).json({ message: "Forbidden: Not your task!" });
  }

  return res.status(200).json(task);
});

// Update Task
export const updateTask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description, dueDate, priority, status, completed } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Please provide a task ID" });
  }

  const task = await TaskModel.findById(id);
  if (!task) {
    return res.status(404).json({ message: "Task not found!" });
  }

  if (!task.user.equals(req.user._id)) {
    return res.status(403).json({ message: "Forbidden: Not your task!" });
  }

  task.title = title ?? task.title;
  task.description = description ?? task.description;
  task.dueDate = dueDate ?? task.dueDate;
  task.priority = priority ?? task.priority;
  task.status = status ?? task.status;
  task.completed = completed ?? task.completed;

  await task.save();
  return res.status(200).json(task);
});

// Delete Single Task
export const deleteTask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const task = await TaskModel.findById(id);

  if (!task) {
    return res.status(404).json({ message: "Task not found!" });
  }

  if (!task.user.equals(req.user._id)) {
    return res.status(403).json({ message: "Forbidden: Not your task!" });
  }

  await task.remove();
  return res.status(200).json({ message: "Task deleted successfully!" });
});

// Delete All Tasks for User
export const deleteAllTasks = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const tasks = await TaskModel.find({ user: userId });

  if (tasks.length === 0) {
    return res.status(404).json({ message: "No tasks found!" });
  }

  await TaskModel.deleteMany({ user: userId });
  return res.status(200).json({ message: "All tasks deleted successfully!" });
});
