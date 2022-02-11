import express from 'express';

import { createUrlCheck, getUrlCheck, updateUrlCheck, deleteUrlCheck } from '../controllers/urlcheck-controller.js'

const router  = express.Router();

router.post('/url-check', createUrlCheck);

router.get('/url-check', getUrlCheck);

router.put('/url-check', updateUrlCheck);

router.delete('/url-check', deleteUrlCheck);

export default router;