const { Project, User } = require('../models');

const createProject = async (req, res) => {
  const { title, description, teamMembers = [] } = req.body;
  if (!title) {
    res.status(400);
    throw new Error('Project title is required');
  }

  const project = await Project.create({
    title,
    description,
    createdBy: req.user.id,
  });

  if (teamMembers.length) {
    const members = await User.findAll({ where: { id: teamMembers } });
    await project.addTeamMembers(members);
  }

  const result = await Project.findByPk(project.id, {
    include: [
      { model: User, as: 'creator', attributes: ['id', 'name', 'email', 'role'] },
      { model: User, as: 'teamMembers', attributes: ['id', 'name', 'email', 'role'], through: { attributes: [] } },
    ],
  });

  res.status(201).json(result);
};

const getProjects = async (req, res) => {
  const baseInclude = [
    { model: User, as: 'creator', attributes: ['id', 'name', 'email', 'role'] },
    { model: User, as: 'teamMembers', attributes: ['id', 'name', 'email', 'role'], through: { attributes: [] } },
  ];

  let projects;
  if (req.user.role === 'Member') {
    projects = await Project.findAll({
      include: [
        baseInclude[0],
        {
          ...baseInclude[1],
          where: { id: req.user.id },
          required: true,
        },
      ],
      order: [['createdAt', 'DESC']],
    });
  } else {
    projects = await Project.findAll({ include: baseInclude, order: [['createdAt', 'DESC']] });
  }

  res.json(projects);
};

const addTeamMember = async (req, res) => {
  const { projectId } = req.params;
  const { userId } = req.body;

  const projectIdInt = parseInt(projectId);
  const userIdInt = parseInt(userId);

  if (isNaN(projectIdInt) || isNaN(userIdInt)) {
    res.status(400);
    throw new Error('Invalid project or user ID');
  }

  const project = await Project.findByPk(projectIdInt);
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  const user = await User.findByPk(userIdInt);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const isMember = await project.hasTeamMember(user);
  if (isMember) {
    res.status(400);
    throw new Error('User already belongs to this project');
  }

  await project.addTeamMember(user);
  const updatedProject = await Project.findByPk(project.id, {
    include: [
      { model: User, as: 'creator', attributes: ['id', 'name', 'email', 'role'] },
      { model: User, as: 'teamMembers', attributes: ['id', 'name', 'email', 'role'], through: { attributes: [] } },
    ],
  });

  res.json(updatedProject);
};

const removeTeamMember = async (req, res) => {
  const { projectId } = req.params;
  const { userId } = req.body;

  const projectIdInt = parseInt(projectId);
  const userIdInt = parseInt(userId);

  if (isNaN(projectIdInt) || isNaN(userIdInt)) {
    res.status(400);
    throw new Error('Invalid project or user ID');
  }

  const project = await Project.findByPk(projectIdInt);
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  const user = await User.findByPk(userIdInt);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  await project.removeTeamMember(user);

  const updatedProject = await Project.findByPk(project.id, {
    include: [
      { model: User, as: 'creator', attributes: ['id', 'name', 'email', 'role'] },
      { model: User, as: 'teamMembers', attributes: ['id', 'name', 'email', 'role'], through: { attributes: [] } },
    ],
  });

  res.json(updatedProject);
};

module.exports = { createProject, getProjects, addTeamMember, removeTeamMember };
