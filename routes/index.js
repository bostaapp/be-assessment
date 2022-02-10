import express from 'express';

import userRouter from './user.js';

const router  = express.Router();

// GET root directory 
router.get('/', async (req, res) => {
  return res.json({hello:"world"});
});

router.use('/users', userRouter);



export default router;