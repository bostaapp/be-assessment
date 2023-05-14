const { Check } = require('../../models/check');
const Report = require('../../models/report');

module.exports = async(req, res, next) => {
  
  //* return Error if Not valid ID 
  const checkId = req.params.id;

  try {
    const tags = req.query.tags;
    const regex = new RegExp(tags, 'i');
  
    //* check if there is check with that ID;
    const check = await Check.findOne({_id: checkId, createdBy: req.userId, tags: regex});
    
    if (!check) {
      const error = new Error('Check NOT FOUND');
      error.statusCode = 404;
      throw error;
    }

    const reports = await Report.find({
      forCheck: checkId
    });

    //* return Error if Not Report found
    if (reports.length === 0) {
      const error = new Error('Report NOT FOUND');
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      message: "Report Retrieved",
      reports: reports
    })

  } catch (error){
    if(!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
}