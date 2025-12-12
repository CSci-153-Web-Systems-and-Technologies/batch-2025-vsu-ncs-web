export const generateServiceNotificationEmail = (
  studentName: string,
  daysDeducted: number,
  description: string,
  date: string,
  facultyName: string,
  link: string
) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Service Record Logged</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #3B82F6; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .header h1 { color: #ffffff; margin: 0; font-size: 24px; }
          .content { background-color: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px; }
          .card { background-color: #ffffff; padding: 20px; border-radius: 6px; border-left: 4px solid #3B82F6; margin-bottom: 20px; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
          .label { font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px; }
          .value { font-size: 16px; font-weight: 600; color: #111827; margin-bottom: 16px; }
          .button { display: inline-block; background-color: #3B82F6; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin-top: 20px; }
          .footer { margin-top: 24px; text-align: center; font-size: 12px; color: #6b7280; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Sanction Cleared</h1>
          </div>
          <div class="content">
            <p>Hello <strong>${studentName}</strong>,</p>
            <p>A new service record has been logged, clearing part of your sanction balance.</p>
            
            <div class="card">
              <div class="label">Days Deducted</div>
              <div class="value" style="color: #3B82F6;">-${daysDeducted} Days</div>
              
              <div class="label">Description</div>
              <div class="value">${description || "Extension duty served"}</div>
              
              <div class="label">Date Logged</div>
              <div class="value">${date}</div>
              
              <div class="label">Logged By</div>
              <div class="value">${facultyName}</div>
            </div>

            <p>You can view your updated balance and full history in your dashboard.</p>
            
            <div style="text-align: center;">
              <a href="${link}" class="button">View Service History</a>
            </div>
          </div>
          <div class="footer">
            <p>Visayas State University - Nursing Conduct System</p>
          </div>
        </div>
      </body>
    </html>
  `;
};
