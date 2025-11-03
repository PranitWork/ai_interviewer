import Plan from "../models/Plan.js";

// 🟢 CREATE PLAN
export const createPlan = async (req, res) => {
  try {
    const { name, price, maxInterviews, maxFeedbacks, durationDays } = req.body;

    // Validate
    if (!name || price == null) {
      return res.status(400).json({ message: "Name and price are required" });
    }

    // Check for existing plan
    const existing = await Plan.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: "Plan with this name already exists" });
    }

    const plan = await Plan.create({
      name,
      price,
      maxInterviews,
      maxFeedbacks,
      durationDays,
    });

    res.status(201).json({ message: "Plan created successfully", plan });
  } catch (error) {
    console.error("❌ Error creating plan:", error);
    res.status(500).json({ message: "Failed to create plan" });
  }
};

// 🟡 UPDATE PLAN
export const updatePlan = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, maxInterviews, maxFeedbacks, durationDays } = req.body;

    // ✅ Find the plan
    const plan = await Plan.findById(id);
    if (!plan) return res.status(404).json({ message: "Plan not found" });

    // ✅ If updating name, make sure it doesn't clash with another plan
    if (name && name.toLowerCase() !== plan.name) {
      const nameExists = await Plan.findOne({ name: name.toLowerCase() });
      if (nameExists) {
        return res
          .status(400)
          .json({ message: `Plan name "${name}" already exists` });
      }
      plan.name = name.toLowerCase();
    }

    // ✅ Apply only provided fields (avoid overwriting others with undefined)
    if (price != null) plan.price = price;
    if (maxInterviews != null) plan.maxInterviews = maxInterviews;
    if (maxFeedbacks != null) plan.maxFeedbacks = maxFeedbacks;
    if (durationDays != null) plan.durationDays = durationDays;

    await plan.save();

    res.json({
      success: true,
      message: "Plan updated successfully",
      plan,
    });
  } catch (error) {
    console.error("❌ Error updating plan:", error);
    res.status(500).json({ message: "Failed to update plan" });
  }
};

// 🧾 GET ALL PLANS (optional utility)
export const getAllPlans = async (req, res) => {
  try {
    const plans = await Plan.find().sort({ price: 1 });
    res.json(plans);
  } catch (error) {
    console.error("❌ Error fetching plans:", error);
    res.status(500).json({ message: "Failed to fetch plans" });
  }
};
