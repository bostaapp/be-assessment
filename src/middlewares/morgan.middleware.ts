import morgan, { StreamOptions } from 'morgan';

import Logger from '../utils/logger.util';

// Override the stream method by telling
// Morgan to use our custom logger instead of the console.log.
const stream: StreamOptions = {
  // Use the http severity
  write: (message) => Logger.info(message),
};

// Build the morgan middleware
const morganMiddleware = morgan(
  // Define message format string (this is the default one).
  // The message format is made from tokens, and each token is
  // defined inside the Morgan library.
  // You can create your custom token to show what do you want from a request.
  ':method :url :status :res[content-length] - :response-time ms',
  // 'combined',
  // Options: in this case, I overwrote the stream and the skip logic.
  // See the methods above.
  { stream },
);

export default morganMiddleware;
