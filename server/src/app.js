import express from "express";
import cors from "cors";
import assetRoutes from "./routes/asset.routes.js";


const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Route
app.get("/", (req, res) => {
    res.send("EverKeep Backend API is running successfully!");
});
app.use("/api/assets", assetRoutes);

export default app;