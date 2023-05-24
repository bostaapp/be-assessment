import { cleanEnv, email, port, str } from "envalid";
import dotenv from "dotenv";
dotenv.config();
const env = cleanEnv(process.env, {
  PORT: port(),
  DATABASE_URI: str(),
  JWT_TOKEN: str(),
  SMTP_HOST: str(),
  SMTP_PORT: port(),
  SMTP_USER: str(),
  SMTP_PASS: str(),
  EMAIL: email(),
  EMAIL_PASSWORD: str(),
});

export default env;
