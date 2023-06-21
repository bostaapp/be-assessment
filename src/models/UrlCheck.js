import mongoose from "mongoose";

const schema = mongoose.Schema;

const urlCheckSchema = new schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
    protocol: {
        type: String,
        enum: ['http', 'https', 'tcp'],
        required: true,
    },
    path: {
        type: String,
    },
    port: {
        type: String,
    },
    webhook: {
        type: String,
        default: "",
    },
    timeout: {
        type: Number,
        default: 5000
    },
    interval: {
        type: Number,
        default: 600000
    },
    threshold: {
        type: Number,
        default: 1
    },
    authentication: {
        username: {
            type: String,
        },
        password: {
            type: String
        }
    },
    httpHeaders: [
        {
            key: String,
            value: String
        }
    ],
    assert: {
        statusCode: {
            type: Number,
        }
    },
    tag: [String],
    ignoreSSL: {
        type: Boolean,
        default: false,
    },
})

export default mongoose.model("urlCheck", urlCheckSchema);