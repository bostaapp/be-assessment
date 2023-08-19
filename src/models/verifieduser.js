import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
}, { collection: 'users' });

export default mongoose.model('User', userSchema);