const { request, response } = require("express");

const getUsers = async (req = request, res = response) => {
  res.send("GET USERS");
};

const createUser = async (req = request, res = response) => {
  res.send("CREATE USER");
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
