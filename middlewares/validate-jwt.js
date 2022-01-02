const { request, response } = require("express");
const jwt = require("jsonwebtoken");

const { User } = require("../models");

const validateJWT = async (req = request, res = response, next) => {
  const token = req.header("x-token");

  if (!token) {
    res.status(401).send("Token unexpected");
  }

  try {
    
    const { uid } = jwt.verify(token, process.env.SECRETKEY)
    req.uid = uid;

    next();

  } catch (error) {
    console.log(error);
    return res.status(500).send('Invalid token');
  }
};

module.exports = {
  validateJWT,
};
