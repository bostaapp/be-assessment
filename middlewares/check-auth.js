import jwt from 'jsonwebtoken';

import ApiError from '../utils/apiError';

export default (req, res, next) => {
    try {
        const token = req.cookies.token;
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        req.decoded = decoded;
        
        next();
    } catch (err) {
        const error = new ApiError({
            status: 401,
            code: 'NotAuthorized',
            message: 'failde to authenticate user, please reauthenticate'
        })
        
        next(error);
    }
};
