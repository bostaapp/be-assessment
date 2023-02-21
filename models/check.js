const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const url = require("url");

const CheckSchema = new Schema({
    name: { type: String, required: true },
    url: { type: String, required: true },
    protocol: {
        type: String,
        enum: ["http:", "https:", "tcp:"],
        default: "http:",
    },
    hostname: { type: String },
    path: {
        type: String,
        default: "/",
    },
    port: {
        type: Number,
    },
    webhook: {
        type: String,
    },
    timeout: {
        type: Number,
        default: 5,
    },
    interval: {
        type: Number,
        default: 600000,
    },
    threshold: {
        type: Number,
        default: 3,
    },
    authentication: {
        username: {
            type: String,
        },
        password: {
            type: String,
        },
    },
    httpHeaders: [{ key: String, value: String }],
    assert: {
        statusCode: {
            type: Number,
        },
    },
    tags: [{ type: String }],
    ignoreSSL: {
        type: Boolean,
        default: false,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        _id: false,
    },
});

//need this middleware to divide url to path, port, etc... if it is inside the url
CheckSchema.pre("save", function () {
    const parsedUrl = new url.URL(this.url);
    this.protocol =
        this.protocol == "http:"
            ? parsedUrl.protocol.toLowerCase()
            : this.protocol.toLowerCase();
    this.hostname = parsedUrl.hostname.toLowerCase();
    this.path = this.path == "/" ? parsedUrl.pathname : this.path;
    this.port = this.port || parsedUrl.port;

    this.url = this.port
        ? `${this.protocol}//${this.hostname}:${this.port}${this.path}`
        : `${this.protocol}//${this.hostname}${this.path}`;
});

module.exports = mongoose.model("Check", CheckSchema);
