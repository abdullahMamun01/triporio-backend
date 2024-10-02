import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join((process.cwd(), '.env')) });

export default {
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
  access_token_expires_in: process.env.ACCESS_TOKEN_EXPIRES_IN,

  otp_expires_in: process.env.OTP_TOKEN_EXPIRES_IN,
  verificationTokenSecret: process.env.VERIFY_TOKEN_SECRET,

  refresh_token_expires_in: process.env.REFRESH_TOKEN_EXPIRES_IN,
  stipe_secret_key: process.env.STRIPE_SECRET_KEY,
  stipe_public_key: process.env.STRIPE_PUBLIC_KEY,
  client_public_domain: process.env.CLIENT_PUBLIC_DOMAIN,
  gmail_smtp_pass: process.env.GEMAIL_SMTP_PASS,
  gmail_smtp_email: process.env.GEMAIL_SMTP_EMAIL,
};
