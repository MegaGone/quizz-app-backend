const { request, response } = require("express");
const bcrypt = require('bcryptjs');

const { User } = require('../models')

const getUsers = async (req = request, res = response) => {
  res.send("GET USERS");
};

const createUser = async (req = request, res = response) => {
  
  const { name, password, email, role } = req.body;
  const user = new User({ name, email, password, role });

  // Crypt pass
  const salt = bcrypt.genSaltSync();
  user.password = bcrypt.hashSync(password, salt);

  await user.save();

  res.json({
    user
  })

};

const getUser = async (req = request, res = response) => {
  res.send("GET USER BY ID");
};

const updateUser = async (req = request, res = response) => {
  res.send("UPDATE USER BY ID");
};

const deleteUser = async (req = request, res = response) => {
  res.send("DELETE USER BY ID");
};

module.exports = {
  getUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
};
