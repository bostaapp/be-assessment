import express from 'express';

const router  = express.Router();

// GET root directory 
router.get('/', async (req, res) => {
  return res.json({hello:"world"});
});

export default router;