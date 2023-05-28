import JoiPasswordComplexity from 'joi-password-complexity';
import Joi from 'joi';

export const registerValidation = Joi.object({
  name: Joi.string().min(1).max(75).required(),
  email: Joi.string().email().required(),
  password: JoiPasswordComplexity().required(),
});

export const loginValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
