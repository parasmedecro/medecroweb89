// bot.js
import TelegramBot from 'node-telegram-bot-api';
import User from './models/userModel.js'; // Import your User model
import connectDB from "./config/mongodb.js";

const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });
connectDB();

const chatIdMap = {}; // Object to store chatId associated with unique codes

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const messageText = msg.text.trim();
    const [command, code] = messageText.split(' ');
    // Check if the message is a 24-character hex string
    const isValidHex = /^[a-fA-F0-9]{24}$/.test(code);
  
    if (!isValidHex) {
        bot.sendMessage(chatId, `
            🚫 **Invalid Code**
            
            It seems the code you entered is not recognized. Please ensure you are logged in to QuickMed and try again.
            
            If you need further assistance, feel free to reach out!
            
            Thank you,
            QuickMed Team
            `);
            
      return;
    }
  
    try {
      const user = await User.findOne({ _id: code });
  
      if (user) {
        // Check if the user already has a chatId
        if (user.chatid) {
          bot.sendMessage(chatId, 'This code has already been registered with a chat ID.');
          return;
        }
  
        user.chatid = chatId;
        await user.save();
  
        chatIdMap[code] = chatId; // Update the chatIdMap
        bot.sendMessage(chatId, `Your unique code has been registered with your chat ID.`);
        console.log(`ChatId for user with ID "${code}" is: ${chatId}`);
      } else {
        bot.sendMessage(chatId, `Invalid code: ${code}`);
      }
    } catch (error) {
      console.error('Error handling message:', error);
      bot.sendMessage(chatId, 'An error occurred while processing your request.');
    }
  });
  

export default chatIdMap ; // Export chatIdMap
