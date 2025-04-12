import { Request, Response } from "express";
import { firstNames, lastNames } from "../container/data";
import { Bot } from "../models/Bot";
import logger from "../utils/logger";
import bcrypt from "bcrypt";

class BotController {
  constructor() {
    if (
      !firstNames ||
      !lastNames ||
      firstNames.length === 0 ||
      lastNames.length === 0
    ) {
      throw new Error(
        "firstNames or lastNames data is missing! Please check data.ts"
      );
    }
  }

  public async bulkBotCreater(req: Request, res: Response): Promise<any> {
    try {
      const botCount = 1000; // Adjust as needed
      const bots = new Set();

      console.log("✅ First names loaded:", firstNames.length);
      console.log("✅ Last names loaded:", lastNames.length);

      while (bots.size < botCount) {
        const firstName =
          firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName =
          lastNames[Math.floor(Math.random() * lastNames.length)];
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${randomNum}@botmail.com`;

        if (bots.has(email)) continue; // Ensure unique email

        const password = await bcrypt.hash("Bot@1234", 10);
        const username = `${firstName}_${randomNum}`;
        const ipaddress = `192.168.1.${randomNum}`;

        bots.add({
          username,
          email,
          password,
          photoURL: "",
          emailVerified: true,
          location: "Virtual Server",
          ipaddress,
        });
      }

      // Convert Set to Array and insert into MongoDB
      await Bot.insertMany([...bots], { ordered: false });

      logger.info(`✅ ${botCount} bot accounts created successfully!`);

      return res.status(201).json({
        status: "success",
        message: `${botCount} bot accounts created successfully`,
      });
    } catch (err) {
      logger.error("❌ Error creating bots:", err);
      return res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  }
}

export default new BotController();
