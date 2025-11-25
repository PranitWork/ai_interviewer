import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("db Connected ✅");
  } catch (error) {
    console.error("db Connection Failed ❌", error);
    process.exit(1);
  }
};

export default connectDB;
