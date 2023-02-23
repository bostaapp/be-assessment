const jsonwebtoken = require("jsonwebtoken");
const User = require("../models/user");

exports.verifyToken = async (req, res, next) => {
    if (!req.headers.authorization)
        return res.status(403).send("Authentication token is not exist");

    const token = req.headers.authorization.split(" ")[1];

    if (!token)
        return res.status(403).send("Authentication token is not exist");

    try {
        const decoded = jsonwebtoken.verify(token, process.env.TOKEN_KEY);
        
        const user = await User.findById(decoded._id);
        
        if (!user) throw "Invalid User verification.";

        req.user = user;
        return next();
    } catch (err) {
        console.log("error at token verifying" + err);
        return res.status(401).json({ message: err });
    }
};
