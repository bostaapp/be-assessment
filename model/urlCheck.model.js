const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String },
    url: { type: String },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
    protocol: { type: String },
    path: { type: String },
    port: { type: Number },
    webhook: { type: String },
    timeout: { type: Number },
    interval: { type: Number },
    threshold: { type: Number },
    authentication: {
        username: { type: String },
        password: { type: String },
    },
    httpHeaders: [
        {
            key: { type: String },
            value: { type: String },
        }
    ],
    assert: {
        statusCode: { type: Number }
    },
    tags: { type: [String] },
    ignoreSSL: { type: String },
    isUp: { type: Boolean },
    responseTime: { type: Number },
    checkDate : { type: Date }
});

module.exports = mongoose.model("UrlCheck", userSchema);
