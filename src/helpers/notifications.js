import nodemailer from "nodemailer";
import config from "../config.js";

export const sendNotificationEmail = async (email, message) => {
    const transporter = nodemailer.createTransport({
        host: config.nodemailAuthHost,
        port: config.nodeMailAuthPort,
        auth: {
            user: config.nodemailAuthUser,
            pass: config.nodemailAuthPass
        }
    });

    const mailOptions = {
        from: `Uptime Monitoring <${config.nodemailAuthUser}>`,
        to: email,
        subject: 'URL Status Notification',
        text: message,
    };

    await transporter.sendMail(mailOptions);
}

export const webhookNotifications = async (url, message, webhookUrl) => {
    try {
        await axios.post(webhookUrl, { url, message });
    } catch (error) {
        console.error('Error sending webhook notification:', error);
    }
}

