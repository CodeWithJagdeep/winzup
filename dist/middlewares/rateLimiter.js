"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
/**
 * Rate limit middleware to limit requests from a single IP.
 * This middleware allows a maximum of 100 requests per 15 minutes.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function to call if rate limit is not exceeded.
 * @returns {void} - If the limit is not exceeded, it passes control to the next middleware.
 */
const rateLimitMiddleware = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes in milliseconds
    max: 100, // Limit each IP to 100 requests per `windowMs`
    message: "Too many requests from this IP, please try again after 15 minutes.", // Custom message
    standardHeaders: true, // Include rate limit info in `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
exports.default = rateLimitMiddleware;
