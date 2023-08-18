import mongoose from "mongoose";

const urlCheckSchema = new mongoose.Schema({
    email: { type: String, required: true },
    name: { type: String, required: true },
    url: { type: String, required: true },
    protocol: { type: String, enum: ["HTTP", "HTTPS", "TCP"], required: true },
    path: { type: String },
    port: { type: Number },
    webhook: { type: String },
    timeout: { type: Number, default: 5 },
    interval: { type: Number, default: 600 },
    threshold: { type: Number, default: 1 },
    authentication: {
        username: { type: String },
        password: { type: String },
    },
    httpHeaders: [{ key: { type: String }, value: { type: String } }],
    assert: {
        statusCode: { type: Number },
    },
    tags: [{ type: String }],
    ignoreSSL: { type: Boolean },
}, { collection: 'checks' });

export default mongoose.model("URLCheck", urlCheckSchema);