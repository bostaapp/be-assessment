const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  verificationCode: String,
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("User", Schema);
