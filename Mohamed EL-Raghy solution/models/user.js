const mongoose = require('mongoose');
const Joi = require('joi');

//* User Schema 
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    minlength : 5,
    maxlength : 255,
    unique : true
  },
  password : {
    type : String,
    required : true,
    minlength : 8,
    maxlength : 255 
  },
  userIsVerified : {
    type : Boolean,
    default : false
  },
  PIN: String,
  PINExpiration: {
    type: Date,
    default: Date.now()
  }
});

//* User model 
const User = mongoose.model('User', userSchema);

//* User Data validation
const validateUser = user => {

  const schema = Joi.object ({
    name: Joi.string().min(5).max(30).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(8).max(255).required(),
    confirm_password: Joi.string().min(8).max(255).required(),
  });
  return schema.validate(user);
}

const validateLoginUser = user => {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(8).max(255).required()
  });
  return schema.validate(user);
}

exports.User = User;
exports.validate = validateUser;
exports.loginValidate = validateLoginUser