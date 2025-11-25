import Plan from "../models/Plan.js";

// 🟢 CREATE PLAN (Price stored in Paise)
export const createPlan = async (req, res) => {
  try {
    let { name, price, maxInterviews, maxFeedbacks, durationDays } = req.body;

    if (!name || price == null) {
      return res.status(400).json({ message: "Name and price are required" });
    }

    name = name.toLowerCase();

    const existing = await Plan.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: "Plan with this name already exists" });
    }

    // 💰 Convert rupees → paise
    const priceInPaise = Math.round(price * 100);

    const plan = await Plan.create({
      name,
      price: priceInPaise,
      maxInterviews,
      maxFeedbacks,
      durationDays,
    });

    // 💰 Convert paise → rupees for frontend response
    const formattedPlan = {
      ...plan.toObject(),
      price: plan.price / 100,
    };

    res.status(201).json({ message: "Plan created successfully", plan: formattedPlan });
  } catch (error) {
    res.status(500).json({ message: "Failed to create plan" });
  }
};


// 🟡 UPDATE PLAN
export const updatePlan = async (req, res) => {
  try {
    const { id } = req.params;
    let { name, price, maxInterviews, maxFeedbacks, durationDays } = req.body;

    const plan = await Plan.findById(id);
    if (!plan) return res.status(404).json({ message: "Plan not found" });

    if (name) {
      name = name.toLowerCase();
      if (name !== plan.name) {
        const exists = await Plan.findOne({ name });
        if (exists) {
          return res.status(400).json({ message: `Plan name "${name}" already exists` });
        }
        plan.name = name;
      }
    }

    // 💰 Convert rupees → paise when updating price
    if (price != null) {
      plan.price = Math.round(price * 100);
    }

    if (maxInterviews != null) plan.maxInterviews = maxInterviews;
    if (maxFeedbacks != null) plan.maxFeedbacks = maxFeedbacks;
    if (durationDays != null) plan.durationDays = durationDays;

    await plan.save();

    const formattedPlan = {
      ...plan.toObject(),
      price: plan.price / 100, // return in rupees
    };

    res.json({
      success: true,
      message: "Plan updated successfully",
      plan: formattedPlan,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update plan" });
  }
};


// 🧾 GET ALL PLANS (return rupees)
export const getAllPlans = async (req, res) => {
  try {
    const plans = await Plan.find().sort({ price: 1 });

    // Convert each plan price paise → rupees
    const formattedPlans = plans.map((p) => ({
      ...p.toObject(),
      price: p.price / 100,
    }));

    res.json({ success: true, plans: formattedPlans });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to load plans" });
  }
};
