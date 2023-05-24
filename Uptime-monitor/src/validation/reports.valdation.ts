import Joi from "joi";

export const getReportsBytagsValidator = Joi.object({
  tags: Joi.array().items(Joi.string()),
});
