import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import router from "./Routes/index.js";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors({
    origin: "http://localhost:5000", 
    credentials: true 
}));

mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((error) => {
        console.error("Error connecting to MongoDB:", error);
    });



app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.use("/api", router);