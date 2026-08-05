import dotenv from "dotenv";

dotenv.config(); // <-- sabse pehle

import app from "./app.js";
import connectDB from "./config/db.js";
import cloudinary from "./config/cloudinary.js";

console.log(cloudinary.config());

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error(error);
    }
};

startServer();