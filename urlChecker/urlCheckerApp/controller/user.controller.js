const userService = require('../service/user.service');
const catchAsync = require('../utils/catchAsync');

exports.register =catchAsync(async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const result = await userService.register(email, password);
    return res.json(result)

})