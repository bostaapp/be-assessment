import jwt from 'jsonwebtoken';
import { config } from 'dotenv';

config();
export const generateToken = (userId) => {
  return jwt.sign({ _id: userId }, process.env.SECRET_KEY);
};

export const verifyToken = (token) => {
  return jwt.verify(token, process.env.SECRET_KEY);
};
