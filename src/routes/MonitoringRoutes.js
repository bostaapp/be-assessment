import express from 'express'
import {
    CreateUrlCheck,
    GetAllUrlChecks,
    GetCheckByName,
    DeleteChecks,
    UpdateUrlCheck
} from '../controllers/MonitoringController.js';

const router = express.Router();

// Route to create a new URL check
router.post('/createcheck', CreateUrlCheck);
// Route to get all URL checks
router.post('/getchecks', GetAllUrlChecks);
// Route to get a URL check by name
router.post('/getcheck', GetCheckByName);
// Route to delete one or more URL checks (implementation missing)
router.post('/deletechecks', DeleteChecks)
// Routh to Update Check by Check name
router.post('/updatecheck', UpdateUrlCheck)


// router.post('/test', test);

export default router;