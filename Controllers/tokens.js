const Token = require("../Models/tokens");
const { apiError } = require("../Utils/apiError");
const crypto = require("crypto");
const userController = require("../Controllers/users");


const createToken = async (userID) => {
    // Check User Exits
    if (!await userController.userExists(userID))
        throw new apiError(400, "User Does not Exist");

    return await new Token({
        userID,
        token: crypto.randomBytes(32).toString("hex")
    }).save();
};

const verifyUser = async (userID, createdToken) => {
    if (!await userController.userExists(userID))
        throw new apiError(400, "User Does not Exist");

    const tokenExists = await Token.findOne({
        userID: userID,
        token: createdToken
    });

    if (!tokenExists)
        throw new apiError(400, "Invalid/Expired Link");

    await userController.verifyUser(userID);
    await Token.findByIdAndRemove(tokenExists._id);

    return { message: "Verified Successfully " };
};

module.exports = { verifyUser, createToken };