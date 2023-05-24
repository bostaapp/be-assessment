import Joi from "joi";

export const signupValidator = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const verifyValidator = Joi.object({
  email: Joi.string().email().required(),
  verificationToken: Joi.string().required(),
});
