const { Schema, model } = require("mongoose");

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
    emun: ["ADMIN_ROLE", "USER_ROLE"],
  },
  enabled: {
    type: Boolean,
    default: true,
  },
  google: {
    type: Boolean,
    default: false,
  }
})

UserSchema.methods.toJSON = function () {
  const { __v, _id, password, ...user } = this.toObject();
  user.uid = _id;
  return user;
};

module.exports = model("User", UserSchema);