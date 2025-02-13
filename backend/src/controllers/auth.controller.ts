import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { User } from "../models/user.model";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = async (req: Request, res: Response) => {
    try {
        const { token } = req.body;
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const { sub, email, name, picture } = ticket.getPayload()!;

        let user = await User.findOne({ googleId: sub });

        console.log(user, "user");

        if (!user) {
            user = new User({ googleId: sub, email, name, avatar: picture, role: "admin", api_key: process.env.TELEGRAM_BOT_TOKEN });
            await user.save();
        }

        const jwtToken = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET_KEY!, { expiresIn: "7d" });

        res.cookie("token", jwtToken, { httpOnly: true }).json({ user, token: jwtToken });

    } catch (error) {
        res.status(400).json({ message: "Google Login Failed" });
    }
};
