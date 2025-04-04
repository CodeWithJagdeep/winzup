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
const nodemailer_1 = __importDefault(require("nodemailer"));
const env_1 = require("../config/env");
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables from .env file
dotenv_1.default.config();
class EmailService {
    constructor() {
        // Configure the SMTP transporter using environment variables
        this.transporter = nodemailer_1.default.createTransport({
            host: env_1.MAIL_HOST,
            port: env_1.MAIL_PORT,
            secure: env_1.MAIL_PORT == 465, // Use SSL if port is 465
            auth: {
                user: env_1.MAIL_USERNAME,
                pass: env_1.MAIL_PASSWORD,
            },
        });
        // Check if the transporter configuration is working correctly
        // uncomment this for verify email Credential
        // this.transporter.verify((error: any, success: any) => {
        //   if (error) {
        //     console.error("Error setting up email transporter:", error);
        //   } else {
        //     console.log("Email service is ready to send messages.");
        //   }
        // });
    }
    /**
     * Send email function
     * @param {MailOptions} mailOptions - The mail options (to, subject, text, html)
     * @returns {Promise<any>}
     */
    sendEmail(mailOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Send the email using the transporter
                const info = yield this.transporter.sendMail(mailOptions);
                console.log("Message sent: %s", info.messageId);
                return info; // Return the email info in case you want to log or use it
            }
            catch (error) {
                // Type guard to ensure error is an instance of Error
                if (error instanceof Error) {
                    console.error("Error sending email:", error.message);
                    throw new Error("Error sending email: " + error.message);
                }
                else {
                    // In case error is not an instance of Error (e.g., if it's a string or something else)
                    console.error("An unknown error occurred:", error);
                    throw new Error("An unknown error occurred while sending email.");
                }
            }
        });
    }
    /**
     * Send a welcome email
     * @param {string} to - The recipient's email address
     * @param {string} name - The name of the user
     */
    sendWelcomeEmail(to, name) {
        return __awaiter(this, void 0, void 0, function* () {
            const mailOptions = {
                from: process.env.MAIL_FROM_ADDRESS,
                to: to,
                subject: "Welcome to MyApp!",
                text: `Hello ${name},\n\nWelcome to QuickStruc! We're excited to have you on board.\n\nBest regards,\nThe MyApp Team`,
                html: `<p>Hello ${name},</p><p>Welcome to QuickStruc! We're excited to have you on board.</p><p>Best regards,<br>QuickStruc Team</p>`,
            };
            return this.sendEmail(mailOptions);
        });
    }
}
exports.default = new EmailService(); // Export an instance of the service to be used in controllers
