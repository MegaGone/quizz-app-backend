const { Schema, model } = require("mongoose");

const answerSchema = Schema({
    title: {
        type: String,
        required: [true, "Title of answer required"]
    },
    isCorrect: {
        type: Boolean,
        default: false
    }
}, { _id: false });

// const QuestionResponseSchema = Schema({
//     selectedIndex: {
//         type: Number,
//         required: [true, "Selected index required"]
//     },
//     title: {
//         type: String,
//         required: [true, "Question title required"]
//     },
//     answers: [answerSchema],
//     time: {
//         type: Number,
//         required: [true, "Time response's required"]
//     }
// }, { _id: false });

const QuestionResponseSchema = Schema({
    questionIndex: {
        type: Number,
        required: [true, "Question index required"]
    },
    selectedIndex: {
        type: Number,
        required: [true, "Selected index required"]
    },
    time: {
        type: Number,
        required: [true, "Time response's required"]
    }
}, { _id: false });

const UserStatsSchema = Schema({
    quizId: {
        type: String,
        required: [true, "QuizID required"]
    },
    playerId: {
        type: String,
        required: [true, "Id required"]
    },
    playerName: {
        type: String,
        required: [true, "Name required"]
    },
    correctAnswers: {
        type: Number,
        required: [true, "Correct Answers required"]
    },
    incorrectAnswers: {
        type: Number,
        required: [true, "Invorrect Answers required"]
    },
    joinIn: {
        type: String,
        required: [true, "Date of union required"]
    },
    questions: [QuestionResponseSchema]
});

UserStatsSchema.methods.toJSON = function () {
    const { __v, ...stats } = this.toObject();
    return stats;
}

module.exports = model('Stats', UserStatsSchema);