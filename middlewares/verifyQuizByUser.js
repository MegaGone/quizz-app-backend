const { response, request } = require("express");
const jwt = require("jsonwebtoken");

const { Quiz } = require("../models");

const verifyQuizByUser = async (req = request, res = response, next) => {

    const token = req.header('x-token'); // Token
    const { id } = req.params;  // Quiz Id

    try {
        
        // Get the user
        const { uid } = jwt.verify(token, process.env.SECRETKEY);

        const quizDB = await Quiz.find(
            { _id: id, "author": uid}
        )
        
        if(quizDB.length == 0) {
            return res.status(401).send('Access Denied')
        } else {
            next();
        }

    } catch (error) {
        return res.status(400).send('ERROR: To verify quiz')
    }

}

module.exports = {
    verifyQuizByUser
}