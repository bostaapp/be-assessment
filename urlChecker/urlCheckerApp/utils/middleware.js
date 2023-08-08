const jwt = require('jsonwebtoken');

exports.authorize = (req, res, next) => {

    const token = req.cookies['accessToken'];
    if (!token) {
        return res.status(401).json({
            message: "Unauthorized"
        })
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({
                message: "Forbidden"
            })
        }
        req.user = user;
        next();
    })
}