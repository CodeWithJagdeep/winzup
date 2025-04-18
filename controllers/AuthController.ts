import { Request, Response, NextFunction } from "express";
import { User } from "../models/User";
import JwtServices from "../services/JwtServices";
import logger from "../utils/logger"; // Import the logger
import Transaction from "../models/Transcation";
import Event from "../models/Event";
import Answer from "../models/Answer";
import Wallet from "../models/Wallet";

class AuthController {
  constructor() {}

  async isUserLoggedIn(req: Request, res: Response): Promise<any> {
    const id = res.locals.user.data;

    try {
      const userdata = await User.findById(id);

      if (userdata) {
        const transaction = await Transaction.find({
          userId: id,
        });
        // Fetch events with sub-events using aggregation
        const events = await Event.aggregate([
          {
            $lookup: {
              from: "subevents", // Name of the sub-events collection
              localField: "subEvents", // Field in the events collection
              foreignField: "_id", // Field in subevents collection
              as: "subEventsDetails", // New field containing the joined sub-events
            },
          },
        ]);

        const answers = await Answer.find({
          userid: id,
        });
        const wallet = await Wallet.findOne({
          userid: id,
        });
        // Log successful user creation
        logger.info(`Password reset for: ${userdata.email}`);

        return res.status(201).json({
          status: "success",
          user: userdata,
          transactions: transaction,
          events: events,
          answers: answers,
          wallet,
        });
      } else {
        return res.status(401).json({
          status: "failed",
          message: "User is not found",
        });
      }
    } catch (err) {
      console.log(err);
    }
  }

  /**
   * Creates a new user account after validating the input.
   * @param {Request} req - The request object containing user signup data.
   * @param {Response} res - The response object used to send back the response.
   * @param {NextFunction} next - The next middleware function in the stack.
   * @returns {Object} - A JSON response with a success or error message.
   */
  public async createUser(req: Request, res: Response): Promise<any> {
    const {
      uid,
      displayName,
      email,
      password,
      photoURL,
      emailVerified,
      ipaddress,
      location,
    } = req.body;

    try {
      // Check if a user with the provided email already exists
      const hasAccount = await User.findOne({ email: email });
      if (hasAccount) {
        logger.warn(`Account already exists with email: ${email}`); // Log a warning if account exists
        return res.status(401).json({
          status: "failed",
          message: "An account already exists with this email address.",
        });
      }

      const newUser = await User.create({
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
      await newUser.save();

      // Generate JWT token after successful user creation
      const token = JwtServices.generateToken({
        id: newUser.id,
      });

      // Log successful user creation
      logger.info(`New user created: ${newUser.email}`);

      // Uncomment to send a welcome email
      // await EmailServices.sendWelcomeEmail(newUser.email, newUser.username);

      return res.status(201).json({
        status: "success",
        message: "User created successfully",
        token: token, // Send the token to the client
      });
    } catch (err) {
      logger.error("Error creating user:", err); // Log the error
      return res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  }

  public async setPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    const id = res.locals.user.data as string;
    const { password } = req.body;
    try {
      const userdata = await User.findById(id);
      if (userdata) {
        userdata.password = password;

        await userdata.save();
        // Log successful user creation
        logger.info(`Password reset for: ${userdata.email}`);

        return res.status(201).json({
          status: "success",
          message: "PassWord reset successfully",
        });
      } else {
        return res.status(401).json({
          status: "failed",
          message: "User is not found",
        });
      }
    } catch (err) {
      logger.error("Error creating user:", err); // Log the error
      return res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
    return id;
  }

  public async socialLogin(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    const {
      uid,
      displayName,
      email,
      photoURL,
      emailVerified,
      ipaddress,
      location,
    } = req.body;

    const hasAccount = await User.findOne({
      email: email,
    });

    if (hasAccount) {
      hasAccount.uid = uid;
      hasAccount.username = displayName;
      hasAccount.photoURL = photoURL;
      hasAccount.uid = uid;
      hasAccount.ipaddress = ipaddress;
      hasAccount.location = location;

      await hasAccount.save();
      // Generate JWT token after successful login
      const token = JwtServices.generateToken({ data: hasAccount._id });
      // Log successful login
      logger.info(`User logged in successfully: ${hasAccount.email}`);

      return res.status(200).json({
        status: "success",
        token: token,
        // user: hasAccount,
        newUser: false,
      });
    } else {
      const newUser = await User.create({
        uid: uid,
        username: displayName,
        photoURL: photoURL,
        email: email,
        emailVerified: emailVerified,
        location: location,
        ipaddress: ipaddress,
      });
      // Generate JWT token after successful login
      const token = JwtServices.generateToken({ data: newUser._id });
      // Log successful login
      logger.info(`User logged in successfully: ${newUser.email}`);

      return res.status(200).json({
        status: "success",
        token: token,
        // user: newUser,
        newUser: true,
      });
    }
  }

  /**
   * Handles user login by validating email and password.
   * @param {Request} req - The request object containing user login data.
   * @param {Response} res - The response object used to send back the response.
   * @param {NextFunction} next - The next middleware function in the stack.
   * @returns {Object} - A JSON response with a status message and JWT token on success.
   */
  public async login(req: Request, res: Response): Promise<any> {
    const { email, password } = req.body;

    try {
      // Await the result of the database query to check if user exists
      const hasAccount = await User.findOne({ email: email });

      if (!hasAccount?.password)
        return res.status(404).json({
          status: "error",
          message: "Please continue with google",
        });

      if (hasAccount) {
        // Check if the password is valid
        const isPasswordValid = await hasAccount.comparePassword(password);
        if (!isPasswordValid) {
          logger.warn(`Failed login attempt for email: ${email}`); // Log failed login attempt
          return res.status(401).json({
            status: "error",
            message: "Invalid credentials",
          });
        }

        // Generate JWT token after successful login
        const token = JwtServices.generateToken({ data: hasAccount.id });

        // Log successful login
        logger.info(`User logged in successfully: ${hasAccount.email}`);

        return res.status(200).json({
          status: "success",
          token: token,
          // user: hasAccount,
        });
      } else {
        logger.warn(`Account not found for email: ${email}`); // Log account not found
        return res.status(404).json({
          status: "error",
          message: "Account not found",
        });
      }
    } catch (error) {
      // Log error and send response in case of unexpected issues
      logger.error("Error during login:", error); // Log the error
      return res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  }

  async UserVerification(req: Request, res: Response): Promise<any> {
    try {
      const { email, ipaddress } = req.query;

      const hasAccount = await User.findOne({
        email: email,
      });
      if (hasAccount) {
        //
        return res
          .status(401)
          .json({ status: "failed", message: "already has an account." });
      } else {
        return res.status(200).json({ status: "success" });
      }
    } catch (error) {
      // Log error and send response in case of unexpected issues
      logger.error("Error during login:", error); // Log the error
      return res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  }

  async walletVerification(req: Request, res: Response): Promise<any> {
    const id = res.locals.user.data;
    const { banknumber, ifsc } = req.body;

    try {
      const wallet = await Wallet.findOne({
        userid: id,
      });
      if (wallet) {
        wallet.bankNumber = banknumber;
        wallet.Ifsc = ifsc;
        await wallet.save();
        return res.status(201).json({
          status: "success",
          message: "wallet create wait for verification",
        });
      }
      await Wallet.create({
        bankNumber: banknumber,
        Ifsc: ifsc,
      });
      return res.status(201).json({
        status: "success",
        message: "wallet create wait for verification",
      });
    } catch (error) {
      // Log error and send response in case of unexpected issues
      logger.error("Error during login:", error); // Log the error
      return res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  }
}

export default new AuthController();
