const { request, response } = require("express");
const bcrypt = require("bcryptjs");

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

  res.json({
    token
  })

}

module.exports = {
  login,
  googleSignIn,
  renewToken
};
