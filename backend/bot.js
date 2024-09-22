import TelegramBot from "node-telegram-bot-api";
import User from "./models/userModel.js"; // Import your User model
import MedicineModel from "./models/MedicineModel.js"; // Import your Medicine model
import connectDB from "./config/mongodb.js";

const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });
connectDB();

const chatIdMap = {};

// Function to send a medicine reminder
const sendMedicineReminder = async (chatId, medicineName) => {
  try {
    // Send a message with two buttons for "YES" and "NO"
    const options = {
      reply_markup: {
        inline_keyboard: [
          [
            { text: "YES", callback_data: `yes_${medicineName}` },
            { text: "NO", callback_data: `no_${medicineName}` },
          ],
        ],
      },
    };
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    const outdatedReminders = await MedicineModel.find({
      chatId,
      medicineName,
      response: null,
      remindedAt: { $lt: oneHourAgo }, // remindedAt is before one hour ago
    });

    // If there are outdated reminders, update them with 'no response' and responseAt = null
    if (outdatedReminders.length > 0) {
      await MedicineModel.updateMany(
        { _id: { $in: outdatedReminders.map((reminder) => reminder._id) } },
        {
          $set: {
            response: "no response",
            responseAt: null,
          },
        }
      );
      console.log(
        `Updated ${outdatedReminders.length} outdated reminders to 'no response' for "${medicineName}".`
      );
    }
    const outdatedReminders1 = await MedicineModel.find({
      chatId,
      medicineName,
      response: "no",
      remindedAt: { $lt: oneHourAgo }, // remindedAt is before one hour ago
    });

    // If there are outdated reminders, update them with 'not taken'
    if (outdatedReminders1.length > 0) {
      await MedicineModel.updateMany(
        { _id: { $in: outdatedReminders.map((reminder) => reminder._id) } },
        {
          $set: {
            response: "not taken",
          },
        }
      );
      console.log(
        `Updated ${outdatedReminders.length} outdated reminders to 'no response' for "${medicineName}".`
      );
    }

    const liveReminders = await MedicineModel.find({
      chatId,
      medicineName,
      response: "no",
      remindedAt: { $gt: oneHourAgo }, // remindedAt is between one hour
    });

    const reminder = await MedicineModel.findOneAndUpdate(
      { chatId, medicineName, response: { $in: [null, "no"] } }, // Find an existing reminder with no response
      { $set: { remindedAt: new Date() } }, // Update the time when the reminder is sent
      { new: true, upsert: true } // Create a new entry if none is found
    );

    await bot.sendMessage(
      chatId,
      `Did you take your ${medicineName}?`,
      options
    );

    console.log(
      `Sent medicine reminder for "${medicineName}" to Chat ID: ${chatId}`
    );
  } catch (error) {
    console.error("Error sending medicine reminder:", error);
    bot.sendMessage(chatId, "An error occurred while processing your request.");
  }
};

// Handle incoming messages
bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const messageText = msg.text.trim();
  const [command, code] = messageText.split(" ");

  try {
    const user1 = await User.findOne({ chatid: chatId });
    if (!user1) {
      // Check if the message is a 24-character hex string
      const isValidHex = /^[a-fA-F0-9]{24}$/.test(code);

      if (!isValidHex) {
        bot.sendMessage(
          chatId,
          `
                🚫 **Invalid Code**
                
                It seems the code you entered is not recognized. Please ensure you are logged in to QuickMed and try again.
                
                If you need further assistance, feel free to reach out!
                
                Thank you,
                QuickMed Team
            `
        );
        return;
      }

      const user = await User.findOne({ _id: code });
      if (user) {
        user.chatid = chatId;
        await user.save();

        bot.sendMessage(
          chatId,
          `Your unique code has been registered with your chat ID.`
        );
      }
    }
  } catch (error) {
    console.log("Error - " + error);
  }

  try {
    // Example call to send a reminder (use this as needed in your logic)
    sendMedicineReminder(chatId, "Vitamin D");
  } catch (error) {
    console.error("Error handling message:", error);
    bot.sendMessage(chatId, "An error occurred while processing your request.");
  }
});

// Handle callback queries (button responses)
bot.on("callback_query", async (callbackQuery) => {
  const { data, message } = callbackQuery;
  const chatId = message.chat.id;
  const username = message.chat.username || "Unknown user";
  const [response, medicineName] = data.split("_"); // Split callback_data to get 'yes'/'no' and medicine name

  // Log the user's response to the console
  console.log(
    `User: ${username} (Chat ID: ${chatId}) responded: ${response} for ${medicineName}`
  );

  try {
    const timestamp = new Date();
    const reminder = await MedicineModel.findOne({
      chatId,
      medicineName,
      response: null,
    });

    if (reminder) {
      // Update existing reminder record with response and timestamp
      await MedicineModel.findByIdAndUpdate(reminder._id, {
        response: response,
        timestamp: timestamp,
      });
    } else {
      console.error("Reminder not found.");
      return;
    }

    // Delete the message to keep the chat clean
    await bot.deleteMessage(chatId, message.message_id);

    // Handle the user's response
    if (response === "yes") {
      bot.sendMessage(chatId, `Great! Glad you took your ${medicineName}.`);
    } else if (response === "no") {
      bot.sendMessage(
        chatId,
        `Don't forget to take your ${medicineName}! I’ll remind you again in 15 minutes.`
      );

      // Remind the user again after 15 minutes
      setTimeout(() => {
        sendMedicineReminder(chatId, medicineName);
      }, 1 * 10 * 1000); // 15 minutes in milliseconds
    }

    // Acknowledge the callback query to avoid timeout errors
    bot.answerCallbackQuery(callbackQuery.id);
  } catch (error) {
    console.error("Error handling callback query:", error);
    bot.sendMessage(
      chatId,
      "An error occurred while processing your response."
    );
  }
});

export default chatIdMap; // Export chatIdMap
