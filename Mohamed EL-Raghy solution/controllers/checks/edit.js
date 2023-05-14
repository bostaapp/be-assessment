const { Check, validate } = require('../../models/check');

module.exports = async (req, res, next) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(422).json({ "error": error.details[0].message });
  }
  
  const checkId = req.params.id;

  try {
    //* check if there is any checks having same url
    let check = await Check.exists({ url: req.body.url, path: req.body.path });
    if (check) {
      const error = new Error('check Already Exist');
      error.statusCode = 400;
      throw error;
    }

    //* find & update
    check = await Check.findOne({_id: checkId, createdBy: req.userId });

    if(!check) {
      const error = new Error('No check found');
      error.statusCode = 404;
      throw error;
    }

    for (const key in req.body) {
        check[key] = req.body[key];
    }

    await check.save();

    return res.status(200).json({ 
      message: "check Updated",
      check: check
    });

  } catch(err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}