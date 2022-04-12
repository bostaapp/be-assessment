const { Schema } = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new Schema({
    userName: String,
    email: {
        type: String,
        unique: true,
        index: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isVerified: { type: Boolean, default: false },
}, {
    timestamps: true
})

userSchema.statics.generateToken = function (user) {
    let token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY, {
        expiresIn: "3h",
    });
    return token;
}

userSchema.statics.verifyToken = function (token) {
    let decoded = jwt.verify(token, process.env.SECRET_KEY);
    return decoded;
}

userSchema.statics.comparePassword = async function (oldPassword, newPassword) {
    let match = await bcrypt.compare(oldPassword, newPassword)
    return match;
}

userSchema.pre("save", async function (next) {
    try {
        if (!this.isModified("password")) {
            return next();
        }
        this.password = await bcrypt.hash(this.password, 7);
        next();
    } catch (error) {
        throw new Error(error);
    }
});

module.exports = userSchema;