import { NextFunction, Request, Response } from "express";
import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import hpp from "hpp";
import AuthRouter from "./routes/AuthRouter";
import QuestionRouter from "./routes/QuestionRouter";
import AnswerRouter from "./routes/AnswerRouter";
import PaymentRouter from "./routes/Paymentrouter";
import EventRouter from "./routes/EventRouter";
import path from "path";
import AppError from "./utils/AppError";
import { connectDB } from "./config/mongoConfig";
import rateLimitMiddleware from "./middlewares/rateLimiter";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import corsMiddleware from "./middlewares/corsMiddleware";

connectDB();

// Initialize Express app
const app = express();

app.use(rateLimitMiddleware);

// Middleware: Set security HTTP headers
app.use(helmet());

// Middleware: Prevent HTTP parameter pollution
app.use(hpp());

// Apply CORS middleware globally for all routes
app.use(corsMiddleware);

// Middleware: Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Increase request payload limit
app.use(bodyParser.json({ limit: "10mb" })); // Increase limit to 10MB
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
app.use(bodyParser.json());

// Middleware: Cookie parser
app.use(cookieParser());

// Middleware: Response compression
app.use(compression());

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/user", AuthRouter);
app.use("/api/payment", PaymentRouter);
app.use("/api/event", EventRouter);
app.use("/api/question", QuestionRouter);
app.use("/api/answer", AnswerRouter);

app.get("/", (req, res) => {
  const userIp =
    req.headers["x-forwarded-for"]?.toString().split(",")[0] || req.ip;
  res.send(`Your IP address is: ${userIp}`);
});
// Catch-all route for undefined endpoints
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server!`, 404));
});

// Global error handling middleware
app.use(globalErrorHandler);

// Export the app module
export default app;
