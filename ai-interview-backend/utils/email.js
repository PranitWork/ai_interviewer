import Brevo from "@getbrevo/brevo";

const apiInstance = new Brevo.TransactionalEmailsApi();
apiInstance.setApiKey(
  Brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

const sendEmail = async (options) => {
  try {
    const emailData = {
      sender: {
        name: "SwarAI",
        email: process.env.BREVO_FROM,  
      },
      to: [{ email: options.email }],
      subject: options.subject,
      htmlContent: options.message,
    };

    const result = await apiInstance.sendTransacEmail(emailData);
    console.log("Email sent:", result);
    return result;
  } catch (error) {
    console.error("Brevo Error:", error.response?.body || error);
    throw error;
  }
};

export default sendEmail;
