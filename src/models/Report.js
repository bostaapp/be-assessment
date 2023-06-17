import mongoose from "mongoose";

const schema = mongoose.Schema;

const reportSchema = new schema({
    urlCheckId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'urlchecks',
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    status: {
        type: String
    },
    availability: {
        type: String,
    },
    outages: {
        type: Number,
    },
    downtime: {
        type: Number,
    },
    uptime: {
        type: Number,
    },
    responseTime: {
        type: Number,
    },
    history: [
        { status: String, timestamp: Date }
    ]
});

export default mongoose.model("Report", reportSchema);