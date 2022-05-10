const { request, response } = require("express");
const { Stats } = require("../models");

const createStats = async (req = request, res = response) => {

    
    try {
        
        const { quizId, playerId, playerName, correctAnswers, incorrectAnswers, joinIn, questions } = req.body;
        const stats = new Stats({ quizId, playerId, playerName, correctAnswers, incorrectAnswers, joinIn, questions });

        await stats.save();

        return res.status(200).json({
            Ok: true,
            stats
        })

    } catch (error) {
        console.log(error);
    }

};

module.exports = {
    createStats
}