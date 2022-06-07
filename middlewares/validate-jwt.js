const { request, response } = require("express");
const jwt = require("jsonwebtoken");

const { Stats, Quiz, User } = require("../models");

const validateJWT = async (req = request, res = response, next) => {
  const token = req.header("x-token");

  if (!token) {
    return res.status(401).send("Token unexpected");
  }

  try {

    const { uid } = jwt.verify(token, process.env.SECRETKEY);

    const user = await User.findById(uid);

    if (!user) {
      return res.status(401).send('Invalid token - Dont exist in DB');
    }

    if (!user.enabled) {
      return res.status(401).send('Invalid token - User not enabled');
    }

    req.user = user;

    next();

  } catch (error) {
    return res.status(401).send('Invalid token')
  }

};

const validateJwtToRenewToken = async (req = request, res = response, next) => {
  // Get token from the header - x-token
  const token = req.header('x-token');

  if (!token) return res.status(401).send('Token unexpected');

  try {

    const { uid } = jwt.verify(token, process.env.SECRETKEY);

    req.uid = uid;

    next();

  } catch (error) {
    console.log(error);
    return res.status(500).send('Invalid token')
  }
}

const validateJWTGuest = async (req = request, res = response, next) => {

  const token = req.header('y-token');

  if (!token) {
    return res.status(401).send('Token unexpected');
  }

  try {

    const { uid: user, quizId: id } = jwt.verify(token, process.env.SECRETKEY);

    const quizDB = await Quiz.findById({ _id: id });
    const statsDB = await Stats.findOne({ quizId: id, playerId: user });

    if (!quizDB) {
      return res.status(400).json({
        Ok: false,
        message: 'Quiz not find'
      })
    }

    if (!statsDB) {
      return res.status(400).json({
        Ok: false,
        message: 'Stats not find'
      })
    }

    next();

  } catch (error) {
    return res.status(401).send('Invalid token');
  }

}

module.exports = {
  validateJWT,
  validateJwtToRenewToken,
  validateJWTGuest
};
