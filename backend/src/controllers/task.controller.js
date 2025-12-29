const Task = require('../models/task.model');

/**
 * CREATE TASK
 * POST /api/tasks
 */
exports.createTask = async (req, res) => {
  try {
    const { title, description, assignedTo } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({ message: 'Title is required' });
    }

    const task = await Task.create({
      title: title.trim(),
      description,
      assignedTo,
      createdBy: req.user.id
    });

    res.status(201).json({
      message: 'Task created successfully',
      task
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET MY TASKS
 * GET /api/tasks/my
 */
exports.getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ createdBy: req.user.id })
      .sort({ createdAt: -1 });

    res.json({
      message: 'My tasks fetched successfully',
      tasks
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET TASKS ASSIGNED TO ME
 * GET /api/tasks/assigned
 */
exports.getAssignedTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user.id })
      .sort({ createdAt: -1 });

    res.json({
      message: 'Assigned tasks fetched successfully',
      tasks
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * UPDATE TASK STATUS
 * PATCH /api/tasks/:id/status
 */
exports.updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const allowedStatuses = ['todo', 'in-progress', 'done'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const task = await Task.findOne({
      _id: id,
      createdBy: req.user.id
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found or not authorized' });
    }

    task.status = status;
    await task.save();

    res.json({
      message: 'Task status updated successfully',
      task
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET ALL TASKS (ADMIN ONLY)
 * GET /api/tasks/all
 */
exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate('createdBy', 'name email role')
      .populate('assignedTo', 'name email role')
      .sort({ createdAt: -1 });

    res.json({
      message: 'All tasks fetched successfully',
      tasks
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * ASSIGN TASK (MANAGER / ADMIN)
 * PATCH /api/tasks/:id/assign
 */
exports.assignTask = async (req, res) => {
  try {
    const { userId } = req.body;
    const { id } = req.params;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.assignedTo = userId;
    await task.save();

    res.json({
      message: 'Task assigned successfully',
      task
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * DELETE TASK (OWNER / ADMIN)
 * DELETE /api/tasks/:id
 */
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (
      task.createdBy.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized to delete this task' });
    }

    await task.deleteOne();

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



