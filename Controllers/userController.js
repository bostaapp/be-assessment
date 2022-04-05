const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");

const User = require("../Models/userSchema");
const eventEmitter = require("../Utils/eventEmitter");

exports.createUser = (req, res, next) => {
  //validation errors
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    let error = new Error();
    error.status = 422;
    error.message = errors
      .array()
      .reduce((current, object) => current + object.msg + " ", "");
    throw error;
  }
  //create new user
  new User({
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10),
    verificationCode: Math.floor(Math.random() * 90000) + 10000,
    isEmailVerified: false,
  })
    .save()
    .then((data) => {
      res.status(201).json({ message: "user is added", data: data });
      eventEmitter.emit("userCreated", data);
    })
    .catch((error) => {
      console.log(error);
      next(error);
    });
};

exports.verifyUser = (req, res, next) => {
  //validation errors
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    let error = new Error();
    error.status = 422;
    error.message = errors
      .array()
      .reduce((current, object) => current + object.msg + " ", "");
    throw error;
  }
  //get the user
  User.findOne({ email: req.body.email })
    .then((user) => {
      console.log(user);
      //check if user exists
      if (user) {
        //check if code is correct
        if (user.verificationCode == req.body.verificationCode) {
          User.findByIdAndUpdate(
            req.body._id,
            { isEmailVerified: true },
            { new: true }
          )
            //verify the user
            .then((data) => {
              console.log(data);
              res.status(201).json({ message: "user verified" });
            })
            .catch((err) => {
              console.log(err);
              next(err);
            });
        } else {
          let error = new Error("verification code is not correct");
          next(error);
        }
      } else {
        let error = new Error("user not found");
        next(error);
      }
    })
    .catch((error) => {
      console.log(error);
      next(error);
    });
};
