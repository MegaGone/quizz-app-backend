const { request, response } = require("express");
const bcrypt = require("bcryptjs");

const { User } = require("../models");
const { generateJWT } = require("../helpers");

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

module.exports = {
  login,
};
