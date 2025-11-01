import mongoose from "mongoose";
import crypto from "crypto";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: {type:String,
  },
  plan: { type: String, default: "free" },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});


userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");
  this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 mins
  return resetToken;
};

export default mongoose.model("User", userSchema);
