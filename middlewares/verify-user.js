const { request, response } = require("express");
const { User } = require('../models');

const verifyEmail = async( req = request, res = response, next ) => {

    const { email } = req.body;

    const userDB = await User.findOne({email})

    if (userDB) {
        return res.status(400).send('Email is already exist');
    }

    next();

};

module.exports = {
    verifyEmail
}