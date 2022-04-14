const { request, response } = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { User } = require("../models");
const { generateJWT } = require("../helpers");
const { googleVerify } = require('../helpers')

const login = async (req = request, res = response) => {
  const { email, password } = req.body;

  try {

    const user = await User.findOne({ email });

    if(!user){
        return res.status(400).send('ERROR: USER / PASSWORD are wrong');
    }

    if( !user.enabled ) {
        return res.status(400).send('ERROR: USER Dont exist');
    }

    const validPassword = bcrypt.compareSync(password, user.password)

    if(!validPassword){
        return res.status(400).send('ERROR: USER / PASSWORD are wrong');
    }

    const token = await generateJWT(user.id);

    return res.status(200).json({ user, token })

  } catch (e) {
    console.log(e);
    return res.status(500).json({
      msg: "Something has gone wrong, try again later",
    });
  }
};

const googleSignIn = async (req = request, res = response ) => {

  const googleToken = req.body.token;

  try {

    const { name, email, picture } = await googleVerify(googleToken)

    const UserDB = await User.findOne({email})
    let user;

    if (!UserDB) {
      user = new User({
        name, 
        email,
        password: '@@@',
        img: picture,
        google: true
      })
    } else {

      user = UserDB;
      user.google = true;
    }

    await user.save();
    
    const token = await generateJWT(user.id);

    return res.status(200).json({token})

  } catch (error) {
    console.log(error);
    return res.status(500).send('Error to get google token')
  }
}

const renewToken = async(req = request, res = response) => {
  
  const uid = req.uid;

  const token = await generateJWT( uid );

  return res.status(200).json({token})

}

const getSession = async (req = request, res = response) => {

  const token = req.header('x-token');

  try {
    
    const { uid } = await jwt.verify(token, process.env.SECRETKEY);

    const UserDB = await User.findById({_id: uid})

    if(!UserDB) {
      return res.status(404).send('ERROR: To get session')
    }

    return res.status(200).json(UserDB)

  } catch (error) {
    return res.status(400).send('ERROR: To verify session')
  }
  
}

const changePassword = async (req = request, res = response) => {

  const currentPassword = req.currentPass;
  const newPassword     = req.newPass;
  const { _id: uid }             = req.user;

  if(currentPassword == newPassword) {
    return res.status(400).send('ERROR: The new password must not be the same as the current password.')
  }

  try {
    
    let userDB = await User.findById(uid);

    if(!userDB) {
      return res.status(400).send('ERROR: To find user to update password.')
    }

    const salt = bcrypt.genSaltSync();
    userDB.password = bcrypt.hashSync(newPassword, salt);

    await userDB.save();

    return res.status(200).send('Password updated successfully')

  } catch (error) {
    return res.status(500).send('ERROR: To update password');
  }

  return res.json({
    currentPassword,
    newPassword,
    uid
  })

}

module.exports = {
  login,
  googleSignIn,
  renewToken,
  getSession,
  changePassword
};
