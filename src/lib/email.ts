import { createTransport } from 'nodemailer';
import type { Project } from '@/types/database';

const transporter = createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const getStatusEmailTemplate = (project: Project, userEmail: string) => {
  const statusColor = {
    Approved: '#00C853',
    Rejected: '#D32F2F',
    Pending: '#FFA000',
  }[project.status];

  return {
    from: `"POI Validation" <${process.env.SMTP_FROM}>`,
    to: userEmail,
    subject: `Project ${project.status}: ${project.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #F5F7FA; padding: 20px; border-radius: 8px;">
          <h1 style="color: #1A1A1A; margin-bottom: 20px;">Project Status Update</h1>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: ${statusColor}; margin-top: 0;">
              Project ${project.status}
            </h2>
            
            <div style="margin: 20px 0;">
              <p style="font-size: 16px; color: #1A1A1A; margin-bottom: 10px;">
                <strong>Project Name:</strong> ${project.name}
              </p>
              <p style="font-size: 16px; color: #1A1A1A; margin-bottom: 10px;">
                <strong>Budget:</strong> $${parseFloat(project.budget || '0').toLocaleString()}
              </p>
              <p style="font-size: 16px; color: #1A1A1A; margin-bottom: 10px;">
                <strong>Description:</strong> ${project.description}
              </p>
            </div>

            ${project.status === 'Approved' ? `
              <div style="background: #E8F5E9; padding: 15px; border-radius: 4px; margin-top: 20px;">
                <p style="color: #00C853; margin: 0;">
                  🎉 Congratulations! Your project has been verified and an NFT will be minted soon.
                </p>
              </div>
            ` : ''}
          </div>

          <div style="text-align: center; color: #666; font-size: 14px;">
            <p>This is an automated message from the POI Validation System.</p>
          </div>
        </div>
      </div>
    `,
  };
};

export const sendStatusUpdateEmail = async (project: Project, userEmail: string) => {
  try {
    const mailOptions = getStatusEmailTemplate(project, userEmail);
    await transporter.sendMail(mailOptions);
    console.log('Status update email sent successfully');
    return true;
  } catch (error) {
    console.error('Error sending status update email:', error);
    return false;
  }
};
