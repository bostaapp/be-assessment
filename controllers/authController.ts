import { RequestHandler } from "express";
import { prisma } from "../utils/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { jwt_expires_in, jwt_secret } from "../utils/config";

const signup: RequestHandler = async (req, res) => {
	const { email, password } = req.body;

	try {
		const hashedPassword = await bcrypt.hash(password, 12);
		const user = await prisma.user.create({
			data: { email, password: hashedPassword },
		});

		const token = jwt.sign({ id: user.id.toString() }, jwt_secret, {
			expiresIn: jwt_expires_in,
		});

		res.send({
			user: { id: user.id, email: user.email },
			token,
		});
	} catch (error: any) {
		console.error(error);
		return res.status(401).send("User couldn't be created");
	}
};

const signin: RequestHandler = async (req, res) => {
	const { email, password } = req.body;
	const user = await prisma.user.findUnique({ where: { email } });

	if (!user || !(await bcrypt.compare(password, user.password))) {
		return res.status(401).send("Incorrect email or password");
	}

	const token = jwt.sign({ id: user.id }, jwt_secret, {
		expiresIn: jwt_expires_in,
	});

	res.status(200).send({
		status: "success",
		token,
	});
};

export default { signup, signin };
