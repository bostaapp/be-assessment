import mongoose from "mongoose";

const CheckSchema = new mongoose.Schema({
    name: { type: String, required: true },

    url: { type: String, required: true },
    
    protocol: { type: String, enum: ['HTTP', 'HTTPS', 'TCP'], required: true },
    
    path: { type: String },
    
    port: { type: Number },
    
    webhook: { type: String },
    
    timeout: { type: Number, default: 5000 },
    
    interval: { type: Number, min: 1, default: 10 }, // Interval in minutes
    
    threshold: { type: Number, default: 1 },
    
    authentication: {
        username: { type: String },
        password: { type: String }
    },
    
    httpHeaders: [{
        key: { type: String },
        value: { type: String }
    }],
    
    assert: {
        statusCode: { type: Number, required: true }
    },
    
    tags: [{ type: String }],
    
    ignoreSSL: { type: Boolean },

    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}
})

const Checks = mongoose.model('Check', CheckSchema, 'checks');

export default Checks;