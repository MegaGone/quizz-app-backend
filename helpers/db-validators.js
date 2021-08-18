const { User } = require("../models");

const validateEmail = async (email = "") => {
  const emailVerified = await User.findOne({ email });

  if (emailVerified) {
      throw new Error(`ERROR: ${email} as already in use`)
  }
};

const verifyUserById = async id => {

  const userVerified = await User.findById(id);

  if( !userVerified ){
    throw new Error(`ERROR: ID ${id} dont exist`)
  }
};

module.exports = {
  validateEmail,
  verifyUserById
};
