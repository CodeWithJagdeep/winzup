"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const env_1 = require("../config/env");
const corsMiddleware = (req, res, next) => {
    const corsOptions = {
        origin: env_1.ALLOWED_ORIGINS, // Allow specific origin(s) or all origins
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS", // Allowed HTTP methods
        allowedHeaders: "Content-Type,Authorization", // Allowed headers
        credentials: true, // Whether to allow credentials (cookies, etc.)
        preflightContinue: false, // Whether to pass the CORS request to the next handler
        optionsSuccessStatus: 204, // Some legacy browsers (IE11) choke on 204
    };
    // Use the cors middleware with options
    (0, cors_1.default)(corsOptions)(req, res, next);
};
exports.default = corsMiddleware;
