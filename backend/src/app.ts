import express from "express";
import authRoutes from "./routes/auth.routes"
// import usersRoutes from "./routes/users.routes"
import adminRoutes from "./routes/admin.routes"
import cors from "cors";
import cookieParser from 'cookie-parser'

const app = express();

const corsConfig = {
    credentials: true,
    origin: true,
};
app.use(cors(corsConfig));

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (_, res) => {
    res.send('Health Check')
})

app.use("/api/auth", authRoutes);
// app.use("/api/users", usersRoutes);
app.use("/api/admin", adminRoutes);

export default app;