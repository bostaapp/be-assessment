const User = require('../models/user.model')
const nodeMailer = require('nodemailer')


exports.register = async (email, password) => {
    const user = new User({
        email: email,
        password: password
    });

    const result = await user.save()
    return result
}

exports.sendEmail = (user) => {
    const {
        NODE_EMAIL,
        NODE_EMAIL_PASSWORD,
        
    } = process.env;

    const transporter = nodeMailer.createTransport({
        service: 'gmail',
        auth: {
            type: "login",
            user: NODE_EMAIL,
            pass: NODE_EMAIL_PASSWORD
        }
    })

    transporter.sendMail({
        from: NODE_EMAIL,
        to: user.email,
        subject: 'Welcome to URL Checker, please verify your email',
        text: 'Please verify your email by clicking the link below',
        html: `<a href="http://localhost:8080/api/user/verify/${user._id}">Verify Email</a>`
    }).then((info) => {
        console.log(info)
    }).catch((err) => {
        console.log(err)
    })

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