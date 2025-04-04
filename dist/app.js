"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const body_parser_1 = __importDefault(require("body-parser"));
const hpp_1 = __importDefault(require("hpp"));
const AuthRouter_1 = __importDefault(require("./routes/AuthRouter"));
const QuestionRouter_1 = __importDefault(require("./routes/QuestionRouter"));
const Paymentrouter_1 = __importDefault(require("./routes/Paymentrouter"));
const EventRouter_1 = __importDefault(require("./routes/EventRouter"));
const path_1 = __importDefault(require("path"));
const AppError_1 = __importDefault(require("./utils/AppError"));
const mongoConfig_1 = require("./config/mongoConfig");
const rateLimiter_1 = __importDefault(require("./middlewares/rateLimiter"));
const globalErrorHandler_1 = __importDefault(require("./middlewares/globalErrorHandler"));
const corsMiddleware_1 = __importDefault(require("./middlewares/corsMiddleware"));
(0, mongoConfig_1.connectDB)();
// Initialize Express app
const app = (0, express_1.default)();
app.use(rateLimiter_1.default);
// Middleware: Set security HTTP headers
app.use((0, helmet_1.default)());
// Middleware: Prevent HTTP parameter pollution
app.use((0, hpp_1.default)());
// Apply CORS middleware globally for all routes
app.use(corsMiddleware_1.default);
// Middleware: Development logging
if (process.env.NODE_ENV === "development") {
    app.use((0, morgan_1.default)("dev"));
}
// Middleware: Body parsers (JSON and URL-encoded data)
app.use(express_1.default.json({ limit: "10kb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "10kb" }));
app.use(body_parser_1.default.json());
// Middleware: Cookie parser
app.use((0, cookie_parser_1.default)());
// Middleware: Response compression
app.use((0, compression_1.default)());
// Serve static files
app.use(express_1.default.static(path_1.default.join(__dirname, "public")));
app.use("/api/user", AuthRouter_1.default);
app.use("/api/payment", Paymentrouter_1.default);
app.use("/api/event", EventRouter_1.default);
app.use("/api/question", QuestionRouter_1.default);
app.use("/api/answer", QuestionRouter_1.default);
app.get("/", (req, res) => {
    var _a;
    const userIp = ((_a = req.headers["x-forwarded-for"]) === null || _a === void 0 ? void 0 : _a.toString().split(",")[0]) || req.ip;
    res.send(`Your IP address is: ${userIp}`);
});
// Catch-all route for undefined endpoints
app.all("*", (req, res, next) => {
    next(new AppError_1.default(`Cannot find ${req.originalUrl} on this server!`, 404));
});
// Global error handling middleware
app.use(globalErrorHandler_1.default);
// Export the app module
exports.default = app;
