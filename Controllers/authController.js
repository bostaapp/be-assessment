require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const User = require("../Models/userSchema");

exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((data) => {
      console.log(data);
      if (!data) next(new Error("user not found"));
      else {
        if (bcrypt.compareSync(req.body.password, data.password)) {
          let accessToken = jwt.sign(
            {
              email: data.email,
              _id: data._id,
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: process.env.TOKEN_EXPIRE_DATE }
          );
          res.status(200).json({
            message: "logged in",
            data: data,
            accessToken: accessToken,
          });
        } else {
          next(new Error("incorrect password"));
        }
      }
    })
    .catch((err) => next(err));
};

exports.authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // not valid token
    req.user = user;
    next();
  });
};
