const express = require('express');
const router = express.Router();

const urlController = require('../controller/url.controller.js');
const middleware = require('../utils/middleware.js');

router.use(middleware.authorize);

router.get('/check', urlController.check)
router.get('/report',urlController.report);
router.get('/:id',urlController.read);


router.post('/',urlController.create);

router.put('/:id',urlController.update);

router.delete('/:id',urlController.delete);



module.exports = router;