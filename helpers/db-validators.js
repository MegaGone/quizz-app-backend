const { User, Role, Quiz } = require("../models");

const validateRole = async (role = "") => {
  const existRole = await Role.findOne({ role });

  if (!existRole) {
    throw new Error(`${role} its an invalid role`);
  }
};

const validateEmail = async (email = "") => {
  const emailVerified = await User.findOne({ email });

  if (emailVerified) {
    throw new Error(`ERROR: ${email} as already in use`);
  }
};

const verifyUserById = async id => {
  const userVerified = await User.findById(id);

  if (!userVerified) {
    throw new Error(`ERROR: User with ID:${id} dont exist`);
  }
};

const verifyQuizById = async id => {
  const quizDB = await Quiz.findById(id);

  if (!quizDB) {
    throw new Error(`ERROR: Quiz with ID:${id} dont exist`)
  }
};

module.exports = {
  validateEmail,
  verifyUserById,
  validateRole,
  verifyQuizById
};
