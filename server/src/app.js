import express from "express";
import cors from "cors";
import assetRoutes from "./routes/asset.routes.js";
import documentRoutes from "./routes/document.routes.js";
import warrantyRoutes from "./routes/warranty.routes.js";
import calendarRoutes from "./routes/calendar.routes.js";



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
app.use("/api/documents", documentRoutes);
app.use("/api/warranties", warrantyRoutes);
app.use(
    "/api/calendar",
    calendarRoutes
);



export default app;