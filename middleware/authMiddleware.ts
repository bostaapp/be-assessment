import jwt, { JwtPayload } from "jsonwebtoken";
import { RequestHandler } from "express";
import { jwt_secret } from "../utils/config";
import { prisma } from "../utils/db";

const authenticateUser: RequestHandler = async (req, res, next) => {
	const token = req.headers.access_token as string;

	if (!token) {
		return res.status(401).send("Unauthenticated");
	}

	try {
		const decoded = jwt.verify(token, jwt_secret) as JwtPayload;
		const user = await prisma.user.findUnique({
			where: { id: parseInt(decoded.id) },
		});
		req.body.user = user;

		next();
	} catch (error) {
		console.log(error);
		res.status(401).send("Unauthenticated");
	}
};

export default { authenticateUser };
