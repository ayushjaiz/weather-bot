export const config = {
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN || "",
    OPENWEATHER_API_KEY: process.env.OPENWEATHER_API_KEY || "",
    MONGODB_URI: process.env.MONGODB_URI || "",
    CRON_SCHEDULE: "*/10 * * * * *",
};
