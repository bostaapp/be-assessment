const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
const User = require('../model/user.model');
const URLCheck = require('../model/urlCheck.model');

router.get('/uptime-reports', auth, async (req, res) => {
    // Check the validity of the token.
    if (!req.user) {
        res.status(401).send('Unauthorized');
        return;
    }
    try {
        const user = await User.findById(req.user.user_id);
        const userId = user._id;
        //get all urls of the user
        const userUrls = await URLCheck.distinct('url', { userId });
        if (userUrls.length == 0) {
            res.status(404).json({ error: "You don't have any URLs checks" });
            return;
        }
        
    const uptimeReports = [];

    // Iterate through each URL and calculate uptime report
    for (const url of userUrls) {

      // Fetch the monitoring data for the URL and sort them in descending order 
      const urlChecks = await URLCheck.find({ url, userId }).sort({checkDate: -1});
      let status = urlChecks[0].isUp;
      let totalUptime = 0;
      let downtime = 0;
      let totalResponseTime = 0;

      // Calculate uptime, downtime, and total response time
      for (const data of urlChecks) {
        if (data.isUp) {
          totalUptime++;
          totalResponseTime += data.responseTime;
        } else {
          downtime++;
        }
      }

      const availability = (totalUptime / urlChecks.length) * 100;
      const averageResponseTime = totalResponseTime / totalUptime;

      uptimeReports.push({
        url,
        status,
        availability,
        averageResponseTime,
        totalUptime,
        downtime,
      });
    }
        res.status(200).json(uptimeReports);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/uptime-reports/:tag', auth, async (req, res) => {
    // Check the validity of the token.
    if (!req.user) {
        res.status(401).send('Unauthorized');
        return;
    }
    try {
        const { tag } = req.params;
        const user = await User.findById(req.user.user_id);
        const userId = user._id;
        //get all urls of the user
        const userUrls = await URLCheck.distinct('url', { userId, tags: tag });
        if (userUrls.length == 0) {
            res.status(404).json({ error: "You don't have any URLs checks" });
            return;
        }
        
    const uptimeReports = [];

    // Iterate through each URL and calculate uptime report
    for (const url of userUrls) {

      // Fetch the monitoring data for the URL tag and sort them in descending order 
      const urlChecks = await URLCheck.find({ url, userId, tags: tag }).sort({checkDate: -1});
      let status = urlChecks[0].isUp;
      let totalUptime = 0;
      let downtime = 0;
      let totalResponseTime = 0;

      // Calculate uptime, downtime, and total response time
      for (const data of urlChecks) {
        if (data.isUp) {
          totalUptime++;
          totalResponseTime += data.responseTime;
        } else {
          downtime++;
        }
      }

      const availability = (totalUptime / urlChecks.length) * 100;
      const averageResponseTime = totalResponseTime / totalUptime;

      uptimeReports.push({
        url,
        status,
        availability,
        averageResponseTime,
        totalUptime,
        downtime,
      });
    }
        res.status(200).json(uptimeReports);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});