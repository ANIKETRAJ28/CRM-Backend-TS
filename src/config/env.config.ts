import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT || 3000;
export const FRONTEND_URL = process.env.FRONTEND_URL;
export const SALT = process.env.SALT || 10;
export const ENVIRONMENT = process.env.ENVIRONMENT || "production";
export const OTP = process.env.OTP || "123456";
