import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const env = process.env;

export default {
  env: env.NODE_ENV,
  port: env.PORT,
  DBUrl: env.DB_URL,
  clientSideURL: env.CLIENT_SIDE_URL,
  serverUrl: env.SERVER_URL,
  main_domain: env.MAIN_DOMAIN,
  bcrypt_salt_round: env.BCRYPT_SALT_ROUND,
  token_data: {
    access_token_secret: env.ACCESS_TOKEN_SECRET,
    refresh_token_secret: env.REFRESH_TOKEN_SECRET,
    access_token_expires: env.ACCESS_TOKEN_EXPIRES,
    refresh_token_expires: env.REFRESH_TOKEN_EXPIRES,
    access_token_cookie_expires: env.ACCESS_TOKEN_COOKIE_EXPIRES,
    refresh_token_cookie_expires: env.REFRESH_TOKEN_COOKIE_EXPIRES,
    forgotPasswordJwtSecret: env.FORTGOT_PASSWORD_SECRET,
    next_auth_expires: env.NEXT_AUTH_EXPIRES,
    mailVarificationSecret: env.MAIL_VARIFICATION_SECRET as string,
  },
  smtp: {
    smtpMail: env.SMTP_MAIL,
    smtpHost: env.SMTP_HOST,
    smtpPort: env.SMTP_PORT,
    smtpService: env.SMTP_SERVICE,
    smtpPass: env.SMTP_PASS,
  },
  session_secret: env.SESSION_SECRET,
  session_expires: env.SESSION_EXPIRES,
  cart_item_expires: env.CART_ITEM_EXPIRES,
  upload_image_size: env.UPLOAD_IMAGE_SIZE,
  upload_video_size: env.UPLOAD_VIDEO_SIZE,
  upload_image_maxCount: env.UPLOAD_IMAGE_MAX_COUNT,
  upload_image_format: env.UPLOAD_IMAGE_FORMAT,
  twilio: {
    sid: env.TWILIO_ACCOUNT_SID,
    auth_token: env.TWILIO_AUTH_TOKEN,
    phone_number: env.TWILIO_PHONE_NUMBER,
  },
  c_api_access_token: env.C_API_ACCESS_TOKEN,
  pixel_id: env.PIXEL_ID,
  stead_fast: {
    api_key: env.STEAD_FAST_API_KEY,
    secret_key: env.STEAD_FAST_SECRET_KEY,
  },
};
