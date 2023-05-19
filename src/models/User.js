import mongoose from 'mongoose';
import userHooks from './hooks/user';
import userMethods from './methods/user';

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },

    password: { type: String, required: true, min: 6 },

    isVerified: { type: Boolean, default: false },

    tokens: {
        verification: { type: String }
    }
});

// ======================== Attach Hooks ====================================
UserSchema.pre('save', userHooks.hashPassword);

// ======================== Attach methods ========================
UserSchema.methods = { ...userMethods };

const Users = mongoose.model("User", UserSchema, 'users');

export default Users;