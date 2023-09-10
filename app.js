require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const User = require("./model/user.model");
const auth = require("./middleware/auth");

const app = express();

app.use(express.json());

app.post("/register", async (req, res) => {

    try {
        // get user info
        const { name, email, password } = req.body;

        if (!(email && password && name)) {
            res.status(400).send("All input is required");
        }

        // check if user already exist
        const existUser = await User.findOne({ email });

        if (existUser) {
            return res.status(401).send("user email already exist. try another email OR login");
        }

        //Encrypt user password
        encryptedPassword = await bcrypt.hash(password, 10);

        // Create user 
        const user = await User.create({
            name,
            email: email.toLowerCase(),
            password: encryptedPassword,
        });

        // Generate token
        const token = jwt.sign(
            { user_id: user._id, email },
            process.env.TOKEN_KEY,
            {
                expiresIn: "1h",
            }
        );
        // save user token
        user.token = token;

        res.status(200).json(user);
    } catch (err) {
        console.log(err);
    }
});

app.post("/login", async (req, res) => {

    try {
      // get user info
      const { email, password } = req.body;
  
      // Validate user info
      if (!(email && password)) {
        res.status(401).send("email or password is missing");
      }
      // Validate if user exist in our database
      const user = await User.findOne({ email });
  
      if (user && (await bcrypt.compare(password, user.password))) {
        // Generate token
        const token = jwt.sign(
          { user_id: user._id, email },
          process.env.TOKEN_KEY,
          {
            expiresIn: "1h",
          }
        );
  
        // save user token
        user.token = token;
  
        res.status(200).json(user);
      }
      res.status(400).send("email or password incorrect");
    } catch (err) {
      console.log(err);
    }
  });
  

  app.post("/welcome", auth, (req, res) => {
    res.status(200).json(req.user);
  });

module.exports = app;