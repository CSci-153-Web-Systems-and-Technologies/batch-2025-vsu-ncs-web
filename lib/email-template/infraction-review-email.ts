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

export const generateReporterNotificationEmail = (
  facultyName: string,
  studentName: string,
  dateFiled: string,
  finalSanction: string,
  adminNotes: string,
  loginURL: string
) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <h2 style="color: #0F172A;">Case Resolved: Serious Infraction</h2>
      <p>Hello ${facultyName},</p>
      <p>The administration has completed the review of the serious infraction you reported against <strong>${studentName}</strong> on ${dateFiled}.</p>
      
      <div style="background-color: #F0FDF4; border: 1px solid #BBF7D0; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #15803D;">Resolution Details</h3>
        
        <p style="margin: 0 0 5px 0; font-size: 14px; color: #64748B;">Final Sanction Imposed:</p>
        <p style="margin: 0 0 15px 0; font-weight: bold; font-size: 16px;">${finalSanction}</p>
        
        <p style="margin: 0 0 5px 0; font-size: 14px; color: #64748B;">Admin Remarks:</p>
        <p style="margin: 0; font-style: italic;">"${adminNotes}"</p>
      </div>

      <p>The case is now closed and the record has been updated.</p>
      
      <a href="${loginURL}/auth/login" style="background-color: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin-top: 10px;">
        View Logged Records
      </a>
    </div>
  `;
};
