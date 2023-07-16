const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const sgMail = require("@sendgrid/mail");
require("dotenv").config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

class AuthService {
	async signup(email, password) {
		try {
			const saltRounds = 10;
			const hashedPassword = await bcrypt.hash(password, saltRounds);

			const user = new User({ email, password: hashedPassword });
			await user.save();

			const verificationToken = jwt.sign(
				{ userId: user._id },
				process.env.JWT_SECRET,
				{ expiresIn: "1h" }
			);
			await this.sendVerificationEmail(user.email, verificationToken);

			return user;
		} catch (error) {
			console.log(
				"🚀 ~ file: authService.js:106 ~ AuthService ~ signup ~ error:",
				error
			);
			throw new Error("Signup failed");
		}
	}

	async sendVerificationEmail(email, token) {
		const msg = {
			to: email,
			from: process.env.EMAIL_FROM,
			subject: "Email Verification",
			text: `Click the following link to verify your email: http://localhost:3000/auth/verifyEmail?token=${token}`,
			html: `<p>Click the following link to verify your email: <a href="http://localhost:3000/auth/verifyEmail?token=${token}">Verify Email</a></p>`,
		};

		try {
			await sgMail.send(msg);
			console.log("sent");
		} catch (error) {
			console.log(
				"🚀 ~ file: authService.js:123 ~ AuthService ~ sendVerificationEmail ~ error:",
				error
			);
			throw new Error("Error sending verification email");
		}
	}

	async verifyEmail(token) {
		try {
			const decoded = jwt.verify(token, process.env.JWT_SECRET);
			const userId = decoded.userId;
			const user = await User.findById(userId);
			if (!user) {
				throw new Error("User not found");
			}

			user.isVerified = true;
			await user.save();

			return user;
		} catch (error) {
			throw new Error("Email verification failed");
		}
	}

	async login(email, password) {
		try {
			const user = await User.findOne({ email });
			if (!user) {
				throw new Error("Invalid email or password");
			}

			const isPasswordMatch = await bcrypt.compare(password, user.password);
			if (!isPasswordMatch) {
				throw new Error("Invalid email or password");
			}

			const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
				expiresIn: "1h",
			});
			return token;
		} catch (error) {
			throw new Error("Login failed");
		}
	}
}

module.exports = new AuthService();
