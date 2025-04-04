"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const JwtServices_1 = __importDefault(require("../services/JwtServices")); // Ensure the path is correct
/**
 * Middleware to authenticate and authorize requests using JWT.
 * @param {Request} req - The request object from the client.
 * @param {Response} res - The response object to be sent back to the client.
 * @param {NextFunction} next - The function to pass control to the next middleware or route handler.
 * @returns {void}
 */
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.headers["authorization"]; // Retrieve the token from the Authorization header
    console.log(token);
    // If no token is provided in the request
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" }); // Return Unauthorized error
    }
    // Remove the 'Bearer ' prefix from the token if it exists
    const tokenWithoutBearer = token.startsWith("Bearer ")
        ? token.slice(7, token.length) // Remove 'Bearer ' prefix
        : token; // If no prefix, use the token as is
    console.log(tokenWithoutBearer);
    try {
        // Verify the token using the JwtServices verifyToken method
        const decoded = JwtServices_1.default.verifyToken(tokenWithoutBearer); // This ensures the token is valid
        res.locals.user = decoded; // Attach the decoded user info to the request object for use in other routes
        next(); // Proceed to the next middleware or route handler
    }
    catch (err) {
        console.error("Error during token verification:", err); // Log any errors for debugging
        return res.status(401).json({ message: "Unauthorized" }); // Return Unauthorized error
    }
});
exports.default = authMiddleware;
