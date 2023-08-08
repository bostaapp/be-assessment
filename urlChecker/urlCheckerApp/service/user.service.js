const User = require('../models/user.model')

exports.register = async (email, password) => {
    const user = new User({
        email: email,
        password: password
    });

    const result = await user.save()
    return result
}