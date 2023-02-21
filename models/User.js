const mongoose = require("mongoose");
const joi = require("joi");
const uniqueValidator = require("mongoose-unique-validator");

//model schema in the schemas folder
const schema = require("../schemas/User");


// model validation

const UserValidationSchema = joi.object({
  userName: joi.string().required(),
  email: joi.string().email().required(),
  password: joi.string().min(3).required(),
});

schema.plugin(uniqueValidator);

module.exports = {
  User: mongoose.model("User", schema),
  UserValidationSchema: UserValidationSchema,
};
