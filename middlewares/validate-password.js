const { request, response } = require("express");
const bcrypt = require("bcryptjs");
const { User } = require("../models");

const validateCurrentPassword = async (req = request, res = response, next) => {

    const { currentPassword, newPassword } = req.body;
    const { password } = req.user;

    try {
        
        // Remove spaces at start/end
        let trimedCurrentPassword = currentPassword.trim();
        let trimedNewPassword = newPassword.trim();

        // Remove spaces between characters
        trimedCurrentPassword = trimedCurrentPassword.replace(/ +/g, "")
        trimedNewPassword = trimedNewPassword.replace(/ +/g, "");

        const hashedPassword = bcrypt.compareSync(trimedCurrentPassword, password)

        if(!hashedPassword) {
            return res.status(400).send('ERROR: Current password Invalid');
        }

        // Set the passwords trimed's
        req.currentPass = trimedCurrentPassword;
        req.newPass     = trimedNewPassword;

        next();

    } catch (error) {
        console.log(error);
        return res.status(400).send('ERROR: To Validate Password')
    }

}

module.exports = {
    validateCurrentPassword
};