import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join((process.cwd(), '.env')) });

export default {
  NODE_ENV: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
  cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
  client_url:
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:5173'
      : process.env.CLIENT_URL,

  email_app_password: process.env.EMAIL_APP_PASSWORD,
  store_id: process.env.STORE_ID,
  store_passwd: process.env.STORE_PASSWD,
  ssl_validation_api: process.env.SSL_VALIDATION_API,
  sendgrid_api_key: process.env.SENDGRID_API_KEY,
};
