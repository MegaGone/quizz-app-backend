const { Schema, model } = require('mongoose');

const QuestionSchema = Schema({
    title: {
        type: String,
        required: [true, "Question title required"]
    },
    isCorrect: {
        type: Boolean,
        required: [true, "Its correct is required"],
        default: false
    }
});

module.exports = {
    QuestionSchema
};