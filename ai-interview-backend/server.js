

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
import analyticsRoutes from "./routes/analyticsRoutes.js"
import planRoutes from "./routes/planRoutes.js"
import contactRoutes from "./routes/contactRoutes.js"
import couponRoutes from "./routes/coupanRoutes.js"

dotenv.config();
connectDB();

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
 "https://swarai.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));


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
app.use("/api/users", userRoutes);
app.use("/api/analytics",analyticsRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/contact",contactRoutes);
app.use("/api/coupon",couponRoutes)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
