import Project from '../models/Project.js';
import Task from '../models/Task.js';

const taskPopulation = (query) =>
  query
    .populate('projectId', 'name teamMembers createdBy')
    .populate('assignedTo', 'name email role')
    .sort({ deadline: 1, createdAt: -1 });

const canAccessProject = async (user, projectId) => {
  const filter =
    user.role === 'Admin'
      ? { _id: projectId, createdBy: user._id }
      : { _id: projectId, teamMembers: user._id };

  return Project.exists(filter);
};

export const getTasks = async (req, res, next) => {
  try {
    const { projectId } = req.query;
    const filter = {};

    if (projectId) {
      const allowed = await canAccessProject(req.user, projectId);
      if (!allowed) {
        return res.status(403).json({ message: 'You do not have access to this project' });
      }

      if (req.user.role !== 'Admin') {
        const project = await Project.findById(projectId).select('fullAccessMembers');
        const hasFullAccess = project.fullAccessMembers.some((id) => id.toString() === req.user._id.toString());
        if (!hasFullAccess) {
          filter.assignedTo = req.user._id;
        }
      }
      filter.projectId = projectId;
    } else if (req.user.role === 'Admin') {
      const projects = await Project.find({ createdBy: req.user._id }).select('_id');
      filter.projectId = { $in: projects.map((project) => project._id) };
    } else {
      const fullAccessProjects = await Project.find({ fullAccessMembers: req.user._id }).select('_id');
      const fullAccessIds = fullAccessProjects.map((project) => project._id);

      filter.$or = [
        { assignedTo: req.user._id },
        { projectId: { $in: fullAccessIds } }
      ];
    }

    const tasks = await taskPopulation(Task.find(filter));
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

export const createTask = async (req, res, next) => {
  try {
    const { title, description, projectId, assignedTo, deadline } = req.body;

    if (!title?.trim() || !projectId || !assignedTo || !deadline) {
      return res.status(400).json({ message: 'Title, project, assignee, and deadline are required' });
    }

    const project = await Project.findOne({ _id: projectId, createdBy: req.user._id });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const isTeamMember = project.teamMembers.some((memberId) => memberId.toString() === assignedTo);
    if (!isTeamMember) {
      project.teamMembers.push(assignedTo);
      await project.save();
    }

    const task = await Task.create({
      title,
      description,
      projectId,
      assignedTo,
      deadline
    });

    const savedTask = await taskPopulation(Task.findById(task._id));
    res.status(201).json(savedTask);
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!['Todo', 'In Progress', 'Done'].includes(status)) {
      return res.status(400).json({ message: 'Status must be Todo, In Progress, or Done' });
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (req.user.role === 'Member' && task.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Members can update only their assigned tasks' });
    }

    if (req.user.role === 'Admin') {
      const project = await Project.exists({ _id: task.projectId, createdBy: req.user._id });
      if (!project) {
        return res.status(403).json({ message: 'You do not have access to this task' });
      }
    }

    task.status = status;
    await task.save();

    const updatedTask = await taskPopulation(Task.findById(task._id));
    res.json(updatedTask);
  } catch (error) {
    next(error);
  }
};
