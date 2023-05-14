const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  
  const header = req.get('Authorization');
  if (!header) {
    req.isAuth = false;
    const error = new Error('Access denied. No token provided.');
    error.statusCode = 401;
    return next(error);
  }

  const token = req.get('Authorization').split(' ')[1];
  let decodedToken;
  
  try {
    decodedToken = jwt.verify(token, process.env.JWT_KEY);
  } catch(err) { 
    req.isAuth = false;
    const error = new Error('Token is not Valid');
    error.statusCode = 400;
    return next(error);
  }

  req.userId = decodedToken.userId;
  req.userEmail = decodedToken.email;
  req.isAuth = true;
  next();
}