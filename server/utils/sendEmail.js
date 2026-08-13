import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import Setting from '../models/Setting.js';
dotenv.config();

const createTransporter = async () => {
  let dbSetting = null;
  try {
    dbSetting = await Setting.findOne();
  } catch (e) {
    console.log("DB setting email lookup skipped");
  }

  const user = dbSetting?.emailUser || process.env.EMAIL_USER;
  const pass = dbSetting?.emailPass || process.env.EMAIL_PASS;

  if (user && pass && !pass.includes('YOUR_APP_PASSWORD') && pass.trim().length > 3) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass }
    });
  }
  return null;
};

export const sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = await createTransporter();
    if (!transporter) {
      console.log(`[Nodemailer Simulated Dispatch] To: ${to} | Subject: ${subject}`);
      return true;
    }

    const info = await transporter.sendMail({
      from: `"SWARNIKA LUXURY HERITAGE" <${process.env.EMAIL_USER || 'swarnika.luxury@gmail.com'}>`,
      to,
      subject,
      html
    });
    console.log(`Email dispatched successfully to ${to}. MessageId: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error("Nodemailer dispatch error (using fallback):", error.message);
    return false;
  }
};

export const sendOrderConfirmationEmail = async (order) => {
  const html = `
    <div style="font-family: Arial, sans-serif; background-color: #FAF9F5; padding: 20px; color: #111;">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #D4AF37; padding: 30px; border-radius: 12px;">
        <h2 style="color: #D4AF37; font-family: serif; text-align: center;">SWARNIKA LUXURY HERITAGE</h2>
        <h3 style="color: #111;">Order Confirmation: ${order.id}</h3>
        <p>Dear ${order.userName},</p>
        <p>Thank you for your order! Your SWARNIKA 1 Gram Micro-Gold Plated Replica Jewellery order has been received via Cash on Delivery.</p>
        <div style="background: #FAF9F5; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; font-weight: bold;">Grand Total: ₹${order.total}</p>
          <p style="margin: 5px 0 0 0; font-size: 12px; color: #888;">Payment Mode: Cash on Delivery (COD)</p>
        </div>
        <p style="font-size: 11px; color: #777;">* Notice: Products are 1 Gram micro-gold plated brass replica pieces (Non-gold).</p>
      </div>
    </div>
  `;
  return sendEmail({ to: order.userEmail, subject: `Order Confirmed: ${order.id} - SWARNIKA`, html });
};
