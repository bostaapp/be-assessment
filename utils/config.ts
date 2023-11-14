require("dotenv").config();

const port = process.env.API_PORT || 3000;
const jwt_secret = process.env.JWT_SECRET!;
const jwt_expires_in = process.env.JWT_EXPIRES_IN!;
const sender_email = process.env.SENDER_EMAIL;

export { port, jwt_secret, jwt_expires_in, sender_email };
