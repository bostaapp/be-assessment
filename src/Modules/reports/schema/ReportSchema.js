const { Schema } = require('mongoose');

const historySchema = new Schema({
    status: Number,
    responseTime: Number,
    timestamps: Date
});

const reportSchema = new Schema({
    checkId: {
        type: Schema.Types.ObjectId,
        ref: "Check",
        required: true,
    },
    checkOwner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    status: { type: Number, default: 200 },
    availability: { type: Number, default: 0 },
    outages: { type: Number, default: 0 },
    downtime: { type: Number, default: 0 },
    uptime: { type: Number, default: 0 },
    responseTime: { type: Number, default: 0 },
    history: [historySchema],
}, {
    timestamps: true
});

module.exports = reportSchema;