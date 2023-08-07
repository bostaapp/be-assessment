const express = require('express');
const router = express.Router();

const userController = require('../controller/user.controller.js');

router.get('/register',(req, res) => res.send('Hello World! from router'));


router.post('/register',userController.register);

module.exports = router;