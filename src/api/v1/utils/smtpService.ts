import { Resend } from 'resend';
require('dotenv').config();

// Initialize the Resend client with your API key
const resend = new Resend(process.env.RESEND_API_KEY);

// Function to send email using Resend
export async function sendMail(email: string, subject: string, link: string) {
  try {
    // Send the email
    const ans = await resend.emails.send({
      from: 'Street Mall <no-reply@streetmallcommerce.com>',
      to: [email],
      subject: subject,
      text: link,
      attachments: [],
    });
    console.log('Email sent successfully:', ans);
    return { success: true, message: "Mail sent successfully" };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, message: "Failed to send email", error: error };
  }
}