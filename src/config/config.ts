export const DATABSE_CONFIG = {
  ssl: process.env.SSL_ENABLED,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
};

export const FIREBASE_CONFIG = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKey: process.env.FIREBASE_PRIVATE_KEY,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};

export const ENV = process.env.NODE_ENV;

export const SENDGRID_CONFIG = {
  apiKey: process.env.SENDGRID_API_KEY,
};

export const VERIFICATION_USER_CONFIG = {
  fromEmail: process.env.SENDGRID_FROM_EMAIL,
  fromName: 'Bosta',
};
