const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  verficationState: {
    type: Boolean,
    default: false,
  },
  token: { type: String },
});

module.exports = mongoose.model("User", UserSchema);
