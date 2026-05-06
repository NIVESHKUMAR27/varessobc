import cron from "node-cron";
import User from "../models/User.js";
import sendEmail from "../utils/sendEmail.js";

// ⏰ Run every 1 hour
cron.schedule("0 * * * *", async () => {
  console.log("⏰ Checking abandoned carts...");

  try {
    const now = new Date();

    const users = await User.find({
      cart: { $exists: true, $not: { $size: 0 } },
      lastCartActivity: { $ne: null },
    });

    for (let user of users) {
      const diff = now - new Date(user.lastCartActivity);

      const hours24 = 24 * 60 * 60 * 1000;

      // ✅ 24 hours passed
      if (diff >= hours24) {
        console.log("📧 Sending cart reminder to:", user.email);

        await sendEmail(user.email, "cart-reminder");

        // 🔁 reset so spam na ho
        user.lastCartActivity = null;
        await user.save();
      }
    }

  } catch (err) {
    console.error("CRON ERROR:", err);
  }
});