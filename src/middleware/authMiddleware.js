import jwt from "jsonwebtoken";
import config from "../config.js";
import User from "../models/User.js";
export const authentication = async (req, res, next) => {
    if (!req.headers.accesstoken) return res.status(403).json({ message: "unauthorized" });
    const accessToken = req.headers.accesstoken.split(" ")[1];
    try {
        const verifyToken = jwt.verify(accessToken, config.tokenSecret);
        const user = await User.findById(verifyToken.userid);
        if (!user) return res.status(401).json({ message: "invalid user verification" });
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ error: error })
    }

}