const mongoose = require('mongoose');
const userSchema = require('../Schema/userSchema');

const User = mongoose.model("user", userSchema);

module.exports = User;