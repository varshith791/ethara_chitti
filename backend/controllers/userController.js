const { User } = require('../models');

const getUsers = async (req, res) => {
  const users = await User.findAll({
    attributes: ['id', 'name', 'email', 'role'],
    order: [['name', 'ASC']],
  });
  res.json(users);
};

module.exports = { getUsers };