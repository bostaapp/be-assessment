import Joi from 'joi';

export const SCHEMA_REGISTER_BODY = Joi.object({
  email: Joi.string().trim().email().lowercase().required(),
  password: Joi.string().trim().min(6).required(),
  passwordConfirmation: Joi.string()
    .valid(Joi.ref('password'))
    .required()
    .options({ messages: { 'any.only': '{{#label}} does not match' } }),
})
  .options({
    stripUnknown: true,
  })
  .required();
