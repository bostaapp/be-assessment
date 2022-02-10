import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

import ApiError from '../utils/apiError.js';
import User from '../models/User.js';
import generateRandomNumber from '../utils/generateRandomNumber.js';

export const createUser = async (req, res, next) => {
    try{
        const password = await bcryptjs.hash(req.body.password, 10);

        const { email } = req.body
        await User.create({
            email,
            password, 
            verificationCode: generateRandomNumber(5),
        })

        return res.status(200).end();
    }
    catch(err){
        next(err);
    }
}

export const login = async (req, res, next) => {
    try{
        const { email,password } = req.body;
        
        const user = await User.findOne({email});

        const correctPassword = await bcryptjs.compare(password, user.password);

        return correctPassword ? 
            res.status(200).json({token: jwt.sign({_id:user._id},process.env.JWT_SECRET)}) :
            next( new ApiError({
                status: 401,
                message: 'failed to authenticate using the given credentials',
                code: 'NotAuthorized'
            }))
    }
    catch(err){
        next(err);
    }
}