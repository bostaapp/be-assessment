const { Check } = require('../../models/check');

module.exports = async (req, res, next) => {
  
  try {    
    const checkId = req.params.id;
    const deletedCheck = await Check.findOneAndRemove({ _id: checkId, createdBy: req.userId });

    if (!deletedCheck) {
      const error = new Error('check is not found...');
      error.statusCode = 404;
      throw error;
    }

    res.status(204).json({
      message: "check Deleted",
      check: deletedCheck
    })
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}