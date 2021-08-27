const { request, response } = require("express");
const { Quiz } = require('../models')

const validatePartipant = async (req = request, res = response, next ) => {

    const { code } = req.body;
    const { _id: id } = req.user;

    const quiz = await Quiz.find({code}); 

    if(!quiz){
        return res.status(400).send('ERROR: The quiz dont exist')
    }

    try {
        const participants = quiz[0].participants;

        const ids = participants.map(participant => participant.userId);

        if( ids.includes(id) ){
            return res.status(400).send('ERROR: You have already participate in the quiz');
        } else {
            next();
        }
        
    } catch (error) {
        return res.status(400).send('ERROR: You already participate in the quizz')
    }

    
}

module.exports = {
    validatePartipant
}