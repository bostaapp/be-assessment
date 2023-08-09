const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const urlSchema = new Schema({
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
        required: true,
        enum: ['HTTP', 'HTTPS', 'TCP']
    },
    path: {
        type: String,
        required: false,
    },
    port: {
        type: Number,
        required: false,
    },
    webhook: {
        type: String,
        required: false,
    },
    timeout: {
        type: Number,
        required: false,
        default: 5,
    },
    interval: {
        type: Number,
        required: false,
        default: 10,
    },
    threshold: {
        type: Number,
        required: false,
        default: 1,
    },
    authentication: {
        type: String,
        get: function (data) {
            try {
                return JSON.parse(data);
            } catch (error) {
                return data;
            }
        },
        set: function (data) {
            return JSON.stringify(data);
        },
        required: false
    },
    httpHeaders: {
        type: [
            {
                key: { type: String },
                value: { type: String }
            }
        ],
        required: false,
    },
    asserts: {
        type: Number,
        required: false,
    },
    tags: {
        type: [String],
        required: false,
    },
    ignoreSSL: {
        type: Boolean,
        required: false,
        default: false,
    },
    User: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['up', 'down'],
        default: 'up'
    },
    lastChecked: {
        type: Date,
        required: true,
        default: Date.now
    },
    history: [
        {
            timestamp: { type: Date, default: Date.now },
            status: { type: String, enum: ['up', 'down'] },
            responseTimeInMS: { type: Number, default: 0 },
        },
    ],
    totalUptimeInSeconds: { type: Number, default: 0 },
    totalDowntimeInSeconds: { type: Number, default: 0 },

}, { timestamps: true });
urlSchema.index({ "name": 1, "User": 1 }, { unique: true });
urlSchema.pre('save', function (next) {
    if (this.isModified('history')) {
        this.totalUptimeInSeconds = 0;
        this.totalDowntimeInSeconds = 0;
        let lastTimestamp = this.lastCheckedAt || this.createdAt;

        this.history.forEach((entry) => {
            const timeDifference = entry.timestamp - lastTimestamp;
            if (entry.status === 'up') {
                this.totalUptimeInSeconds += timeDifference / 1000;
            } else if (entry.status === 'down') {
                this.totalDowntimeInSeconds += timeDifference / 1000;
            }
            lastTimestamp = entry.timestamp;
        });
    }

    next();
});

urlSchema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

urlSchema.method('getAverageResponseTime', function () {
    let totalResponseTime = 0;
    this.history.forEach((entry) => {
        totalResponseTime += entry.responseTimeInMS;
    });
    return totalResponseTime / this.history.length;
});

urlSchema.method('calculateAvailabiltyPercentage', function () {
    const totalUptimeInSeconds = this.totalUptimeInSeconds;
    const totalDowntimeInSeconds = this.totalDowntimeInSeconds;
    const totalSeconds = totalUptimeInSeconds + totalDowntimeInSeconds;
    const availabilityPercentage = (totalUptimeInSeconds / totalSeconds) * 100;
    return availabilityPercentage;
});

urlSchema.method('formulateRequestData', function () {
    const { protocol, url, path, port, authentication, httpHeaders } = this;

    let finalUrl = `${protocol.toLowerCase()}://${url}`;
    if (port) {
        finalUrl += `:${port}`;
    }
    if (path) {
        finalUrl += `/${path}`;
    }

    const headers = {};
    if (httpHeaders && Array.isArray(httpHeaders)) {
        httpHeaders.forEach(header => {
            const [key, value] = header.split(':');
            if (key && value) {
                headers[key.trim()] = value.trim();
            }
        });
    }

    if (authentication) {
        headers['Authorization'] = `Bearer ${authentication}`;
    }

    return {
        url: finalUrl,
        headers: headers,
    };
});

urlSchema.method("getLatest", function () {
    return this.model('URL').findById(this.id);
});

module.exports = mongoose.model('URL', urlSchema);

