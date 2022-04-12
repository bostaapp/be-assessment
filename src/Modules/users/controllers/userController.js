const { StatusCodes } = require("http-status-codes");
const User = require("../models/UserModel");
const sendEmail = require('../../../../common/services/sendEmail');



const signUp = async (req, res) => {
    const { userName, email, password } = req.body;
    try {
        const newUser = new User({ userName, email, password });

        let data = await newUser.save();

        let token = User.generateToken(newUser);

        await sendEmail(
            [email],
            `EMAIL VERFICIATION`,
            `<h1> Welcome</h1>
                   <a href="${process.env.BASE_URL}/verify/${token}"> Press This Link to Verify Your Account. </a>`
        );

        res
            .status(StatusCodes.CREATED)
            .json({ message: "Added successfully", data: data })
    }
    catch (error) {
        res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ error: error })
    }

}

const verifyUser = async (req, res) => {
    const { token } = req.params;
    var decoded = User.verifyToken(token);
    const user = await User.findOne({ _id: decoded._id });
    if (user) {
        await User.updateOne(
            { _id: decoded._id },
            {
                isVerified: true,
            }
        );
        res.status(StatusCodes.OK).json({ message: "Account has been verified" });
    }
    else
        res.status(StatusCodes.FORBIDDEN).json({ message: "FORBIDDEN" });
};


const signIn = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user) {
            const match = await User.comparePassword(password, user.password)
            if (match) {
                var token = User.generateToken(user);
                const { password, ...info } = user._doc;
                res
                    .status(StatusCodes.OK)
                    .json({ message: "Login successfully", data: info, token: token });
            }
            else {
                res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({ message: "password is not correct" })
            }

        }
        else {
            res
                .status(StatusCodes.BAD_REQUEST)
                .json({ message: "not found" })
        }
    }
    catch (error) {
        next(error);
    }

}




module.exports = {
    signUp,
    signIn,
    verifyUser,
}