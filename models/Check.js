const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const CheckSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: { type: String, required: true },
  method: {
    type: String,
    enum: ["GET", "POST", "PUT", "DELETE"],
    default: "GET",
  },
  url: { type: String, required: true },
  protocol: {
    type: String,
    enum: ["http", "https", "tcp"],
    default: "http",
  },
  path: {
    type: String,
    default: "/",
  },
  port: {
    type: Number,
  },
  webhook: {
    type: String,
  },
  timeout: {
    type: Number,
    default: 5,
  },
  interval: {
    type: Number,
    default: 600000,
  },
  threshold: {
    type: Number,
    default: 3,
  },
  authentication: {
    username: {
      type: String,
    },
    password: {
      type: String,
    },
  },
  httpHeaders: [{ key: String, value: String }],
  assert: {
    statusCode: {
      type: Number,
    },
  },
  tags: [{ type: String }],
  ignoreSSL: {
    type: Boolean,
    default: false,
  },
  time: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Check", CheckSchema);
