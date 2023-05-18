import _ from 'lodash';
import APIError from '../utils/api-error';




//Middleware of handling errors
export const errorHandler = (err, req, res, next) => {
  let error = { ...err }; //spread operator
  error.message = err.message;

  // Log in console for Dev
  console.log(err.stack.red);
  console.log(err);

  //Mongoose bad ObjectId
  if (err.name === "CastError" || err.name === "TypeError") {
    const message = `Resource not found with that id`;
    error = new APIError(message, 404);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = `Duplicate field value entered`;
    error = new APIError(message, 400);
  }

  // Mongoose Validation error
  if (err.name === "ValidationError") {
    console.log(err.errors);
    const message = Object.values(err.errors).map((val) => val.message);
    error = new APIError(message, 400);
  }

  res
    .status(error.statusCode || 500)
    .json({ Success: false, error: error.message || "Server Error" });
};
