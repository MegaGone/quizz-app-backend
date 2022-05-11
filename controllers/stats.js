const { request, response } = require("express");
const { Stats, Quiz } = require("../models");

const createStats = async (req = request, res = response) => {

    
    try {
        
        const { quizId, playerId, playerName, correctAnswers, incorrectAnswers, joinIn, questions } = req.body;

        // Validate if player stats exist
        const statsDB = await Stats.findOne({playerId});
        
        if (statsDB) {
            return res.status(400).json({
                Ok: false,
                message: "You have been participated in this quiz"
            })
        }

        const stats = new Stats({ quizId, playerId, playerName, correctAnswers, incorrectAnswers, joinIn, questions });

        await stats.save();

        // Join the data
        const { questions: questionsDB } = await Quiz.findById({ _id: quizId });
        const { questions: answersPlayer } = stats;

        const fullStats = answersPlayer.map((answer, i) => {
            return {
                selectedIndex   : answer.selectedIndex,
                time            : answer.time,
                title           : questionsDB[i].title,
                answers         : questionsDB[i].answers
            }
        })

        return res.status(200).json({
            Ok: true,
            fullStats
        })

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            Ok: false,
            message: "Error to create stats"
        })
    }

};

module.exports = {
    createStats
}