const { request, response } = require("express");
const { nanoid } = require('nanoid')
const moment = require('moment');

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

const joinToQuiz = async ( req = request, res = response ) => {
  
  // Get the code to join to the quiz
  const { code } = req.body;

  // Get the user data to the object Participant
  const { _id: userId, name } = req.user;
  const joinIn = moment().format("MMM Do YY")

  const participant = {
    name,
    userId,
    joinIn
  }

  try {

    const quizDB = await Quiz.updateOne(
      { code, 'participants.userId': { $nin: [participant.id] } },
      { $push: { participants: participant } },
      { upsert: false}
    );

    return res.send('OK')

  } catch (error) {
    console.log(error);
    return res.status(500).send('ERROR: We have a error to join the quiz')
  }

}

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

const getQuizzesByUser = async (req = request, res = response) => {

  const uid = req.uid;
  const query = { author: uid };

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

const updateQuiz = async (req = request, res = response) => {

  const { id } = req.params;

  const { author, code, ...data } = req.body;

  const quizDB = await Quiz.findByIdAndUpdate(id, data);

  if( !quizDB ) {
    return res.status(400).send('ERROR: Error to update a quiz')
  }

  return res.status(200).send('UPDATE')

};

const deleteQuiz = async (req = request, res = response) => {

  const { id } = req.params;

  const quizDB = await Quiz.findByIdAndDelete({_id: id})
  
  if(!quizDB){
    return res.status(400).send('ERROR: We have a issue to delete the quiz')
  }

  return res.status(200).send('DELETED')
};

module.exports = {
  getQuizs,
  createQuiz,
  getQuiz,
  updateQuiz,
  deleteQuiz,
  joinToQuiz,
  getQuizzesByUser
};