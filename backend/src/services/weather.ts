import axios from "axios";
import { config } from "../config/config";

export const getWeather = async (city: string): Promise<string> => {
    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${config.OPENWEATHER_API_KEY}&units=metric`;
        const response = await axios.get(url);

        return `🌦 Weather Update for ${city}:
    - Temperature: ${response.data.main.temp}°C
    - Humidity: ${response.data.main.humidity}%
    - Condition: ${response.data.weather[0].description}`;
    } catch (error) {
        return `❌ Error fetching weather for ${city}. Please ensure the city name is correct.`;
    }
};
