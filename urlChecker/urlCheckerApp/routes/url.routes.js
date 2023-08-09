const express = require('express');
const router = express.Router();

const userController = require('../controller/user.controller.js');
const middleware = require('../utils/middleware.js');
router.get('/register',(req, res) => res.send('Hello World! from router'));


router.post('/',userController.register);
router.get('/verify/:id',userController.verify);
router.post('/login',userController.login);
router.get('/checkAuth', [middleware.authorize], (req, res) => {
    res.json({
        message: "Authorized"
    })
})

module.exports = router;