const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt')
const SALT_WORK_FACTOR = 10;
const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (val) {
                let regex = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');
                return  regex.test( val.toString())
            },
            message: val => `${val.value} does not match the email pattern, please enter a valid email`
        }
    },
    password: {
        type: String,
        required: true,
        
    },
    emailVerified: {
        type: Boolean,
        enum: [true, false],
        default: false
    }
});

userSchema.pre('save', function(next) {
    let user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);
            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

userSchema.method('comparePassword' ,function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch)=> {
        if (err) return cb(err);
        cb(null, isMatch);
    });
});
module.exports = mongoose.model("User", userSchema);