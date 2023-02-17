const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReportSchema = new Schema({
    status: {
        type: Number,
    },
    availability: {
        type: Number,
    },
    outages: {
        type: Number,
    },
    downtime: {
        type: Number,
    },
    uptime: {
        type: Number,
    },
    responseTime: {
        type: Number,
    },
    history: {
        type: Number,
    },
    timestamp: { type: Date, default: Date.now },
    check: {
        type: Schema.Types.ObjectId,
        ref: "Check",
        required: true,
    },
});
module.exports = mongoose.model("Report", ReportSchema);
