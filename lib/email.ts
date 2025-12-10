export const generateWelcomeEmail = (
  name: string,
  email: string,
  tempPassword: string,
  loginUrl: string
) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #0A58A3;">Welcome to VSU Nursing Conduct System</h2>
      <p>Hello ${name},</p>
      <p>Your account for the VSU NCS has been successfully created by the administrator.</p>
      
      <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0; font-weight: bold;">Here are your login credentials:</p>
        <p style="margin: 10px 0;"><strong>Email:</strong> ${email}</p>
        <p style="margin: 10px 0;"><strong>Temporary Password:</strong> ${tempPassword}</p>
      </div>

      <p>Please log in immediately and update your password.</p>
      
      <a href="${loginUrl}" style="background-color: #0A58A3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Login to Portal</a>
      
      <p style="margin-top: 30px; font-size: 12px; color: #666;">
        If you have trouble logging in, please contact the College of Nursing administration.
      </p>
    </div>
  `;
};

export const generateConductNotificationEmail = (
  studentName: string,
  type: "merit" | "demerit" | "serious",
  description: string,
  date: string,
  facultyName: string
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
      
      <a href="${process.env.NEXT_PUBLIC_SITE_URL}/auth/login" style="background-color: ${color}; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin-top: 10px;">
        View My Portal
      </a>
    </div>
  `;
};