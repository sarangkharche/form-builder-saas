// Email notification utility using Resend
// Install: npm install resend

export async function sendSubmissionNotification(
  toEmail: string,
  formName: string,
  submissionData: Record<string, any>
) {
  // Check if Resend API key is configured
  const resendApiKey = process.env.RESEND_API_KEY;

  if (!resendApiKey) {
    console.warn("RESEND_API_KEY not configured. Skipping email notification.");
    return;
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL || "noreply@yourdomain.com",
        to: toEmail,
        subject: `New submission for ${formName}`,
        html: generateEmailHTML(formName, submissionData),
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Failed to send email:", error);
    }
  } catch (error) {
    console.error("Error sending email notification:", error);
  }
}

function generateEmailHTML(formName: string, data: Record<string, any>): string {
  const formatValue = (value: any): string => {
    if (Array.isArray(value)) {
      return value.join(", ");
    }
    if (typeof value === "object" && value !== null) {
      return JSON.stringify(value);
    }
    return String(value || "");
  };

  const rows = Object.entries(data)
    .map(
      ([key, value]) => `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #374151;">
            ${key}
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #6b7280;">
            ${formatValue(value)}
          </td>
        </tr>
      `
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f9fafb; margin: 0; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
          <div style="padding: 24px; border-bottom: 2px solid #e5e7eb;">
            <h1 style="margin: 0; font-size: 24px; color: #111827;">New Form Submission</h1>
            <p style="margin: 8px 0 0 0; color: #6b7280;">You received a new submission for <strong>${formName}</strong></p>
          </div>
          <div style="padding: 24px;">
            <table style="width: 100%; border-collapse: collapse;">
              ${rows}
            </table>
          </div>
          <div style="padding: 24px; background-color: #f9fafb; border-top: 1px solid #e5e7eb; text-align: center;">
            <p style="margin: 0; font-size: 14px; color: #6b7280;">
              Sent from your Form Builder
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
}
