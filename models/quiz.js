const { Schema, model } = require('mongoose');

const QuizSchema = Schema({
    title: {
        type: String,
        required: [true, "Title is required"]
    },
    enabled: {
        type: Boolean,
        default: true,
        required: true
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
    // TODO: Investigar ARRAY de un modelo de mongoose
});

QuizSchema.methods.toJSON = function () {
    const { __v, enabled, ...quiz } = this.toObject();
    return quiz;
}

module.exports = model('Quiz', QuizSchema);