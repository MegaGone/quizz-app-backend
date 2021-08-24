const { request, response } = require("express");
const { Quiz } = require('../models')

const getQuizs = (req = request, res = response) => {
  res.json({
    msg: "GET QUIZS",
    status: "200",
  });
};

const createQuiz = async (req = request, res = response) => {

  // TODO: Validar que el title sea unico por User
  // TODO: Investigar sobre validar propiedades dentro de un array en express
  const { _id: author } = req.user;
  const { questions, title, description } = req.body;

  try {
    
    const quiz = new Quiz({ title, description, questions, author })

    await quiz.save();

    return res.status(200).json(quiz)

  } catch (error) {
    console.log(error);
    return res.status(500).send("Error create the quiz")
  }

};

const getQuiz = (req = request, res = response) => {
  res.json({
    msg: "GET QUIZ",
    status: "200",
  });
};

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
};