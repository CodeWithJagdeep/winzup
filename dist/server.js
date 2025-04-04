"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app")); // Import your app instance
const env_1 = require("./config/env"); // Import the port from your config
// Handle unhandled promise rejections
process.on("unhandledRejection", (error) => {
    console.error("Unhandled Rejection:", error);
    // Gracefully shut down the application
    process.exit(1); // Exit the process with failure code
});
// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
    console.error("Uncaught Exception:", error);
    // Gracefully shut down the application
    process.exit(1); // Exit the process with failure code
});
// Start the server
app_1.default.listen(env_1.PORT, () => {
    console.log(`Server running on Port ${env_1.PORT}`);
});
