const Notification = require("./notification");
const nodeMailer = require('nodemailer')
const userService = require('../service/user.service');

class EmailNotification extends Notification {

    transporter;

    constructor(messageContent, recieverId) {
        super( messageContent, recieverId);
        this.transporter = nodeMailer.createTransport({
            service: 'gmail',
            auth: {
                type: "login",
                user: process.env.NODE_EMAIL,
                pass: process.env.NODE_EMAIL_PASSWORD
            }
        });

    }
    async sendNotification() {
        super.sendNotification()
        const userEmail = await userService.findUserEmailById(this.recieverId);
        console.log(`Sending email notification to ${userEmail} with message ${this.messageContent}`);
        this.transporter.sendMail({
            from: process.env.NODE_EMAIL,
            to: userEmail,
            subject: 'URL Checker Notification Alert',
            text: this.messageContent,
            html: `<p>${this.messageContent}</p>`
        }).then((info) => {
            // console.log(info)
        }
        ).catch((err) => {
            // console.log(err.message)
        }
        )
    }
}

module.exports = EmailNotification;