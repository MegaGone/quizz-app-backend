const { Schema, model } = require('mongoose');

const participantsSchema = Schema({
    name: {
        type: String,
        required: [true, 'Name of participant required']
    },
    userId: {
        type: String,
        required: [true, 'Id required']
    },
    joinIn: {
        type: String,
        required: [true, 'Date of union required']
    },
    correctAnswers: {
        type: Number,
        default: 0
    }
}, { _id: false });

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

const QuestionSchema = Schema({
    title: {
        type: String,
        required: [true, "Question title required"]
    },
    answers: [answerSchema]
});

const QuizSchema = Schema({
    title: {
        type: String,
        required: [true, "Title is required"]
    },
    description: {
        type: String,
        required: [true, "Description is required"]
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    code: {
        type: String,
        required: [true, "Code required"]
    },
    questions: [QuestionSchema],
    participants: [participantsSchema]
});

QuizSchema.methods.toJSON = function () {
    const { __v, enabled, ...quiz } = this.toObject();
    return quiz;
}

module.exports = model('Quiz', QuizSchema);