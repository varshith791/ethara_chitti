const Project = require('../models/Project');
const User = require('../models/User');

const createProject = async (req, res) => {
  const { title, description, teamMembers } = req.body;
  if (!title) {
    res.status(400);
    throw new Error('Project title is required');
  }

  const members = teamMembers || [];
  const validMembers = await User.find({ _id: { $in: members } }).select('_id');

  const project = await Project.create({
    title,
    description,
    createdBy: req.user._id,
    teamMembers: validMembers.map((member) => member._id),
  });

  res.status(201).json(project);
};

const getProjects = async (req, res) => {
  let query = {};
  if (req.user.role === 'Member') {
    query = { teamMembers: req.user._id };
  }

  const projects = await Project.find(query)
    .populate('createdBy', 'name email role')
    .populate('teamMembers', 'name email role')
    .sort({ createdAt: -1 });

  res.json(projects);
};

const addTeamMember = async (req, res) => {
  const { projectId } = req.params;
  const { userId } = req.body;

  const project = await Project.findById(projectId);
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (project.teamMembers.includes(userId)) {
    res.status(400);
    throw new Error('User already belongs to this project');
  }

  project.teamMembers.push(userId);
  await project.save();

  res.json(project);
};

const removeTeamMember = async (req, res) => {
  const { projectId } = req.params;
  const { userId } = req.body;

  const project = await Project.findById(projectId);
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  project.teamMembers = project.teamMembers.filter((memberId) => memberId.toString() !== userId);
  await project.save();

  res.json(project);
};

module.exports = { createProject, getProjects, addTeamMember, removeTeamMember };
