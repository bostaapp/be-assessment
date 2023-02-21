const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: { type: String, required: true },
  url: { type: String, required: true },
  protocol: { type: String, required: true },
  path: { type: String, required: true },
  port: { type: Number, required: true },
  webhook: String,
  timeout: { type: Number, default: 5 * 1000 }, // 5 second
  interval: { type: Number, default: 10 }, // 10 minutes
  threshold: { type: Number, default: 1 },
  authentication: { userName: String, password: String },
  httpHeaders: [{ key: String, value: String }],
  assert: { statusCode: Number },
  tags: [String],
  ignoreSSL: { type: Boolean, default: false },
});

module.exports = schema;
