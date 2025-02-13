import dotenv from "dotenv";
dotenv.config();

import { connectMongoDB } from "./config/mongo";

import cron from "node-cron";
import { bot, sendWeatherUpdates } from "./bot/bot";
import { config } from "./config/config";

import app from "./app";
const port = process.env.APP_PORT || 3001;

// Connect to MongoDB
connectMongoDB();

console.log("🚀 Bot is running...");

// Schedule weather updates
cron.schedule(config.CRON_SCHEDULE, sendWeatherUpdates);

cron.schedule("*/5 * * * *", () => {
    console.log('Pinging after 30 seconds')
});

app.listen(port, async () => {
    await connectMongoDB();
    console.log('App running on port ' + port);
})

