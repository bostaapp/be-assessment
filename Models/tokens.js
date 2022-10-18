const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
    userID: {
        type: 'objectId',
        ref: "users",
        required: [true, "Missing userID, Token"]
    },
    token: {
        type: String,
        required: [true, "Missing token, Token"]
    }
});

const Token = mongoose.model("tokens", tokenSchema);

module.exports = Token;