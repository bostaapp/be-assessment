const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  checkId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Check",
    required: true,
    index: true,
  },
  status: String,
  availability: Number,
  outages: Number,
  downTime: Number,
  upTime: Number,
  responseTime: Number,
  historyLog: [String],
});

module.exports = schema;
