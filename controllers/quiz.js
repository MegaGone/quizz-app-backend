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
  const { questions, title, description, lapse } = req.body;

  // GENERATE THE CODE TO THE QUIZ
  const code = nanoid(7).toUpperCase();

  try {
    
    const quiz = new Quiz({ title, description, questions, author, code, lapse })

    await quiz.save();

    return res.status(200).send('Quiz Created')

  } catch (error) {
    console.log(error);
    return res.status(500).send("Error create the quiz")
  }

};

const joinToQuiz = async ( req = request, res = response ) => {

  try {

      // Get the code to join to the quiz
  const { code } = req.body;

  // Get the user data to the object Participant
  const { _id: userId, name } = req.user;
  // const joinIn = moment().format("MMM Do YY")
  const joinIn = moment().format("YYYY-MM-DD")

  const participant = {
    name,
    userId,
    joinIn
  }

    const quizDB = await Quiz.updateOne(
      { code, 'participants.userId': { $nin: [participant.id] } },
      { $push: { participants: participant } },
      { upsert: false}
    );

    return res.status(200).json({
      ok: true,
      message: 'Joined'
    })

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      message: 'Error to join to the quiz'
    })
  }

}

const removeParticipant = async ( req = request, res = response ) => {

  const { id, user } = req.params;

  try {
    
    const quizDB = await Quiz.updateMany(
      { _id: id },
      { $pull: { participants: { userId: user }}}
    )

    return res.status(200).send('Participant removed')
  } catch (error) {
    console.log(error);
    return res.status(500).send("ERROR: Removing participant")
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
  // Quiz.find().skip(Number(from)).limit(Number(limit))  // Query Params
  // Quiz.find(query).limit(5)

  const [ total, quizzes ] = await Promise.all([
    Quiz.countDocuments(query),
    Quiz.find(query)
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

const getQuizBycode = async (req = request, res = response) => {

  const { code } = req.params;
  const query = { code: code };
  
  try {
    const quizDB = await Quiz.find(query);

    return res.status(200).json({
      status: "OK",
      quizDB
    })
  } catch (error) {
    return res.status(500).json({
      status: "Error",
      msg   : "Failed to get quiz"
    })
  }
}

/*################### GUEST ###################*/
const getQuizByCodeGuest = async ( req = request, res = response ) => {

  const { code } = req.body;

  if (code.length < 7 ) {
    return res.status(400).json({
      Ok: false,
      message: 'Invalid code.'
    })
  }

  const quizDB = await Quiz.findOne({code});

  if (!quizDB) {
    return res.status(400).json({
      ok: false,
      message: 'Quiz not find.'
    })
  }

  return res.json({
    ok: true,
    quizDB
  })

};

const joinToQuizGuest = async ( req = request, res = response) => {

  const { code, name, email } = req.body;

  try {

    const quizDB = await Quiz.findOne({ code });
  
    // If quiz doesn't exist
    if (!quizDB) {
      return res.status(400).json({
        ok: false,
        message: 'Quiz not find.'
      })
    }
    
    // If the participant exist
    const { participants } = quizDB;

    const ids = participants.map(p => p.userId);

    if ( ids.includes(email) ) {
      return res.status(400).json({
        Ok: false,
        message: 'You have already participate in the quiz'
      })
    }


    const joinIn = moment().format("YYYY-MM-DD")
  
    const participant = {
      name,
      userId: email,
      joinIn
    }

    const quizToInsert = await Quiz.updateOne(
      { code, 'participants.userId': { $nin: [participant.id] } },
      { $push: { participants: participant } },
      { upsert: false}
    );

    return res.status(200).json({
      ok: true,
      message: 'Joined'
    })

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      message: 'Error to join to the quiz'
    })
  }

}

/*################### QUESTIONS ###################*/
const addQuestion = async (req = request, res = response ) => {

  const { id } = req.params;

  const { title, answers } = req.body;

  const temporalAnswer = {
    title,
    answers
  }

  try {
     
    const quizDB = await Quiz.updateOne(
      { _id: id },
      { $push: { questions: temporalAnswer } }
    )

    return res.status(200).json({
      msg: "CREATED",
      quizDB
    })

  } catch (error) {
    console.log(error);
    return res.status(400).send('ERROR: Deleting question.')
  }

}

const updateQuestion = async ( req = request, res = response ) => {

  const { id, questionId } = req.params;

  const { title, answers } = req.body;

  try {

   const quizDB = await Quiz.updateOne(
     { _id: id,  "questions._id": questionId },
     { $set: { "questions.$.title": title, "questions.$.answers": answers }}
   )

    return res.status(200).json({
      msg: 'UPDATED',
      quizDB
    })

  } catch (error) {
    console.log(error);
    return res.status(400).send('ERROR: Updating question')
  }


}

const deleteQuestion = async ( req = request, res = response ) => {

  const { questionID } = req.params;

  try {
    
    const quizDB = await Quiz.updateMany(
      { },
      { $pull: { questions: { _id: questionID }}}
    )

    return res.status(200).send("Question deleted")

  } catch (error) {
    console.log(error);
    return res.status(400).send('ERROR: Deleting question')
  }

}

module.exports = {
  getQuizs,
  createQuiz,
  getQuiz,
  updateQuiz,
  deleteQuiz,
  joinToQuiz,
  getQuizzesByUser,
  getQuizBycode,
  deleteQuestion,
  addQuestion,
  updateQuestion,
  removeParticipant,
  getQuizByCodeGuest,
  joinToQuizGuest
};