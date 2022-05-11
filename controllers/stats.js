const { request, response } = require("express");
const { Stats } = require("../models");

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

        return res.status(200).json({
            Ok: true,
            stats
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