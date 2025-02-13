import mongoose from "mongoose";

const subscriberSchema = new mongoose.Schema({
    chatId: { type: Number, required: true, unique: true },
    city: { type: String, required: true },
    email: { type: String, required: true },
});

export const Subscriber = mongoose.model("Subscriber", subscriberSchema);
