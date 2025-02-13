import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");
        if (!token) { res.status(401).json({ message: "Unauthorized" }); return }

        const decoded: any = jwt.verify(token, process.env.JWT_SECRET_KEY as string);
        const user = await User.findById(decoded.id);

        console.log('user');

        if (!user) { res.status(401).json({ message: "User not found" }); return; }
        if (user.blocked) {
            res.status(403).json({ message: "User is blocked" });
            return
        }
        (req as any).user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
};
