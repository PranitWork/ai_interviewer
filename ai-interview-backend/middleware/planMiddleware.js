import User from "../models/User.js";
import Plan from "../models/Plan.js";

export const checkPlanLimits = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const planName = user.plan?.trim().toLowerCase();

    const plan = await Plan.findOne({ name: planName });

    if (!plan) {
      return res.status(500).json({
        message: `Plan '${planName}' not found in Plan collection.`,
      });
    }

    const usage = user.usage || {
      interviewsConducted: 0,
      feedbacksGenerated: 0,
    };

    const path = req.originalUrl.toLowerCase();

    if (path.includes("interview")) {
      if (usage.interviewsConducted >= plan.maxInterviews) {
        return res.status(403).json({
          message: `You've reached the interview limit for your ${plan.name} plan. Upgrade to continue.`,
        });
      }
    }

    if (path.includes("feedback")) {
      if (usage.feedbacksGenerated >= plan.maxFeedbacks) {
        return res.status(403).json({
          message: `You've reached the feedback limit for your ${plan.name} plan. Upgrade to continue.`,
        });
      }
    }

    next();
  } catch (error) {
    res.status(500).json({ message: "Error checking plan limits" });
  }
};
