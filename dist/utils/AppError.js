"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AppError extends Error {
    constructor(message, statusCode = 500, status = "error") {
        super(message); // Call parent class constructor (Error)
        this.statusCode = statusCode; // Set status code, defaulting to 500 (Internal Server Error)
        this.isOperational = true; // Operational error flag
        Error.captureStackTrace(this, this.constructor); // Captures the stack trace for better error reporting
        this.status = status;
        // Set the name of the error to the class name (AppError)
        this.name = this.constructor.name;
    }
}
exports.default = AppError;
