import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import router from "./Routes/index.js";
import cookieParser from "cookie-parser";
const app = express();
const PORT = 3000;
app.use(cors({
    origin: "http://localhost:5000", 
    credentials: true 
}));

app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
app.use("/api", router);