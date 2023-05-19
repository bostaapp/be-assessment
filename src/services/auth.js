import httpStatus from "http-status";
import Users from "../models/User";
import APIError from "../utils/api-error";
import { generateJWT } from "../utils/generate-jwt";
import sendEmail from "../utils/send-email";
import jwt from 'jsonwebtoken';

const AuthService = {
    async signupUser({ email, password }){
        const verificationToken = await generateJWT({email})
        const user = await Users.create({email, password, isVerified: false, tokens: {verification: verificationToken}});
        const authToken = await generateJWT({_id: user._id});
        
        const verificationLink = `http://localhost:3000/auth/verify?token=${verificationToken}`;
        await sendEmail({
            email,
            subject: 'Email Verification',
            // message: verificationLink
            html: `Click the following link to verify your email: <a href="${verificationLink}">${verificationLink}</a>`
        })

        return { token: authToken };
    },

    async signinUser({ email, password }){
        const user = await Users.findOne({ email });

        if(!user){
            throw new APIError({message: `No User found with email: ${email}`, status: httpStatus.NOT_FOUND});
        }

        if(!(await user.comparePassword(password))){
            throw new APIError({message: `Incorrect email or password`, status: httpStatus.UNAUTHORIZED})
        }

        const authToken = await generateJWT({_id: user._id});
        return { token: authToken };
    },

    async verifyUserEmail({token}){
        const decoded = jwt.decode(token, process.env.JWT_SECRET);
        const email = decoded.email;

        const user = await Users.findOne({email});

        if(!user){
            throw new APIError({message: `No User found with email: ${email}`, status: httpStatus.NOT_FOUND})
        }

        user.isVerified = true;
        await user.save();
    }
}

export default AuthService;