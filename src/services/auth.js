import httpStatus from "http-status";
import Users from "../models/User";
import APIError from "../utils/api-error";
import { generateJWT } from "../utils/generate-jwt";
import sendEmail from "../utils/send-email";
import jwt from 'jsonwebtoken';

const AuthService = {
    /**
     * Sign up a new user
     *
     * @param {String} email Email of the user
     * @param {String} password Password of the user
     *
     */
    async signupUser({ email, password }){
        const verificationToken = await generateJWT({email})
        const user = await Users.create({email, password, isVerified: false, tokens: {verification: verificationToken}});
        // const authToken = await generateJWT({_id: user._id});
        
        const verificationLink = `http://localhost:3000/auth/verify?token=${verificationToken}`;
        await sendEmail({
            email,
            subject: 'Email Verification',
            // message: verificationLink
            html: `Click the following link to verify your email: <a href="${verificationLink}">${verificationLink}</a>`
        })

        // return { token: authToken };
    },

    /**
     * Sign in a  user
     *
     * @param {String} email Email of the user
     * @param {String} password Password of the user
     *
     * @returns {Object} Object containing the authentication token
     */
    async signinUser({ email, password }){
        const user = await Users.findOne({ email });

        if(!user){
            throw new APIError({message: `No User found with email: ${email}`, status: httpStatus.NOT_FOUND});
        }

        if(!(await user.comparePassword(password))){
            throw new APIError({message: `Incorrect email or password`, status: httpStatus.UNAUTHORIZED})
        }

        if(!user.isVerified){
            throw new APIError({message: `User did not verify his/her email`, status: httpStatus.FORBIDDEN});
        }

        const authToken = await generateJWT({_id: user._id});
        return { token: authToken };
    },

    /**
     * Verify user's email
     *
     * @param {String} token Verification token
     *
     * @throws {APIError} If no user is found with the specified email
     */
    async verifyUserEmail({token}){
        const decoded = jwt.decode(token, process.env.JWT_SECRET);
        const email = decoded.email;

        const user = await Users.findOne({ email, 'tokens.verification': token });

        if(!user){
            throw new APIError({message: `No User found with email: ${email}`, status: httpStatus.NOT_FOUND})
        }

        user.isVerified = true;
        await user.save();
    }
}

export default AuthService;