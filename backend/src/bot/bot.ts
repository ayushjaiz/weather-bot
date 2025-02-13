import TelegramBot from "node-telegram-bot-api";
import { config } from "../config/config";
import { Subscriber } from "../models/subscriber.model";
import { getWeather } from "../services/weather";

const bot = new TelegramBot(config.TELEGRAM_BOT_TOKEN, { polling: true });

const userStates = new Map<number, { step: string; city?: string }>();

// Handle /start command
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "👋 Welcome! Use /subscribe to get daily weather updates.");
});

// Handle /subscribe command - Ask for city
bot.onText(/\/subscribe/, (msg) => {
  bot.sendMessage(msg.chat.id, "📍 Please enter your city:");
  userStates.set(msg.chat.id, { step: "awaiting_city" });
});

// Handle City & Email Input
bot.on("message", async (msg) => {
  const userState = userStates.get(msg.chat.id);

  if (userState?.step === "awaiting_city") {
    const city = msg.text || "";
    if (!city.match(/^[a-zA-Z\s]+$/)) {
      return bot.sendMessage(msg.chat.id, "❌ Invalid city name. Please enter a valid city.");
    }

    userStates.set(msg.chat.id, { step: "awaiting_email", city });
    return bot.sendMessage(msg.chat.id, "📧 Please enter your email:");
  }

  if (userState?.step === "awaiting_email") {
    const email = msg.text || "";
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return bot.sendMessage(msg.chat.id, "❌ Invalid email format. Please enter a valid email.");
    }

    try {
      // Check if email is already taken
      const existingEmailUser = await Subscriber.findOne({ email });
      if (existingEmailUser) {
        return bot.sendMessage(msg.chat.id, "⚠️ This email is already in use. Please enter another email:");
      }

      // Check if user already exists
      const existingUser = await Subscriber.findOne({ chatId: msg.chat.id });
      if (existingUser) {
        existingUser.city = userState.city!;
        existingUser.email = email;
        await existingUser.save();
        bot.sendMessage(msg.chat.id, `✅ Subscription updated! You will now receive updates for ${userState.city}.`);
      } else {
        await new Subscriber({ chatId: msg.chat.id, city: userState.city!, email }).save();
        bot.sendMessage(msg.chat.id, `✅ Subscribed successfully! You will receive daily updates for ${userState.city}.`);
      }
    } catch (error) {
      console.error("❌ Subscription Error:", error);
      bot.sendMessage(msg.chat.id, "❌ Error saving subscription. Please try again later.");
    }

    userStates.delete(msg.chat.id);
  }
});

// Handle /unsubscribe command
bot.onText(/\/unsubscribe/, async (msg) => {
  try {
    await Subscriber.deleteOne({ chatId: msg.chat.id });
    bot.sendMessage(msg.chat.id, "❌ You have unsubscribed from daily updates.");
  } catch (error) {
    console.error("❌ Unsubscription Error:", error);
    bot.sendMessage(msg.chat.id, "❌ Error unsubscribing. Please try again later.");
  }
});

// Send weather updates to all subscribers
export const sendWeatherUpdates = async () => {
  try {
    const subscribers = await Subscriber.find();
    for (const user of subscribers) {
      const weatherReport = await getWeather(user.city);
      bot.sendMessage(user.chatId, weatherReport);
    }
  } catch (error) {
    console.error("❌ Error sending weather updates:", error);
  }
};

export { bot };
