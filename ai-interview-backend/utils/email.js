import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async ({ email, subject, message }) => {
  await resend.emails.send({
    from: "SwarAi <onboarding@resend.dev>",
    to: email,
    subject,
    html: message,
  });
};

export default sendEmail;
