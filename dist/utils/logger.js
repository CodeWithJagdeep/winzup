"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
const path_1 = __importDefault(require("path"));
const env_1 = require("../config/env");
// Get log level from the environment
const logLevel = env_1.LOG_LEVEL || "info"; // Default to 'info' if not set
// Resolve the file path to the log file
const logFilePath = path_1.default.resolve(__dirname, "../logging/app.log"); // Using absolute path for the log file
// Create a custom logger
const logger = winston_1.default.createLogger({
    level: logLevel, // Use the log level from env variable
    format: winston_1.default.format.combine(winston_1.default.format.colorize(), // Colorize logs in console
    winston_1.default.format.timestamp(), // Add timestamp to logs
    winston_1.default.format.printf(({ timestamp, level, message }) => {
        return `[${timestamp}] ${level}: ${message}`;
    })),
    transports: [
        new winston_1.default.transports.Console({
            // Console transport for logs
            format: winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.simple()),
        }),
        new winston_1.default.transports.File({ filename: logFilePath }), // File transport to save logs using absolute path
    ],
});
exports.default = logger;
