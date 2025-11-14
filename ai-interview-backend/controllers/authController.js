import crypto from "crypto";
import User from "../models/User.js";
import Otp from "../models/Otp.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import sendEmail from "../utils/email.js";

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });


// 📤 STEP 1: SEND OTP
export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const normalizedEmail = email.toLowerCase();

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser)
      return res.status(400).json({ success: false, message: "User already exists" });

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP
    await Otp.findOneAndUpdate(
      { email: normalizedEmail },
      { otp, createdAt: Date.now() },
      { upsert: true, new: true }
    );

    // Send OTP via email
    await sendEmail({
      email: normalizedEmail,
      subject: "Your OTP for Registration",
      message: `
        <div style="font-family: Arial, sans-serif;">
          <h2>🔐 Email Verification</h2>
          <p>Your OTP code is:</p>
          <h1 style="color:#007bff;">${otp}</h1>
          <p>This code is valid for 5 minutes.</p>
        </div>
      `,
    });

    res.status(200).json({ success: true, message: "OTP sent successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
};


// ✅ STEP 2: VERIFY OTP AND REGISTER
export const verifyAndRegister = async (req, res) => {
  try {
    const { name, email, password, otp } = req.body;
    const normalizedEmail = email.toLowerCase();

    const otpDoc = await Otp.findOne({ email: normalizedEmail });

    if (!otpDoc)
      return res.status(400).json({ success: false, message: "OTP not found or expired" });

    if (otpDoc.otp !== otp)
      return res.status(400).json({ success: false, message: "Invalid OTP" });

    // ✅ OTP is valid — create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role: "user",
    });

    // Delete OTP after success
    await Otp.deleteOne({ email: normalizedEmail });

    // Generate JWT Token
    const token = generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: { _id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
       if (!email || !password) {
      return res.status(400).json({ message: "Please enter all fields" });
    }
    const user = await User.findOne({ email: email });
    if (!user) return res.status(401).json({ success: false, message: "Invalid email" });
    const isMatch = await bcrypt.compare(password,user.password);
    if (!isMatch) return res.status(401).json({ success: false, message: "Invalid password" });

    res.cookie("token", generateToken(user._id), {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });

    res.json({
      success: true,
      user: { _id: user._id, name: user.name, email: user.email, plan: user.plan },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};




// ✅ Forgot Password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const resetToken = user.getResetPasswordToken();
     await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.CLIENT_URL}/auth/reset-password/${resetToken}`;
    const message = `
      <h2>Reset Your Password</h2>
      <p>Click below to reset your password:</p>
      <a href="${resetUrl}" target="_blank">${resetUrl}</a>
    `;

    await sendEmail({
      email: user.email,
      subject: "Password Reset Request",
      message,
    });
    
    
    res.json({ success: true, message: "Email sent successfully",resetUrl, });
  } catch (err) {
    res.status(500).json({ success: false, message: "Email not sent" });
  }
};

// ✅ Reset Password
export const resetPassword = async (req, res) => {
  const {password} = req.body;
  try {
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ success: false, message: "Invalid or expired token" });
    const hashpassword = await bcrypt.hash(password,10)
    user.password = hashpassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({ success: true, message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Logout
export const logoutUser = (req, res) => {
  res.clearCookie("token");
  res.json({ success: true, message: "Logged out" });
};

export const currentUser=(req,res)=>{
   res.status(200).json({
    success: true,
    user: req.user,
  });
}
