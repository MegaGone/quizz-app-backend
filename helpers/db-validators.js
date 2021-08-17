const { User } = require("../models");

const validateEmail = async (email = "") => {
  const emailVerified = await User.findOne({ email });

  if (emailVerified) {
      throw new Error(`ERROR: ${email} as already in use`)
  }
};

module.exports = {
  validateEmail,
};
