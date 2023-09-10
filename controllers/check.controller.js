const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
});

exports.send_email_message = (send_to, subject, message) => {

    return new Promise((resolve, reject) => {

        const email_message = {
            from: { name: process.env.EMAIL_FRIENDLY_NAME },
            to: send_to,
            subject: subject,
            text: message
        };

        transporter.sendMail(email_message).then(() => {
            resolve(true);
        }).catch((error) => {
            reject(false);
        });

    })

}