const { request, response } = require("express");

const getQuizs = (req = request, res = response) => {
  res.json({
    msg: "GET QUIZS",
    status: "200",
  });
};

const createQuiz = (req = request, res = response) => {
  res.json({
    msg: "CREATE",
    status: "200",
  });
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