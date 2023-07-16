const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function authMiddleware(req, res, next) {
	// Get the authorization header from the request
	const authHeader = req.headers.authorization;

	if (!authHeader) {
		return res.status(401).json({ error: "Unauthorized" });
	}

	// Extract the JWT token from the authorization header
	const token = authHeader.replace("Bearer ", "");

	try {
		// Verify the token
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const userId = decoded.userId;

		// Find the user associated with the token
		const user = await User.findById(userId);
		if (!user) {
			return res.status(401).json({ error: "Unauthorized" });
		}

		// Attach the user object to the request for further processing
		req.user = user;

		// Proceed to the next middleware or route handler
		next();
	} catch (error) {
		console.log(
			"🚀 ~ file: authMiddleware.js:37 ~ authMiddleware ~ error:",
			error
		);
		return res.status(401).json({ error: "Unauthorized" });
	}
}

module.exports = authMiddleware;
