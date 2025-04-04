"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TIMEZONE = exports.APP_NAME = exports.THIRD_PARTY_API_KEY = exports.LOG_LEVEL = exports.ALLOWED_ORIGINS = exports.MAIL_FROM_ADDRESS = exports.MAIL_FROM_NAME = exports.MAIL_PASSWORD = exports.MAIL_USERNAME = exports.MAIL_PORT = exports.MAIL_HOST = exports.RAZORPAY_KEY_SECRET = exports.RAZORPAY_KEY_ID = exports.TEST_PAYMENT_SECRET = exports.TEST_PAYMENT_ID = exports.JWT_EXPIRES_IN = exports.JWT_SECRET = exports.DATABASE_URL = exports.BASE_API_URL = exports.DOCKER_ENV = exports.NODE_ENV = exports.PORT = void 0;
const dotenv_1 = require("dotenv");
// Load environment variables from .env file
(0, dotenv_1.config)();
// -------------------------------
// Server Configuration
// -------------------------------
exports.PORT = Number(process.env.PORT) || 3000; // Application port
exports.NODE_ENV = process.env.NODE_ENV || "development"; // Environment: development, production, etc.
exports.DOCKER_ENV = process.env.DOCKER_ENV || "development"; // Docker environment
exports.BASE_API_URL = process.env.BASE_API_URL; // Base API URL for the app
// -------------------------------
// Database Configuration
// -------------------------------
exports.DATABASE_URL = process.env.DATABASE_URL; // Full DB connection string
// -------------------------------
// JWT Configuration
// -------------------------------
exports.JWT_SECRET = process.env.JWT_SECRET; // Secret key for JWT
exports.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "9d"; // JWT token expiry time
// -------------------------------
// Payment Configuration
// -------------------------------
exports.TEST_PAYMENT_ID = process.env.AppID_Test; // Secret key for JWT
exports.TEST_PAYMENT_SECRET = process.env.Secret_key_Test; // JWT token expiry time
exports.RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID; // Secret key for JWT
exports.RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET; // JWT token expiry time
// -------------------------------
// Mail Configuration
// -------------------------------
exports.MAIL_HOST = process.env.MAIL_HOST; // Mail server host
exports.MAIL_PORT = process.env.MAIL_PORT
    ? Number(process.env.MAIL_PORT)
    : undefined; // Mail server port
exports.MAIL_USERNAME = process.env.MAIL_USERNAME; // Mail server username
exports.MAIL_PASSWORD = process.env.MAIL_PASSWORD; // Mail server password
exports.MAIL_FROM_NAME = process.env.MAIL_FROM_NAME; // Sender's name
exports.MAIL_FROM_ADDRESS = process.env.MAIL_FROM_ADDRESS; // Sender's email address
// -------------------------------
// Security and Allowed Origins
// -------------------------------
exports.ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS || "http://localhost:5173"; // Allowed CORS origins
// -------------------------------
// Logging Configuration
// -------------------------------
exports.LOG_LEVEL = process.env.LOG_LEVEL || "info"; // Log level (info, debug, etc.)
// -------------------------------
// Third-party Integrations
// -------------------------------
exports.THIRD_PARTY_API_KEY = process.env.THIRD_PARTY_API_KEY; // Third-party API key
// -------------------------------
// Application Metadata
// -------------------------------
exports.APP_NAME = process.env.APP_NAME || "MyApp"; // Application name
exports.TIMEZONE = process.env.TIMEZONE || "UTC"; // Default timezone
