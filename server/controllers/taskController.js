const Task = require('../models/Task');

const getUserTasks = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [tasks, total] = await Promise.all([
      Task.find({ user: req.user })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('category', 'name'),
      Task.countDocuments({ user: req.user }),
    ]);

    return res.status(200).json({
      tasks,
      total,
      page,
      pages: Math.ceil(total / limit) || 1,
      limit,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message || 'Unable to fetch tasks' });
  }
};

const createTask = async (req, res) => {
  const { title, description, priority, dueDate, category } = req.body;

  if (!title) {
    return res.status(400).json({ message: 'Title is required' });
  }

  try {
    const task = await Task.create({
      title,
      description: description || '',
      priority: priority || 'medium',
      dueDate,
      category,
      user: req.user,
    });

    const populatedTask = await task.populate('category', 'name');
    return res.status(201).json(populatedTask);
  } catch (error) {
    return res.status(400).json({ message: error.message || 'Unable to create task' });
  }
};

const getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user }).populate('category', 'name');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    return res.status(200).json(task);
  } catch (error) {
    return res.status(404).json({ message: 'Task not found' });
  }
};

const updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const allowedFields = ['title', 'description', 'priority', 'dueDate', 'category', 'completed'];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        task[field] = req.body[field];
      }
    });

    const updatedTask = await task.save();
    const populatedTask = await updatedTask.populate('category', 'name');

    return res.status(200).json(populatedTask);
  } catch (error) {
    return res.status(400).json({ message: error.message || 'Unable to update task' });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await task.deleteOne();
    return res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    return res.status(400).json({ message: error.message || 'Unable to delete task' });
  }
};

const toggleTaskComplete = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.completed = !task.completed;
    const updatedTask = await task.save();

    return res.status(200).json(updatedTask);
  } catch (error) {
    return res.status(400).json({ message: error.message || 'Unable to update task' });
  }
};

const searchTasks = async (req, res) => {
  try {
    const searchTerm = req.query.q || '';

    const tasks = await Task.find({
      user: req.user,
      title: { $regex: searchTerm, $options: 'i' },
    })
      .sort({ createdAt: -1 })
      .populate('category', 'name');

    return res.status(200).json(tasks);
  } catch (error) {
    return res.status(400).json({ message: error.message || 'Unable to search tasks' });
  }
};

const getDueTodayTasks = async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const tasks = await Task.find({
      user: req.user,
      dueDate: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    })
      .sort({ dueDate: 1 })
      .populate('category', 'name');

    return res.status(200).json(tasks);
  } catch (error) {
    return res.status(400).json({ message: error.message || 'Unable to fetch due today tasks' });
  }
};

const getTaskStats = async (req, res) => {
  try {
    const [pending, completed] = await Promise.all([
      Task.countDocuments({ user: req.user, completed: false }),
      Task.countDocuments({ user: req.user, completed: true }),
    ]);

    return res.status(200).json({ pending, completed });
  } catch (error) {
    return res.status(400).json({ message: error.message || 'Unable to fetch task stats' });
  }
};

module.exports = {
  getUserTasks,
  createTask,
  getTaskById,
  updateTask,
  deleteTask,
  toggleTaskComplete,
  searchTasks,
  getDueTodayTasks,
  getTaskStats,
};
