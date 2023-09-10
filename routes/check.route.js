const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
const { send_email_message } = require('../controllers/check.controller');
const User = require('../model/user.model');
const URLCheck = require('../model/urlCheck.model');

router.get('/checks/:id', auth, async (req, res) => {
    // Check the validity of the token.
    if (!req.user) {
        res.status(401).send('Unauthorized');
        return;
    }
    try {
        const { id } = req.params;
        const user = await User.findById(req.user.user_id);
        const userId = user._id;
        const urlcheck = await URLCheck.findOne({ _id: id, userId });
        if (!urlcheck) {
            res.status(404).json({ error: 'URL check not found' });
            return;
        }
        res.status(200).json(urlcheck);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// make new url check
router.post('/checks', auth, async (req, res) => {
    // Check the validity of the token.
    if (!req.user) {
        res.status(401).send('Unauthorized');
        return;
    }
    try {
        const { url, name, protocol } = req.body;
        const user = await User.findById(req.user.user_id);
        const userId = user._id;
        const response = await axios.get(url);
        const isUp = response.status >= 200 && response.status < 400;
        const responseTime = response.config.responseTime;
        const checkDate = new Date();
        const lastUrlCheck = await URLCheck.find({ url, userId }).sort({ checkDate: -1 });

        if (lastUrlCheck.length != 0) {
            const lastUrlCheckStatus =
                lastUrlCheck[0].isUp;
            if (lastUrlCheckStatus == false && isUp == true) {
                await send_email_message(user.email, 'URL is getting up', `The URL ${urlcheck.url} is currently up.`);
            }
        }

        if (isUp == false) {
            await send_email_message(user.email, 'URL is down', `The URL ${urlcheck.url} is currently down.`);
        }

        const urlcheck = new URLCheck({ url, userId, name, protocol, isUp, responseTime, checkDate });
        if (req.body.tags) {
            urlcheck.tags = req.body.tags;
        }
        await urlcheck.save();

        res.json(urlcheck);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
});

router.put('/checks/:id', auth, async (req, res) => {
    // Check the validity of the token.
    if (!req.user) {
        res.status(401).send('Unauthorized');
        return;
    }
    try {
        const { id } = req.params;
        const { name, protocol, path, port } = req.body;
        const user = await User.findById(req.user.user_id);
        const userId = user._id;
        // Find the URL check by ID and user association
        const urlcheck = await URLCheck.findOneAndUpdate({ _id: id, userId }, { $set: { name, protocol, path, port } });

        if (!urlcheck) {
            res.status(404).json({ error: 'URL not found' });
            return;
        }

        res.json(urlcheck);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
});


router.delete('/checks/:id', auth, async (req, res) => {
    // Check the validity of the token.
    if (!req.user) {
        res.status(401).send('Unauthorized');
        return;
    }
    try {
        const { id } = req.params;
        const userId = req.user.id;

        // Find the URL check by ID and user association
        const urlcheck = await URLCheck.findOneAndDelete({ _id: id, userId });

        if (!urlcheck) {
            return res.status(404).json({ error: 'URL check not found' });
        }

        res.status(204).end();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});
module.exports = router;