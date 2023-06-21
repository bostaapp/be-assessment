import nodemailer from "nodemailer";
import config from "../config.js";

const sendVerificationMail = async (to, text) => {
    var transporter = nodemailer.createTransport({
        host: config.nodemailAuthHost,
        port: config.nodeMailAuthPort,
        auth: {
            user: config.nodemailAuthUser,
            pass: config.nodemailAuthPass
        }
    });

    transporter.verify((error, success) => {
        if (error) {
            console.log(error);
        } else {
            // console.log("Mailing service ready.");
        }
    });


    let info = await transporter.sendMail({
        from: config.mailUser, // sender address
        to: to, // list of receivers
        subject: "Email Verification", // Subject line
        text: text, // plain text body
    });
    return info;
}

export default sendVerificationMail;