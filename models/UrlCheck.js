import mongoose from 'mongoose';

const UrlCheckSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        },
        protocol: {
            type: String,
            enum: [
                'HTTP',
                'HTTPS',
                'TCP'
            ],
            required: true
        },
        path: String,
        port: {
            type: Number,
            min: 0,
            max: 65535,
        },
        webhook: String,
        timeout: {
            type: Number,
            default: 5,
        },
        interval: {
            type: Number,
            default: 10,
        },
        threshold: {
            type: Number,
            default: 1,
        },
        authentication: {
            username: String,
            password: String,
        },
        httpHeaders: [{
            key: String,
            value: String
        }],
        assert: {
            type: Number,
            min: 200,
            max: 599,
        },
        tags: [String],
        ignoreSSL: {
            type: Boolean,
            required: true
        },
        userId: {
            type: mongoose.Types.ObjectId,
            ref: 'User'
        }
    },  
    {timestamps: true}
);

export default mongoose.model('UrlCheck', UrlCheckSchema);