const { request, response } = require("express");
const { nanoid } = require('nanoid')

const { Quiz } = require('../models')

const getQuizs = async (req = request, res = response) => {

  const { limit = 5, from = 0 } = req.query;

  const [ total, quizes ] = await Promise.all([
    Quiz.countDocuments(),
    Quiz.find().skip(Number(from)).limit(Number(limit))
  ]);

  return res.status(200).send({
    total,
    quizes
  })

};

const createQuiz = async (req = request, res = response) => {

  // TODO: Validar que el title sea unico por User
  const { _id: author } = req.user;
  const { questions, title, description } = req.body;

  // GENERATE THE CODE TO THE QUIZ
  const code = nanoid(7).toUpperCase();

  try {
    
    const quiz = new Quiz({ title, description, questions, author, code })

    await quiz.save();

    return res.status(200).json(quiz)

  } catch (error) {
    console.log(error);
    return res.status(500).send("Error create the quiz")
  }

};

const getQuiz = async (req = request, res = response) => {

  // Validate if, the autor dont 
  const { _id: user } = req.user;

  const { id } = req.params;

  const quizDB = await Quiz.findById(id);

  if (!quizDB) {
    return res.status(500).send('ERROR: We cant find the quiz')
  }

  return res.status(200).json(quizDB)
};

const getQuizByUser = async ( req = request, res = response ) => {
  const { _id: id } = req.user;
  const query = { author: id };

  // const quizzes = await Quiz.find({ author: id }).skip()
  const [ total, quizzes ] = await Promise.all([
    Quiz.countDocuments(query),
    Quiz.find(query).limit(5)
  ]);

  if (!quizzes) {
    return res.status(500).send('ERROR: Error getting the quizzes')
  }

  if ( total === 0 || quizzes.length <= 0) {
    return res.status(200).send("You dont have quizzes to display. Create a quiz!")
  } 

  return res.status(200).json({
    total,
    quizzes
  })

}

const updateQuiz = (req = request, res = response) => {
  res.json({
    msg: "UPDATE",
    status: "200",
  });
};

const deleteQuiz = (req = request, res = response) => {
  res.json({
    msg: "DELETE",
    status: "200",
  });
};

module.exports = {
  getQuizs,
  createQuiz,
  getQuiz,
  updateQuiz,
  deleteQuiz,
  getQuizByUser
};