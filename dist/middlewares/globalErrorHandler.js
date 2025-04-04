"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Global error handler middleware for handling errors across the application.
 *
 * @param {Error} err - The error object that contains error details, including message, stack, status code, etc.
 * @param {Request} req - The request object, which contains information about the HTTP request, such as headers, body, and query parameters.
 * @param {Response} res - The response object, which is used to send a response back to the client.
 * @param {NextFunction} next - The next middleware function, which can be called to pass control to the next middleware.
 */
const globalErrorHandler = (err, // Error can be AppError (custom) or a generic Error
req, res, next) => {
    // Set the default status code if it's not set
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";
    // Log the error (for development or production)
    if (process.env.NODE_ENV === "development") {
        console.error("ERROR 💥:", err);
    }
    else {
        // Log detailed errors in production
        if (err.isOperational) {
            console.error("ERROR 💥:", err);
        }
        else {
            // Log the entire error stack for unknown errors
            console.error("ERROR 💥:", err.stack);
        }
    }
    // Send a response with the error details
    res.status(err.statusCode).json(Object.assign({ status: err.status, message: err.message }, (process.env.NODE_ENV === "development" && {
        stack: err.stack,
    })));
};
exports.default = globalErrorHandler;
