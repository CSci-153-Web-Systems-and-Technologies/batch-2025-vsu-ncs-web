export const generateConductNotificationEmail = (
  studentName: string,
  type: "merit" | "demerit" | "serious",
  description: string,
  date: string,
  facultyName: string,
  loginURL: string
) => {
  const isGood = type === "merit";
  const color = isGood ? "#059669" : "#DC2626";
  const title = isGood
    ? "New Merit Record Received"
    : "New Conduct Record Logged";

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <h2 style="color: ${color};">${title}</h2>
      <p>Hello ${studentName},</p>
      <p>A new ${type} record has been logged in your file by <strong>${facultyName}</strong>.</p>
      
      <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0 0 10px 0;"><strong>Date:</strong> ${date}</p>
        <p style="margin: 0 0 10px 0;"><strong>Description:</strong></p>
        <p style="margin: 0; font-style: italic;">"${description}"</p>
      </div>

      <p>You can view your full record history by logging into the VSU NCS portal.</p>
      
      <a href="${loginURL}/auth/login" style="background-color: ${color}; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin-top: 10px;">
        View My Portal
      </a>
    </div>
  `;
};
