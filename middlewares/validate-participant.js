const { request, response } = require("express");
const { Quiz } = require('../models')

const validatePartipant = async (req = request, res = response, next ) => {

    const { code } = req.body;
    const { _id: id } = req.user;

    const quiz = await Quiz.find({code}); 

    if(!quiz){
        return res.status(400).json({
            Ok: false,
            message: "The quiz doesn't exist"
        })
    }

    try {
        const participants = quiz[0].participants;

        const ids = participants.map(participant => participant.userId);

        if( ids.includes(id) ){
            return res.status(400).json({
                Ok: false,
                message: 'You have already participate in the quiz.'
            })
        } else {
            next();
        }
        
    } catch (error) {
        return res.status(400).send('ERROR: You already participate in the quizz.')
    }

    
}

const verifyParticipant = async ( req = request, res = response, next ) => {

    const { id, user } = req.params;

    try {
        
        const quizDB = await Quiz.findById(id);

        if(!quizDB) {
            return res.status(400).send("ERROR: Quiz doesn't exist")
        }

        const { participants } = quizDB;

        const existParticipant = participants.findIndex(participant => participant.userId == user);

        if(existParticipant >= 0) {
            next();
        } else {
            return res.status(400).send('ERROR: User are not participant of this quiz')
        }
        

    } catch (error) {
        console.log(error);
        return res.status(500).send('ERROR: To verify participant')
    }

}

module.exports = {
    validatePartipant,
    verifyParticipant
}