import { Request, Response } from "express";
import { User } from "../models/user.model";
import { Subscriber } from "../models/subscriber.model";

// Update API Key (Admin only)
export const updateApiKey = async (req: Request, res: Response) => {
    try {
        const { apiKey } = req.body;
        const userId = (req as any).user.id;

        const user = await User.findById(userId);
        if (!user || user.role !== "admin") {
            res.status(403).json({ message: "Unauthorized" });
            return;
        }

        user.api_key = apiKey;
        await user.save();

        res.json({ message: "API key updated successfully", api_key: apiKey });
    } catch (error) {
        res.status(500).json({ message: "Failed to update API key", error });
    }
};

// Delete a subscriber
export const deleteSubscriber = async (req: Request, res: Response) => {
    try {

        const { id } = req.params;

        console.log("chat-id", id);

        // Check if the user is an admin
        if ((req as any).user.role !== "admin") {
            res.status(403).json({ message: "Unauthorized" });
            return;
        }

        const subscriber = await Subscriber.findByIdAndDelete(id);

        if (!subscriber) {
            res.status(404).json({ message: "Subscriber not foureturn;nd" });
        }

        res.json({ message: "Subscriber deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete subscriber", error });
    }
};

// Get all subscribers (Admin only)
export const getAllSubscribers = async (req: Request, res: Response) => {
    try {
        console.log('Fetching subscribers');
        if ((req as any).user.role !== "admin") {
            res.status(403).json({ message: "Unauthorized" });
            return;
        }

        const subscribers = await Subscriber.find();
        res.json(subscribers);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch subscribers", error });
    }
};

