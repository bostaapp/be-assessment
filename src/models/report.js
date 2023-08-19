import mongoose from "mongoose";
const reportSchema = new mongoose.Schema({
    name: { type: String },
    url: { type: String },
    status: {
        type: Number,
        required: true,
    },
    availability: {
        type: Number,
        required: true,
    },
    outages: {
        type: Number,
        required: true,
    },
    downtime: {
        type: Number,
        required: true,
    },
    uptime: {
        type: Number,
        required: true,
    },
    responseTime: {
        type: Number,
        required: true,
    },
    timestamp: {
        type: Date,
        required: true,
    },

}, { collection: 'reports' });

export default mongoose.model('Report', reportSchema);