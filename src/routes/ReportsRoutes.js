import express from 'express'
import { createReports } from '../controllers/ReportsController.js'

const router = express.Router();

// Route to create a new report
router.post('/createreport', createReports);

export default router;