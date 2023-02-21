const nodemailer = require("nodemailer");

const host = process.env.MAIL_HOST;
const port = process.env.MAIL_PORT;
const user = process.env.MAIL_USER;
const pass = process.env.MAIL_PASS;
const service = process.env.MAIL_SERVICE;

/*const transporter = nodemailer.createTransport({
    host: host,
    port: port,
    //secure: true,
    //service: service,
    auth: {
        user: user,
        pass: pass,
    },
});

transporter.verify((error, success) => {
    if (error) {
        console.log(error);
    } else {
        console.log("Mailing service ready.");
    }
});

function setupMailOptions(email, subject, text) {
    const mailOptions = {
        from: `uptime monitoring Website <${process.env.OWNER_MAIL}>`,
        to: email,
        subject,
        text,
    };

    return mailOptions;
}*/

exports.sendMail = (email, subject, text) => {
    //var mailOptions = setupMailOptions(email, subject, text);
    //transporter.sendMail(mailOptions);
};
