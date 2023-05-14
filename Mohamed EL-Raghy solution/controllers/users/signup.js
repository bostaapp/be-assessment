const _ = require('lodash');
const bcrypt = require('bcrypt');

const { User, validate } = require('../../models/user');
const { sendVerifyCode } = require('../../services/sendGrid');

module.exports = async (req, res, next) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(422).json({ "error": error.details[0].message });
  }
  try {

    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({ "error": "User Already registered" });
    }
  
    user = new User(_.pick(req.body, ['name', 'email', 'password']));
  
    if (user.password !== req.body.confirm_password) {
      return res.status(400).json({ "error": "password doesn't match" });
    } 
  
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  
    
    //* send 5 digits PIN to user when registering 
    const code = generateCode(5);
    await sendVerifyCode(user.email, code);
    
    user.PIN = code;
    user.PINExpiration = Date.now() + 3600000;

    await user.save();  
    
    res.status(201).json({ 
      message: "User Created",
      PIN: code, // for development perpose
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (err) {
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
}

function generateCode(digit_num) {
  return Math.floor(Math.random() * (9 * Math.pow(10, digit_num - 1))) + Math.pow(10, digit_num - 1);
}