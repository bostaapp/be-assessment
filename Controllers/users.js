const { User, validate } = require("../Models/users");
const { apiError } = require("../Utils/apiError");
const { bcrypt_pass, bcrypt_salt } = require("../Config/config.secrets");
const bcrypt = require("bcryptjs");

function validUserParams(user, login = false) {
    const isNotValid = validate(user, login);
    if (isNotValid) throw new apiError(400, isNotValid.details[0].message);

}

async function userExists(userID) {
    return User.findById(userID);
}

const createUser = async (newUser) => {
    validUserParams(newUser);

    const isDuplicate = await User.findOne({ email: newUser.email });
    if (isDuplicate)
        throw new apiError(400, "User Already Exists");

    const passHash = bcrypt.hashSync(newUser.password + bcrypt_pass, parseInt(bcrypt_salt));

    return await new User({
        username: newUser.username,
        email: newUser.email,
        password: passHash
    }).save();
};

const authenticateUser = async (userLogin) => {
    validUserParams(userLogin, true);
    const user = await User.findOne({ email: userLogin.email });
    if (!user)
        throw new apiError(400, "User not found ");

    if (!user.verified)
        throw new apiError(401, "User is not Verified");

    const authenticated = bcrypt.compareSync(
        userLogin.password + bcrypt_pass, user.password
    );
    if (!authenticated)
        throw new apiError(400, "Password is Wrong");

    return user;
};

const verifyUser = async (userID) => {
    if (!userID)
        throw new apiError(400, "Missing User ID");
    if (!await userExists(userID))
        throw new apiError(400, "User does not exist");
    await User.findByIdAndUpdate({ _id: userID }, { verified: true });
    return { message: "User Verified" };
};

module.exports = { createUser, authenticateUser, userExists, verifyUser };