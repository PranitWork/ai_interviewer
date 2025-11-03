import User from "../models/User.js";
import bcrypt from "bcryptjs";

// 🔹 GET /api/users/all → Admin: Fetch all users
export const getAllUsers = async (req, res) => {
  try {
    // Only allow admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    const users = await User.find().select("-password -resetPasswordToken -resetPasswordExpire");
    res.json(users);
  } catch (error) {
    console.error("❌ getAllUsers Error:", error.message);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

// 🔹 GET /api/users/profile → Authenticated user profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password -resetPasswordToken -resetPasswordExpire");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("❌ getUserProfile Error:", error.message);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

// 🔹 PUT /api/users/profile → Update profile info
export const updateUserProfile = async (req, res) => {
  const { name, password } = req.body;
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }


    if (name) user.name = name;

    // ✅ Update password if provided
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user: {
        name: user.name,
        plan: user.plan,
      },
    });
  } catch (error) {
    console.error("❌ updateUserProfile Error:", error.message);
    res.status(500).json({ message: "Failed to update profile" });
  }
};

// 🔹 DELETE /api/users/:id → Admin delete user
export const deleteUser = async (req, res) => {
  try {
    // Only admin can delete users
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.deleteOne();

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("❌ deleteUser Error:", error.message);
    res.status(500).json({ message: "Failed to delete user" });
  }
};


export const updateUserPlan = async (req,res)=>{
  const {id}= req.params;
  const {plan, planExpireAt} = req.body
  try{
    const validPlans = ["free","pro","enterprise"];
    if(!validPlans.includes(plan)){
      return res.status(400).json({message:"Invalid plan selected"})
    }
    const updatedUser = await User.findByIdAndUpdate(
      id,{
        plan,
        planExpiresAt:planExpireAt || null,
      },{new:true}
    ).select("-password -resetPasswordToken -resetPasswordExpire");

    if(!updatedUser){
      res.status(404).json({message:"user not found"});
    }

    res.json({sucess:true,message:"use plan updated successfully", user:updatedUser});

  }catch(errr){
    res.status(500).json({message:"failed to update plan"})
  }
}