import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import sendEmail from "../utils/email.js";

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

// ✅ Register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const normalizedEmail = email.toLowerCase();

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser)
      return res.status(400).json({ success: false, message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
    });

    res.cookie("token", generateToken(user._id), {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });

    res.status(201).json({
      success: true,
      user: { _id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error(err);
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
      console.log(user)
    const isMatch = await bcrypt.compare(password,user.password);
    console.log(isMatch)
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

    const resetUrl = `${process.env.CLIENT_URL}/api/auth/reset-password/${resetToken}`;
    console.log(resetUrl)
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
    console.error(err);
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
    console.log(user)

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
