import express from 'express';

import { createUrlCheck, getUrlCheck, updateUrlCheck, deleteUrlCheck } from '../controllers/urlcheck-controller.js'
import { verifyAndAttachTokenBodyToReq } from '../middlewares/check-auth.js';

const router  = express.Router();

router.post('/url-check', verifyAndAttachTokenBodyToReq, createUrlCheck);

router.get('/url-check', verifyAndAttachTokenBodyToReq, getUrlCheck);

router.put('/url-check', verifyAndAttachTokenBodyToReq, updateUrlCheck);

router.delete('/url-check', verifyAndAttachTokenBodyToReq, deleteUrlCheck);

export default router;