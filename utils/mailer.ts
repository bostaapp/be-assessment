import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import { sender_email } from "./config";

interface EmailOptions {
	recipient: string;
	subject: string;
	message: string;
}

const sendEmail = async (options: EmailOptions) => {
	const transporter = nodemailer.createTransport({
		host: process.env.SMTP_HOST,
		port: parseInt(process.env.SMTP_PORT!),
		auth: {
			user: process.env.SMTP_USERNAME,
			pass: process.env.SMTP_PASSWORD,
		},
	});

	const mailOptions: Mail.Options = {
		sender: sender_email,
		subject: options.subject,
		to: options.recipient,
		text: options.message,
	};

	const { accepted, response } = await transporter.sendMail(mailOptions);
	console.log(accepted, response);
};

export default sendEmail;
