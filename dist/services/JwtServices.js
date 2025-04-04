"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
class JwtServices {
    // Constructor to ensure instance of JwtServices class is not required for static methods
    constructor() {
        if (!env_1.JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined in the environment variables.");
        }
        JwtServices.jwtSecret = env_1.JWT_SECRET; // Set static jwtSecret after validation
    }
    /**
     * Generate a JWT token
     * @param {Object} payload - The payload to be encoded into the token
     * @returns {string} - The generated JWT token
     */
    generateToken(payload) {
        if (!payload) {
            throw new Error("Payload is required to generate the token.");
        }
        try {
            // Sign the JWT with the payload and secret, with a configurable expiration time
            return jsonwebtoken_1.default.sign(payload, JwtServices.jwtSecret, {
                expiresIn: "90d",
            });
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error("Error generating JWT token: " + error.message);
            }
            throw new Error("Unknown error generating JWT token");
        }
    }
    /**
     * Verify the JWT token
     * @param {string} token - The JWT token to be verified
     * @returns {JwtPayload | string} - The decoded token payload if valid
     */
    verifyToken(token) {
        if (!token) {
            throw new Error("Token is required to verify.");
        }
        try {
            console.log(env_1.JWT_SECRET, JwtServices.jwtSecret);
            // Verify the token using the JWT secret and return the decoded payload
            return jsonwebtoken_1.default.verify(token, JwtServices.jwtSecret);
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error("Invalid or expired token: " + error.message);
            }
            throw new Error("Unknown error verifying token");
        }
    }
    /**
     * Decode a JWT token without verification
     * @param {string} token - The JWT token to decode
     * @returns {JwtPayload | null} - The decoded token payload or null if invalid
     */
    decodeToken(token) {
        if (!token) {
            throw new Error("Token is required to decode.");
        }
        try {
            // Decode the token without verifying it
            return jsonwebtoken_1.default.decode(token);
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error("Error decoding token: " + error.message);
            }
            throw new Error("Unknown error decoding token");
        }
    }
}
exports.default = new JwtServices(); // Exporting as default
