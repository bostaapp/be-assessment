const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
  owner: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  protocol: {
    type: String,
    enum: ["http", "https", "tcp"],
    required: true,
  },
  path: {
    type: String,
    default: "/",
  },
  port: {
    type: Number,
    min: 0,
    max: 65535,
    default: null,
  },
  webhook: String,
  timeout: {
    type: Number,
    default: 5,
  },
  interval: {
    type: Number,
    default: 10000,
  },
  threshold: {
    type: Number,
    default: 1,
  },
  authentication: {
    type: {
      username: String,
      password: String,
    },
    default: null,
  },
  httpHeaders: {
    type: Object,
    default: {},
  },
  assert: {
    type: {
      statusCode: {
        type: Number,
        min: 100,
        max: 599,
      },
    },
    default: null,
  },
  tags: {
    type: [String],
    default: [],
  },
  ignoreSSL: {
    type: Boolean,
    required: true,
  },
});

module.exports = mongoose.model("Check", Schema);
