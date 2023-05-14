const mongoose = require('mongoose');
const Joi = require('joi');

const checkSchema = new mongoose.Schema({
  name: { type: String, minlength: 5, maxlength: 30, required: true },
  url: { type: String, minlength:1, required: true, default: '/' },
  protocol: { type: String, required: true, enum : ['HTTP', 'HTTPS', 'TCP', null] },
  path:{ type: String, required:false },
  port: { type: Number, required: false },
  webhook: { type: String, required: false },
  timeout: { type: Number, required: false, default: 5 * 1000 },
  interval: { type: Number, required: false, default: 10 * 60 * 1000 },
  threshold: { type: Number, required: false, default: 1 },
  authentication: {
    type: { username: { type: String, required: true }, password: { type: String, required: true } },
    required: false,
  },
  httpHeaders: { type: [Object], default: "'Content-Type': 'application/json'", required: false},
  assert: {
    type: { statusCode: { type: Number, required: true } },
    required: false,
  },
  tags: { type: [String], required: false },
  ignoreSSL: { type: Boolean, required: false },
  createdBy: { type: mongoose.Types.ObjectId, ref: 'User', required: true }
});

const Check = mongoose.model('Check', checkSchema);

const validateCheck = check => {
  const schema = Joi.object({
    name: Joi.string().min(5).max(30).required(),
    url: Joi.string().min(1).required(),
    protocol: Joi.string().required().valid('HTTP', 'HTTPS', 'TCP'),
    path: Joi.string().min(1).default('/'),
    port: Joi.number().positive(),
    webhook: Joi.string(),
    timeout: Joi.number().positive().default(5 * 1000),
    interval: Joi.number().positive().default(10 * 60 * 1000),
    threshold: Joi.number().positive().default(1),
    authentication: Joi.object({
      username: Joi.string().min(5).max(30).required(),
      password: Joi.string().required()
    }).optional(),
    httpHeaders: Joi.array().items(Joi.object({
      key: Joi.string(),
      value: Joi.string()
    })).optional(),
    assert: Joi.object({
      statusCode: Joi.number().positive().required()
    }).optional(),
    tags: Joi.array().items(Joi.string()).default([""]),
    ignoreSSL: Joi.boolean()
  });

  return schema.validate(check);
}

exports.Check = Check;
exports.validate = validateCheck;