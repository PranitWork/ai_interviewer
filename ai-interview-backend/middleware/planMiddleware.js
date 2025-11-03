import User from "../models/User.js";
import Plan from "../models/Plan.js";

/**
 *  Middleware: checkPlanLimits
 * Prevents usage beyond plan limits
 * Use before routes that create interviews/feedbacks
 */
export const checkPlanLimits = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Load plan details from Plan collection
    const plan = await Plan.findOne({ name: user.plan });
    if (!plan) return res.status(500).json({ message: "Plan not configured properly" });

    const { usage } = user;

    // Determine what route the user is trying to use
    const path = req.path.toLowerCase();

    if (path.includes("interview")) {
      if (usage.interviewsConducted >= plan.maxInterviews) {
        return res.status(403).json({
          message: `You’ve reached the interview limit for your ${plan.name} plan. Upgrade to continue.`,
        });
      }
    }

    if (path.includes("feedback")) {
      if (usage.feedbacksGenerated >= plan.maxFeedbacks) {
        return res.status(403).json({
          message: `You’ve reached the feedback limit for your ${plan.name} plan. Upgrade to continue.`,
        });
      }
    }

    next();
  } catch (error) {
    console.error("❌ checkPlanLimits error:", error);
    res.status(500).json({ message: "Error checking plan limits" });
  }
};


