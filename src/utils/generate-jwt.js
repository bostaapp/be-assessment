import jwt from 'jsonwebtoken';

const JWT_EXPIRY_IN_SECONDS = 60 * 60 * 24 * 365;

export const generateJWT  = async (payload, expiresIn = JWT_EXPIRY_IN_SECONDS) => {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
}