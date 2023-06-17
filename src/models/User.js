import mongoose from "mongoose";
import { stringify } from "uuid";

const schema = mongoose.Schema

const userSchema = new schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    verficationState: {
        type: Boolean,
        default: false,
    },
    verId: {
        type: String,
    },
    token: { type: String },
});

userSchema.index({ email: 1 }, { unique: true });

export default mongoose.model("User", userSchema);