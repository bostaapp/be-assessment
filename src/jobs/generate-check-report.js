import _ from 'lodash';
import https from 'https'; // Add this line to import the 'https' module
import axios from 'axios';
import Reports from '../models/Report';
import Checks from '../models/Check';

/**
 * Upsert a Report for a given Check
 *
 * @param {Object} check Check to Upsert the report for
 *
 * @param {Object} [notifications_options] Options to send notification to users
 * @param {String} [notifications_options.userEmail] Email of the Check owner to send notifications to it
 * 
 */
async function upsertCheckReport (check, { userEmail }){
    console.log(`Running cron job for check ${check._id} `)
    try{
        if(!(await Checks.exists({_id: check._id}))){
            check.job.stop();
            console.log(`Stopped job with check id: ${check._id}`)
        }

        let url = check.url;

        // Append path if available
        if(check.path){
            url += check.path;
        }

        // Append port if available
        if(check.port){
            url += `:${check.port}`;
        }

        const headers = {};

        // Append custom Http headers if available
        if (check.httpHeaders && _.isArray(check.httpHeaders)) {
            check.httpHeaders.forEach((header) => {
              headers[header.key] = header.value;
            });
        }

        const config = {
            timeout: check.timeout || 5000, // Default timeout is 5 seconds
            headers,
            httpsAgent: check.ignoreSSL ? new https.Agent({ rejectUnauthorized: false }) : undefined
        };

        // Add authentication headers if available
        if (check.authentication && check.authentication.username && check.authentication.password) {
            const { username, password } = check.authentication;
            const authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;
            headers.Authorization = authHeader;
        }

        const startTime = new Date(); // Measure the start time of the request
        const response = await axios.get(url, config);
        const endTime = new Date(); // Measure the end time of the request
        const { status } = response;

        const isUp = check.assert ? status ===  check.assert.statusCode : status >= 200 && status < 300;

        const responseTime = endTime - startTime;
        const log = {
            timestamp: Date.now(),
            logMessage: `Request to ${url} - Status: ${status}, Response Time: ${responseTime} ms`,
        }

        const oldReport = await Reports.findOne({check: check._id});

        let downtime = 0;
        let uptime = 0;
        let newAvailableCount = isUp ? 1 : 0;
        let newOutagesCount = isUp ? 0 : 1;
        let newTotalCount = 1;
        let responseTimesSum = responseTime;
        
        if(oldReport){
            downtime = !isUp ? oldReport.downtime + check.interval : 0;
            uptime = isUp ? oldReport.uptime + check.interval : 0;
    
            newAvailableCount = isUp ? oldReport.stats.avaialbleCount + 1 : oldReport.stats.avaialbleCount;
            newOutagesCount = !isUp ? oldReport.stats.outagesCount + 1 : oldReport.stats.outagesCount;
            newTotalCount = oldReport.stats.count + 1;
            responseTimesSum = oldReport.stats.responseTimesSum + responseTime;

            // Send Email if Report status has changed
            if((!isUp && oldReport.status === 'Up') || (isUp && oldReport.status === 'Down')){
                await sendEmail({
                    email: userEmail,
                    subject: `URL Check: ${url} status chenaged`,
                    html: `URL Check ${url} status is now ${isUp ? 'Up': 'Down'}`
                })
            }
        }

        const availability = (newAvailableCount/newTotalCount) * 100;
        const outages = (newOutagesCount/newTotalCount) * 100;
        
        const averageResponseTime = (responseTimesSum/newTotalCount);

        // Upsert the report in the database
        const filter = {check: check._id}
        const update = {
            check: check._id, 
            url,
            status: isUp ? "Up" : "Down",
            availability, 
            outages,
            downtime,
            uptime,
            averageResponseTime,
            stats: {
                count: newTotalCount,
                outagesCount: newOutagesCount,
                avaialbleCount: newAvailableCount,
                responseTimesSum
            },
            userId: check.userId,
            $push: {
                history: log
            }
        }
        const options = { upsert: true, new: true };

        await Reports.findOneAndUpdate(filter, update, options);
    }
    catch(error){
        console.error(`Error occurred while polling check ${check._id}`, error);
    }
}

export default upsertCheckReport;