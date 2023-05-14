const express = require('express');
const router = express.Router();

const reportController = require('../controllers/report');
const auth = require('../middleware/is-Auth');
const validID = require('../middleware/validateObjectId');

//? GET: /api/report/checkId ===> return report for Check
router.get('/:id', auth, validID, reportController.getReport);

module.exports = router;