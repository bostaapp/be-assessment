const User = require('../models/user.model');
const catchAsync = require('../utils/catchAsync');
const notificationService = require('./notification.service')
const jwt = require('jsonwebtoken')

exports.register = async (email, password) => {
    const user = new User({
        email: email,
        password: password
    });

    const result = await user.save()
    const messageContent = `
    <h1>Welcome to URL Checker</h1>
    <p>Please verify your email by clicking the link below</p>
    <a href="http://localhost:8080/api/user/verify/${result._id}">Verify Email</a>
    `
    notificationService.sendNotification("email", messageContent, result._id)
    return result
}


exports.verify = async (id) => {

    //  find user by id and update the verified field to true 
    const foundUser = await User.findByIdAndUpdate(id, {
        emailVerified: true
    }, {
        new: true
    })
    return foundUser
}

exports.login = async (email, password) => {
    // find user by email
    const foundUser = await User.findOne({
        email: email
    })
    if (!foundUser) {
        throw new Error("User not found")
    }
    // check if password matches

    await foundUser.comparePassword(password, (err, isMatch) => {
        if (err) throw new Error("Incorrect password")
    });


    // generate access token
    const accessToken = jwt.sign({
        id: foundUser._id,
        email: foundUser.email
    }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRATION
    })

    return {
        accessToken: accessToken,
    }
}
exports.findUserEmailById = async (id) => {
    const user = await User.findById(id)
    return user.email

}