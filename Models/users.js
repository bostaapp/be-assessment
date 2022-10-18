const mongoose = require("mongoose");
const joi = require("joi");

function validate(user, login = false) {
    let schema = joi.object({
        username: joi.string().required(),
        email: joi.string().email().required(),
        password: joi.string().min(6).required()
    });
    if (login) {
        schema = joi.object({
            email: joi.string().required(),
            password: joi.string().required()
        });
    }
    const { error } = schema.validate(user);
    return error;
}

const usersSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username is not Provided"]
    },
    email: {
        type: String,
        required: [true, "Email must be Provided"]
    },
    password: {
        type: String,
        required: [true, "Please provide a Password for the Account"]
    },
    verified: {
        type: Boolean,
        default: false

    }
});

const User = mongoose.model("users", usersSchema);


module.exports = { User, validate };