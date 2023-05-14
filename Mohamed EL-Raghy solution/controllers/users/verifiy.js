const Joi = require('joi');

const { User } = require('../../models/user');

module.exports = async (req, res, next) => {

  const { error } = validate(req.body);
  if(error) {
    return res.status(422).json({ "error": error.details[0].message} );
  }

  try {
    const user = await User.findOne({ _id: req.userId, PIN: req.body.PIN, PINExpiration: { $gt: Date.now() } }).select('-password');
    if (!user) {
      const error = new Error("Not Authorized");
      error.statusCode = 401;
      throw error;
    }
  
    user.userIsVerified = true;
    user.PIN = undefined;
    user.PINExpiration = undefined;
  
    await user.save();
  
    return res.status(200).json({ 
      message : "Account is activated", 
      accountIsActive: user.userIsVerified,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

validate = req => {
  const schema = Joi.object({
    PIN: Joi.string().min(5).max(5).required()
  })
  return schema.validate(req);
}
