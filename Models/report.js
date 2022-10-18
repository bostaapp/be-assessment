const mongoose = require("mongoose");
const joi = require("joi");

function validateReport(report) {
    let schema = joi.object({
        status: joi.string().valid("available", "unavailable", "error", "-"),
        availability: joi.number().min(0),
        outages: joi.number().min(0),
        downtime: joi.number().min(0),
        uptime: joi.number().min(0),
        responseTime: joi.number().min(0),
        history: joi.array().optional()
    });
    const { error } = schema.validate(report);
    return error;
}

const reportSchema = new mongoose.Schema({
    urlID: {
        type: "objectId",
        ref: "checks",
        required: [true, "Missing Check IO"]
    },
    userID: {
        type: "objectId",
        ref: "users",
        required: [true, "Missing User ID"]
    },
    status: {
        type: String,
        enum: ["available", "unavailable", "error", "-"],
        default: "-"
    },
    availability: {
        type: Number,
        default: 0
    },
    outages: {
        type: Number,
        default: 0
    },
    downtime: {
        type: Number,
        default: 0
    },
    uptime: {
        type: Number,
        default: 0
    },
    responseTime: {
        type: Number,
        default: 0
    },
    history: [{
        timestamp: {
            type: Date,
            default: Date.now()
        },
        status: {
            type: String,
            enum: ["available", "unavailable", "error", "-"],
            default: "-"
        },
        availability: {
            type: Number,
            default: 0
        }
    }]
});

const Report = mongoose.model("reports", reportSchema);
module.exports = { Report, validateReport };