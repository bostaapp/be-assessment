import * as dotenv from "dotenv";
dotenv.config();

export default {
    databaseUrl: process.env.DATABASE_URL,
    tokenSecret: process.env.TOKEN_SECRET,
    URL: process.env.URL,
    mailUser: process.env.MAIL_USER,
    nodemailAuthUser: process.env.NODEMAIL_AUTH_USER,
    nodemailAuthPass: process.env.NODEMAIL_AUTH_PASS,
    nodeMailAuthPort: process.env.NODEMAIL_AUTH_PORT,
    nodemailAuthHost: process.env.NODEMAIL_AUTH_HOST,
}