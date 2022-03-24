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

const verifyQuizByCode = async (req = request, res = response, next) => {

    const token = req.header('x-token');

    const { code } = req.params;

    try {
        
        const { uid } = jwt.verify(token, process.env.SECRETKEY);

        const author = await Quiz.findOne({code: code}).then((quiz) => quiz.author)
        .catch((err) => {
           return res.status(400).send('ERROR: To verify quiz') 
        })

        console.log(author);

        if(author != uid) {
            return res.status(401).send('Unauthorized')
        } 

        next();

    } catch (error) {
        console.log(error);
        return res.status(400).send('ERROR: To verify code')
    }

}

module.exports = {
    verifyQuizByUser,
    verifyQuizByCode
}