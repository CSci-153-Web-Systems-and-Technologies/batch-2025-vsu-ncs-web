import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "jamirandrade4270@gmail.com",
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    const info = await transporter.sendMail({
      from: '"VSU NCS Admin" <jamirandrade4270@gmail.com>',
      to: to,
      subject: subject,
      html: html,
    });
    console.log("Message sent: %s", info.messageId);
    return { success: true };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error };
  }
};
