import Project from '../models/Project.js';
import User from '../models/User.js';

const populateProject = (query) =>
  query
    .populate('createdBy', 'name email role')
    .populate('teamMembers', 'name email role')
    .populate('fullAccessMembers', 'name email role')
    .sort({ createdAt: -1 });

export const getProjects = async (req, res, next) => {
  try {
    const filter =
      req.user.role === 'Admin'
        ? { createdBy: req.user._id }
        : { teamMembers: req.user._id };

    const projects = await populateProject(Project.find(filter));
    res.json(projects);
  } catch (error) {
    next(error);
  }
};

export const createProject = async (req, res, next) => {
  try {
    const { name, teamMembers = [], fullAccessMembers = [] } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({ message: 'Project name is required' });
    }

    const validMembers = await User.find({ _id: { $in: teamMembers } }).select('_id');
    const memberIds = validMembers.map((member) => member._id.toString());

    const validFullAccess = validMembers.filter((member) => fullAccessMembers.includes(member._id.toString()));
    const fullAccessIds = validFullAccess.map((member) => member._id.toString());

    const project = await Project.create({
      name,
      createdBy: req.user._id,
      teamMembers: memberIds,
      fullAccessMembers: fullAccessIds
    });

    const savedProject = await populateProject(Project.findById(project._id));
    res.status(201).json(savedProject);
  } catch (error) {
    next(error);
  }
};

export const updateProjectMembers = async (req, res, next) => {
  try {
    const { teamMembers = [], fullAccessMembers = [] } = req.body;
    const project = await Project.findOne({ _id: req.params.id, createdBy: req.user._id });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const validMembers = await User.find({ _id: { $in: teamMembers } }).select('_id');
    const validFullAccess = validMembers.filter((member) => fullAccessMembers.includes(member._id.toString()));

    project.teamMembers = validMembers.map((member) => member._id);
    project.fullAccessMembers = validFullAccess.map((member) => member._id);
    await project.save();

    const updatedProject = await populateProject(Project.findById(project._id));
    res.json(updatedProject);
  } catch (error) {
    next(error);
  }
};
