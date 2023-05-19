import Joi from 'joi';

const AuthValidation = {
    signupUser: {
        body: {
            email: Joi.string().required(),
            password: Joi.string().min(6).required()
        } 
    },

    signinUser: {
        body: {
            email: Joi.string().required(),
            password: Joi.string().min(6).required()
        }
    }
}

export default AuthValidation;