const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');
const User = require('../../src/Modules/users/models/UserModel');


module.exports = () => {
    return async (req, res, next) => {
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(" ")[1];
            if (token) {
                try {
                    var decoded = jwt.verify(token, process.env.SECRET_KEY);
                    const user = await User.findById(decoded._id);
                    if (user) {
                        req.user = user;
                        next();
                    }
                    else throw "FORBIDDEN"

                }
                catch (err) {
                    res.
                        status(StatusCodes.FORBIDDEN).
                        json({ message: "error", err })
                }

            }
            else {
                res
                    .status(StatusCodes.UNAUTHORIZED)
                    .json({ message: "UNAUTHORIZED" })
            }
        }
        else {
            res
                .status(StatusCodes.UNAUTHORIZED)
                .json({ message: "UNAUTHENTICATED" })
        }

    }
}