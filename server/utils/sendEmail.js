import { Resend } from 'resend';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Universal Dual Email Sender (Supports Resend API & Nodemailer SMTP fallback)
 */
export const sendEmail = async ({ to, subject, html }) => {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'SWARNIKA LUXURY HERITAGE <onboarding@resend.dev>';

  // 1. Try sending via Resend API if RESEND_API_KEY is present
  if (apiKey && apiKey.trim().length > 5 && !apiKey.includes('YOUR_RESEND_API_KEY')) {
    try {
      const resend = new Resend(apiKey);
      const { data, error } = await resend.emails.send({
        from: fromEmail,
        to: [to],
        subject,
        html
      });

      if (error) {
        console.error('Resend API dispatch error:', error);
        // Fallthrough to Nodemailer if available
      } else {
        console.log(`[Resend Email] Successfully sent to ${to}. Message ID: ${data?.id}`);
        return true;
      }
    } catch (err) {
      console.error('Resend API exception:', err.message);
    }
  }

  // 2. Fallback to Nodemailer SMTP (e.g. Gmail App Password) if configured
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  if (emailUser && emailPass && !emailPass.includes('YOUR_APP_PASSWORD') && emailPass.trim().length > 3) {
    try {
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: { user: emailUser, pass: emailPass }
      });

      const info = await transporter.sendMail({
        from: `"SWARNIKA LUXURY HERITAGE" <${emailUser}>`,
        to,
        subject,
        html
      });

      console.log(`[Nodemailer SMTP] Successfully sent to ${to}. Message ID: ${info.messageId}`);
      return true;
    } catch (smtpErr) {
      console.error('Nodemailer SMTP error:', smtpErr.message);
    }
  }

  // 3. Development / Simulation Log
  console.log(`[Simulated Email Dispatch] To: ${to} | Subject: ${subject}`);
  return true;
};

export const sendOrderConfirmationEmail = async (order) => {
  const html = `
    <div style="font-family: Arial, sans-serif; background-color: #FAF9F5; padding: 20px; color: #111;">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border: 2px solid #D4AF37; padding: 30px; border-radius: 12px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="color: #D4AF37; font-family: serif; margin: 0;">SWARNIKA</h2>
          <p style="font-size: 10px; color: #92400e; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; margin-top: 4px;">LUXURY HERITAGE</p>
        </div>
        <h3 style="color: #111;">Order Confirmation: ${order.id}</h3>
        <p>Dear ${order.userName},</p>
        <p>Thank you for your order! Your SWARNIKA 1 Gram Micro-Gold Plated Replica Jewellery order has been received via Cash on Delivery.</p>
        <div style="background: #FAF9F5; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #D4AF37;">
          <p style="margin: 0; font-weight: bold; font-size: 16px; color: #D4AF37;">Grand Total: ₹${order.total}</p>
          <p style="margin: 5px 0 0 0; font-size: 12px; color: #666;">Payment Mode: Cash on Delivery (COD)</p>
        </div>
        <p style="font-size: 11px; color: #777;">* Notice: Products are 1 Gram micro-gold plated brass replica pieces (Non-gold).</p>
      </div>
    </div>
  `;

  return sendEmail({
    to: order.userEmail,
    subject: `Order Confirmed: ${order.id} - SWARNIKA LUXURY HERITAGE`,
    html
  });
};