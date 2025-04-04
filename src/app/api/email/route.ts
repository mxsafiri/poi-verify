import { NextResponse } from 'next/server';
import type { Project } from '@/types/database';

const getStatusEmailTemplate = (project: Project, userEmail: string) => {
  const statusColor = {
    Approved: '#00C853',
    Rejected: '#D32F2F',
    Pending: '#FFA000',
  }[project.status];

  return {
    to: userEmail,
    subject: `Project Status Update: ${project.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Project Status Update</h2>
        <p>Your project "${project.name}" has been ${project.status.toLowerCase()}.</p>
        
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: ${statusColor}; margin-top: 0;">Status: ${project.status}</h3>
          <p><strong>Project Name:</strong> ${project.name}</p>
          <p><strong>Description:</strong> ${project.description || 'N/A'}</p>
          <p><strong>Impact Metric:</strong> ${project.metric || 'N/A'}</p>
          <p><strong>Budget:</strong> ${project.budget || 'N/A'}</p>
        </div>
        
        <p style="color: #666; font-size: 14px;">
          This is an automated message from the POI Validation System.
        </p>
      </div>
    `,
  };
};

export async function POST(request: Request) {
  try {
    const { project, userEmail } = await request.json();

    // In a real application, you would send the email here using your preferred email service
    // For now, we'll just simulate the email sending
    const emailTemplate = getStatusEmailTemplate(project, userEmail);
    
    // Log the email template for development
    console.log('Email template:', emailTemplate);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
