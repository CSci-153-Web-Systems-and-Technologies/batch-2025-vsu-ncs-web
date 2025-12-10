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

export const generateStudentInfractionResolutionEmail = (
  studentName: string,
  dateFiled: string,
  finalSanction: string,
  adminNotes: string,
  loginURL: string
) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <h2 style="color: #0F172A;">Serious Infraction Case Update</h2>
      <p>Hello ${studentName},</p>
      <p>The administration has completed the review of your serious infraction case filed on <strong>${dateFiled}</strong>.</p>
      
      <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #DC2626;">Final Decision</h3>
        
        <p style="margin: 0 0 5px 0; font-size: 14px; color: #64748B;">Sanction Imposed:</p>
        <p style="margin: 0 0 15px 0; font-weight: bold; font-size: 16px;">${finalSanction}</p>
        
        <p style="margin: 0 0 5px 0; font-size: 14px; color: #64748B;">Administrative Notes:</p>
        <p style="margin: 0; font-style: italic;">"${adminNotes}"</p>
      </div>

      <p>This decision is final and has been recorded in your permanent file.</p>
      
      <a href="${loginURL}/auth/login" style="background-color: #0F172A; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin-top: 10px;">
        View Case Details
      </a>
    </div>
  `;
};