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
const User_1 = require("../models/User");
const JwtServices_1 = __importDefault(require("../services/JwtServices"));
const logger_1 = __importDefault(require("../utils/logger")); // Import the logger
const Transcation_1 = __importDefault(require("../models/Transcation"));
const Event_1 = __importDefault(require("../models/Event"));
const Answer_1 = __importDefault(require("../models/Answer"));
const Wallet_1 = __importDefault(require("../models/Wallet"));
class AuthController {
    constructor() { }
    isUserLoggedIn(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = res.locals.user.data;
            try {
                const userdata = yield User_1.User.findById(id);
                if (userdata) {
                    const transaction = yield Transcation_1.default.find({
                        userId: id,
                    });
                    // Fetch events with sub-events using aggregation
                    const events = yield Event_1.default.aggregate([
                        {
                            $lookup: {
                                from: "subevents", // Name of the sub-events collection
                                localField: "subEvents", // Field in the events collection
                                foreignField: "_id", // Field in subevents collection
                                as: "subEventsDetails", // New field containing the joined sub-events
                            },
                        },
                    ]);
                    const answers = yield Answer_1.default.find({
                        userid: id,
                    });
                    const wallet = yield Wallet_1.default.findOne({
                        userid: id,
                    });
                    // Log successful user creation
                    logger_1.default.info(`Password reset for: ${userdata.email}`);
                    return res.status(201).json({
                        status: "success",
                        user: userdata,
                        transactions: transaction,
                        events: events,
                        answers: answers,
                        wallet,
                    });
                }
                else {
                    return res.status(401).json({
                        status: "failed",
                        message: "User is not found",
                    });
                }
            }
            catch (err) {
                console.log(err);
            }
        });
    }
    /**
     * Creates a new user account after validating the input.
     * @param {Request} req - The request object containing user signup data.
     * @param {Response} res - The response object used to send back the response.
     * @param {NextFunction} next - The next middleware function in the stack.
     * @returns {Object} - A JSON response with a success or error message.
     */
    createUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { uid, displayName, email, password, photoURL, emailVerified, ipaddress, location, } = req.body;
            try {
                // Check if a user with the provided email already exists
                const hasAccount = yield User_1.User.findOne({ email: email });
                if (hasAccount) {
                    logger_1.default.warn(`Account already exists with email: ${email}`); // Log a warning if account exists
                    return res.status(401).json({
                        status: "failed",
                        message: "An account already exists with this email address.",
                    });
                }
                const newUser = yield User_1.User.create({
                    uid: uid,
                    username: displayName,
                    photoURL: photoURL,
                    email: email,
                    emailVerified: emailVerified,
                    location: location,
                    ipaddress: ipaddress,
                    password: password,
                });
                // Save the user to the database
                yield newUser.save();
                // Generate JWT token after successful user creation
                const token = JwtServices_1.default.generateToken({
                    id: newUser.id,
                });
                // Log successful user creation
                logger_1.default.info(`New user created: ${newUser.email}`);
                // Uncomment to send a welcome email
                // await EmailServices.sendWelcomeEmail(newUser.email, newUser.username);
                return res.status(201).json({
                    status: "success",
                    message: "User created successfully",
                    token: token, // Send the token to the client
                });
            }
            catch (err) {
                logger_1.default.error("Error creating user:", err); // Log the error
                return res.status(500).json({
                    status: "error",
                    message: "Internal server error",
                });
            }
        });
    }
    setPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = res.locals.user.data;
            const { password } = req.body;
            try {
                const userdata = yield User_1.User.findById(id);
                if (userdata) {
                    userdata.password = password;
                    yield userdata.save();
                    // Log successful user creation
                    logger_1.default.info(`Password reset for: ${userdata.email}`);
                    return res.status(201).json({
                        status: "success",
                        message: "PassWord reset successfully",
                    });
                }
                else {
                    return res.status(401).json({
                        status: "failed",
                        message: "User is not found",
                    });
                }
            }
            catch (err) {
                logger_1.default.error("Error creating user:", err); // Log the error
                return res.status(500).json({
                    status: "error",
                    message: "Internal server error",
                });
            }
            return id;
        });
    }
    socialLogin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { uid, displayName, email, photoURL, emailVerified, ipaddress, location, } = req.body;
            const hasAccount = yield User_1.User.findOne({
                email: email,
            });
            if (hasAccount) {
                hasAccount.uid = uid;
                hasAccount.username = displayName;
                hasAccount.photoURL = photoURL;
                hasAccount.uid = uid;
                hasAccount.ipaddress = ipaddress;
                hasAccount.location = location;
                yield hasAccount.save();
                // Generate JWT token after successful login
                const token = JwtServices_1.default.generateToken({ data: hasAccount._id });
                // Log successful login
                logger_1.default.info(`User logged in successfully: ${hasAccount.email}`);
                return res.status(200).json({
                    status: "success",
                    token: token,
                    // user: hasAccount,
                    newUser: false,
                });
            }
            else {
                const newUser = yield User_1.User.create({
                    uid: uid,
                    username: displayName,
                    photoURL: photoURL,
                    email: email,
                    emailVerified: emailVerified,
                    location: location,
                    ipaddress: ipaddress,
                });
                // Generate JWT token after successful login
                const token = JwtServices_1.default.generateToken({ data: newUser._id });
                // Log successful login
                logger_1.default.info(`User logged in successfully: ${newUser.email}`);
                return res.status(200).json({
                    status: "success",
                    token: token,
                    // user: newUser,
                    newUser: true,
                });
            }
        });
    }
    /**
     * Handles user login by validating email and password.
     * @param {Request} req - The request object containing user login data.
     * @param {Response} res - The response object used to send back the response.
     * @param {NextFunction} next - The next middleware function in the stack.
     * @returns {Object} - A JSON response with a status message and JWT token on success.
     */
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            try {
                // Await the result of the database query to check if user exists
                const hasAccount = yield User_1.User.findOne({ email: email });
                if (!(hasAccount === null || hasAccount === void 0 ? void 0 : hasAccount.password))
                    return res.status(404).json({
                        status: "error",
                        message: "Please continue with google",
                    });
                if (hasAccount) {
                    // Check if the password is valid
                    const isPasswordValid = yield hasAccount.comparePassword(password);
                    if (!isPasswordValid) {
                        logger_1.default.warn(`Failed login attempt for email: ${email}`); // Log failed login attempt
                        return res.status(401).json({
                            status: "error",
                            message: "Invalid credentials",
                        });
                    }
                    // Generate JWT token after successful login
                    const token = JwtServices_1.default.generateToken({ data: hasAccount.id });
                    // Log successful login
                    logger_1.default.info(`User logged in successfully: ${hasAccount.email}`);
                    return res.status(200).json({
                        status: "success",
                        token: token,
                        // user: hasAccount,
                    });
                }
                else {
                    logger_1.default.warn(`Account not found for email: ${email}`); // Log account not found
                    return res.status(404).json({
                        status: "error",
                        message: "Account not found",
                    });
                }
            }
            catch (error) {
                // Log error and send response in case of unexpected issues
                logger_1.default.error("Error during login:", error); // Log the error
                return res.status(500).json({
                    status: "error",
                    message: "Internal server error",
                });
            }
        });
    }
    UserVerification(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, ipaddress } = req.query;
                const hasAccount = yield User_1.User.findOne({
                    email: email,
                });
                if (hasAccount) {
                    //
                    return res
                        .status(401)
                        .json({ status: "failed", message: "already has an account." });
                }
                else {
                    return res.status(200).json({ status: "success" });
                }
            }
            catch (error) {
                // Log error and send response in case of unexpected issues
                logger_1.default.error("Error during login:", error); // Log the error
                return res.status(500).json({
                    status: "error",
                    message: "Internal server error",
                });
            }
        });
    }
    walletVerification(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = res.locals.user.data;
            const { banknumber, ifsc } = req.body;
            try {
                const wallet = yield Wallet_1.default.findOne({
                    userid: id,
                });
                if (wallet) {
                    wallet.bankNumber = banknumber;
                    wallet.Ifsc = ifsc;
                    yield wallet.save();
                    return res.status(201).json({
                        status: "success",
                        message: "wallet create wait for verification",
                    });
                }
                yield Wallet_1.default.create({
                    bankNumber: banknumber,
                    Ifsc: ifsc,
                });
                return res.status(201).json({
                    status: "success",
                    message: "wallet create wait for verification",
                });
            }
            catch (error) {
                // Log error and send response in case of unexpected issues
                logger_1.default.error("Error during login:", error); // Log the error
                return res.status(500).json({
                    status: "error",
                    message: "Internal server error",
                });
            }
        });
    }
}
exports.default = new AuthController();
