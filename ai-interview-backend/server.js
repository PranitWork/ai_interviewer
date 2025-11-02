import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import interviewRoutes from "./routes/interviewRoutes.js";
import feedbackRoutes from "./routes/feedbackRoutes.js";
import subscriptionRoutes from "./routes/subscriptionRoutes.js";
import userRoutes from "./routes/userRoutes.js"

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser()); 

app.get("/", (req, res) => {
  res.send("AI Interview Backend Running ✅");
});

app.use("/api/auth", authRoutes);
app.use("/api/interview", interviewRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/subscription", subscriptionRoutes);
app.use("api/users", userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
