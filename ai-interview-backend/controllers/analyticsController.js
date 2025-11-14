import User from "../models/User.js";
import Interview from "../models/Interview.js";
import Feedback from "../models/Feedback.js";
import Subscription from "../models/Subscription.js";

// 🔹 USER ANALYTICS
export const getUserAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;

    const totalInterviews = await Interview.countDocuments({ user: userId });
    const totalFeedbacks = await Feedback.countDocuments({ user: userId });
    const activeSubscription = await Subscription.findOne({ user: userId, status: "active" });

    const latestFeedback = await Feedback.findOne({ user: userId }).sort({ createdAt: -1 });

    const data = {
      totalInterviews,
      totalFeedbacks,
      currentPlan: activeSubscription?.plan || "free",
      planExpiry: activeSubscription?.currentPeriodEnd || null,
      lastFeedback: latestFeedback?.report || null,
    };

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user analytics" });
  }
};

// 🔹 ADMIN ANALYTICS
export const getAdminAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalInterviews = await Interview.countDocuments();
    const totalFeedbacks = await Feedback.countDocuments();
    const activeSubscriptions = await Subscription.countDocuments({ status: "active" });
    const totalRevenue = await Subscription.aggregate([
      { $match: { status: "active" } },
      { $group: { _id: null, revenue: { $sum: "$amount" } } },
    ]);

    const data = {
      totalUsers,
      totalInterviews,
      totalFeedbacks,
      activeSubscriptions,
      totalRevenue: totalRevenue[0]?.revenue || 0,
    };

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch admin analytics" });
  }
};
