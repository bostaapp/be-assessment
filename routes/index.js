import express from 'express';

import userRouter from './user.js';
import urlCheckRouter from './url-checker.js'; 

const router  = express.Router();

// GET root directory 
router.get('/', async (req, res) => {
  return res.json({hello:"world"});
});

router.use('/users', userRouter);

router.use('/url-check', urlCheckRouter);

export default router;