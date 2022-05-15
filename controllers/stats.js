const { request, response } = require("express");
const { Stats, Quiz, User } = require("../models");

const createStats = async (req = request, res = response) => {

    
    try {
        
        const { quizId, playerId, playerName, correctAnswers, incorrectAnswers, joinIn, questions } = req.body;

        // Validate if player stats exist
        const statsDB = await Stats.findOne({playerId, quizId});
        
        if (statsDB) {
            return res.status(400).json({
                Ok: false,
                message: "You have been participated in this quiz"
            })
        }

        const newStats = new Stats({ quizId, playerId, playerName, correctAnswers, incorrectAnswers, joinIn, questions });

        await newStats.save();

        // Join the data
        const quizDB = await Quiz.findById({ _id: quizId });
        const { questions: questionsDB } = quizDB;
        const { questions: answersPlayer } = newStats;

        if (questionsDB.length != answersPlayer.length) {
            return res.status(400).json({
                Ok: false,
                message: "Stats dont match"
            })
        }

        const stats = answersPlayer.map((answer, i) => {
            if (answer.questionId == questionsDB[i]._id) {
                return {
                    selectedIndex   : answer.selectedIndex,
                    time            : answer.time,
                    title           : questionsDB[i].title,
                    answers         : questionsDB[i].answers
                }
            }
        })

        // Push into quizzesPlayeds[]
        const checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$")

        if (checkForHexRegExp.test(playerId)) {

            const userStats = {
                quizId,
                title: quizDB.title,
                joinIn,
                correctAnswers,
                incorrectAnswers,
                answers: answersPlayer,
                description: quizDB.description,
                lapse: quizDB.lapse
            }

            await User.updateOne(
                { _id: playerId },
                { $push: { quizzesPlayeds: userStats } }
            );

            const { quizzesPlayeds } = await User.findById({ _id: playerId });

            if (quizzesPlayeds.length > 3) {
                // const statsToRemove = quizzesPlayeds[0];

                await User.updateOne(
                    { _id: playerId },
                    { $pop: { quizzesPlayeds: -1 }}
                );

                // Dont removed from DB because the admins or quizAdmin need get all the records
                // await Stats.findOneAndRemove({ quizId: statsToRemove.quizId, playerId: playerId })
            }
        }

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

const getStatsByQuiz = async ( req = request, res = response ) => {

    const { id } = req.params;

    try {

        const statsDB = await Stats.find({ quizId: id })
    
        return res.status(200).json({
            Ok: true,
            statsDB
        })
        
    } catch (error) {
        return res.status(400).json({
            Ok: false,
            message: "Error getting stats"
        })
    }


};

const getStatsByUser = async ( req = request, res = response ) => {

    const { id, user } = req.params;

    
    try {
        const { questions } = await Quiz.findById({ _id: id });
        const { questions: answers } = await Stats.findOne({ playerId: user });

        const stats = answers.map((answer, i) => {
            if ( answer.questionId == questions[i]._id) {
                return {
                    selectedIndex   : answer.selectedIndex,
                    time            : answer.time,
                    title           : questions[i].title,
                    answers         : questions[i].answers
                }
            }
        })
        
        return res.status(200).json({
            Ok: false,
            stats
        })

    } catch (error) {
        return res.status(400).json({
            Ok: false,
            message: "Error getting stats"
        });
    }

};

module.exports = {
    createStats,
    getStatsByQuiz,
    getStatsByUser
}