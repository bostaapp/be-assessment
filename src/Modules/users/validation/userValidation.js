const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");
// Joi.objectId = require('joi-objectid')(Joi)


// strong password like Ahmed_1
const complexityOptions = {
    type: String,
    min: 5,
    max: 250,
    lowerCase: 1,
    upperCase: 1,
    numeric: 1,
    symbol: 1,
    requirementCount: 7,
    required: true,
}

module.exports = {
    signUpSchema: {
        body: Joi.object().required().keys({
            userName: Joi.string().min(3).max(25).required(),
            email: Joi.string().required().email(),
            password:passwordComplexity(complexityOptions) ,
            confirmPassword: Joi.any().valid(Joi.ref('password')).required().label('Confirm password')
            .options({ messages: { 'any.only': '{{#label}} does not match'} }),
        }),
       
    },
    signInSchema: {
        body: Joi.object().required().keys({
            email: Joi.string().required().email(),
            password:Joi.string().required()
        }),
      
    },
  
}