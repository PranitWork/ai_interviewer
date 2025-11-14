import Coupon from "../models/Coupan.js";



// 🟢 CREATE COUPON (ADMIN ONLY)
export const createCoupon = async (req, res) => {
  try {
    const { code, discountPercent, expiresAt, maxUses } = req.body;

    // Validate fields
    if (!code || !discountPercent || !expiresAt) {
      return res.status(400).json({
        success: false,
        message: "All fields are required (code, discountPercent, expiresAt).",
      });
    }

    // Check if coupon exists
    const exists = await Coupon.findOne({ code });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Coupon code already exists.",
      });
    }

    // Create coupon
    const coupon = await Coupon.create({
      code,
      discountPercent,
      expiresAt,
      maxUses: maxUses || 1000,
    });

    return res.json({
      success: true,
      message: "Coupon created successfully",
      coupon,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create coupon",
    });
  }
};


// 🟡 APPLY COUPON
export const applyCoupon = async (req, res) => {
  try {
    const { code, amount } = req.body;

    if (!code || !amount) {
      return res.status(400).json({
        success: false,
        message: "Coupon code & amount required",
      });
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });

    if (!coupon) {
      return res.json({ success: false, message: "Invalid coupon code" });
    }

    if (coupon.expiresAt < new Date()) {
      return res.json({ success: false, message: "Coupon expired" });
    }

    if (coupon.usedCount >= coupon.maxUses) {
      return res.json({ success: false, message: "Coupon usage limit reached" });
    }

    // Calculate discount
    const discount = Math.round((amount * coupon.discountPercent) / 100);
    const newAmount = amount - discount;

    return res.json({
      success: true,
      discount,
      discountPercent: coupon.discountPercent,
      newAmount,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to apply coupon",
    });
  }
};
