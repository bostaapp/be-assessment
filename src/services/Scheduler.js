import { CronJob } from "cron";
import pkg from '@sendgrid/mail';
const { sgMail } = pkg;
import { GetAllChecksforscheduler } from "./dbServices.js";

export const runMonitorScheduler = async () => {
    // define cron job to send polling requests
    CronJob.schedule(async () => {
        const res = await GetAllChecksforscheduler();
        res.forEach(async check => {
            const results = await monitorUrl(check.url)
            sendNotification(results.status, check.email, check.name)
        })
    })
}


// function for sending notifications
async function sendNotification(status, userEmail, urlCheckName) {

    const msg = {
        to: userEmail,
        from: process.env.EMAIL_FROM,
        subject: "Report for all created Checks ",
        text: `The ${urlCheckName} is ${status.toLowerCase()}`,
        html: `The ${urlCheckName} is ${status.toLowerCase()}`,
    };
    try {
        await sgMail.send(msg);
        console.log(
            `Notification email sent to ${msg.to} for URL check ${urlCheckName}`
        );
    } catch (err) {
        console.error(
            `Error sending notification email to ${msg.to} for URL check ${urlCheckName}: ${err.message}`
        );
    }
}