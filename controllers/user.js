const { request, response } = require("express");
const bcrypt = require('bcryptjs');

const { User } = require('../models');
const { generateJWT } = require("../helpers");

const getUsers = async (req = request, res = response) => {
  
  const { limit = 5, from = 0 } = req.query;
  const query = { enabled: true };

  const [ total, users ] = await Promise.all([
    User.countDocuments(query),
    User.find(query).skip(Number(from)).limit(Number(limit))
  ]);

  res.status(200).json({
    total,
    users
  })

};

const createUser = async (req = request, res = response) => {
  
  const { name, password, email, role } = req.body;
  const user = new User({ name, email, password, role });

  // Crypt pass
  const salt = bcrypt.genSaltSync();
  user.password = bcrypt.hashSync(password, salt);

  await user.save();

  const token = await generateJWT( user.id );

  return res.status(201).json({
    msg: 'User created succesfully',
    token
  })

};

const getUser = async (req = request, res = response) => {
  
  const { id } = req.params;

  const userDB = await User.findById(id);

  if (!userDB) {
    return res.status(500).send('ERROR: We have a issue to find a user')
  }

  return res.status(200).json(userDB)

};

const updateUser = async (req = request, res = response) => {
  const { id } = req.params;
  const { _id, password, google, email, ...data } = req.body;

  if(password){
    const salt = bcrypt.genSaltSync();
    data.password = bcrypt.hashSync(password, salt);
  }

  const userDB = await User.findByIdAndUpdate(id, data);

  return res.status(200).json({
    userDB
  });

};

const deleteUser = async (req = request, res = response) => {

  const { id } = req.params;

  const userDB = await User.findByIdAndUpdate(id, { enabled: false }, {new: true });

  return res.status(200).json(userDB)

};

const purgeDeleteUsers = async(req = request, res = response ) => {

  // Get users from DB
  const usersDB = await User.find({enabled: false});

  // Validate if i have users to delete
  if (usersDB <= 0) {
    return res.status(400).send('Nothing to delete')
  }

  // Convert to Array
  const users = await Object.values(usersDB);

  // Convert a new array just with id
  const ids = users.map( user => {
    return user.id
  })

  // Delete all
  await ids.forEach( id => {
    User.findByIdAndRemove(id, (err) => {

      if (err) {
        return res.status(500).send('ERROR: We cant deleted the users, please try later.')
      } else {

        return res.status(200).json({
          msg: "Purge Complete",
          ids
        })
      }

    })
  })
}

module.exports = {
  getUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  purgeDeleteUsers
};
