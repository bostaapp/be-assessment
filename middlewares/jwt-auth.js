const jwtToken = require("jsonwebtoken");

// genToken with the secret key in the env file
const generateToken = (userID) => {
  token = jwtToken.sign(userID, process.env.JWT_SECRET_KEY);
  return token;
};

// return use id from the token or throws an exception
const getUserID = (token) => {
  let userId;
  jwtToken.verify(token, process.env.JWT_SECRET_KEY, (err, id) => {
    if (err) {
      throw new Error(
        JSON.stringify({ error: "token is invalid please get another token" })
      );
    }
    userId = id;
  });

  return userId;
};

module.exports = { generateToken, getUserID };
