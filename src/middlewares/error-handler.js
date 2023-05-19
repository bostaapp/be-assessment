import _ from 'lodash';
import APIError from '../utils/api-error';
import httpStatus from 'http-status';
import mongoose from 'mongoose';


//Middleware of handling errors
export const errorHandler = (err, req, res, next) => {
  console.log(err)
  let errorType = 'API';
  // ========== Handle known errors ==========
  // Wrap mongoose errors and report BAD_REQUEST
  if (err instanceof mongoose.Error.ValidationError) {
    errorType = 'mongo';
    // eslint-disable-next-line no-param-reassign
    err = new APIError({ message: err.message, status: httpStatus.BAD_REQUEST });
  }

  const response = { message: err.message, status: err.status };

  if (!_.isNil(err.errorCode)) {
    response.errorCode = err.errorCode;
  }

  // Handle and format joi schema validation errors
  if (err.isJoi) {
    errorType = 'validation';
    response.status = httpStatus.BAD_REQUEST;
    response.message = '';

    const errors = { validation: { source: err.source, keys: [], details: [] } };

    // Concatenate all validation errors to be reported
    if (err.details) {
      err.details.forEach(detail => {
        response.message += `${detail.message.replace(/"/g, '\'')}\n`;
        const detailPath = detail.path.join('.');
        errors.validation.keys.push(detailPath);

        errors.validation.details.push({
          path: detail.path,
          message: `${detail.message.replace(/"/g, '\'')}`,
        });
      });
    }

    response.errors = errors;
  }

  // ========== Handle unknown errors ==========
  // For any unknown errors, report "something went wrong"
  if (_.isNil(response.message) || _.isNil(response.status) || response.status >= 500) {
    response.message = 'Something Went Wrong';
  }

  // ========== Send error response to user ==========
  if (!_.isEmpty(err.meta)) { response.meta = err.meta; }
  if (_.isNil(response.status)) { response.status = httpStatus.INTERNAL_SERVER_ERROR; }

  // Attach error to response for better logs
  res.error = err;

  return res.status(response.status).json(response);
};
