import httpStatus from "http-status";
import APIError from "../utils/api-error";
import jwt from 'jsonwebtoken'
import Users from "../models/User";
import _ from "lodash";

export const authenticate = async (req, res, next) => {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
  
    if (!token) {
      return next(new APIError({message: "Not authorized to access this route", status: httpStatus.UNAUTHORIZED}));
    }
  
    // verify token
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await Users.findById(decoded._id);
  
      if(_.isNil(user)){
        return next(new APIError({message: "No user found for the provided JWT token", status: httpStatus.NOT_FOUND}));
      }

      req.user = user;
      next();
    } catch (error) {
      next(error);
    }
}