import sendEmail from "../utils/email.js";

export const sendContactMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // ✅ Validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // ✅ Email content (HTML)
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; padding: 10px;">
        <h2>📩 New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      </div>
    `;

    // ✅ Send the email to your support inbox
    await sendEmail({
      email: "pranitworkspace@gmail.com", // your own inbox
      subject: `New Contact Message from ${name}`,
      message: htmlContent,
    });

    return res.status(200).json({
      success: true,
      message: "Message sent successfully!",
    });
  } catch (error) {
    console.error("Error sending contact message:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send message, please try again later.",
    });
  }
};
