const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
  check: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Check",
    required: true,
  },
  status: {
    type: Number,
    min: 100,
    max: 599,
  },
  availability: Number,
  outages: Number,
  requests: Number,
  downtime: Number,
  uptime: Number,
  responseTime: Number,
  history: [
    {
      type: new mongoose.Schema(
        {
          status: {
            type: Number,
            min: 100,
            max: 599,
          },
          responseTime: Number,
        },
        { timestamps: true }
      ),
    },
  ],
});

module.exports = mongoose.model("Report", Schema);
