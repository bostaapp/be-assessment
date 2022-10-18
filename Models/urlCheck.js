const mongoose = require("mongoose");
const joi = require("joi");

const intervalTime = 1000 * 60;
const timeoutTime = 5000;
const threshold = 1;

function validateCheck(check, update = false) {
    let schema = joi.object({
        name: joi.string().required().min(5).max(100),
        url: joi.string().required(),
        path: joi.string().optional(),
        port: joi.number().optional().min(0).max(65536),
        webhook: joi.string().optional(),
        timeout: joi.number().optional().max(3 * timeoutTime),
        interval: joi.number().optional().max(3 * intervalTime),
        threshold: joi.number().optional(),
        authentication: joi.object({
            username: joi.string(),
            password: joi.string()
        }).optional(),
        httpHeaders: joi.object().optional(),
        tags: joi.array().optional(),
        ignoreSSL: joi.bool().optional()
    });
    if (update) {
        schema = joi.object({
            name: joi.string().min(5).max(100),
            url: joi.string(),
            path: joi.string(),
            port: joi.number().min(0).max(65536),
            webhook: joi.string(),
            timeout: joi.number().max(3 * timeoutTime),
            interval: joi.number().max(3 * intervalTime),
            threshold: joi.number(),
            active: joi.bool(),
            headers: joi.object().optional(),
            handle: joi.object(),
            authentication: joi.object({
                username: joi.string(),
                password: joi.string()
            }),
            httpHeaders: joi.object(),
            tags: joi.array(),
            ignoreSSL: joi.bool()
        }).optional();
    }
    const { error } = schema.validate(check);
    return error;
}


const urlCheckSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Provide a Name for url check"]
    },
    url: {
        type: String,
        required: [true, "Check needs URL"]
    },
    path: {
        type: String,
        default: null
    },
    userID: {
        type: "objectId",
        ref: "users",
        required: [true, "Missing User ID"]
    },
    protocol: {
        type: String,
        enum: ["https:", "http:", "tcp:"],
        required: true
    },
    port: {
        type: Number,
        default: null
    },
    webhook: {
        type: String,
        default: null
    },
    authentication: {
        type: {
            username: String,
            password: String
        },
        default: null
    },
    httpHeaders: {
        type: Object,
        default: {}
    },
    tags: {
        type: [String],
        default: []
    },
    timeout: {
        type: Number,
        default: timeoutTime
    },
    ignoreSSL: {
        type: Boolean,
        default: true
    },
    interval: {
        type: Number,
        default: intervalTime
    },
    threshold: {
        type: Number,
        default: threshold
    },
    active: {
        type: Boolean,
        default: false
    },
    handle: {
        type: Object,
        default: null
    }
});

const Check = mongoose.model("checks", urlCheckSchema);

module.exports = { Check, validateCheck };