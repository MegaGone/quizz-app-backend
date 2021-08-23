const { request, response } = require("express");
const jwt = require("jsonwebtoken");

const { User } = require("../models");

const validateJWT = async (req = request, res = response, next) => {
  const token = req.header("x-token");

  if (!token) {
    res.status(401).send("Token unexpected");
  }

  try {
    const { uid } = jwt.verify(token, process.env.SECRETKEY);

    const user = await User.findById(uid);

    if (!user) {
      return res.status(401).send("Invalid token - Dosnt exist in DB");
    }

    if (!user.enabled) {
      return res.status(401).send("Invalid token - enabled: false");
    }

    req.user = user;

    next();
  } catch (err) {
    console.log(err);
    return res.status(401).send("Invalid token");
  }
};

module.exports = {
  validateJWT,
};
