const { Schema, model } = require('mongoose');

const answerSchema = Schema({
    title: {
        type: String,
        required: [true, "Title of answer required"]
    },
    isCorrect: {
        type: Boolean,
        default: false
    }
});

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
    enabled: {
        type: Boolean,
        default: true,
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
    questions: [QuestionSchema]
    // TODO: Investigar ARRAY de un modelo de mongoose
});

QuizSchema.methods.toJSON = function () {
    const { __v, enabled, ...quiz } = this.toObject();
    return quiz;
}

module.exports = model('Quiz', QuizSchema);