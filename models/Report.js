const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ReportSchema = new Schema({
  check: {
    type: Schema.Types.ObjectId,
    ref: "Check",
    required: true,
  },
  result: {
    type: String,
  },
  status: {
    type: Number,
  },
  responseTime: {
    type: Number,
  },
  time: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("Report", ReportSchema);
