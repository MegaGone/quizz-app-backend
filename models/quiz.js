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
    questions: [{
        type: QuestionSchema,
        required: true
    }]
    // TODO: Investigar ARRAY de un modelo de mongoose
});

QuizSchema.methods.toJSON = function () {
    const { __v, enabled, ...quiz } = this.toObject();
    return quiz;
}

module.exports = model('Quiz', QuizSchema);