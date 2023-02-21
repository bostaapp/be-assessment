const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReportSchema = new Schema({
    status: {
        type: Number,
        default: 200,
    },
    availability: {
        type: Number,
        default: 0,
    },
    outages: {
        type: Number,
        default: 0,
    },
    uptimeRequests: {
        type: Number,
        default: 0,
    },
    downtime: {
        type: Number,
        default: 0,
    },
    uptime: {
        type: Number,
        default: 0,
    },
    responseTime: {
        type: Number,
        default: 0,
    },
    history: {
        type: Schema.Types.Array,
        default: [],
    },
    check: {
        type: Schema.Types.ObjectId,
        ref: "Check",
        required: true,
    },
});
module.exports = mongoose.model("Report", ReportSchema);
