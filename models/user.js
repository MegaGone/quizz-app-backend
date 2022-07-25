const { Schema, model } = require("mongoose");

const QuestionResponseSchema = Schema({
  questionId: {
      type: String,
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

const QuizzesSchema = Schema({
  quizId: {
    type: Schema.Types.ObjectId,
    ref: "Quiz",
    required: true
  },
  title: {
    type: String,
    required: [true, "Quiz title required"]
  },
  joinIn: {
    type: String,
    required: [true, 'Date of union required']
  },
  correctAnswers: {
    type: Number,
    required: [true, "Correct Answers required"]
  },
  incorrectAnswers: {
    type: Number,
    required: [true, "Invorrect Answers required"]
  },
  description: {
    type: String,
    required: [true, "Description is required"]
  },
  lapse: {
    type: Number,
    required: true
  },
  answers: [QuestionResponseSchema]
})

const UserSchema = Schema({
  name: {
    type: String,
    required: [true, "Name required"],
  },
  email: {
    type: String,
    required: [true, "Email required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password required"],
  },
  img: {
    type: String,
  },
  role: {
    type: String,
    required: [true, "Role required"],
    default: "USER_ROLE",
    enum: ["ADMIN_ROLE", "USER_ROLE"],
  },
  enabled: {
    type: Boolean,
    default: true,
  },
  google: {
    type: Boolean,
    default: false,
  },
  quizzesPlayeds: [QuizzesSchema]
})

UserSchema.methods.toJSON = function () {
  const { __v, _id, password, ...user } = this.toObject();
  user.uid = _id;
  return user;
};

module.exports = model("User", UserSchema);