const { Check } = require('../../models/check');

module.exports = async (req, res, next) => {
  const checkId = req.params.id;

  try {
    const check = await Check.findOne({_id: checkId, createdBy: req.userId});
    
    if (!check) {
      const error = new Error('No Check found...');
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      check: check
    });
    
  } catch (err){
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
} 