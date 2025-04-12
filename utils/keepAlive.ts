import axios from "axios";

/**
 * Prevents the bot from going idle by sending periodic requests.
 */
const keepAlive = () => {
  setInterval(async () => {
    try {
      await axios.get("https://lazybump.onrender.com");
      console.log("🔄 Sent dummy request to keep bot alive.");
    } catch (err) {
      console.log("⚠️ Dummy request failed (ignored).");
    }
  }, 60000); // Every 1 minute
};

export default keepAlive;
